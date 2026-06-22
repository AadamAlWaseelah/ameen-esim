import Link from "next/link";
import QRCode from "qrcode";
import {
  ArrowRight,
  Check,
  MailCheck,
  QrCode,
  Signal,
  Smartphone,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/reveal";
import { TrustBar } from "@/components/site/trust-bar";
import { EsimDevice } from "@/components/site/esim-device";
import { HaramainGlobe } from "@/components/site/haramain-globe";
import { HaramainGalleryImage } from "@/components/site/haramain-gallery-image";
import { DestinationsMarquee } from "@/components/site/destinations-marquee";
import { PlanCard } from "@/components/plans/plan-card";
import { listPublicPlans } from "@/lib/plans/store";

export const dynamic = "force-dynamic";

const STEPS = [
  {
    icon: Signal,
    title: "Pick your plan",
    body: "Choose a Saudi data plan that matches your trip — by data and by days.",
    benefits: [
      "Plans from light browsing to heavy use",
      "One clear price in GBP",
      "Throttling & coverage stated upfront",
    ],
  },
  {
    icon: MailCheck,
    title: "Get it by email",
    body: "Your eSIM QR code arrives in minutes — no SIM card in the post.",
    benefits: [
      "Install before you fly",
      "Nothing to collect or swap",
      "Resend any time from your order",
    ],
  },
  {
    icon: QrCode,
    title: "Activate on arrival",
    body: "Scan the QR in Saudi Arabia and you're online in moments.",
    benefits: [
      "Scan once, connected on arrival",
      "Works on 215+ eSIM-ready phones",
      "Keep your home SIM in for calls",
    ],
  },
];

const HONEST_FACTS = [
  "Data-only — there's no phone number",
  "“Unlimited” plans are throttled after a daily cap",
  "Calling apps can be limited on Saudi networks",
  "Networks congest near the Haram at peak prayer times",
];

const GLOBE_FEATURES = [
  {
    icon: MailCheck,
    tone: "gold" as const,
    title: "Instant QR by email",
    body: "Your eSIM lands in your inbox within minutes of paying.",
  },
  {
    icon: Smartphone,
    tone: "green" as const,
    title: "Works on 215+ devices",
    body: "Modern eSIM iPhones, Samsung Galaxy, Google Pixel and more.",
  },
  {
    icon: Wallet,
    tone: "gold" as const,
    title: "No roaming bills",
    body: "One clear price in GBP — no account, no subscription.",
  },
];

const FEATURE_TONE: Record<"gold" | "green", string> = {
  gold: "bg-gold/15 text-gold-pale ring-1 ring-gold/25",
  green: "bg-[#34b27b]/15 text-[#69e6ab] ring-1 ring-[#34b27b]/25",
};

function isFeatured(badge: string | null) {
  return Boolean(badge && badge.toLowerCase().includes("popular"));
}

export default async function Home() {
  const plans = await listPublicPlans();
  const featuredPlans = [...plans]
    .sort((a, b) => Number(isFeatured(b.badge)) - Number(isFeatured(a.badge)))
    .slice(0, 3);

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://ameenesim.com";
  const heroQr = await QRCode.toDataURL(siteUrl, {
    errorCorrectionLevel: "M",
    margin: 0,
    width: 320,
    color: { dark: "#19202e", light: "#ffffff" },
  });

  return (
    <>
      {/* Hero — navy panel with animated gold aurora + product mockup. */}
      <section className="container pt-6 sm:pt-10">
        <div className="relative isolate overflow-hidden rounded-[1.75rem] bg-navy px-6 py-16 text-cream sm:rounded-[2rem] sm:px-10 sm:py-20 lg:py-24">
          {/* Animated aurora glow + soft mihrab arches. */}
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div
              className="animate-aurora absolute -left-[10%] top-[-20%] h-[460px] w-[560px] rounded-full opacity-70 blur-3xl"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(201,169,97,0.35), transparent)",
              }}
            />
            <div
              className="animate-aurora-slow absolute right-[-15%] top-[10%] h-[420px] w-[520px] rounded-full opacity-50 blur-3xl"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(231,213,146,0.28), transparent)",
              }}
            />
            <div className="absolute bottom-[-34%] left-1/2 h-[150%] w-[120%] max-w-[1200px] -translate-x-1/2 rounded-t-[48%] border-t border-gold/10" />
            <div className="absolute bottom-[-34%] left-1/2 h-[128%] w-[94%] max-w-[1000px] -translate-x-1/2 rounded-t-[48%] border-t border-gold/10" />
          </div>

          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="text-center lg:text-left">
              <p className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-3.5 py-1.5 text-sm text-gold-pale">
                <span aria-hidden className="inline-block size-1.5 rotate-45 bg-gold" />
                By Al-Waseelah Tours · UK Umrah operator
              </p>

              <h1
                className="animate-fade-up mt-7 text-balance text-4xl leading-[1.03] tracking-[-0.02em] text-cream sm:text-5xl lg:text-6xl"
                style={{ animationDelay: "60ms" }}
              >
                Stay <span className="text-gold-pale">connected</span> for your
                Umrah &amp; Hajj.
              </h1>

              <p
                className="animate-fade-up mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-cream/75 lg:mx-0"
                style={{ animationDelay: "120ms" }}
              >
                Saudi data eSIMs for pilgrims — delivered to your inbox in
                minutes. Data-only, no phone number, and we tell you exactly what
                you&apos;re buying.
              </p>

              <div
                className="animate-fade-up mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start"
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

            <div
              className="animate-fade-up flex justify-center lg:justify-end"
              style={{ animationDelay: "200ms" }}
            >
              <EsimDevice qrDataUri={heroQr} />
            </div>
          </div>
        </div>
      </section>

      {/* Trust signals — honest credibility, Trust & Authority pattern. */}
      <section className="container pt-12 sm:pt-16">
        <Reveal>
          <TrustBar />
        </Reveal>
      </section>

      {/* Global reach — full-bleed tech band: the world connecting to the Haramain. */}
      <section className="relative isolate mt-16 overflow-hidden bg-navy text-cream sm:mt-20">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-navy via-[#0f1626] to-navy" />
          <div
            className="absolute right-[8%] top-1/2 h-[520px] w-[620px] max-w-[60%] -translate-y-1/2 rounded-full opacity-50 blur-3xl"
            style={{
              background:
                "radial-gradient(closest-side, rgba(201,169,97,0.22), transparent)",
            }}
          />
          <div
            className="absolute -bottom-1/4 left-[2%] h-[420px] w-[520px] max-w-[55%] rounded-full opacity-40 blur-3xl"
            style={{
              background:
                "radial-gradient(closest-side, rgba(52,178,123,0.16), transparent)",
            }}
          />
          {/* Faint tech grid, masked to fade at the edges. */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
              backgroundSize: "52px 52px",
              maskImage:
                "radial-gradient(ellipse at center, black, transparent 75%)",
              WebkitMaskImage:
                "radial-gradient(ellipse at center, black, transparent 75%)",
            }}
          />
          {/* Soft gradient transitions into the cream page (no hard edges). */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-cream to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-cream to-transparent" />
        </div>

        <Reveal className="container grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="text-center lg:text-left">
            <p className="inline-flex items-center gap-2.5 rounded-full border border-cream/15 bg-cream/[0.06] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-gold-pale backdrop-blur-sm">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34b27b]/70" />
                <span className="relative inline-flex size-2 rounded-full bg-[#34b27b]" />
              </span>
              Pilgrims from every corner
            </p>

            <h2 className="mt-6 text-balance text-4xl leading-[1.02] tracking-[-0.02em] text-cream sm:text-5xl lg:text-6xl">
              The whole world, connected to the{" "}
              <span className="text-gold-pale">Haramain</span>.
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-pretty leading-relaxed text-cream/70 lg:mx-0">
              Wherever your journey begins, you arrive in Makkah and Madinah
              already online — the same eSIM, the same simple setup, no roaming
              bills.
            </p>

            <ul className="mx-auto mt-8 grid max-w-xl gap-3 text-left lg:mx-0">
              {GLOBE_FEATURES.map((f) => (
                <li
                  key={f.title}
                  className="group flex items-start gap-4 rounded-2xl border border-cream/10 bg-cream/[0.04] p-4 transition-colors duration-200 ease-out-strong hover:border-gold/30 hover:bg-cream/[0.07]"
                >
                  <span
                    className={`inline-flex size-11 shrink-0 items-center justify-center rounded-xl ${FEATURE_TONE[f.tone]}`}
                  >
                    <f.icon className="size-5" aria-hidden />
                  </span>
                  <div>
                    <p className="font-semibold text-cream">{f.title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-cream/60">
                      {f.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
              <Button asChild size="lg" variant="gold">
                <Link href="/plans">Browse plans</Link>
              </Button>
              <Button asChild size="lg" variant="outline-light">
                <Link href="/compatibility">Check my device</Link>
              </Button>
            </div>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-[540px]">
            <HaramainGlobe />

            {/* Flanking holy-site photos — hover (or tap) reveals the name. */}
            <HaramainGalleryImage
              src="/gallery/madinah.jpg"
              alt="Al-Masjid an-Nabawi in Madinah at dusk"
              title="Masjid al-Nabawi"
              subtitle="Madinah"
              tiltClassName="-rotate-3"
              className="absolute left-0 top-1 z-20 h-32 w-24 sm:h-40 sm:w-28 lg:h-48 lg:w-36"
            />
            <HaramainGalleryImage
              src="/gallery/makkah.jpg"
              alt="Al-Masjid al-Haram and the Kaaba in Makkah"
              title="Masjid al-Haram"
              subtitle="Makkah"
              tiltClassName="rotate-3"
              className="absolute bottom-1 right-0 z-20 h-32 w-24 sm:h-40 sm:w-28 lg:h-48 lg:w-36"
            />
          </div>
        </Reveal>
      </section>

      {/* Departure cities — infinite marquee of where pilgrims set out from. */}
      <section className="bg-cream py-16 sm:py-20">
        <div className="container">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl text-navy sm:text-4xl">
              Wherever your journey begins
            </h2>
            <p className="mt-3 text-pretty leading-relaxed text-slate">
              Pilgrims set out from every corner of the world — Ameen keeps you
              connected the moment you land in Saudi Arabia.
            </p>
          </Reveal>
        </div>
        <Reveal className="container mt-10 sm:mt-12">
          <DestinationsMarquee />
        </Reveal>
      </section>

      {/* How it works — dark band, numbered connector + benefit cards. */}
      <section className="relative isolate mt-16 overflow-hidden bg-navy text-cream sm:mt-20">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-navy via-[#0f1626] to-navy" />
          <div
            className="absolute left-1/2 top-[18%] h-[420px] w-[640px] max-w-[80%] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
            style={{
              background:
                "radial-gradient(closest-side, rgba(201,169,97,0.18), transparent)",
            }}
          />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-cream to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-cream to-transparent" />
        </div>

        <div className="container py-20 sm:py-28">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-cream/15 bg-cream/[0.06] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-gold-pale">
              How it works
            </p>
            <h2 className="mt-5 text-balance text-3xl leading-[1.05] text-cream sm:text-4xl lg:text-5xl">
              Online in three steps
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-pretty leading-relaxed text-cream/70">
              No shop, no SIM card in the post. Buy before you fly and activate
              when you land.
            </p>
          </Reveal>

          {/* Numbered indicators on a connecting line (sm+). */}
          <div className="relative mx-auto mt-14 max-w-5xl">
            <div
              aria-hidden
              className="absolute left-[16.6%] right-[16.6%] top-5 hidden h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent sm:block"
            />
            <ol className="grid gap-6 sm:grid-cols-3 sm:gap-6 lg:gap-8">
              {STEPS.map((step, i) => (
                <Reveal as="li" key={step.title} delay={i * 90}>
                  <div className="flex flex-col items-center">
                    <span className="relative z-10 inline-flex size-10 items-center justify-center rounded-full border border-gold/40 bg-navy font-display text-lg text-gold-pale ring-4 ring-navy">
                      {i + 1}
                    </span>

                    <div className="group mt-6 h-full w-full rounded-2xl border border-cream/10 bg-cream/[0.04] p-6 text-left transition-all duration-300 ease-out-strong hover:-translate-y-1 hover:border-gold/30 hover:bg-cream/[0.07]">
                      <span className="inline-flex size-12 items-center justify-center rounded-xl bg-gold/15 text-gold-pale ring-1 ring-gold/25">
                        <step.icon className="size-5" aria-hidden />
                      </span>
                      <h3 className="mt-5 text-xl text-cream">{step.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-cream/65">
                        {step.body}
                      </p>
                      <ul className="mt-5 space-y-2.5 border-t border-cream/10 pt-5">
                        {step.benefits.map((b) => (
                          <li
                            key={b}
                            className="flex items-start gap-2.5 text-sm text-cream/75"
                          >
                            <span className="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-[#34b27b]/20 text-[#69e6ab]">
                              <Check className="size-2.5" aria-hidden />
                            </span>
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Popular plans teaser — pulls real catalogue data. */}
      {featuredPlans.length ? (
        <section className="container pb-4">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <h2 className="text-3xl text-navy sm:text-4xl">Popular plans</h2>
              <p className="mt-3 text-pretty leading-relaxed text-slate">
                A few Saudi data eSIMs to start with. Prices are clearly marked as
                pending until our supplier and margin are confirmed.
              </p>
            </div>
            <Link
              href="/plans"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gold-deep underline-offset-4 hover:underline"
            >
              View all plans
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Reveal>

          <div className="mt-10 grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredPlans.map((plan, index) => (
              <Reveal key={plan.id} delay={index * 60}>
                <PlanCard plan={plan} featured={isFeatured(plan.badge)} />
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      {/* Honest by default — editorial panel, gold hairline accent. */}
      <section className="container py-20 sm:py-24">
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
                  <span className="text-pretty leading-snug text-navy">{fact}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      {/* Final CTA */}
      <section className="container pb-24">
        <Reveal className="relative isolate overflow-hidden rounded-[1.75rem] bg-navy px-6 py-14 text-center text-cream sm:px-10 sm:py-16">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[280px] w-[520px] max-w-[120%] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-50 blur-3xl"
            style={{
              background:
                "radial-gradient(closest-side, rgba(201,169,97,0.30), transparent)",
            }}
          />
          <h2 className="text-balance text-3xl text-cream sm:text-4xl">
            Sorted before you fly.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-pretty leading-relaxed text-cream/75">
            Choose a plan, get your QR by email, and land in Saudi Arabia already
            connected.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" variant="gold">
              <Link href="/plans">Browse plans</Link>
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
