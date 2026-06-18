import Link from "next/link";
import { AlertTriangle, ArrowRight, CalendarDays, Signal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatDataAmount, formatMoney } from "@/lib/money";
import { getActiveProviderId } from "@/lib/esim";
import { getPlanProviderRef } from "@/lib/plans/store";
import type { PlanRecord } from "@/lib/plans/types";

export function PlanCard({ plan }: { plan: PlanRecord }) {
  const providerId = getActiveProviderId();
  const providerRef = getPlanProviderRef(plan, providerId);
  const priceKnown = plan.retailPricePence != null;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-paper shadow-sm transition-[border-color,box-shadow,transform] duration-200 ease-out-expo hover:border-gold/45 hover:shadow-md">
      <div className="flex items-start justify-between gap-4 border-b border-line p-5">
        <div>
          {plan.badge ? (
            <p className="mb-3 inline-flex rounded-full border border-gold/30 bg-gold/10 px-2.5 py-1 text-xs font-medium text-gold-deep">
              {plan.badge}
            </p>
          ) : null}
          <h2 className="text-2xl text-navy">{plan.title}</h2>
          <p className="mt-1 text-sm text-slate">{plan.subtitle}</p>
        </div>
        <p className="tnum shrink-0 text-right text-2xl font-semibold text-navy">
          {formatMoney(plan.retailPricePence)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 p-5 text-sm">
        <div className="rounded-xl border border-line bg-cream/70 p-3">
          <Signal className="mb-2 size-4 text-gold-deep" aria-hidden />
          <p className="font-medium text-navy">{formatDataAmount(plan.dataAmountMb)}</p>
          <p className="text-slate">Data allowance</p>
        </div>
        <div className="rounded-xl border border-line bg-cream/70 p-3">
          <CalendarDays className="mb-2 size-4 text-gold-deep" aria-hidden />
          <p className="font-medium text-navy">{plan.validityDays} days</p>
          <p className="text-slate">Validity</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5">
        <p className="text-sm leading-relaxed text-slate">{plan.description}</p>

        {!providerRef ? (
          <p className="mt-4 flex items-start gap-2 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
            Missing provider mapping for {providerId}. Hidden from sale.
          </p>
        ) : null}

        <div className="mt-auto pt-6">
          <Button
            asChild
            className="w-full"
            variant={priceKnown ? "primary" : "outline"}
          >
            <Link href={`/plans/${plan.slug}`}>
              {priceKnown ? "View plan" : "View details"}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
