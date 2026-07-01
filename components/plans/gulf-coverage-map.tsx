"use client";

import dynamic from "next/dynamic";

import { cn } from "@/lib/utils";

function MapSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-2xl bg-gradient-to-b from-cream to-paper ring-1 ring-line",
        className
      )}
    />
  );
}

// MapLibre is heavy and browser-only, so it loads lazily on the client.
const GulfCoverageMapImpl = dynamic(
  () => import("./gulf-coverage-map-impl").then((m) => m.GulfCoverageMapImpl),
  { ssr: false, loading: () => <MapSkeleton className="h-[340px] lg:h-[460px]" /> }
);

export function GulfCoverageMap({ className }: { className?: string }) {
  return <GulfCoverageMapImpl className={className} />;
}
