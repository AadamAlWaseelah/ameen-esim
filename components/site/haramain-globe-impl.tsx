"use client";

import { useEffect } from "react";
import type { StyleSpecification, GeoJSONSource } from "maplibre-gl";

import { Map, useMap } from "@/components/ui/map";

// --- Geography -------------------------------------------------------------

const MAKKAH: [number, number] = [39.8262, 21.4225];
const MADINAH: [number, number] = [39.6142, 24.4686];

// Approach gateways: Madinah-bound arcs route through a point NORTH of Madinah
// (so they enter from above); Makkah-bound arcs through a point SOUTH of Makkah
// (entering from below). This keeps the two bundles from overlapping.
const GATE_MADINAH: [number, number] = [39.4, 31];
const GATE_MAKKAH: [number, number] = [40.1, 13.5];

const ORIGINS: { name: string; coord: [number, number]; toMadinah?: boolean }[] =
  [
    { name: "London", coord: [-0.1276, 51.5072], toMadinah: true },
    { name: "New York", coord: [-74.006, 40.7128], toMadinah: true },
    { name: "Toronto", coord: [-79.3832, 43.6532] },
    { name: "Paris", coord: [2.3522, 48.8566] },
    { name: "Lagos", coord: [3.3792, 6.5244], toMadinah: true },
    { name: "Johannesburg", coord: [28.0473, -26.2041] },
    { name: "Cairo", coord: [31.2357, 30.0444] },
    { name: "Istanbul", coord: [28.9784, 41.0082], toMadinah: true },
    { name: "Tashkent", coord: [69.2401, 41.2995] },
    { name: "Karachi", coord: [67.0011, 24.8607] },
    { name: "Mumbai", coord: [72.8777, 19.076] },
    { name: "Dhaka", coord: [90.4125, 23.8103] },
    { name: "Kuala Lumpur", coord: [101.6869, 3.139], toMadinah: true },
    { name: "Jakarta", coord: [106.8456, -6.2088], toMadinah: true },
  ];

type ArcDef = {
  id: string;
  from: [number, number];
  control: [number, number];
  to: [number, number];
};

// Fan the shared gateway out per-arc so beams stay distinct as they approach.
function buildArcDefs(): ArcDef[] {
  const madinah = ORIGINS.filter((o) => o.toMadinah);
  const makkah = ORIGINS.filter((o) => !o.toMadinah);

  const gatewayControl = (
    index: number,
    count: number,
    gate: [number, number],
  ): [number, number] => {
    const spread = 2.3;
    const offset = (index - (count - 1) / 2) * spread;
    return [gate[0] + offset, gate[1]];
  };

  const defs: ArcDef[] = [];
  madinah.forEach((o, i) =>
    defs.push({
      id: o.name,
      from: o.coord,
      to: MADINAH,
      control: gatewayControl(i, madinah.length, GATE_MADINAH),
    }),
  );
  makkah.forEach((o, i) =>
    defs.push({
      id: o.name,
      from: o.coord,
      to: MAKKAH,
      control: gatewayControl(i, makkah.length, GATE_MAKKAH),
    }),
  );
  return defs;
}

const ARC_DEFS = buildArcDefs();
// 64 samples is visually indistinguishable at this zoom and halves the
// GeoJSON the comet loop re-tessellates on every update (see FRAME_MS).
const ARC_SAMPLES = 64;

// Quadratic Bézier through an explicit control point.
function bezierPath(
  p0: [number, number],
  c: [number, number],
  p2: [number, number],
  steps = ARC_SAMPLES,
): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const inv = 1 - t;
    pts.push([
      inv * inv * p0[0] + 2 * inv * t * c[0] + t * t * p2[0],
      inv * inv * p0[1] + 2 * inv * t * c[1] + t * t * p2[1],
    ]);
  }
  return pts;
}

const ARC_PATHS = ARC_DEFS.map((d) => ({
  id: d.id,
  coords: bezierPath(d.from, d.control, d.to),
}));

function lineFeature(
  coords: [number, number][],
  id: string,
): GeoJSON.Feature<GeoJSON.LineString> {
  return { type: "Feature", properties: { id }, geometry: { type: "LineString", coordinates: coords } };
}

