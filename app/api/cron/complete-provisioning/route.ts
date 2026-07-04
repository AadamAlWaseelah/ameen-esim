import { NextResponse } from "next/server";

import { refreshProvisioning } from "@/lib/orders/provision";
import { listProvisioningOrders } from "@/lib/orders/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/*
  Safety net for orders parked as `provisioning`: the webhook can only poll
  the provider briefly, and the success page only finishes an order if the
  customer still has it open. This sweep (Vercel Cron, see vercel.json)
  re-checks every parked order and delivers + emails any that are now ready,
  so a customer who closed the tab still gets their eSIM unattended.

  Auth: Vercel Cron sends `Authorization: Bearer ${CRON_SECRET}` when that
  env var is set on the project. Fails closed if CRON_SECRET is unset.
*/
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parked = await listProvisioningOrders();
  const results: { id: string; status: string }[] = [];
  for (const order of parked) {
    const updated = await refreshProvisioning(order.id);
    results.push({ id: order.id, status: updated?.status ?? order.status });
  }

  return NextResponse.json({ checked: parked.length, results });
}
