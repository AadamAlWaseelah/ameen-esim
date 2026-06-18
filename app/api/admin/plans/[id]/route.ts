import { NextResponse } from "next/server";

import { planInputFromJson } from "@/lib/plans/admin-input";
import { deletePlan, updatePlan } from "@/lib/plans/store";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const input = planInputFromJson(await request.json());
  const plan = await updatePlan(params.id, input);

  if (!plan) {
    return NextResponse.json({ error: "Plan not found." }, { status: 404 });
  }

  return NextResponse.json({ plan });
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const deleted = await deletePlan(params.id);
  if (!deleted) {
    return NextResponse.json({ error: "Plan not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