function fc<T extends GeoJSON.Geometry>(
  features: GeoJSON.Feature<T>[],
): GeoJSON.FeatureCollection<T> {
  return { type: "FeatureCollection", features };
}

// --- Haramain green region (the Prophet's green-dome colour) ---------------

function circlePolygon(
  [lng, lat]: [number, number],
  radiusKm: number,
  steps = 72,
): GeoJSON.Feature<GeoJSON.Polygon> {
  const dLat = radiusKm / 110.574;
  const dLng = radiusKm / (111.32 * Math.cos((lat * Math.PI) / 180));
  const ring: [number, number][] = [];
  for (let i = 0; i <= steps; i += 1) {
    const t = (i / steps) * 2 * Math.PI;
    ring.push([lng + dLng * Math.cos(t), lat + dLat * Math.sin(t)]);
  }
  return { type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [ring] } };
}

const HARAMAIN_GLOW = fc([circlePolygon(MAKKAH, 320), circlePolygon(MADINAH, 320)]);
const HARAMAIN_CORE = fc([circlePolygon(MAKKAH, 130), circlePolygon(MADINAH, 130)]);
const HARAMAIN_POINTS = fc<GeoJSON.Point>([
  { type: "Feature", properties: {}, geometry: { type: "Point", coordinates: MAKKAH } },
  { type: "Feature", properties: {}, geometry: { type: "Point", coordinates: MADINAH } },
]);

const GLOBE_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    countries: { type: "geojson", data: "/geo/countries-110m.geojson" },
    "haramain-glow": { type: "geojson", data: HARAMAIN_GLOW },
    "haramain-core": { type: "geojson", data: HARAMAIN_CORE },
    "haramain-points": { type: "geojson", data: HARAMAIN_POINTS },
  },
  layers: [
    { id: "ocean", type: "background", paint: { "background-color": "#121a28" } },
    { id: "land", type: "fill", source: "countries", paint: { "fill-color": "#243149" } },
    {
      id: "land-outline",
      type: "line",
      source: "countries",
      paint: { "line-color": "rgba(201,169,97,0.28)", "line-width": 0.6 },
    },
    {
      id: "haramain-glow",
      type: "fill",
      source: "haramain-glow",
      paint: { "fill-color": "#2fae74", "fill-opacity": 0.16 },
    },
    {
      id: "haramain-core",
      type: "fill",
      source: "haramain-core",
      paint: { "fill-color": "#34b27b", "fill-opacity": 0.34 },
    },
    {
      id: "haramain-dots",
      type: "circle",
      source: "haramain-points",
      paint: {
        "circle-radius": 3.6,
        "circle-color": "#69e6ab",
        "circle-stroke-color": "rgba(255,255,255,0.75)",
        "circle-stroke-width": 1,
        "circle-opacity": 0.95,
      },
    },
  ],
};

// --- Atmosphere ------------------------------------------------------------

function GlobeSky() {
  const { map, isLoaded } = useMap();
  useEffect(() => {
    if (!map || !isLoaded) return;
    try {
      map.setSky({
        "sky-color": "#0b0f17",
        "sky-horizon-blend": 0.6,
        "horizon-color": "#1d2a44",
        "horizon-fog-blend": 0.6,
        "fog-color": "#0e1420",
        "fog-ground-blend": 0.4,
        "atmosphere-blend": ["interpolate", ["linear"], ["zoom"], 0, 0.85, 6, 0],
      });
    } catch {
      // setSky unsupported — globe still renders fine.
    }
  }, [map, isLoaded]);
  return null;
}

// --- Static paths + single travelling comet per arc ------------------------

const COMET_TAIL = 0.2; // fraction of the path length
const COMET_PERIOD = 5.2; // seconds per traversal
const COMET_GAP = 0.18; // fraction of cycle the comet is "off"
// Each comet update is a GeoJSON setData(), which MapLibre re-serialises and
// re-tessellates in its worker. At rAF rate that's fine on 60Hz Android but
// floods the worker on 120Hz iPhones (ProMotion), causing stutter/flicker —
// so cap updates at ~30fps; the movement is slow enough that it stays smooth.
const FRAME_MS = 33;

