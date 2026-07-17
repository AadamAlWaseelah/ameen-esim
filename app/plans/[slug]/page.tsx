import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import {
  AlertTriangle,
  Check,
  MessageCircleWarning,
  Smartphone,
} from "lucide-react";

import { formatDataAmount, formatMoney } from "@/lib/money";
import { getPlanBySlug, resolvePlanProvider } from "@/lib/plans/store";

import { BuyButton } from "./buy-button";

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
  searchParams,
}: {
  params: { slug: string };
  searchParams: { cancelled?: string };
}) {
  const plan = await getPlanBySlug(params.slug);
  if (!plan || !plan.active) notFound();

  const mapped = resolvePlanProvider(plan) != null;
  const priceKnown = plan.retailPricePence != null;
  const cancelled = searchParams?.cancelled === "1";

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
            <Stat
              label="Validity"
              value={`${plan.validityDays} ${plan.validityDays === 1 ? "day" : "days"}`}
            />
            <NetworkStat network={plan.network} />
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
            One-off price in GBP. No subscription, no auto-renewal.
          </p>

          {!mapped ? (
            <div className="mt-5 rounded-xl border border-gold/30 bg-gold/10 p-4 text-sm text-navy">
              This plan is nearly ready. Check back soon, or ask us and
              we&apos;ll let you know when it goes live.
            </div>
          ) : null}

          {cancelled ? (
            <div className="mt-5 rounded-xl border border-gold/30 bg-gold/10 p-4 text-sm text-navy">
              Checkout was cancelled and you have not been charged. You can try
              again whenever you&apos;re ready.
            </div>
          ) : null}

          <BuyButton
            slug={plan.slug}
            disabled={!priceKnown || !mapped}
            label={priceKnown ? "Buy eSIM" : "Price pending"}
          />

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
            {/* Calling-app guidance is specific to Saudi networks, so it only
                shows on plans that cover Saudi Arabia. */}
            {["SA", "GCC", "Gulf"].includes(plan.country) ? (
              <>
                <TruthNote
                  icon={<MessageCircleWarning className="size-4" aria-hidden />}
                  title="WhatsApp calls"
                  body={
                    <>
                      Messages and voice notes work fine, but WhatsApp voice
                      and video calls are usually blocked on Saudi networks.
                      Apps like Botim and IMO do work for calls. See{" "}
                      <Link
                        href="/coverage"
                        className="font-medium text-gold-deep underline-offset-4 hover:underline"
                      >
                        what actually works
                      </Link>
                      .
                    </>
                  }
                />
                <TruthNote
                  icon={<AlertTriangle className="size-4" aria-hidden />}
                  title="Network conditions"
                  body="Networks can be congested around the Haram at peak prayer times. Data speeds are network-dependent."
                />
              </>
            ) : (
              <TruthNote
                icon={<AlertTriangle className="size-4" aria-hidden />}
                title="Network conditions"
                body="Calling apps follow each country's own network rules, and data speeds depend on the local network. We can't guarantee a specific app or speed."
              />
            )}
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

/*
  Operator logos for the Network card. A plan matches when its `network`
  field mentions the operator name (case-insensitive). To support a new
  operator: drop the logo under public/brand/networks/ and add a row here —
  then set the plan's network in admin to e.g. "Zain · 4G/5G" and the logo
  shows automatically. Only ever name the operator we actually fulfil on.
*/
const NETWORK_LOGOS: {
  match: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  className: string;
}[] = [
  {
    match: "stc",
    src: "/brand/stc-logo.png",
    alt: "stc (Saudi Telecom Company)",
    width: 54,
    height: 27,
    className: "h-[22px] w-auto",
  },
  {
    match: "zain",
    src: "/brand/networks/zain-ksa.svg",
    alt: "Zain Saudi Arabia",
    width: 28,
    height: 28,
    className: "h-[26px] w-auto",
  },
  {
    match: "three",
    src: "/brand/networks/three-uk.png",
    alt: "Three UK",
    width: 48,
    height: 27,
    className: "h-[24px] w-auto",
  },
];

// Network stat with the operator's logo where we have one. Falls back to the
// plain text card for unnamed networks.
function NetworkStat({ network }: { network: string | null }) {
  const logo = network
    ? NETWORK_LOGOS.find((l) => network.toLowerCase().includes(l.match))
    : undefined;
  if (!logo) {
    // Plans without a mapped network name fall back to honest generic copy —
    // never a template placeholder in customer-facing UI.
    return <Stat label="Network" value={network ?? "Local networks"} />;
  }
  // e.g. "STC · 4G/5G" — the logo carries the name, keep the tech suffix.
  const suffix = network!.split("·")[1]?.trim();
  return (
    <div className="rounded-2xl border border-line bg-paper p-5">
      <p className="text-sm text-slate">Network</p>
      <div className="mt-1.5 flex items-center gap-2.5">
        <Image
          src={logo.src}
          alt={logo.alt}
          width={logo.width}
          height={logo.height}
          className={logo.className}
        />
        {suffix ? (
          <span className="font-medium text-navy">{suffix}</span>
        ) : null}
      </div>
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
