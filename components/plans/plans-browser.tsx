"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  CalendarRange,
  Gift,
  Globe,
  Signal,
  Star,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { flagForCountry } from "@/lib/flags";
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
// Exported so the Gulf explorer's tab counts match what actually renders.
export function isFup(plan: BrowserPlan) {
  return /fup|1mbps/i.test(plan.slug);
}

type Group = {
  key: string;
  title: string;
  blurb: string;
  icon: LucideIcon;
  match: (plan: BrowserPlan) => boolean;
};

// Groups render in this order and each plan lands in the FIRST group that
// matches it, so badged best-sellers lead and never repeat further down.
// Daily passes sit last deliberately: bundles convert better as the opener.
const GROUPS: Group[] = [
  {
    key: "featured",
    title: "Most popular",
    blurb:
      "The sizes most pilgrims pick for a typical Umrah trip. A safe place to start.",
    icon: Star,
    match: (p) => p.badge != null,
  },
  {
    key: "short",
    title: "Short stays · up to 15 days",
    blurb: "A fixed data bundle for a trip of a week or two.",
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
  {
    key: "daily",
    title: "Daily data",
    blurb:
      "A fresh allowance every day. Best when you want plenty of data and will top up as you go.",
    icon: Gift,
    match: (p) => isDaily(p),
  },
];

export function PlansBrowser({
  plans,
  accent = "navy",
  layout = "grid",
  showGroupHeaders = true,
  rowColumns = 2,
  hideShortStays = false,
}: {
  plans: BrowserPlan[];
  accent?: Accent;
  layout?: Layout;
  showGroupHeaders?: boolean;
  /** Column count for the "row" layout (1 when beside the coverage map). */
  rowColumns?: 1 | 2;
  /**
   * Hide fixed bundles of 15 days or less. Used for Saudi Arabia, where the
   * 30-day bundles cost the same as the short ones, so short stays only
   * steer buyers into a worse deal.
   */
  hideShortStays?: boolean;
}) {
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const grouped = useMemo(() => {
    // Fair-use / throttled variants are never shown to keep the list honest.
    // Featured (badged) plans lead AND repeat in their duration group, so a
    // shopper browsing by trip length still finds them where they expect.
    const visible = plans.filter(
      (p) =>
        !isFup(p) &&
        !(hideShortStays && !isDaily(p) && p.validityDays <= 15),
    );
    return GROUPS.map((group) => ({
      ...group,
      items: visible
        .filter(group.match)
        .sort(
          (a, b) =>
            (a.retailPricePence ?? Infinity) - (b.retailPricePence ?? Infinity),
        ),
    })).filter((group) => group.items.length > 0);
  }, [plans, hideShortStays]);

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
      ? rowColumns === 1
        ? "mt-5 grid gap-3"
        : "mt-5 grid gap-3 lg:grid-cols-2"
      : "mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4";
  // Featured cards run wider (three across) so the best-sellers feel bigger.
  const featuredGridClass = "mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3";

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

            <div
              className={
                group.key === "featured" && layout === "grid"
                  ? featuredGridClass
                  : gridClass
              }
            >
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
                    featured={group.key === "featured"}
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

// Vertical card — Saudi grid (up to four across). Featured cards carry a
// gold ring + glow so the best-sellers stand apart from the rest.
function PlanCard({
  plan,
  daily,
  fup,
  accent,
  featured = false,
  loading,
  disabled,
  onBuy,
}: {
  plan: BrowserPlan;
  daily: boolean;
  fup: boolean;
  accent: Accent;
  featured?: boolean;
  loading: boolean;
  disabled: boolean;
  onBuy: () => void;
}) {
  const priceKnown = plan.retailPricePence != null;
  const flag = flagForCountry(plan.country);
  // A badge (e.g. "Popular") wins the corner; otherwise show the country's
  // flag, falling back to the region code for non-flagged regionals (Gulf).
  const textTag =
    plan.badge ?? (!flag && plan.country !== "SA" ? plan.country : null);

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border bg-paper p-5",
        featured
          ? "border-gold/60 shadow-[0_0_0_1px_rgba(201,169,97,0.25),0_10px_38px_-10px_rgba(201,169,97,0.55)]"
          : "border-line shadow-[0_1px_2px_rgba(25,32,46,0.04)]",
      )}
    >
      {featured ? (
        <div
          aria-hidden
          className="animate-glow-pulse pointer-events-none absolute -inset-1 -z-10 rounded-[1.25rem] blur-lg"
          style={{
            background:
              "radial-gradient(70% 60% at 50% 0%, rgba(201,169,97,0.35), transparent)",
          }}
        />
      ) : null}
      {textTag ? (
        <span
          className={cn(
            "absolute right-4 top-4 rounded-md px-2 py-0.5 text-[11px] font-semibold",
            featured ? "bg-gold/20 text-gold-deep" : accentTintClass(accent),
          )}
        >
          {textTag}
        </span>
      ) : flag ? (
        <span
          title={flag.name}
          className="absolute right-4 top-4 block h-3.5 w-[19px] overflow-hidden rounded-[3px] ring-1 ring-black/10"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={flag.flag}
            alt={flag.name}
            className="h-full w-full object-cover"
          />
        </span>
      ) : null}

      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-semibold text-navy">
          {formatDataAmount(plan.dataAmountMb)}
        </span>
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
  // The Gulf list is already filtered to one family by the explorer tabs, so
  // only a real badge earns the corner; a per-row family chip is just noise.
  const tag = plan.badge;

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
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-3.5" aria-hidden />
              {daily ? "Daily pass" : `${plan.validityDays} days validity`}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Globe className="size-3.5" aria-hidden />
              {plan.country === "Gulf"
                ? "6 countries incl. Saudi Arabia & Iraq"
                : "6 countries incl. Saudi Arabia & Oman"}
            </span>
            {fup ? (
              <span className="inline-flex items-center gap-1.5">
                <Signal className="size-3.5" aria-hidden />
                Slows to 1Mbps after the daily allowance
              </span>
            ) : null}
          </div>
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