function GlobeArcs() {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded) return;

    const basePaths = ARC_PATHS.map((p) => lineFeature(p.coords, p.id));

    const removeAll = () => {
      try {
        for (const id of ["comets", "arcs-base", "arcs-glow"]) {
          if (map.getLayer(id)) map.removeLayer(id);
        }
        if (map.getSource("comets")) map.removeSource("comets");
        if (map.getSource("arcs")) map.removeSource("arcs");
      } catch {
        // Map already torn down (style removed during unmount) — nothing to do.
      }
    };

    // Idempotent + race-safe across StrictMode / Suspense double-mounts.
    try {
      removeAll();

    map.addSource("arcs", { type: "geojson", data: fc(basePaths) });
    map.addLayer({
      id: "arcs-glow",
      type: "line",
      source: "arcs",
      layout: { "line-cap": "round", "line-join": "round" },
      paint: { "line-color": "#e7d592", "line-width": 4, "line-opacity": 0.08, "line-blur": 3 },
    });
    map.addLayer({
      id: "arcs-base",
      type: "line",
      source: "arcs",
      layout: { "line-cap": "round", "line-join": "round" },
      paint: { "line-color": "#c9a961", "line-width": 1, "line-opacity": 0.28 },
    });

    map.addSource("comets", {
      type: "geojson",
      lineMetrics: true,
      data: fc<GeoJSON.LineString>([]),
    });
    map.addLayer({
      id: "comets",
      type: "line",
      source: "comets",
      layout: { "line-cap": "round" },
      paint: {
        "line-width": 2.6,
        "line-blur": 1,
        // tail (transparent) -> bright head along each comet segment
        "line-gradient": [
          "interpolate",
          ["linear"],
          ["line-progress"],
          0,
          "rgba(246,232,184,0)",
          0.65,
          "rgba(246,232,184,0.35)",
          1,
          "#fff4cf",
        ],
      },
    });
    } catch {
      // A concurrent StrictMode / Suspense mount is mid-setup and owns the
      // layers; this run can safely skip — the surviving mount renders them.
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return removeAll;

    // Stagger each comet's phase so they don't bunch at the centre together.
    const phases = ARC_PATHS.map((_, i) => (i * 0.6180339887) % 1);

    let raf = 0;
    const start = performance.now();
    let lastUpdate = -Infinity;

    const tick = (now: number) => {
      if (now - lastUpdate < FRAME_MS) {
        raf = requestAnimationFrame(tick);
        return;
      }
      lastUpdate = now;
      try {
        const src = map.getSource("comets") as GeoJSONSource | undefined;
        if (src) {
          const elapsed = (now - start) / 1000;
          const features: GeoJSON.Feature<GeoJSON.LineString>[] = [];
          ARC_PATHS.forEach((path, i) => {
            const cycle = (elapsed / COMET_PERIOD + phases[i]) % 1;
            if (cycle > 1 - COMET_GAP) return; // brief off-beat, then re-fire
            const head = cycle / (1 - COMET_GAP); // 0..1 head progress
            const n = path.coords.length - 1;
            const hi = Math.round(head * n);
            const ti = Math.max(0, Math.floor((head - COMET_TAIL) * n));
            if (hi - ti < 1) return;
            features.push(lineFeature(path.coords.slice(ti, hi + 1), path.id));
          });
          src.setData(fc(features));
        }
      } catch {
        // map/source torn down mid-frame during a remount — ignore
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
      removeAll();
    };
  }, [map, isLoaded]);

  return null;
}

export function HaramainGlobeImpl() {
  return (
    <Map
      styles={{ light: GLOBE_STYLE, dark: GLOBE_STYLE }}
      projection={{ type: "globe" }}
      // Stationary, centred on the Haramain so the convergence is always front.
      viewport={{ center: [40.5, 23], zoom: 1.65 }}
      interactive={false}
      attributionControl={false}
      className="[&_.maplibregl-ctrl-attrib]:hidden"
    >
      <GlobeSky />
      <GlobeArcs />
    </Map>
  );
}
