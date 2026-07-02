"use client";

import { useEffect } from "react";
import type { FilterSpecification, StyleSpecification } from "maplibre-gl";

import { Map, useMap } from "@/components/ui/map";
import { cn } from "@/lib/utils";

/*
  Regional coverage map for the Gulf plans panel. Light, on-brand style
  (cream sea, paper land, navy hairlines) with the countries covered by the
  selected plan family pulsing in Saudi green. Two families exist:
  GCC plans include Oman, Gulf plans include Iraq; both cover the core five.
  The family is controlled by the explorer's tabs, so map and plan list
  always agree.
*/

export type GulfFamily = "GCC" | "Gulf";
type Family = GulfFamily;

const CORE = ["Saudi Arabia", "United Arab Emirates", "Qatar", "Kuwait"];
// Exported so the explorer can render the legend beneath the map.
export const FAMILY_COUNTRIES: Record<Family, string[]> = {
  GCC: [...CORE, "Oman"],
  Gulf: [...CORE, "Iraq"],
};

// Bahrain is covered by both families but is too small to exist in the
// 110m-resolution country polygons, so it gets its own pulsing dot.
const BAHRAIN: [number, number] = [50.55, 26.07];

const PULSE_MIN = 0.22;
const PULSE_MAX = 0.52;
const PULSE_PERIOD = 2.6; // seconds per breath

const MAP_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    countries: { type: "geojson", data: "/geo/countries-110m.geojson" },
    bahrain: {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: { type: "Point", coordinates: BAHRAIN },
      },
    },
  },
  layers: [
    { id: "sea", type: "background", paint: { "background-color": "#e9edf3" } },
    {
      id: "land",
      type: "fill",
      source: "countries",
      paint: { "fill-color": "#fbfaf6" },
    },
    {
      id: "borders",
      type: "line",
      source: "countries",
      paint: { "line-color": "rgba(25,32,46,0.22)", "line-width": 0.7 },
    },
    {
      id: "covered-fill",
      type: "fill",
      source: "countries",
      filter: ["in", ["get", "NAME"], ["literal", FAMILY_COUNTRIES.GCC]],
      paint: { "fill-color": "#2fae74", "fill-opacity": PULSE_MIN },
    },
    {
      id: "covered-outline",
      type: "line",
      source: "countries",
      filter: ["in", ["get", "NAME"], ["literal", FAMILY_COUNTRIES.GCC]],
      paint: { "line-color": "#1f4a32", "line-width": 1.1, "line-opacity": 0.55 },
    },
    {
      id: "bahrain-dot",
      type: "circle",
      source: "bahrain",
      paint: {
        "circle-radius": 4,
        "circle-color": "#2fae74",
        "circle-opacity": 0.75,
        "circle-stroke-color": "#1f4a32",
        "circle-stroke-width": 1,
      },
    },
  ],
};

// Breathe the covered region's fill between PULSE_MIN and PULSE_MAX.
function CoveragePulse({ family }: { family: Family }) {
  const { map, isLoaded } = useMap();

  // Keep the highlighted countries in sync with the selected family.
  useEffect(() => {
    if (!map || !isLoaded) return;
    const filter: FilterSpecification = [
      "in",
      ["get", "NAME"],
      ["literal", FAMILY_COUNTRIES[family]],
    ];
    try {
      map.setFilter("covered-fill", filter);
      map.setFilter("covered-outline", filter);
    } catch {
      // Style still swapping — the initial filter renders until it settles.
    }
  }, [map, isLoaded, family]);

  useEffect(() => {
    if (!map || !isLoaded) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) {
      try {
        map.setPaintProperty("covered-fill", "fill-opacity", 0.38);
      } catch {
        // layer not ready — static default stays
      }
      return;
    }

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = ((now - start) / 1000 / PULSE_PERIOD) * Math.PI * 2;
      const level =
        PULSE_MIN + (PULSE_MAX - PULSE_MIN) * (0.5 + 0.5 * Math.sin(t));
      try {
        map.setPaintProperty("covered-fill", "fill-opacity", level);
        map.setPaintProperty(
          "bahrain-dot",
          "circle-radius",
          3.4 + 2.2 * ((level - PULSE_MIN) / (PULSE_MAX - PULSE_MIN))
        );
      } catch {
        // map torn down mid-frame — the cleanup below stops the loop
      }
      raf = requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [map, isLoaded]);

  return null;
}

export function GulfCoverageMapImpl({
  family,
  className,
}: {
  family: Family;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl ring-1 ring-line",
        className
      )}
    >
      <Map
        styles={{ light: MAP_STYLE, dark: MAP_STYLE }}
        viewport={{ center: [49.2, 26.8], zoom: 3.15 }}
        interactive={false}
        attributionControl={false}
        className="[&_.maplibregl-ctrl-attrib]:hidden"
      >
        <CoveragePulse family={family} />
      </Map>
    </div>
  );
}
