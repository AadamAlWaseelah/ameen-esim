"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, Globe } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GulfCoverageMap } from "@/components/plans/gulf-coverage-map";
import {
  FAMILY_COUNTRIES,
  type GulfFamily,
} from "@/components/plans/gulf-coverage-map-impl";
import { isFup, type BrowserPlan } from "@/components/plans/plans-browser";
import { formatDataAmount } from "@/lib/money";
import { cn } from "@/lib/utils";

/*
  Gulf plans explorer. The family tabs drive BOTH the coverage map highlight
  and the plan list, and plans sharing a validity collapse into one card with
  a data-amount slider, so the whole panel stays as short as the map.
*/

const FAMILIES: { key: GulfFamily; label: string; note: string }[] = [
  { key: "GCC", label: "GCC plans", note: "incl. Oman" },
  { key: "Gulf", label: "Gulf plans", note: "incl. Iraq" },
];

type Bucket = {
  key: string;
  label: string;
  daily: boolean;
  plans: BrowserPlan[]; // sorted by data amount ascending
};

function coverageLabel(family: GulfFamily) {
  return family === "Gulf"
    ? "6 countries incl. Saudi Arabia & Iraq"
    : "6 countries incl. Saudi Arabia & Oman";
}

function priceLabel(pence: number | null) {
  return pence != null ? `£${(pence / 100).toFixed(2)}` : "TBD";
}

// Bucket by validity: fixed bundles ascending, daily passes last.
function bucketPlans(plans: BrowserPlan[]): Bucket[] {
  const fixed = new Map<number, BrowserPlan[]>();
  const daily: BrowserPlan[] = [];
  for (const p of plans) {
    if (p.validityDays <= 1) daily.push(p);
    else fixed.set(p.validityDays, [...(fixed.get(p.validityDays) ?? []), p]);
  }
  const byData = (a: BrowserPlan, b: BrowserPlan) =>
    (a.dataAmountMb ?? 0) - (b.dataAmountMb ?? 0);
  const buckets: Bucket[] = Array.from(fixed.entries())
    .sort(([a], [b]) => a - b)
    .map(([days, items]) => ({
      key: `fixed-${days}`,
      label: `${days}-day bundle${items.length > 1 ? "s" : ""}`,
      daily: false,
      plans: items.sort(byData),
    }));
  if (daily.length) {
    buckets.push({
      key: "daily",
      label: "Daily passes",
      daily: true,
      plans: daily.sort(byData),
    });
  }
  return buckets;
}

