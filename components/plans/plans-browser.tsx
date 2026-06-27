"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, Globe, Signal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDataAmount } from "@/lib/money";

export type BrowserPlan = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  country: string;
  dataAmountMb: number | null;
  validityDays: number;
  retailPricePence: number | null;
  badge: string | null;
};

// 1-day packages give a daily allowance; everything else is a fixed bundle.
function isDaily(plan: BrowserPlan) {
  return plan.validityDays <= 1;
}

// Fair-use / throttled variants (e.g. "...-fup-1mbps") are hidden by default.
function isFup(plan: BrowserPlan) {
  return /fup|1mbps/i.test(plan.slug);
}

type Group = {
  key: string;
  title: string;
  blurb: string;
  match: (plan: BrowserPlan) => boolean;
};

const GROUPS: Group[] = [
  {
    key: "daily",
    title: "Daily data",
    blurb: "A fresh allowance every day — best when you want plenty of data and will top up as you go.",
    match: (p) => isDaily(p),
  },
  {
    key: "short",
    title: "Short stays · up to 15 days",
    blurb: "A fixed bundle for a focused Umrah trip of a week or two.",
    match: (p) => !isDaily(p) && p.validityDays <= 15,
  },
  {
    key: "monthly",
    title: "Monthly bundles · 30 days",
    blurb: "Larger 30-day bundles for longer stays or heavier use.",
    match: (p) => !isDaily(p) && p.validityDays > 15,
  },
];

export function PlansBrowser({ plans }: { plans: BrowserPlan[] }) {
  const [showFup, setShowFup] = useState(false);
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hasFup = useMemo(() => plans.some(isFup), [plans]);

  const grouped = useMemo(() => {
    const visible = plans.filter((p) => showFup || !isFup(p));
    return GROUPS.map((group) => ({
      ...group,
      items: visible
        .filter(group.match)
        .sort(
          (a, b) =>
            (a.retailPricePence ?? Infinity) - (b.retailPricePence ?? Infinity),
        ),
    })).filter((group) => group.items.length > 0);
  }, [plans, showFup]);

  async function buy(slug: string) {
    setLoadingSlug(slug);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, quantity: 1 }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Could not start checkout.");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoadingSlug(null);
    }
  }

  return (
    <div className="space-y-14">
      {grouped.map((group) => (
        <section key={group.key}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <h2 className="text-2xl text-navy">{group.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-slate">
                {group.blurb}
              </p>
            </div>
            {group.key === "daily" && hasFup ? (
              <button
                type="button"
                onClick={() => setShowFup((v) => !v)}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  showFup
                    ? "border-navy bg-navy/5 text-navy"
                    : "border-line text-slate hover:text-navy",
                )}
                aria-pressed={showFup}
              >
                {showFup ? "Hide fair-use options" : "Show fair-use options"}
              </button>
            ) : null}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {group.items.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                daily={isDaily(plan)}
                fup={isFup(plan)}
                loading={loadingSlug === plan.slug}
                disabled={loadingSlug !== null}
                onBuy={() => buy(plan.slug)}
              />
            ))}
          </div>
        </section>
      ))}

      {error ? (
        <p className="text-center text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function PlanCard({
  plan,
  daily,
  fup,
  loading,
  disabled,
  onBuy,
}: {
  plan: BrowserPlan;
  daily: boolean;
  fup: boolean;
  loading: boolean;
  disabled: boolean;
  onBuy: () => void;
}) {
  const priceKnown = plan.retailPricePence != null;
  const popular = Boolean(plan.badge?.toLowerCase().includes("popular"));
  const regional = plan.country !== "SA";
  const tag = plan.badge ?? (regional ? plan.country : null);

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border bg-paper p-5",
        popular ? "border-navy" : "border-line",
      )}
    >
      {tag ? (
        <span className="absolute right-4 top-4 rounded-md bg-gold/20 px-2 py-0.5 text-[11px] font-semibold text-gold-deep">
          {tag}
        </span>
      ) : null}

      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-semibold text-navy">
          {formatDataAmount(plan.dataAmountMb)}
        </span>
        {daily ? <span className="text-sm text-slate">/ day</span> : null}
      </div>

      <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-slate">
        <CalendarDays className="size-3.5" aria-hidden />
        {daily ? "Daily pass" : `${plan.validityDays} days validity`}
      </p>

      {regional ? (
        <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-slate">
          <Globe className="size-3.5" aria-hidden />
          6 countries incl. Saudi Arabia
        </p>
      ) : null}

      {fup ? (
        <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-slate">
          <Signal className="size-3.5" aria-hidden />
          Slows to 1Mbps after the daily allowance
        </p>
      ) : null}

      <div className="mt-5 flex items-end justify-between">
        <p className="tnum text-xl font-semibold text-navy">
          {priceKnown ? `£${(plan.retailPricePence! / 100).toFixed(2)}` : "TBD"}
          <span className="ml-1 text-xs font-normal text-slate">one-off</span>
        </p>
      </div>

      <Button
        onClick={onBuy}
        disabled={disabled || !priceKnown}
        className="mt-3 w-full"
      >
        {loading ? "Starting…" : priceKnown ? "Buy this eSIM" : "Coming soon"}
      </Button>

      <Link
        href={`/plans/${plan.slug}`}
        className="mt-2 text-center text-xs font-medium text-gold-deep underline-offset-4 hover:underline"
      >
        Plan details
      </Link>
    </div>
  );
}
