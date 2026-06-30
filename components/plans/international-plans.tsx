"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { PlansBrowser, type BrowserPlan } from "./plans-browser";

export type IntlCountry = {
  code: string;
  name: string;
  flag: string;
};

// Flag-button selector for worldwide single-country eSIMs. Picking a flag
// swaps the plan grid below to that country's plans.
export function InternationalPlans({
  countries,
  plans,
}: {
  countries: IntlCountry[];
  plans: BrowserPlan[];
}) {
  const hasPlans = (code: string) => plans.some((p) => p.country === code);
  const firstWithPlans = countries.find((c) => hasPlans(c.code)) ?? countries[0];
  const [selected, setSelected] = useState(firstWithPlans?.code);

  const active = countries.find((c) => c.code === selected) ?? countries[0];
  const countryPlans = plans.filter((p) => p.country === selected);

  return (
    <div>
      <div
        role="tablist"
        aria-label="Choose a country"
        className="flex flex-wrap gap-2.5"
      >
        {countries.map((c) => {
          const isSelected = c.code === selected;
          return (
            <button
              key={c.code}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setSelected(c.code)}
              className={cn(
                "inline-flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-colors",
                isSelected
                  ? "border-intl bg-intl-tint text-intl"
                  : "border-line bg-paper text-navy hover:border-intl/40 hover:text-intl",
              )}
            >
              <span className="block h-5 w-[27px] shrink-0 overflow-hidden rounded-[3px] ring-1 ring-black/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.flag}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </span>
              {c.name}
              {!hasPlans(c.code) ? (
                <span className="text-xs font-normal text-slate">· soon</span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="mt-7">
        {countryPlans.length ? (
          <PlansBrowser
            plans={countryPlans}
            accent="blue"
            layout="grid"
            showGroupHeaders={false}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-[color:var(--intl-line)] bg-paper/50 p-8 text-center">
            <p className="font-medium text-navy">
              {active?.name} plans coming soon
            </p>
            <p className="mt-1 text-sm text-slate">
              We&apos;re finalising eSIMs for {active?.name}. Check back shortly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
