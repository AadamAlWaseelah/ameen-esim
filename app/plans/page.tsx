import Link from "next/link";
import { MessageCircle } from "lucide-react";

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
        <Reveal className="mt-12 grid gap-x-10 gap-y-12 lg:grid-cols-[1.4fr,1fr]">
          <div>
            <h2 className="text-2xl text-navy">Saudi Arabia</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-slate">
              Data eSIMs for use within Saudi Arabia.
            </p>
            <div className="mt-6">
              <PlansBrowser plans={saudiPlans} />
            </div>
          </div>

          {gulfPlans.length ? (
            <aside className="lg:border-l lg:border-line lg:pl-10">
              <h2 className="text-2xl text-navy">Travelling across the Gulf?</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-slate">
                One eSIM covering Saudi Arabia plus five Gulf neighbours — handy
                if you transit through the UAE, Qatar or beyond.
              </p>
              <div className="mt-6">
                <PlansBrowser plans={gulfPlans} />
              </div>
            </aside>
          ) : null}
        </Reveal>
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
