"use client";

import { useMemo, useState } from "react";

import { GulfCoverageMap } from "@/components/plans/gulf-coverage-map";
import type { GulfFamily } from "@/components/plans/gulf-coverage-map-impl";
import {
  PlansBrowser,
  isFup,
  type BrowserPlan,
} from "@/components/plans/plans-browser";
import { cn } from "@/lib/utils";

/*
  Gulf plans explorer: the family tabs drive BOTH the coverage map highlight
  and the plan list, so shoppers only ever see the plans that match the map
  in front of them. Keeps the panel short instead of listing every family.
*/

const FAMILIES: { key: GulfFamily; label: string; note: string }[] = [
  { key: "GCC", label: "GCC plans", note: "incl. Oman" },
  { key: "Gulf", label: "Gulf plans", note: "incl. Iraq" },
];

export function GulfPlansExplorer({ plans }: { plans: BrowserPlan[] }) {
  const [family, setFamily] = useState<GulfFamily>("GCC");

  // Hide fair-use variants up front so tab counts match the rendered list.
  const shown = useMemo(() => plans.filter((p) => !isFup(p)), [plans]);
  const visible = useMemo(
    () => shown.filter((p) => p.country === family),
    [shown, family]
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(320px,0.9fr)_1.1fr] lg:items-start">
      <GulfCoverageMap
        family={family}
        className="h-[320px] lg:sticky lg:top-24 lg:h-[430px]"
      />

      <div>
        {/* Family navigation — swaps the list and the map highlight together. */}
        <div
          role="tablist"
          aria-label="Gulf plan family"
          className="flex gap-1 rounded-xl border border-line bg-cream p-1"
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

        <PlansBrowser
          key={family}
          plans={visible}
          accent="navy"
          layout="row"
          showGroupHeaders={false}
          rowColumns={1}
        />
      </div>
    </div>
  );
}
