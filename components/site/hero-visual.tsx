import { MailCheck } from "lucide-react";

import { AmeenMark } from "@/components/site/ameen-mark";
import { EsimDevice } from "@/components/site/esim-device";

/**
 * Hero visual: the floating eSIM phone with the brand "A" mark rising behind
 * it and slow signal rings radiating out, plus a small delivery chip.
 * Everything here is decorative and mirrors the hero's motion language
 * (float, glow pulse, expanding rings). Frozen under prefers-reduced-motion.
 */
export function HeroVisual({ qrDataUri }: { qrDataUri: string }) {
  return (
    <div className="relative mx-auto w-[280px] sm:w-[320px]" aria-hidden>
      {/* Brand mark, large and luminous behind the device. */}
      <AmeenMark
        className="animate-glow-pulse absolute -right-20 -top-12 -z-10 w-[440px] max-w-none text-gold opacity-[0.17] sm:-right-32 sm:-top-16 sm:w-[540px]"
        starClassName="fill-gold-pale"
      />

      {/* Signal rings pulsing out from the connected phone. */}
      <div className="absolute inset-0 -z-10 grid place-items-center">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="animate-signal-ring absolute size-[340px] rounded-full border border-gold/30 sm:size-[420px]"
            style={{ animationDelay: `${i * 1.4}s` }}
          />
        ))}
      </div>

      <EsimDevice qrDataUri={qrDataUri} className="w-full" />

      {/* Delivery chip floating at the phone's edge. */}
      <div
        className="animate-float-slow absolute -left-16 bottom-20 hidden items-center gap-2 rounded-xl border border-cream/15 bg-navy-700/85 px-3.5 py-2.5 text-xs font-medium text-cream/90 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.6)] backdrop-blur-sm md:flex"
        style={{ animationDelay: "1.2s" }}
      >
        <MailCheck className="size-4 text-gold" aria-hidden />
        QR by email in minutes
      </div>
    </div>
  );
}
