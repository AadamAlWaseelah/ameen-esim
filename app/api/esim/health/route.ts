import { NextResponse } from "next/server";

import { getActiveProviderId, getProvider } from "@/lib/esim";
import type { BalanceInfo } from "@/lib/esim/types";

export const dynamic = "force-dynamic";

/*
  One-click auth sanity test for the active eSIM provider.

  GET /api/esim/health — admin-only (gated by the session cookie in
  middleware.ts): it exposes the reseller balance and fires authenticated
  provider calls on every hit, so it must not be public. Log in at /admin
  first, then open this URL.

  Two probes:
    1. auth    — lists the SA catalogue. This is the same authenticated
                 endpoint the mapper and admin already rely on, so its
                 success definitively proves credentials, base URL and auth
                 headers are valid. This determines overall `ok`.
    2. balance — best-effort reseller balance. A wrong/unsupported endpoint
                 must NOT fail the check (auth is already proven above), so a
                 failure here is reported but does not flip `ok`.

  Also reports `config`: booleans for whether each required env var is set
  (never their values), so one authenticated URL confirms a deployment is
  wired correctly after any env change. `configOk` is true when every var
  the app needs in production is present.
*/

type ProbeResult =
  | { ok: true; packageCount: number }
  | { ok: false; error: string };

type BalanceResult =
  | ({ ok: true } & BalanceInfo)
  | { ok: false; error: string };

function message(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

function stripeMode(): "live" | "test" | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (key?.startsWith("sk_live_")) return "live";
  if (key?.startsWith("sk_test_")) return "test";
  return null;
}

/*
  Presence-only report of the env config. Booleans, never values. `required`
  are the vars the app needs to sell + deliver in production; `recommended`
  degrade gracefully if missing (e.g. no RESEND_API_KEY just means no emails).
*/
function configReport() {
  const required = {
    databaseUrl: Boolean(process.env.DATABASE_URL),
    siteUrl: Boolean(process.env.NEXT_PUBLIC_SITE_URL),
    stripeSecretKey: Boolean(process.env.STRIPE_SECRET_KEY),
    stripeWebhookSecret: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
    adminPassword: Boolean(process.env.ADMIN_PASSWORD),
  };
  const recommended = {
    adminSessionSecret: Boolean(process.env.ADMIN_SESSION_SECRET),
    cronSecret: Boolean(process.env.CRON_SECRET),
    resendApiKey: Boolean(process.env.RESEND_API_KEY),
    orderEmailFrom: Boolean(process.env.ORDER_EMAIL_FROM),
  };
  return {
    configOk: Object.values(required).every(Boolean),
    stripeMode: stripeMode(),
    required,
    recommended,
  };
}

export async function GET() {
  const providerId = getActiveProviderId();
  const provider = getProvider();
  const startedAt = Date.now();

  let auth: ProbeResult;
  try {
    const catalogue = await provider.listCatalogue("SA");
    auth = { ok: true, packageCount: catalogue.length };
  } catch (err) {
    auth = { ok: false, error: message(err) };
  }

  let balance: BalanceResult;
  if (provider.getBalance) {
    try {
      balance = { ok: true, ...(await provider.getBalance()) };
    } catch (err) {
      balance = { ok: false, error: message(err) };
    }
  } else {
    balance = { ok: false, error: "Provider does not expose a balance endpoint." };
  }

  const ok = auth.ok;
  return NextResponse.json(
    {
      ok,
      providerId,
      auth,
      balance,
      config: configReport(),
      elapsedMs: Date.now() - startedAt,
    },
    { status: ok ? 200 : 502 },
  );
}
