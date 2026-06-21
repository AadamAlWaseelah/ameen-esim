"use client";

import { useEffect } from "react";
import type { StyleSpecification } from "maplibre-gl";

import { Map, MapArc, useMap, type MapArcDatum } from "@/components/ui/map";

// --- Geography -------------------------------------------------------------

const MAKKAH: [number, number] = [39.8262, 21.4225];
const MADINAH: [number, number] = [39.6142, 24.4686];

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

const ARCS: MapArcDatum[] = [
  ...ORIGINS.map((o) => ({
    id: o.name,
    from: o.coord,
    to: o.toMadinah ? MADINAH : MAKKAH,
  })),
  { id: "haramain", from: MAKKAH, to: MADINAH },
];

// Build an approximate geographic circle (radius in km) as a GeoJSON polygon.
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

function fc(
  features: GeoJSON.Feature[],
): GeoJSON.FeatureCollection {
  return { type: "FeatureCollection", features };
}

const HARAMAIN_GLOW = fc([
  circlePolygon(MAKKAH, 320),
  circlePolygon(MADINAH, 320),
]);
const HARAMAIN_CORE = fc([
  circlePolygon(MAKKAH, 130),
  circlePolygon(MADINAH, 130),
]);
const HARAMAIN_POINTS = fc([
  { type: "Feature", properties: {}, geometry: { type: "Point", coordinates: MAKKAH } },
  { type: "Feature", properties: {}, geometry: { type: "Point", coordinates: MADINAH } },
]);

// Brand-coloured globe: navy ocean, raised-navy land, faint gold borders, and a
// green-tinted Haramain region (the Prophet's green-dome colour) over Makkah &
// Madinah — no text labels; the flanking photos name the two sites.
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
    {
      id: "land",
      type: "fill",
      source: "countries",
      paint: { "fill-color": "#243149" },
    },
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

// --- Behaviour: atmosphere + slow auto-rotation ---------------------------

function GlobeBehaviour() {
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

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let raf = 0;
    let last = performance.now();

    const spin = (now: number) => {
      const dt = now - last;
      last = now;
      const c = map.getCenter();
      map.setCenter([c.lng + 0.06 * (dt / 16.67), c.lat]);
      raf = requestAnimationFrame(spin);
    };

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(spin);
      }
    };

    raf = requestAnimationFrame(spin);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [map, isLoaded]);

  return null;
}

export function HaramainGlobeImpl() {
  return (
    <Map
      styles={{ light: GLOBE_STYLE, dark: GLOBE_STYLE }}
      projection={{ type: "globe" }}
      viewport={{ center: [42, 20], zoom: 1.55 }}
      interactive={false}
      attributionControl={false}
      className="[&_.maplibregl-ctrl-attrib]:hidden"
    >
      <GlobeBehaviour />

      {/* Glow pass beneath the crisp arcs */}
      <MapArc
        id="arcs-glow"
        data={ARCS}
        curvature={0.32}
        samples={48}
        interactive={false}
        paint={{
          "line-color": "#e7d592",
          "line-width": 4,
          "line-opacity": 0.12,
          "line-blur": 3,
        }}
      />
      <MapArc
        id="arcs"
        data={ARCS}
        curvature={0.32}
        samples={48}
        interactive={false}
        paint={{
          "line-color": "#c9a961",
          "line-width": 1.2,
          "line-opacity": 0.7,
        }}
      />
    </Map>
  );
}
