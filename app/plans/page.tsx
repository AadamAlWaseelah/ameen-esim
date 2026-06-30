import Link from "next/link";
import {
  CalendarDays,
  Clock,
  Globe,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/reveal";
import { PlansBrowser } from "@/components/plans/plans-browser";
import { listPublicPlans } from "@/lib/plans/store";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Saudi eSIM Plans",
  description:
    "Browse Saudi Arabia data eSIM plans for Umrah and Hajj travellers.",
};

const FAQS = [
  {
    q: "Will my phone work with an eSIM?",
    a: "Most phones from the last few years support eSIM, but some older or network-locked handsets don't. Look for “Add eSIM” in your phone settings before buying.",
  },
  {
    q: "Is there a phone number?",
    a: "No. Saudi eSIMs are data-only — ideal for maps, messaging and browsing. There's no local number for regular calls or SMS.",
  },
  {
    q: "When should I activate it?",
    a: "Install before you travel and activate when you land in Saudi Arabia, so the validity period starts on arrival rather than at home.",
  },
  {
    q: "Do calling apps like WhatsApp work?",
    a: "Sometimes. Voice and video calling can be restricted on Saudi networks. We won't promise it works — please verify for your own situation.",
  },
];

export default async function PlansPage() {
  const plans = await listPublicPlans();
  const selectorPlans = plans.map((plan) => ({
    id: plan.id,
    slug: plan.slug,
    title: plan.title,
    subtitle: plan.subtitle,
    country: plan.country,
    dataAmountMb: plan.dataAmountMb,
    validityDays: plan.validityDays,
    retailPricePence: plan.retailPricePence,
    badge: plan.badge,
  }));

  const saudiPlans = selectorPlans.filter((p) => p.country === "SA");
  const gulfPlans = selectorPlans.filter(
    (p) => p.country === "GCC" || p.country === "Gulf",
  );

  return (
    <main className="container py-10 sm:py-16">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h1 className="text-balance text-4xl text-navy sm:text-5xl">
          Saudi &amp; Gulf data eSIM plans
        </h1>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-slate">
          One-off data eSIMs for your trip. Pick a Saudi Arabia plan, or a
          Gulf-wide plan that also covers neighbouring countries — all data-only,
          delivered in minutes, for any eSIM-compatible phone.
        </p>
      </Reveal>

      {selectorPlans.length ? (
        <div className="mt-12 space-y-8">
          {/* Saudi Arabia — set apart with a green wash so it reads as the
              primary, in-country option. */}
          <Reveal className="overflow-hidden rounded-3xl border border-[color:var(--saudi-line)] bg-gradient-to-b from-saudi-tint to-saudi-tint-2">
            <div className="relative p-6 sm:p-8">
              <SaudiSkyline />
              <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                  <Hexagon image="/brand/saudi-flag.svg" />
                  <div>
                    <h2 className="text-2xl text-navy sm:text-3xl">
                      Saudi Arabia
                    </h2>
                    <p className="mt-1 text-sm leading-relaxed text-slate">
                      Data eSIMs for use within Saudi Arabia.
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-2 self-start rounded-full border border-[color:var(--saudi-line)] bg-paper/70 px-3 py-1.5 text-xs font-medium text-saudi">
                  <Clock className="size-3.5" aria-hidden />
                  Delivered in minutes
                </span>
              </div>

              <div className="relative mt-6 border-t border-[color:var(--saudi-line)] pt-7">
                <PlansBrowser plans={saudiPlans} accent="green" layout="grid" />
              </div>
            </div>
          </Reveal>

          {/* Gulf-wide — one eSIM that also covers the neighbours. */}
          {gulfPlans.length ? (
            <Reveal className="overflow-hidden rounded-3xl border border-line bg-gradient-to-b from-cream to-paper">
              <div className="p-6 sm:p-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex items-start gap-4">
                    <Hexagon tone="gold">
                      <Globe className="size-6 text-gold-deep" aria-hidden />
                    </Hexagon>
                    <div className="max-w-md">
                      <h2 className="text-2xl text-navy sm:text-3xl">
                        Travelling across the Gulf?
                      </h2>
                      <p className="mt-1 text-sm leading-relaxed text-slate">
                        One eSIM covering Saudi Arabia plus five Gulf neighbours
                        — handy if you transit through the UAE, Qatar or beyond.
                      </p>
                    </div>
                  </div>
                  <dl className="flex flex-wrap gap-x-7 gap-y-4">
                    <Feature
                      icon={Globe}
                      title="6 countries"
                      sub="incl. Saudi Arabia"
                    />
                    <Feature
                      icon={CalendarDays}
                      title="Daily data"
                      sub="Fresh allowance"
                    />
                    <Feature
                      icon={ShieldCheck}
                      title="One-off plans"
                      sub="No auto-renewal"
                    />
                  </dl>
                </div>

                <div className="mt-6 border-t border-line pt-7">
                  <PlansBrowser
                    plans={gulfPlans}
                    accent="navy"
                    layout="row"
                    showGroupHeaders={false}
                  />
                </div>
              </div>
            </Reveal>
          ) : null}
        </div>
      ) : (
        <Reveal className="mx-auto mt-10 max-w-md rounded-2xl border border-line bg-paper p-10 text-center">
          <p className="font-medium text-navy">No plans available yet</p>
          <p className="mt-2 text-sm text-slate">
            Plans appear here once they&apos;re mapped to the active provider.
          </p>
        </Reveal>
      )}

      {/* Common questions — honest, no invented claims. */}
      <section className="mt-24">
        <Reveal className="max-w-2xl">
          <h2 className="text-3xl text-navy sm:text-4xl">Common questions</h2>
          <p className="mt-3 text-pretty leading-relaxed text-slate">
            The honest essentials before you buy a Saudi eSIM.
          </p>
        </Reveal>
        <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2">
          {FAQS.map((faq) => (
            <Reveal as="div" key={faq.q} className="bg-paper p-6">
              <h3 className="font-medium text-navy">{faq.q}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate">{faq.a}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Help CTA */}
      <Reveal className="mt-12 flex flex-col items-start justify-between gap-4 rounded-2xl border border-line bg-cream/60 p-6 sm:flex-row sm:items-center">
        <div>
          <p className="font-medium text-navy">Not sure which plan to pick?</p>
          <p className="text-sm text-slate">
            Tell us your trip length and we&apos;ll point you to the right size.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/contact">
            <MessageCircle className="size-4" aria-hidden />
            Ask a question
          </Link>
        </Button>
      </Reveal>
    </main>
  );
}

// Elongated (pointy-top) hexagon badge used as the section emblem. Pass an
// `image` to fill it edge-to-edge (e.g. the Saudi flag), otherwise it takes a
// tinted gradient with a centred icon child.
function Hexagon({
  tone,
  image,
  children,
}: {
  tone?: "green" | "gold";
  image?: string;
  children?: React.ReactNode;
}) {
  return (
    <span
      className="grid h-[68px] w-14 shrink-0 place-items-center"
      style={{
        clipPath:
          "polygon(50% 0%, 100% 26%, 100% 74%, 50% 100%, 0% 74%, 0% 26%)",
        filter: "drop-shadow(0 2px 4px rgba(25,32,46,0.18))",
        ...(image
          ? {
              backgroundImage: `url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : {
              background:
                tone === "gold"
                  ? "linear-gradient(160deg, var(--gold-pale) 0%, var(--gold) 100%)"
                  : "linear-gradient(160deg, var(--saudi) 0%, var(--saudi-deep) 100%)",
            }),
      }}
    >
      {children}
    </span>
  );
}

// Faint skyline wash in the top-right of the Saudi panel (decorative).
function SaudiSkyline() {
  return (
    <div
      className="pointer-events-none absolute right-0 top-0 hidden h-full w-1/2 opacity-[0.07] sm:block"
      style={{
        background:
          "radial-gradient(120% 120% at 100% 0%, var(--saudi) 0%, transparent 55%)",
      }}
      aria-hidden
    />
  );
}

// Single icon + label feature in the Gulf header strip.
function Feature({
  icon: Icon,
  title,
  sub,
}: {
  icon: LucideIcon;
  title: string;
  sub: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <Icon className="size-5 shrink-0 text-gold-deep" aria-hidden />
      <div>
        <dt className="text-sm font-semibold text-navy">{title}</dt>
        <dd className="text-xs text-slate">{sub}</dd>
      </div>
    </div>
  );
}
