"use client";

import dynamic from "next/dynamic";

function GlobeSkeleton() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="size-[78%] max-h-[460px] max-w-[460px] animate-pulse rounded-full bg-gradient-to-b from-navy-700 to-navy ring-1 ring-gold/15" />
    </div>
  );
}

// MapLibre is heavy and browser-only — load it lazily, client-side only.
const HaramainGlobeImpl = dynamic(
  () => import("./haramain-globe-impl").then((m) => m.HaramainGlobeImpl),
  { ssr: false, loading: () => <GlobeSkeleton /> },
);

export function HaramainGlobe() {
  return <HaramainGlobeImpl />;
}
