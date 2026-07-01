"use client";

import dynamic from "next/dynamic";

import type { GulfFamily } from "@/components/plans/gulf-coverage-map-impl";
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
  { ssr: false, loading: () => <MapSkeleton className="h-[320px] lg:h-[430px]" /> }
);

export function GulfCoverageMap({
  family,
  className,
}: {
  family: GulfFamily;
  className?: string;
}) {
  return <GulfCoverageMapImpl family={family} className={className} />;
}
