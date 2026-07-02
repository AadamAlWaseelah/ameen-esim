"use client";

import { useState } from "react";

import {
  CONTINENTS,
  FEATURED_INTL_CODES,
  type Continent,
} from "@/lib/flags";
import { Flag } from "@/components/ui/flag";
import { cn } from "@/lib/utils";
import { PlansBrowser, type BrowserPlan } from "./plans-browser";

export type IntlCountry = {
  code: string;
  name: string;
  continent: Continent;
};

/*
  International selector: a featured row of the most-bought countries, a
  hairline divider, then continent tabs revealing only that continent's
  flags. Picking any flag (featured or continental) swaps the plan grid.
*/
export function InternationalPlans({
  countries,
  plans,
}: {
  countries: IntlCountry[];
  plans: BrowserPlan[];
}) {
  const hasPlans = (code: string) => plans.some((p) => p.country === code);

  const featured = FEATURED_INTL_CODES.map((code) =>
    countries.find((c) => c.code === code),
  ).filter((c): c is IntlCountry => Boolean(c));

  const firstWithPlans =
    featured.find((c) => hasPlans(c.code)) ??
    countries.find((c) => hasPlans(c.code)) ??
    countries[0];
  const [selected, setSelected] = useState(firstWithPlans?.code);
  const [continent, setContinent] = useState<Continent>("Europe");

  const active = countries.find((c) => c.code === selected) ?? countries[0];
  const countryPlans = plans.filter((p) => p.country === selected);
  const continentCountries = countries.filter(
    (c) => c.continent === continent,
  );

  function FlagButton({ country }: { country: IntlCountry }) {
    const isSelected = country.code === selected;
    return (
      <button
        type="button"
        aria-pressed={isSelected}
        onClick={() => setSelected(country.code)}
        className={cn(
          "inline-flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-colors duration-150 ease-out-strong",
          isSelected
            ? "border-intl bg-intl-tint text-intl"
            : "border-line bg-paper text-navy hover:border-intl/40 hover:text-intl",
        )}
      >
        <span className="block h-5 w-[27px] shrink-0 overflow-hidden rounded-[3px] ring-1 ring-black/10">
          <Flag code={country.code} />
        </span>
        {country.name}
        {!hasPlans(country.code) ? (
          <span className="text-xs font-normal text-slate">· soon</span>
        ) : null}
      </button>
    );
  }

  return (
    <div>
      {/* Featured destinations */}
      <p className="text-sm font-semibold text-navy">Popular destinations</p>
      <div className="mt-3 flex flex-wrap gap-2.5">
        {featured.map((c) => (
          <FlagButton key={c.code} country={c} />
        ))}
      </div>

      <hr className="my-6 border-[color:var(--intl-line)]" />

      {/* Continent browser */}
      <div
        role="tablist"
        aria-label="Browse by continent"
        className="flex w-full flex-wrap gap-1 rounded-xl border border-[color:var(--intl-line)] bg-paper/70 p-1"
      >
        {CONTINENTS.map((c) => {
          const activeTab = continent === c;
          return (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={activeTab}
              onClick={() => setContinent(c)}
              className={cn(
                "flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-colors duration-150 ease-out-strong",
                activeTab
                  ? "bg-intl text-white shadow-sm"
                  : "text-slate hover:text-intl",
              )}
            >
              {c}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-2.5">
        {continentCountries.length ? (
          continentCountries.map((c) => (
            <FlagButton key={c.code} country={c} />
          ))
        ) : (
          <p className="text-sm text-slate">
            No {continent} destinations yet. More countries are on the way.
          </p>
        )}
      </div>

      {/* Selected country's plans */}
      <div className="mt-7">
        {countryPlans.length ? (
          <PlansBrowser plans={countryPlans} accent="blue" layout="grid" />
        ) : (
          <div className="rounded-2xl border border-dashed border-[color:var(--intl-line)] bg-paper/50 p-8 text-center">
            <p className="font-medium text-navy">
              {active?.name} plans coming soon
            </p>
            <p className="mt-1 text-sm text-slate">
              We&apos;re finalising eSIMs for {active?.name}. Check back
              shortly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
