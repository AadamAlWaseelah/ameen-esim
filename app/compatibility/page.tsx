import type { ReactNode } from "react";
import Link from "next/link";
import { Apple, Bot, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/reveal";
import { CompatibilityChecker } from "@/components/site/compatibility-checker";

export const metadata = {
  title: "Will my phone work? eSIM compatibility checker",
  description:
    "Check whether your phone or tablet supports eSIM before buying a Saudi data plan for Umrah or Hajj. Search 400+ compatible Apple, Samsung, Google and more.",
};

const IOS_STEPS = [
  "Open Settings and tap Mobile Service (or Cellular).",
  "Look for Add eSIM or Set Up Cellular.",
  "If you see it, your iPhone supports eSIM.",
];

const ANDROID_STEPS = [
  "Open Settings → Network & internet (or Connections).",
  "Tap SIMs, then look for Add eSIM / Download a SIM.",
  "If it appears, your phone supports eSIM.",
];

export default function CompatibilityPage() {
  return (
    <main className="container py-10 sm:py-16">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1.5 text-sm font-medium text-gold-deep">
          <span aria-hidden className="inline-block size-1.5 rotate-45 bg-gold" />
          Check before you buy
        </p>
        <h1 className="mt-5 text-balance text-4xl text-navy sm:text-5xl">
          Will my phone work?
        </h1>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-slate">
          A Saudi eSIM only works on an eSIM-capable, carrier-unlocked phone.
          Search your model below. It takes a second, and it saves you from
          buying a plan you can&apos;t use.
        </p>
      </Reveal>

      <Reveal delay={80} className="mx-auto mt-8 max-w-3xl">
        <CompatibilityChecker />
      </Reveal>

      {/* How to check in settings */}
      <Reveal delay={120} className="mx-auto mt-12 max-w-3xl">
        <h2 className="text-center text-2xl text-navy">
          Prefer to check it yourself?
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <SettingsCard
            icon={<Apple className="size-5" aria-hidden />}
            title="On iPhone"
            steps={IOS_STEPS}
          />
          <SettingsCard
            icon={<Bot className="size-5" aria-hidden />}
            title="On Android"
            steps={ANDROID_STEPS}
          />
        </div>
        <p className="mt-5 text-center text-sm text-slate">
          Tip: you can also dial{" "}
          <span className="font-medium text-navy">*#06#</span>. If an{" "}
          <span className="font-medium text-navy">EID</span> number appears, your
          phone has an eSIM.
        </p>
      </Reveal>

      {/* CTA */}
      <Reveal delay={160} className="mx-auto mt-14 max-w-3xl">
        <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-line bg-navy p-7 text-cream sm:flex-row sm:p-8">
          <div>
            <h2 className="text-2xl text-cream">Phone all set?</h2>
            <p className="mt-1 text-cream/70">
              Pick a Saudi data plan for your trip.
            </p>
          </div>
          <Button asChild size="lg" variant="gold" className="shrink-0">
            <Link href="/plans">
              Browse plans
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </Reveal>
    </main>
  );
}

function SettingsCard({
  icon,
  title,
  steps,
}: {
  icon: ReactNode;
  title: string;
  steps: string[];
}) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-6">
      <div className="flex items-center gap-3">
        <span className="inline-flex size-10 items-center justify-center rounded-xl bg-cream text-gold-deep">
          {icon}
        </span>
        <h3 className="text-lg text-navy">{title}</h3>
      </div>
      <ol className="mt-4 space-y-3">
        {steps.map((step, i) => (
          <li key={step} className="flex gap-3 text-sm leading-relaxed text-slate">
            <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-gold/15 text-xs font-semibold text-gold-deep">
              {i + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}
