import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { getProviderById, type ProviderId } from "@/lib/esim";
import { sendOrderEmail } from "@/lib/email/order";
import {
  getOrderById,
  getOrderByStripeSession,
  updateOrder,
} from "@/lib/orders/store";
import { getStripe } from "@/lib/stripe";

// Stripe signature verification needs the Node runtime and the raw body.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Provisioning polls the provider for the allocated eSIM; give it headroom
// (Vercel clamps to the plan's max). Anything still pending is parked as
// `provisioning` and finished by the success page / re-check.
export const maxDuration = 60;

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET is not set." },
      { status: 503 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const payload = await request.text();
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(payload, signature, secret);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: `Signature verification failed: ${message}` },
      { status: 400 },
    );
  }

  if (event.type === "checkout.session.completed") {
    await fulfill(event.data.object as Stripe.Checkout.Session);
  }

  // Always 200 for handled/ignored events so Stripe stops retrying.
  return NextResponse.json({ received: true });
}

async function fulfill(session: Stripe.Checkout.Session): Promise<void> {
  const orderId = session.metadata?.orderId;
  const order =
    (orderId ? await getOrderById(orderId) : null) ??
    (await getOrderByStripeSession(session.id));

  if (!order) {
    console.error(
      `[stripe webhook] No order found for session ${session.id} (orderId=${orderId}).`,
    );
    return;
  }

  // Idempotency: Stripe retries webhooks. Only provision from the initial
  // pending/paid state; once we're provisioning or delivered, do nothing.
  if (order.status !== "pending" && order.status !== "paid") {
    return;
  }

  const email = session.customer_details?.email ?? order.email;
  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : (session.payment_intent?.id ?? null);

  await updateOrder(order.id, {
    status: "paid",
    email,
    stripePaymentIntentId: paymentIntentId,
  });

  // Provision with the provider this order was routed to at checkout, using
  // the order id as the idempotency key so a retried webhook won't
  // double-order at the provider.
  try {
    const provider = getProviderById(order.providerId as ProviderId);
    const provisioned = await provider.createOrder({
      internalOrderId: order.id,
      providerRef: order.providerRef,
      customerEmail: email,
      quantity: order.quantity,
    });

    const updated = await updateOrder(order.id, {
      status: provisioned.status,
      providerOrderRef: provisioned.providerOrderRef,
      iccid: provisioned.iccid ?? null,
      lpaString: provisioned.lpaString || null,
      smdpAddress: provisioned.smdpAddress ?? null,
      activationCode: provisioned.activationCode ?? null,
      qrImageDataUri: provisioned.qrImageDataUri || null,
    });

    // Email only when the eSIM is actually delivered (we have an LPA/QR).
    if (updated && provisioned.status === "delivered") {
      const result = await sendOrderEmail(updated);
      if (result.sent) {
        await updateOrder(order.id, { emailSentAt: new Date() });
      } else {
        console.error(
          `[stripe webhook] Order ${order.id} provisioned but email not sent: ${result.reason}`,
        );
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `[stripe webhook] Provisioning failed for order ${order.id}: ${message}`,
    );
    await updateOrder(order.id, { status: "failed", errorMessage: message });
  }
}