export function GulfPlansExplorer({ plans }: { plans: BrowserPlan[] }) {
  const [family, setFamily] = useState<GulfFamily>("GCC");
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fair-use variants stay hidden, matching the Saudi browser.
  const shown = useMemo(() => plans.filter((p) => !isFup(p)), [plans]);
  const buckets = useMemo(
    () => bucketPlans(shown.filter((p) => p.country === family)),
    [shown, family]
  );

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
    <div className="grid gap-6 lg:grid-cols-[minmax(320px,0.9fr)_1.1fr] lg:items-stretch">
      {/* Map column stretches to match the plan list's height. */}
      <div className="flex flex-col">
        <GulfCoverageMap
          family={family}
          className="h-[320px] lg:h-auto lg:min-h-[400px] lg:flex-1"
        />
        <p className="mt-3 flex items-center gap-2 text-xs font-medium text-navy">
          <span className="relative flex size-2.5 shrink-0" aria-hidden>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2fae74]/60" />
            <span className="relative inline-flex size-2.5 rounded-full bg-[#2fae74]" />
          </span>
          Covered: {FAMILY_COUNTRIES[family].join(", ")} &amp; Bahrain
        </p>
      </div>

      <div>
        {/* Family navigation — swaps the list and the map highlight together. */}
        <div
          role="tablist"
          aria-label="Gulf plan family"
          className="flex gap-1 rounded-xl border border-line bg-paper/70 p-1"
        >
          {FAMILIES.map((f) => {
            const active = family === f.key;
            const count = shown.filter((p) => p.country === f.key).length;
            return (
              <button
                key={f.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFamily(f.key)}
                className={cn(
                  "flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors duration-150 ease-out-strong",
                  active
                    ? "bg-navy text-cream shadow-sm"
                    : "text-slate hover:text-navy"
                )}
              >
                {f.label}
                <span
                  className={cn(
                    "ml-2 text-xs font-normal",
                    active ? "text-cream/70" : "text-slate/80"
                  )}
                >
                  {f.note} · {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 space-y-4">
          {buckets.map((bucket) => (
            <BucketCard
              key={`${family}-${bucket.key}`}
              bucket={bucket}
              family={family}
              loadingSlug={loadingSlug}
              onBuy={buy}
            />
          ))}
        </div>

        {error ? (
          <p className="mt-4 text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}

/*
  One card per validity. Multiple data sizes collapse into a slider; a single
  size renders the same card without the slider row.
*/
function BucketCard({
  bucket,
  family,
  loadingSlug,
  onBuy,
}: {
  bucket: Bucket;
  family: GulfFamily;
  loadingSlug: string | null;
  onBuy: (slug: string) => void;
}) {
  // Default to the middle size — a sensible anchor for most trips.
  const [index, setIndex] = useState(Math.floor((bucket.plans.length - 1) / 2));
  const plan = bucket.plans[Math.min(index, bucket.plans.length - 1)];
  const priceKnown = plan.retailPricePence != null;
  const loading = loadingSlug === plan.slug;

  return (
    <div className="rounded-2xl border border-line bg-paper p-5 shadow-[0_1px_2px_rgba(25,32,46,0.04)]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-navy">{bucket.label}</p>
        <span className="inline-flex items-center gap-1.5 text-xs text-slate">
          <CalendarDays className="size-3.5" aria-hidden />
          {bucket.daily
            ? "Fresh allowance every day"
            : `${plan.validityDays} days validity`}
        </span>
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-3">
        <p className="text-3xl font-semibold tracking-tight text-navy">
          {formatDataAmount(plan.dataAmountMb)}
          {bucket.daily ? (
            <span className="ml-1 text-sm font-normal text-slate">/ day</span>
          ) : null}
        </p>
        <p className="tnum text-xl font-semibold text-navy">
          {priceLabel(plan.retailPricePence)}
          <span className="ml-1 text-xs font-normal text-slate">one-off</span>
        </p>
      </div>

      {bucket.plans.length > 1 ? (
        <div className="mt-3">
          <input
            type="range"
            min={0}
            max={bucket.plans.length - 1}
            step={1}
            value={index}
            onChange={(e) => setIndex(Number(e.target.value))}
            aria-label={`Data amount for ${bucket.label}`}
            aria-valuetext={formatDataAmount(plan.dataAmountMb) ?? undefined}
            className="w-full cursor-pointer accent-navy"
          />
          <div className="mt-1 flex justify-between">
            {bucket.plans.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setIndex(i)}
                className={cn(
                  "rounded px-1 text-xs transition-colors duration-150",
                  i === index
                    ? "font-semibold text-navy"
                    : "text-slate hover:text-navy"
                )}
              >
                {formatDataAmount(p.dataAmountMb)}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-slate">
        <Globe className="size-3.5" aria-hidden />
        {coverageLabel(family)}
      </p>

      <div className="mt-4 flex items-center gap-4">
        <Button
          onClick={() => onBuy(plan.slug)}
          disabled={loadingSlug !== null || !priceKnown}
          className="flex-1"
        >
          {loading
            ? "Starting…"
            : priceKnown
              ? "Buy this eSIM"
              : "Coming soon"}
        </Button>
        <Link
          href={`/plans/${plan.slug}`}
          className="shrink-0 text-xs font-medium text-gold-deep underline-offset-4 hover:underline"
        >
          Plan details
        </Link>
      </div>
    </div>
  );
}
