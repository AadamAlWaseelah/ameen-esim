import Link from "next/link";
import { MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/reveal";
import { PlanCard } from "@/components/plans/plan-card";
import { getActiveProviderId } from "@/lib/esim";
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

function isFeatured(badge: string | null) {
  return Boolean(badge && badge.toLowerCase().includes("popular"));
}

export default async function PlansPage() {
  const plans = await listPublicPlans();
  const providerId = getActiveProviderId();

  return (
    <main className="container py-10 sm:py-16">
      <Reveal className="max-w-3xl">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-sm font-medium text-gold-deep">
          <span aria-hidden className="inline-block size-1.5 rotate-45 bg-gold" />
          Active provider: {providerId}
        </p>
        <h1 className="text-balance text-4xl text-navy sm:text-5xl">
          Saudi data eSIM plans
        </h1>
        <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-slate">
          One-off data eSIMs for your trip. Placeholder prices are clearly marked
          until the wholesale provider and margin are confirmed — all plans are
          data-only and need an eSIM-compatible phone.
        </p>
      </Reveal>

      {plans.length ? (
        <div className="mt-12 grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <Reveal key={plan.id} delay={index * 50}>
              <PlanCard plan={plan} featured={isFeatured(plan.badge)} />
            </Reveal>
          ))}
        </div>
      ) : (
        <Reveal className="mt-12 rounded-2xl border border-line bg-paper p-10 text-center">
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
