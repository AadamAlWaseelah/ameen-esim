import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/reveal";
import { SITE } from "@/lib/site-config";

export const metadata = {
  title: "About",
  description: `Who's behind ${SITE.brand} and why we built it.`,
};

const HONEST_POINTS = [
  "Data-only eSIMs, and we say plainly there's no phone number",
  "Speeds and coverage depend on the local network, and we won't pretend otherwise",
  "We flag when calling apps may be restricted on Saudi networks",
  "We ask you to check your phone is compatible before you buy",
];

const COMPANY_FACTS = [
  { label: "Trading name", value: SITE.brand },
  { label: "Legal name", value: SITE.legalName },
  { label: "Company no.", value: SITE.companyNumber },
  { label: "Registered in", value: SITE.country },
];

export default function AboutPage() {
  return (
    <>
      {/* Header — generous type, no panel chrome. */}
      <section className="container pt-14 sm:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="animate-fade-up text-balance text-4xl leading-[1.05] tracking-[-0.025em] text-navy sm:text-6xl">
            Connectivity, from people who take{" "}
            <span className="text-gold-deep">pilgrims</span> seriously.
          </h1>
          <p
            className="animate-fade-up mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-slate"
            style={{ animationDelay: "80ms" }}
          >
            {SITE.brand} sells simple, honest Saudi data eSIMs for Umrah and
            Hajj, built by the family behind Al-Waseelah&apos;s travel services
            for pilgrims.
          </p>
        </div>
      </section>

      {/* Why we exist — story beside a real photo of the destination. */}
      <section className="container py-16 sm:py-24">
        <Reveal className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative order-last aspect-[4/3] overflow-hidden rounded-[1.5rem] lg:order-first">
            <Image
              src="/gallery/makkah.jpg"
              alt="Al-Masjid al-Haram and the Kaaba in Makkah"
              fill
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-navy/40 via-transparent to-transparent"
            />
            <p className="absolute bottom-4 left-4 rounded-full border border-cream/20 bg-navy/60 px-3.5 py-1.5 text-sm text-cream backdrop-blur-sm">
              Makkah, where your data should just work
            </p>
          </div>
          <div>
            <h2 className="text-balance text-3xl tracking-[-0.02em] text-navy sm:text-4xl">
              Why we exist
            </h2>
            <p className="mt-5 text-pretty leading-relaxed text-slate">
              Getting online when you land for Umrah or Hajj should be the last
              thing you worry about. Roaming is expensive, local SIMs mean
              queues and paperwork, and many eSIM sites bury you in confusing
              options.
            </p>
            <p className="mt-4 text-pretty leading-relaxed text-slate">
              We built {SITE.brand} to make it straightforward: pick a plan,
              pay, and get your eSIM by email in minutes, ready to scan before
              you fly.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Honest by default — navy band, checklist, same discipline as home. */}
      <section className="relative isolate overflow-hidden bg-navy py-16 text-cream sm:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-[10%] top-[-30%] -z-10 h-[420px] w-[560px] rounded-full opacity-50 blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, rgba(201,169,97,0.25), transparent)",
          }}
        />
        <Reveal className="container grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <h2 className="text-balance text-3xl tracking-[-0.02em] text-cream sm:text-4xl">
              Honest by default
            </h2>
            <p className="mt-5 max-w-md text-pretty leading-relaxed text-cream/75">
              No inflated claims, no hidden extras, no fake urgency. We tell you
              what each plan does, and what it doesn&apos;t, before you pay.
            </p>
          </div>
          <ul className="space-y-4">
            {HONEST_POINTS.map((point, i) => (
              <Reveal as="li" key={point} delay={i * 70}>
                <span className="flex items-start gap-3.5">
                  <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold-pale ring-1 ring-gold/30">
                    <Check className="size-3.5" aria-hidden />
                  </span>
                  <span className="text-pretty leading-relaxed text-cream/90">
                    {point}
                  </span>
                </span>
              </Reveal>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* Who we are — company facts as hairline rows, not cards. */}
      <section className="container py-16 sm:py-24">
        <Reveal className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <h2 className="text-balance text-3xl tracking-[-0.02em] text-navy sm:text-4xl">
              Who we are
            </h2>
            <p className="mt-5 text-pretty leading-relaxed text-slate">
              {SITE.brand} is a trading name of {SITE.legalName}, a company
              registered in {SITE.country}. We&apos;re part of the same family
              that runs Al-Waseelah&apos;s travel services for pilgrims, so
              connectivity is a natural extension of helping people on their
              journey.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="gold">
                <Link href="/plans">
                  Browse plans
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/how-it-works">How it works</Link>
              </Button>
            </div>
          </div>
          <dl className="self-start rounded-[1.25rem] border border-line bg-paper px-6 py-2">
            {COMPANY_FACTS.map((fact) => (
              <div
                key={fact.label}
                className="flex items-baseline justify-between gap-6 border-b border-line py-4 last:border-b-0"
              >
                <dt className="text-sm text-slate">{fact.label}</dt>
                <dd className="text-right font-medium text-navy">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>
    </>
  );
}
