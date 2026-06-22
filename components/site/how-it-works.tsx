"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MailCheck, QrCode, Rocket, Signal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EsimDevice } from "@/components/site/esim-device";
import { cn } from "@/lib/utils";

const STEPS: {
  icon: typeof Signal;
  tone: "gold" | "green";
  title: string;
  body: string;
}[] = [
  {
    icon: Signal,
    tone: "gold",
    title: "Pick your plan",
    body: "Choose a Saudi data plan that matches your trip — by data and by days.",
  },
  {
    icon: MailCheck,
    tone: "green",
    title: "Get it by email",
    body: "Your eSIM QR code arrives in minutes — no SIM card in the post, nothing to collect.",
  },
  {
    icon: QrCode,
    tone: "gold",
    title: "Activate on arrival",
    body: "Scan the QR in Saudi Arabia and you're online in moments. Keep your home SIM in for calls.",
  },
];

const TONE: Record<"gold" | "green", string> = {
  gold: "bg-gold/12 text-gold-deep ring-1 ring-gold/25",
  green: "bg-[#2f8f5b]/12 text-[#2f8f5b] ring-1 ring-[#2f8f5b]/25",
};

export function HowItWorks({ qrDataUri }: { qrDataUri: string }) {
  const listRef = useRef<HTMLOListElement>(null);
  const [progress, setProgress] = useState(0);

  // Scroll-linked progress: fills the timeline as the section moves up through
  // the viewport. Scroll-driven (not autoplay), so it's fine under reduced motion.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      const el = listRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const p = (vh * 0.55 - rect.top) / (rect.height || 1);
      setProgress(Math.min(1, Math.max(0, p)));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section className="bg-cream py-20 sm:py-28">
      <div className="container grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-16">
        {/* Left — heading, CTA, product mockup */}
        <div className="text-center lg:text-left">
          <p className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-gold-deep">
            <Rocket className="size-4" aria-hidden />
            Get connected
          </p>
          <h2 className="mt-5 text-balance text-4xl leading-[1.04] tracking-[-0.02em] text-navy sm:text-5xl">
            Online in three steps
          </h2>
          <p className="mx-auto mt-5 max-w-md text-pretty leading-relaxed text-slate lg:mx-0">
            Choose a plan, get your QR by email, and activate when you land — no
            shop, and no SIM card in the post.
          </p>
          <div className="mt-8 flex justify-center lg:justify-start">
            <Button asChild size="lg" variant="gold">
              <Link href="/plans">Browse plans</Link>
            </Button>
          </div>
          <div className="mt-12 flex justify-center lg:justify-start">
            <EsimDevice qrDataUri={qrDataUri} className="w-[220px] sm:w-[250px]" />
          </div>
        </div>

        {/* Right — vertical timeline with scroll-fill progress */}
        <ol ref={listRef} className="relative space-y-5">
          {/* Track + animated fill */}
          <div
            aria-hidden
            className="absolute left-[1.375rem] top-5 w-0.5 rounded-full bg-line"
            style={{ bottom: "1.25rem" }}
          />
          <div
            aria-hidden
            className="absolute left-[1.375rem] top-5 w-0.5 rounded-full bg-gradient-to-b from-gold to-gold-deep"
            style={{ height: `calc(${progress} * (100% - 2.5rem))` }}
          />

          {STEPS.map((step, i) => {
            const active = progress >= (i + 0.5) / STEPS.length;
            return (
              <li key={step.title} className="relative flex gap-5">
                <span
                  className={cn(
                    "relative z-10 mt-1 grid size-11 shrink-0 place-items-center rounded-full border bg-cream font-mono text-sm tabular-nums transition-colors duration-300",
                    active
                      ? "border-gold text-gold-deep"
                      : "border-line text-slate/70",
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div
                  className={cn(
                    "flex-1 rounded-2xl border bg-paper p-5 transition-all duration-300 ease-out-strong",
                    active
                      ? "border-gold/40 shadow-md"
                      : "border-line shadow-sm",
                  )}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className={cn(
                        "inline-flex size-11 shrink-0 items-center justify-center rounded-xl",
                        TONE[step.tone],
                      )}
                    >
                      <step.icon className="size-5" aria-hidden />
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-navy">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate">
                        {step.body}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
