import Link from "next/link";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/reveal";

const STEPS = [
  {
    n: "1",
    title: "Pick your plan",
    body: "Choose a Saudi data plan that matches your trip — by data and by days.",
  },
  {
    n: "2",
    title: "Get it by email",
    body: "Your eSIM QR code arrives in minutes. No SIM swap, no posting, no waiting.",
  },
  {
    n: "3",
    title: "Activate on arrival",
    body: "Scan the QR in Saudi Arabia and you're online. Honest data, clearly stated.",
  },
];

const HONEST_FACTS = [
  "Data-only — there's no phone number",
  "“Unlimited” plans are throttled after a daily cap",
  "Calling apps can be limited on Saudi networks",
  "Networks congest near the Haram at peak prayer times",
];

export default function Home() {
  return (
    <>
      {/* Hero — a contained navy panel on the cream page. */}
      <section className="container pt-6 sm:pt-10">
        <div className="relative isolate overflow-hidden rounded-[1.75rem] bg-navy px-6 py-20 text-cream sm:rounded-[2rem] sm:px-10 sm:py-28">
          {/* Decorative framing: gold glow + soft mihrab arches. */}
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div
              className="absolute left-1/2 top-0 h-[420px] w-[680px] max-w-[120%] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-60 blur-3xl"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(201,169,97,0.30), transparent)",
              }}
            />
            <div className="absolute bottom-[-32%] left-1/2 h-[150%] w-[120%] max-w-[1200px] -translate-x-1/2 rounded-t-[48%] border-t border-gold/10" />
            <div className="absolute bottom-[-32%] left-1/2 h-[128%] w-[94%] max-w-[1000px] -translate-x-1/2 rounded-t-[48%] border-t border-gold/10" />
          </div>

          <div className="mx-auto max-w-3xl text-center">
            <p className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-3.5 py-1.5 text-sm text-gold-pale">
              <span
                aria-hidden
                className="inline-block size-1.5 rotate-45 bg-gold"
              />
              By Al-Waseelah Tours · UK Umrah operator
            </p>

            <h1
              className="animate-fade-up mt-7 text-balance text-4xl leading-[1.04] tracking-[-0.02em] text-cream sm:text-5xl md:text-6xl"
              style={{ animationDelay: "60ms" }}
            >
              Stay <span className="text-gold-pale">connected</span> for your
              Umrah &amp; Hajj.
            </h1>

            <p
              className="animate-fade-up mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-cream/75"
              style={{ animationDelay: "120ms" }}
            >
              Saudi data eSIMs for pilgrims — delivered to your inbox in minutes.
              Data-only, no phone number, and we tell you exactly what
              you&apos;re buying.
            </p>

            <div
              className="animate-fade-up mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
              style={{ animationDelay: "180ms" }}
            >
              <Button asChild size="lg" variant="gold">
                <Link href="/plans">Browse plans</Link>
              </Button>
              <Button asChild size="lg" variant="outline-light">
                <Link href="/how-it-works">How it works</Link>
              </Button>
            </div>

            <p
              className="animate-fade-up mt-7 text-sm text-cream/55"
              style={{ animationDelay: "240ms" }}
            >
              Delivered by email · No account needed · Pay in GBP
            </p>
          </div>
        </div>
      </section>

      {/* How it works — a real 3-step sequence, so numbering earns its place. */}
      <section className="container py-20 sm:py-28">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl text-navy sm:text-4xl">Online in three steps</h2>
          <p className="mt-3 text-pretty leading-relaxed text-slate">
            No shop, no SIM card in the post. Buy before you fly and activate
            when you land.
          </p>
        </Reveal>

        <div className="relative mx-auto mt-14 max-w-4xl">
          {/* Connector behind the step nodes (decorative, sm+ only). */}
          <div
            aria-hidden
            className="absolute left-0 right-0 top-7 hidden border-t border-dashed border-gold/40 sm:block"
          />
          <ol className="grid gap-12 sm:grid-cols-3 sm:gap-8">
            {STEPS.map((step, i) => (
              <Reveal as="li" key={step.n} delay={i * 90} className="text-center">
                <span className="relative z-10 mx-auto inline-flex size-14 items-center justify-center rounded-full border border-gold/40 bg-cream font-display text-2xl text-gold-deep">
                  {step.n}
                </span>
                <h3 className="mt-5 text-xl text-navy">{step.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-pretty text-sm leading-relaxed text-slate">
                  {step.body}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Honest by default — editorial panel, gold hairline accent. */}
      <section className="container pb-24">
        <Reveal className="overflow-hidden rounded-[1.75rem] border border-line bg-paper">
          <div className="h-1 w-full bg-gradient-to-r from-gold-pale via-gold to-gold-deep" />
          <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div>
              <h2 className="text-3xl text-navy sm:text-4xl">Honest by default</h2>
              <p className="mt-4 max-w-xl text-pretty leading-relaxed text-slate">
                We inherit Al-Waseelah&apos;s honesty discipline: no fake
                urgency, no invented coverage claims. We&apos;ll always tell you
                the truth about a Saudi eSIM before you buy.
              </p>
            </div>
            <ul className="space-y-3.5">
              {HONEST_FACTS.map((fact) => (
                <li key={fact} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-deep">
                    <Check className="size-3.5" aria-hidden />
                  </span>
                  <span className="text-pretty leading-snug text-navy">
                    {fact}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>
    </>
  );
}
