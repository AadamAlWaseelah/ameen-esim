"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, ChevronDown, Search, Smartphone, X } from "lucide-react";

import {
  ESIM_COMPATIBLE_DEVICES,
  TOTAL_COMPATIBLE_DEVICES,
  searchCompatibleDevices,
} from "@/lib/devices/esim-compatible";

const POPULAR = ["iPhone", "Galaxy", "Pixel", "Xiaomi", "Oppo", "Huawei"];

export function CompatibilityChecker() {
  const [query, setQuery] = useState("");
  const trimmed = query.trim();
  const hasQuery = trimmed.length > 0;
  const results = useMemo(() => searchCompatibleDevices(query, 30), [query]);

  return (
    <div className="rounded-[1.5rem] border border-line bg-paper p-5 shadow-sm sm:p-7">
      {/* Search field */}
      <label htmlFor="device-search" className="sr-only">
        Search your phone or tablet model
      </label>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate"
          aria-hidden
        />
        <input
          id="device-search"
          type="search"
          inputMode="search"
          autoComplete="off"
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
          placeholder="Search your device, e.g. iPhone 13 or Galaxy S22"
          className="h-14 w-full rounded-2xl border border-input bg-cream/50 pl-12 pr-12 text-base text-navy outline-none transition-[border-color,box-shadow] duration-200 ease-out-strong placeholder:text-slate/80 focus:border-gold focus:bg-paper focus:shadow-[0_0_0_4px_rgba(201,169,97,0.18)]"
          aria-describedby="device-search-hint"
        />
        {hasQuery ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-slate transition-colors hover:bg-navy/5 hover:text-navy"
          >
            <X className="size-4" aria-hidden />
          </button>
        ) : null}
      </div>

      {/* Popular shortcuts */}
      {!hasQuery ? (
        <div className="mt-4 flex flex-wrap items-center gap-2" id="device-search-hint">
          <span className="text-sm text-slate">Popular:</span>
          {POPULAR.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => setQuery(term)}
              className="rounded-full border border-line bg-cream/60 px-3 py-1 text-sm text-navy transition-[transform,border-color,background-color] duration-150 ease-out-strong hover:border-gold/50 active:scale-[0.97]"
            >
              {term}
            </button>
          ))}
        </div>
      ) : null}

      {/* Results */}
      <div className="mt-5" aria-live="polite">
        {hasQuery && results.length > 0 ? (
          <>
            <p className="text-sm font-medium text-gold-deep">
              {results.length} compatible {results.length === 1 ? "match" : "matches"}
            </p>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {results.map((match, i) => (
                <li
                  key={`${match.brand}-${match.device}`}
                  className="animate-fade-up flex items-center gap-3 rounded-xl border border-line bg-cream/50 px-3.5 py-3"
                  style={{ animationDelay: `${Math.min(i, 10) * 30}ms` }}
                >
                  <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-deep">
                    <Check className="size-4" aria-hidden />
                  </span>
                  <span>
                    <span className="block font-medium leading-tight text-navy">
                      {match.device}
                    </span>
                    <span className="text-xs text-slate">{match.brand}</span>
                  </span>
                </li>
              ))}
            </ul>
          </>
        ) : null}

        {hasQuery && results.length === 0 ? (
          <div className="rounded-xl border border-gold/30 bg-gold/5 p-4">
            <p className="flex items-start gap-2.5 font-medium text-navy">
              <Smartphone className="mt-0.5 size-4 shrink-0 text-gold-deep" aria-hidden />
              We couldn&apos;t find &ldquo;{trimmed}&rdquo; on the list
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate">
              That doesn&apos;t always mean it won&apos;t work — newer or
              regional models may not be listed yet. The quickest way to be sure:
              open your phone&apos;s settings and search for{" "}
              <span className="font-medium text-navy">&ldquo;eSIM&rdquo;</span> or{" "}
              <span className="font-medium text-navy">&ldquo;Add eSIM&rdquo;</span>.
              Still unsure?{" "}
              <Link
                href="/contact"
                className="font-medium text-gold-deep underline-offset-4 hover:underline"
              >
                Ask us
              </Link>{" "}
              before you buy.
            </p>
          </div>
        ) : null}
      </div>

      {/* Honest caveats */}
      <div className="mt-6 space-y-2.5 border-t border-line pt-5 text-sm leading-relaxed text-slate">
        <p>
          This is a guide based on manufacturer lists, covering{" "}
          {TOTAL_COMPATIBLE_DEVICES}+ devices — not a guarantee for every model.
        </p>
        <p>
          Your phone must also be{" "}
          <span className="font-medium text-navy">carrier-unlocked</span>. Some
          regional variants (for example certain mainland-China models) ship
          without eSIM, so always confirm in your device settings.
        </p>
      </div>

      {/* Browse full list */}
      <details className="group mt-5">
        <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-medium text-navy [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className="size-4 text-gold-deep transition-transform duration-200 ease-out-strong group-open:rotate-180"
            aria-hidden
          />
          Browse the full list of supported devices
        </summary>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          {ESIM_COMPATIBLE_DEVICES.map((group) => (
            <div key={group.brand}>
              <h3 className="text-sm font-semibold text-navy">{group.brand}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate">
                {group.devices.join(", ")}
              </p>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
