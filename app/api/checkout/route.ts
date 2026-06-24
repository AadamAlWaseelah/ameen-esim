import { NextResponse } from "next/server";

import { getActiveProviderId } from "@/lib/esim";
import { createOrder } from "@/lib/orders/store";
import { getPlanBySlug, getPlanProviderRef } from "@/lib/plans/store";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

export const dynamic = "force-dynamic";

const MAX_QUANTITY = 10;

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

  const providerId = getActiveProviderId();
  const providerRef = getPlanProviderRef(plan, providerId);
  if (!providerRef || providerRef.startsWith("TODO")) {
    return NextResponse.json(
      { error: `This plan is not mapped for the ${providerId} provider.` },
      { status: 400 },
    );
  }

  // Generate the order id up front so it can be both the Stripe metadata key
  // and the provider idempotency key (internalOrderId) later in the webhook.
  const orderId = crypto.randomUUID();
  const amountPence = plan.retailPricePence * quantity;
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    new URL(request.url).origin;

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
