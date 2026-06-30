"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  CalendarRange,
  Gift,
  Globe,
  Signal,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

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

type Accent = "green" | "navy" | "blue";
type Layout = "grid" | "row";

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
  icon: LucideIcon;
  match: (plan: BrowserPlan) => boolean;
};

const GROUPS: Group[] = [
  {
    key: "daily",
    title: "Daily data",
    blurb:
      "A fresh allowance every day — best when you want plenty of data and will top up as you go.",
    icon: Gift,
    match: (p) => isDaily(p),
  },
  {
    key: "short",
    title: "Short stays · up to 15 days",
    blurb: "A fixed bundle for a focused Umrah trip of a week or two.",
    icon: CalendarRange,
    match: (p) => !isDaily(p) && p.validityDays <= 15,
  },
  {
    key: "monthly",
    title: "Monthly bundles · 30 days",
    blurb: "Larger 30-day bundles for longer stays or heavier use.",
    icon: CalendarDays,
    match: (p) => !isDaily(p) && p.validityDays > 15,
  },
];

export function PlansBrowser({
  plans,
  accent = "navy",
  layout = "grid",
  showGroupHeaders = true,
}: {
  plans: BrowserPlan[];
  accent?: Accent;
  layout?: Layout;
  showGroupHeaders?: boolean;
}) {
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const grouped = useMemo(() => {
    // Fair-use / throttled variants are never shown to keep the list honest.
    const visible = plans.filter((p) => !isFup(p));
    return GROUPS.map((group) => ({
      ...group,
      items: visible
        .filter(group.match)
        .sort(
          (a, b) =>
            (a.retailPricePence ?? Infinity) - (b.retailPricePence ?? Infinity),
        ),
    })).filter((group) => group.items.length > 0);
  }, [plans]);

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

  const gridClass =
    layout === "row"
      ? "mt-5 grid gap-3 lg:grid-cols-2"
      : "mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4";

  return (
    <div className="space-y-10">
      {grouped.map((group) => {
        const GroupIcon = group.icon;
        return (
          <section key={group.key}>
            {showGroupHeaders ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl",
                    accentTintClass(accent),
                  )}
                >
                  <GroupIcon className="size-4" aria-hidden />
                </span>
                <div className="max-w-xl">
                  <h3 className="text-lg font-semibold text-navy">
                    {group.title}
                  </h3>
                  <p className="mt-0.5 text-sm leading-relaxed text-slate">
                    {group.blurb}
                  </p>
                </div>
              </div>

              <span className="hidden shrink-0 text-xs text-slate sm:inline sm:pl-4">
                All plans are one-off · Data only
              </span>
            </div>
            ) : null}

            <div className={gridClass}>
              {group.items.map((plan) =>
                layout === "row" ? (
                  <PlanCardRow
                    key={plan.id}
                    plan={plan}
                    daily={isDaily(plan)}
                    fup={isFup(plan)}
                    accent={accent}
                    loading={loadingSlug === plan.slug}
                    disabled={loadingSlug !== null}
                    onBuy={() => buy(plan.slug)}
                  />
                ) : (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    daily={isDaily(plan)}
                    fup={isFup(plan)}
                    accent={accent}
                    loading={loadingSlug === plan.slug}
                    disabled={loadingSlug !== null}
                    onBuy={() => buy(plan.slug)}
                  />
                ),
              )}
            </div>
          </section>
        );
      })}

      {error ? (
        <p className="text-center text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function priceLabel(pence: number | null) {
  return pence != null ? `£${(pence / 100).toFixed(2)}` : "TBD";
}

function buyButtonClass(accent: Accent) {
  if (accent === "green") return "bg-saudi text-white hover:bg-saudi-deep";
  if (accent === "blue") return "bg-intl text-white hover:bg-intl-deep";
  return undefined;
}

// Soft tinted chip background for the accent (group icons, country tags).
function accentTintClass(accent: Accent) {
  if (accent === "green") return "bg-saudi-tint text-saudi";
  if (accent === "blue") return "bg-intl-tint text-intl";
  return "bg-gold/15 text-gold-deep";
}

// Vertical card — Saudi grid (up to four across).
function PlanCard({
  plan,
  daily,
  fup,
  accent,
  loading,
  disabled,
  onBuy,
}: {
  plan: BrowserPlan;
  daily: boolean;
  fup: boolean;
  accent: Accent;
  loading: boolean;
  disabled: boolean;
  onBuy: () => void;
}) {
  const priceKnown = plan.retailPricePence != null;
  const regional = plan.country !== "SA";
  const tag = plan.badge ?? (regional ? plan.country : null);

  return (
    <div className="relative flex flex-col rounded-2xl border border-line bg-paper p-5 shadow-[0_1px_2px_rgba(25,32,46,0.04)]">
      {tag ? (
        <span
          className={cn(
            "absolute right-4 top-4 rounded-md px-2 py-0.5 text-[11px] font-semibold",
            accentTintClass(accent),
          )}
        >
          {tag}
        </span>
      ) : null}

      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-semibold text-navy">
          {formatDataAmount(plan.dataAmountMb)}
        </span>
        {daily ? <span className="text-sm text-slate">/ day</span> : null}
      </div>

      <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-slate">
        <CalendarDays className="size-3.5" aria-hidden />
        {daily ? "Daily pass" : `${plan.validityDays} days validity`}
      </p>

      {fup ? (
        <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-slate">
          <Signal className="size-3.5" aria-hidden />
          Slows to 1Mbps after the daily allowance
        </p>
      ) : null}

      <p className="tnum mt-5 text-xl font-semibold text-navy">
        {priceLabel(plan.retailPricePence)}
        <span className="ml-1 text-xs font-normal text-slate">one-off</span>
      </p>

      <Button
        onClick={onBuy}
        disabled={disabled || !priceKnown}
        className={cn("mt-3 w-full", buyButtonClass(accent))}
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

// Horizontal card — Gulf-wide plans (details left, price + buy right).
function PlanCardRow({
  plan,
  daily,
  fup,
  accent,
  loading,
  disabled,
  onBuy,
}: {
  plan: BrowserPlan;
  daily: boolean;
  fup: boolean;
  accent: Accent;
  loading: boolean;
  disabled: boolean;
  onBuy: () => void;
}) {
  const priceKnown = plan.retailPricePence != null;
  const tag = plan.badge ?? (plan.country !== "SA" ? plan.country : null);

  return (
    <div className="relative flex flex-col rounded-2xl border border-line bg-paper p-5 shadow-[0_1px_2px_rgba(25,32,46,0.04)]">
      {tag ? (
        <span className="absolute right-4 top-4 rounded-md bg-gold/20 px-2 py-0.5 text-[11px] font-semibold text-gold-deep">
          {tag}
        </span>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-semibold text-navy">
              {formatDataAmount(plan.dataAmountMb)}
            </span>
            {daily ? <span className="text-sm text-slate">/ day</span> : null}
          </div>
          <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-slate">
            <CalendarDays className="size-3.5" aria-hidden />
            {daily ? "Daily pass" : `${plan.validityDays} days validity`}
          </p>
          <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-slate">
            <Globe className="size-3.5" aria-hidden />
            6 countries incl. Saudi Arabia
          </p>
          {fup ? (
            <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-slate">
              <Signal className="size-3.5" aria-hidden />
              Slows to 1Mbps after the daily allowance
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-4">
          <p className="tnum text-xl font-semibold text-navy">
            {priceLabel(plan.retailPricePence)}
            <span className="ml-1 text-xs font-normal text-slate">one-off</span>
          </p>
          <Button
            onClick={onBuy}
            disabled={disabled || !priceKnown}
            className={buyButtonClass(accent)}
          >
            {loading ? "Starting…" : priceKnown ? "Buy this eSIM" : "Coming soon"}
          </Button>
        </div>
      </div>

      <Link
        href={`/plans/${plan.slug}`}
        className="mt-3 text-center text-xs font-medium text-gold-deep underline-offset-4 hover:underline sm:text-left"
      >
        Plan details
      </Link>
    </div>
  );
}
