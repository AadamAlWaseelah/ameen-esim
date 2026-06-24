import { NextResponse } from "next/server";

import { getActiveProviderId, getProvider } from "@/lib/esim";
import type { BalanceInfo } from "@/lib/esim/types";

export const dynamic = "force-dynamic";

/*
  One-click auth sanity test for the active eSIM provider.

  GET /api/esim/health

  Two probes:
    1. auth    — lists the SA catalogue. This is the same authenticated
                 endpoint the mapper and admin already rely on, so its
                 success definitively proves credentials, base URL and auth
                 headers are valid. This determines overall `ok`.
    2. balance — best-effort reseller balance. A wrong/unsupported endpoint
                 must NOT fail the check (auth is already proven above), so a
                 failure here is reported but does not flip `ok`.
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
    { ok, providerId, auth, balance, elapsedMs: Date.now() - startedAt },
    { status: ok ? 200 : 502 },
  );
}
