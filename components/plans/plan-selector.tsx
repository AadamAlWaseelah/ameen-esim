"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import NumberFlow from "@number-flow/react";
import { CalendarDays, Check, Signal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDataAmount } from "@/lib/money";

export type SelectorPlan = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  dataAmountMb: number | null;
  validityDays: number;
  retailPricePence: number | null;
  badge: string | null;
};

type Tab = "daily" | "fixed";
type Sort = "price" | "data";

// "Daily" plans give an allowance that resets each day (1-day packages);
// everything else is a fixed bundle over a set number of days.
function isDaily(plan: SelectorPlan) {
  return plan.slug.includes("per-day") || plan.validityDays <= 1;
}

const SPRING = { type: "spring", stiffness: 380, damping: 32 } as const;

export function PlanSelector({ plans }: { plans: SelectorPlan[] }) {
  const groups = useMemo(
    () => ({
      daily: plans.filter(isDaily),
      fixed: plans.filter((p) => !isDaily(p)),
    }),
    [plans],
  );

  const [tab, setTab] = useState<Tab>(
    groups.daily.length ? "daily" : "fixed",
  );
  const [sort, setSort] = useState<Sort>("price");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const list = useMemo(() => {
    const arr = [...groups[tab]];
    arr.sort((a, b) =>
      sort === "price"
        ? (a.retailPricePence ?? Infinity) - (b.retailPricePence ?? Infinity)
        : (a.dataAmountMb ?? Infinity) - (b.dataAmountMb ?? Infinity),
    );
    return arr;
  }, [groups, tab, sort]);

  const selected = list.find((p) => p.slug === selectedSlug) ?? list[0] ?? null;
  const pounds = selected?.retailPricePence != null
    ? selected.retailPricePence / 100
    : 0;
  const priceKnown = selected?.retailPricePence != null;

  function switchTab(next: Tab) {
    setTab(next);
    setSelectedSlug(null); // fall back to first plan of the new tab
    setError(null);
  }

  async function buy() {
    if (!selected || !priceKnown) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: selected.slug, quantity: 1 }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? "Could not start checkout.");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-3 rounded-[28px] border border-line bg-paper p-3 shadow-[0_24px_60px_-32px_rgba(25,32,46,0.45)]">
      {/* Daily / Fixed toggle */}
      <div className="relative flex rounded-full bg-cream/80 p-1">
        {(["daily", "fixed"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => switchTab(t)}
            className={cn(
              "relative z-10 w-full rounded-full py-2 text-sm font-semibold transition-colors",
              tab === t ? "text-navy" : "text-slate hover:text-navy",
            )}
          >
            {tab === t ? (
              <motion.span
                layoutId="tab-indicator"
                transition={SPRING}
                className="absolute inset-0 -z-10 rounded-full bg-white shadow-sm"
              />
            ) : null}
            {t === "daily" ? "Daily" : "Fixed bundles"}
          </button>
        ))}
      </div>

      {/* Sort */}
      <div className="flex items-center justify-between px-1 text-xs">
        <span className="text-slate">
          {list.length} plan{list.length === 1 ? "" : "s"}
        </span>
        <div className="flex items-center gap-1 text-slate">
          <span>Sort:</span>
          {(["price", "data"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSort(s)}
              className={cn(
                "rounded-full px-2 py-0.5 font-medium transition-colors",
                sort === s ? "bg-navy/5 text-navy" : "hover:text-navy",
              )}
            >
              {s === "price" ? "Cheapest" : "Most data"}
            </button>
          ))}
        </div>
      </div>

      {/* Selectable plan rows */}
      <div className="flex max-h-[320px] flex-col gap-2 overflow-y-auto px-0.5 py-0.5">
        {list.map((plan) => {
          const active = selected?.slug === plan.slug;
          const isPopular = Boolean(plan.badge?.toLowerCase().includes("popular"));
          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => {
                setSelectedSlug(plan.slug);
                setError(null);
              }}
              className="relative flex items-center justify-between gap-3 rounded-2xl p-4 text-left"
            >
              {active ? (
                <motion.span
                  layoutId="plan-highlight"
                  transition={SPRING}
                  className="absolute inset-0 rounded-2xl border-[2.5px] border-navy"
                />
              ) : (
                <span className="absolute inset-0 rounded-2xl border-2 border-line" />
              )}

              <span className="relative flex flex-col">
                <span className="flex items-center gap-2">
                  <span className="font-semibold text-navy">
                    {formatDataAmount(plan.dataAmountMb)}
                    {isDaily(plan) ? " / day" : ""}
                  </span>
                  {isPopular ? (
                    <span className="rounded-md bg-gold/20 px-1.5 py-0.5 text-[11px] font-semibold text-gold-deep">
                      Popular
                    </span>
                  ) : null}
                </span>
                <span className="mt-0.5 flex items-center gap-3 text-xs text-slate">
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays className="size-3" aria-hidden />
                    {isDaily(plan) ? "1-day pass" : `${plan.validityDays} days`}
                  </span>
                  {plan.subtitle ? <span className="truncate">{plan.subtitle}</span> : null}
                </span>
              </span>

              <span className="relative flex items-center gap-3">
                <span className="tnum font-semibold text-navy">
                  {plan.retailPricePence != null
                    ? `£${(plan.retailPricePence / 100).toFixed(2)}`
                    : "TBD"}
                </span>
                <span
                  className={cn(
                    "flex size-5 items-center justify-center rounded-full border-2 transition-colors",
                    active ? "border-navy bg-navy text-white" : "border-slate/50",
                  )}
                >
                  {active ? <Check className="size-3" aria-hidden /> : null}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected summary + price + CTA */}
      <div className="rounded-2xl bg-cream/70 p-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-medium text-navy">
              {selected ? selected.title : "Select a plan"}
            </p>
            {selected ? (
              <p className="mt-0.5 flex items-center gap-1 text-xs text-slate">
                <Signal className="size-3" aria-hidden />
                {formatDataAmount(selected.dataAmountMb)}
                {isDaily(selected) ? " each day" : " total"} ·{" "}
                {isDaily(selected) ? "daily" : `${selected.validityDays} days`}
              </p>
            ) : null}
          </div>
          <div className="text-right">
            <NumberFlow
              value={pounds}
              format={{
                style: "currency",
                currency: "GBP",
                trailingZeroDisplay: "stripIfInteger",
              }}
              className="text-2xl font-semibold text-navy"
            />
            <p className="text-xs text-slate">one-off</p>
          </div>
        </div>
      </div>

      <Button
        onClick={buy}
        disabled={!selected || !priceKnown || loading}
        size="lg"
        className="w-full"
      >
        {loading ? "Starting checkout…" : priceKnown ? "Buy this eSIM" : "Coming soon"}
      </Button>

      {error ? (
        <p className="px-1 text-center text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      {selected ? (
        <Link
          href={`/plans/${selected.slug}`}
          className="text-center text-xs font-medium text-gold-deep underline-offset-4 hover:underline"
        >
          See full plan details
        </Link>
      ) : null}
    </div>
  );
}
