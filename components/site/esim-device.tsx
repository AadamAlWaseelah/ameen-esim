import { Check, Signal } from "lucide-react";

import { AmeenMark } from "@/components/site/ameen-mark";
import { cn } from "@/lib/utils";

/**
 * Decorative phone mockup showing the actual product: an eSIM activation card
 * with a scannable QR, network row and animated signal bars. Pure-CSS motion
 * (float + signal rise); frozen under prefers-reduced-motion. aria-hidden — it
 * illustrates, it doesn't inform.
 */
export function EsimDevice({
  qrDataUri,
  className,
}: {
  qrDataUri: string;
  className?: string;
}) {
  return (
    <div className={cn("relative mx-auto w-[260px] sm:w-[300px]", className)} aria-hidden>
      {/* Gold glow behind the device */}
      <div
        className="animate-glow-pulse absolute inset-0 -z-10 translate-y-6 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(201,169,97,0.45), transparent)",
        }}
      />

      <div className="animate-float-slow">
        {/* Phone frame */}
        <div className="rounded-[2.6rem] border border-white/10 bg-navy-700 p-2.5 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.65)] ring-1 ring-black/30">
          <div className="overflow-hidden rounded-[2.1rem] bg-cream">
            {/* Status bar */}
            <div className="flex items-center justify-between px-5 pt-4 text-[11px] font-medium text-navy/70">
              <span>9:41</span>
              <span className="flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-gold-deep" />
                eSIM
              </span>
            </div>

            {/* eSIM activation card */}
            <div className="px-5 pb-6 pt-5">
              <div className="flex items-center gap-2.5">
                <AmeenMark
                  className="h-4 w-auto shrink-0 text-navy"
                  starClassName="fill-gold-deep"
                />
                <p className="font-display text-lg text-navy">Ameen eSIM</p>
              </div>
              <p className="mt-0.5 text-xs text-slate">
                Saudi Arabia · Data only
              </p>

              <div className="mt-4 rounded-2xl border border-line bg-paper p-4 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrDataUri}
                  alt=""
                  className="mx-auto aspect-square w-full max-w-[150px] rounded-lg"
                />
                <p className="mt-3 text-center text-[11px] text-slate">
                  Scan to install
                </p>
              </div>

              {/* Connected row with animated signal bars */}
              <div className="mt-4 flex items-center justify-between rounded-xl border border-gold/30 bg-gold/10 px-3.5 py-2.5">
                <span className="flex items-center gap-2 text-sm font-medium text-navy">
                  <Check className="size-4 text-gold-deep" />
                  Connected
                </span>
                <span className="flex items-end gap-0.5" aria-hidden>
                  {[0, 1, 2, 3].map((i) => (
                    <span
                      key={i}
                      className="w-1 origin-bottom rounded-sm bg-gold-deep"
                      style={{
                        height: `${6 + i * 4}px`,
                        animation: "signal-rise 1.6s ease-out infinite alternate",
                        animationDelay: `${i * 180}ms`,
                      }}
                    />
                  ))}
                  <Signal className="ml-1 hidden size-4 text-gold-deep" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
