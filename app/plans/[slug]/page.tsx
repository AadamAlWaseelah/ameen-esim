import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import {
  AlertTriangle,
  Check,
  MessageCircleWarning,
  Smartphone,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatDataAmount, formatMoney } from "@/lib/money";
import { getActiveProviderId } from "@/lib/esim";
import { getPlanBySlug, getPlanProviderRef } from "@/lib/plans/store";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const plan = await getPlanBySlug(params.slug);
  return {
    title: plan ? plan.title : "Plan not found",
  };
}

export default async function PlanDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const plan = await getPlanBySlug(params.slug);
  if (!plan || !plan.active) notFound();

  const providerId = getActiveProviderId();
  const providerRef = getPlanProviderRef(plan, providerId);
  const priceKnown = plan.retailPricePence != null;

  return (
    <main className="container py-10 sm:py-16">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <section>
          <Link
            href="/plans"
            className="text-sm font-medium text-gold-deep underline-offset-4 hover:underline"
          >
            Back to plans
          </Link>
          <h1 className="mt-5 text-balance text-4xl text-navy sm:text-5xl">
            {plan.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate">
            {plan.description}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Stat label="Data" value={formatDataAmount(plan.dataAmountMb)} />
            <Stat label="Validity" value={`${plan.validityDays} days`} />
            <Stat label="Network" value={plan.network ?? "{{NETWORK_TBD}}"} />
          </div>

          <section className="mt-10 rounded-2xl border border-line bg-paper p-6">
            <h2 className="text-2xl text-navy">What&apos;s included</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {plan.featureList.map((feature) => (
                <li key={feature} className="flex gap-3 text-navy">
                  <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-deep">
                    <Check className="size-3.5" aria-hidden />
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </section>
        </section>

        <aside className="rounded-2xl border border-line bg-paper p-6 shadow-sm lg:sticky lg:top-24">
          {plan.badge ? (
            <p className="mb-4 inline-flex rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-sm font-medium text-gold-deep">
              {plan.badge}
            </p>
          ) : null}
          <p className="text-sm text-slate">Price</p>
          <p className="tnum mt-1 text-4xl font-semibold text-navy">
            {formatMoney(plan.retailPricePence)}
          </p>
          <p className="mt-2 text-sm text-slate">
            GBP only. Final prices are pending supplier and margin confirmation.
          </p>

          {!providerRef ? (
            <div className="mt-5 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
              Missing provider mapping for {providerId}. This plan is not ready
              for checkout.
            </div>
          ) : null}

          <Button className="mt-6 w-full" size="lg" disabled={!priceKnown || !providerRef}>
            {priceKnown ? "Buy eSIM" : "Price pending"}
          </Button>

          <div className="mt-6 space-y-4 border-t border-line pt-6">
            <TruthNote
              icon={<Smartphone className="size-4" aria-hidden />}
              title="Check your phone first"
              body={
                <>
                  Older phones and some locked devices do not support eSIM.{" "}
                  <Link
                    href="/compatibility"
                    className="font-medium text-gold-deep underline-offset-4 hover:underline"
                  >
                    Check your device
                  </Link>{" "}
                  before buying.
                </>
              }
            />
            <TruthNote
              icon={<MessageCircleWarning className="size-4" aria-hidden />}
              title="WhatsApp calls"
              body="Voice and video calling apps can be restricted on Saudi networks. We will not promise they work."
            />
            <TruthNote
              icon={<AlertTriangle className="size-4" aria-hidden />}
              title="Network conditions"
              body="Networks can be congested around the Haram at peak prayer times. Data speeds are network-dependent."
            />
          </div>
        </aside>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-5">
      <p className="text-sm text-slate">{label}</p>
      <p className="mt-1 font-medium text-navy">{value}</p>
    </div>
  );
}

function TruthNote({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 text-gold-deep">{icon}</span>
      <div>
        <p className="font-medium text-navy">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-slate">{body}</p>
      </div>
    </div>
  );
}
