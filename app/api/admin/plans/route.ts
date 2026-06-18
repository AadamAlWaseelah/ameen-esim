import { NextResponse } from "next/server";

import { getProvider } from "@/lib/esim";
import { planInputFromJson } from "@/lib/plans/admin-input";
import { createPlan, listPlans } from "@/lib/plans/store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get("catalogue") === "1") {
    const provider = getProvider();
    const catalogue = await provider.listCatalogue("SA");
    return NextResponse.json({ providerId: provider.id, catalogue });
  }

  const plans = await listPlans({ includeInactive: true });
  return NextResponse.json({ plans });
}

export async function POST(request: Request) {
  const input = planInputFromJson(await request.json());
  if (!input.slug || !input.title || !input.validityDays || !input.description) {
    return NextResponse.json(
      { error: "slug, title, validityDays and description are required." },
      { status: 400 }
    );
  }

  const plan = await createPlan(input);
  return NextResponse.json({ plan }, { status: 201 });
}
