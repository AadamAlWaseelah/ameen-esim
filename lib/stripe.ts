import Stripe from "stripe";

/*
  Lazy Stripe client. Like the DB layer, we do NOT construct at import time so
  the app boots without STRIPE_SECRET_KEY; a missing key throws a clear error
  only when checkout/webhook actually need Stripe.
*/

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (_stripe) return _stripe;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Add your Stripe secret key to .env.local " +
        "to enable checkout.",
    );
  }

  _stripe = new Stripe(key, { apiVersion: "2026-05-27.dahlia" });
  return _stripe;
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}
