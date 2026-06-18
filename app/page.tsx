import Link from "next/link";
import { Wifi, MailCheck, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

const STEPS = [
  {
    icon: Wifi,
    title: "Pick your plan",
    body: "Choose a Saudi data plan that matches your trip — by data and by days.",
  },
  {
    icon: MailCheck,
    title: "Get it by email",
    body: "Your eSIM QR code arrives instantly. No SIM swap, no posting, no waiting.",
  },
  {
    icon: ShieldCheck,
    title: "Activate on arrival",
    body: "Scan the QR in Saudi Arabia and you're online. Honest data, clearly stated.",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container py-20 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <p
              className="animate-fade-up text-sm font-medium uppercase tracking-[0.18em] text-gold-deep"
              style={{ animationDelay: "0ms" }}
            >
              By Al-Waseelah Tours
            </p>
            <h1
              className="animate-fade-up mt-5 text-balance text-4xl leading-[1.05] text-navy sm:text-5xl md:text-6xl"
              style={{ animationDelay: "60ms" }}
            >
              Stay connected for your Umrah &amp; Hajj.
            </h1>
            <p
              className="animate-fade-up mx-auto mt-6 max-w-xl text-balance text-lg leading-relaxed text-slate"
              style={{ animationDelay: "120ms" }}
            >
              Saudi data eSIMs for pilgrims — delivered to your inbox in minutes.
              Data-only, no phone number, and we tell you exactly what you&apos;re
              buying.
            </p>
            <div
              className="animate-fade-up mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
              style={{ animationDelay: "180ms" }}
            >
              <Button asChild size="lg">
                <Link href="/plans">Browse plans</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/how-it-works">How it works</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How it works teaser */}
      <section className="container pb-8">
        <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className="animate-fade-up bg-paper p-7"
              style={{ animationDelay: `${240 + i * 50}ms` }}
            >
              <span className="inline-flex size-11 items-center justify-center rounded-md bg-cream text-gold-deep">
                <step.icon className="size-5" aria-hidden />
              </span>
              <h3 className="mt-4 text-lg text-navy">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Honesty strip */}
      <section className="container py-16">
        <div className="rounded-lg border border-line bg-paper p-8 sm:p-10">
          <h2 className="text-2xl text-navy">Honest by default</h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-slate">
            Saudi eSIMs are data-only — there&apos;s no phone number, and calling
            apps can be restricted on local networks. Around the Haram at peak
            prayer times, networks get congested. We&apos;ll always tell you the
            truth about coverage and &ldquo;unlimited&rdquo; data before you buy.
          </p>
          <p className="mt-6 text-sm text-slate">
            Building in phases — this is the Phase 0 scaffold.{" "}
            {/* TODO(ameen): remove once full home (Phase 4) ships */}
          </p>
        </div>
      </section>
    </>
  );
}
