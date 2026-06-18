import { SlidersHorizontal } from "lucide-react";

import { Reveal } from "@/components/site/reveal";
import { PlanCard } from "@/components/plans/plan-card";
import { getActiveProviderId } from "@/lib/esim";
import { listPublicPlans } from "@/lib/plans/store";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Saudi eSIM Plans",
  description:
    "Browse Saudi Arabia data eSIM plans for Umrah and Hajj travellers.",
};

export default async function PlansPage() {
  const plans = await listPublicPlans();
  const providerId = getActiveProviderId();

  return (
    <main className="container py-10 sm:py-16">
      <Reveal className="max-w-3xl">
        <p className="mb-4 inline-flex rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-sm font-medium text-gold-deep">
          Active provider: {providerId}
        </p>
        <h1 className="text-balance text-4xl text-navy sm:text-5xl">
          Saudi data eSIM plans
        </h1>
        <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-slate">
          Placeholder prices are clearly marked until the wholesale provider and
          margin are confirmed. All plans are data-only and require an eSIM
          compatible phone.
        </p>
      </Reveal>

      <Reveal
        delay={80}
        className="mt-8 flex flex-col gap-3 rounded-2xl border border-line bg-paper p-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <p className="font-medium text-navy">Filters coming in Phase 1 polish</p>
          <p className="text-sm text-slate">
            Data size and validity filters will sit here as the catalogue grows.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl border border-line px-3 py-2 text-sm text-navy transition-colors hover:border-gold/50">
          <SlidersHorizontal className="size-4" aria-hidden />
          Sort: recommended
        </button>
      </Reveal>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan, index) => (
          <Reveal key={plan.id} delay={index * 50}>
            <PlanCard plan={plan} />
          </Reveal>
        ))}
      </div>
    </main>
  );
}
