import Link from "next/link";
import { AlertTriangle, ArrowRight, CalendarDays, Signal, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDataAmount, formatMoney } from "@/lib/money";
import { resolvePlanProvider } from "@/lib/plans/store";
import type { PlanRecord } from "@/lib/plans/types";

export function PlanCard({
  plan,
  featured = false,
}: {
  plan: PlanRecord;
  featured?: boolean;
}) {
  const resolved = resolvePlanProvider(plan);
  const priceKnown = plan.retailPricePence != null;

  return (
    <article
      className={cn(
        "sheen group relative flex h-full flex-col overflow-hidden rounded-2xl bg-paper transition-[border-color,box-shadow,transform] duration-200 ease-out-expo",
        featured
          ? "border-2 border-gold shadow-[0_18px_44px_-22px_rgba(168,134,63,0.6)] lg:-translate-y-1"
          : "border border-line shadow-sm hover:-translate-y-1 hover:border-gold/45 hover:shadow-[0_20px_44px_-26px_rgba(25,32,46,0.5)]"
      )}
    >
      {featured ? (
        <div
          aria-hidden
          className="animate-glow-pulse pointer-events-none absolute -inset-px -z-10 rounded-2xl blur-md"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 0%, rgba(201,169,97,0.5), transparent)",
          }}
        />
      ) : null}
      {featured ? (
        <div className="flex items-center justify-center gap-1.5 bg-gold py-1.5 text-xs font-semibold uppercase tracking-wide text-navy">
          <Star className="size-3.5 fill-navy" aria-hidden />
          Most chosen by pilgrims
        </div>
      ) : null}

      <div className="flex items-start justify-between gap-4 border-b border-line p-5">
        <div>
          {plan.badge && !featured ? (
            <p className="mb-3 inline-flex rounded-full border border-gold/30 bg-gold/10 px-2.5 py-1 text-xs font-medium text-gold-deep">
              {plan.badge}
            </p>
          ) : null}
          <h2 className="font-display text-2xl text-navy">{plan.title}</h2>
          <p className="mt-1 text-sm text-slate">{plan.subtitle}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="tnum text-2xl font-semibold text-navy">
            {formatMoney(plan.retailPricePence)}
          </p>
          {priceKnown ? (
            <p className="text-xs text-slate">one-off</p>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 p-5 text-sm">
        <div className="rounded-xl border border-line bg-cream/70 p-3">
          <Signal className="mb-2 size-4 text-gold-deep" aria-hidden />
          <p className="font-medium text-navy">
            {formatDataAmount(plan.dataAmountMb)}
          </p>
          <p className="text-slate">Data</p>
        </div>
        <div className="rounded-xl border border-line bg-cream/70 p-3">
          <CalendarDays className="mb-2 size-4 text-gold-deep" aria-hidden />
          <p className="font-medium text-navy">
            {plan.validityDays} {plan.validityDays === 1 ? "day" : "days"}
          </p>
          <p className="text-slate">Validity</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5">
        <p className="text-sm leading-relaxed text-slate">{plan.description}</p>

        {!resolved ? (
          <p className="mt-4 flex items-start gap-2 rounded-xl border border-gold/30 bg-gold/10 p-3 text-sm text-navy">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-gold-deep" aria-hidden />
            This plan is nearly ready. Check back soon.
          </p>
        ) : null}

        <div className="mt-auto pt-6">
          <Button
            asChild
            className="w-full"
            variant={featured ? "gold" : priceKnown ? "primary" : "outline"}
          >
            <Link href={`/plans/${plan.slug}`}>
              {priceKnown ? "View plan" : "View details"}
              <ArrowRight
                className="size-4 transition-transform duration-200 ease-out-expo group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
