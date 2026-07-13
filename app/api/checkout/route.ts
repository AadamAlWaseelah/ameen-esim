import { NextResponse } from "next/server";

import { createOrder } from "@/lib/orders/store";
import { getPlanBySlug, resolvePlanProvider } from "@/lib/plans/store";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

export const dynamic = "force-dynamic";

// Fulfilment (order schema, email, success page) delivers exactly one eSIM
// profile per order, so quantity is capped at 1 until multi-profile support
// exists end-to-end. The storefront only ever sends 1; this also stops direct
// API calls from paying for profiles that would never be delivered.
const MAX_QUANTITY = 1;

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Checkout is not configured yet. STRIPE_SECRET_KEY is missing." },
      { status: 503 },
    );
  }

  let body: { slug?: unknown; quantity?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const slug = typeof body.slug === "string" ? body.slug : "";
  if (!slug) {
    return NextResponse.json({ error: "A plan slug is required." }, { status: 400 });
  }

  const quantity = Math.min(
    MAX_QUANTITY,
    Math.max(1, Math.floor(Number(body.quantity) || 1)),
  );

  const plan = await getPlanBySlug(slug);
  if (!plan || !plan.active) {
    return NextResponse.json({ error: "Plan not found." }, { status: 404 });
  }
  if (plan.retailPricePence == null) {
    return NextResponse.json(
      { error: "This plan has no price yet." },
      { status: 400 },
    );
  }

  // Route per plan: a plan mapped only to Maya sells via Maya while the
  // default provider keeps fulfilling everything else.
  const resolved = resolvePlanProvider(plan);
  if (!resolved) {
    return NextResponse.json(
      { error: "This plan is not mapped to an eSIM provider yet." },
      { status: 400 },
    );
  }
  const { providerId, ref: providerRef } = resolved;

  // Mock fulfilment delivers fake eSIMs. ESIM_PROVIDER silently defaults to
  // mock when unset or misspelled, so with live Stripe keys that would charge
  // real money for nothing — refuse the combination outright. (Test-mode
  // Stripe + mock stays allowed: that's the local/E2E testing setup.)
  if (
    providerId === "mock" &&
    process.env.STRIPE_SECRET_KEY?.startsWith("sk_live_")
  ) {
    console.error(
      "[checkout] Refusing live-mode payment routed to the mock eSIM provider. Check ESIM_PROVIDER.",
    );
    return NextResponse.json(
      { error: "Checkout is temporarily unavailable. Please try again later." },
      { status: 503 },
    );
  }

  // Generate the order id up front so it can be both the Stripe metadata key
  // and the provider idempotency key (internalOrderId) later in the webhook.
  const orderId = crypto.randomUUID();
  const amountPence = plan.retailPricePence * quantity;
  // success_url/cancel_url must come from configuration in production: the
  // request-origin fallback is derived from the Host header, which an
  // attacker can spoof to redirect customers after payment. Dev only.
  const configuredBase = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (!configuredBase && process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Checkout is not configured yet. NEXT_PUBLIC_SITE_URL is missing." },
      { status: 503 },
    );
  }
  const base = configuredBase ?? new URL(request.url).origin;

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        quantity,
        price_data: {
          currency: "gbp",
          unit_amount: plan.retailPricePence,
          product_data: {
            name: plan.title,
            description: plan.subtitle ?? undefined,
          },
        },
      },
    ],
    success_url: `${base}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/plans/${slug}?cancelled=1`,
    metadata: { orderId, planSlug: slug, providerId, providerRef },
  });

  await createOrder({
    id: orderId,
    email: session.customer_details?.email ?? "",
    planId: plan.id,
    planSlug: plan.slug,
    planTitle: plan.title,
    quantity,
    amountPence,
    currency: "GBP",
    providerId,
    providerRef,
    stripeSessionId: session.id,
    status: "pending",
  });

  return NextResponse.json({ url: session.url });
}
