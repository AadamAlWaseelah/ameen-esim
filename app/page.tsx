import Image from "next/image";
import Link from "next/link";
import QRCode from "qrcode";
import { ArrowRight, Check, MailCheck, Smartphone, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/reveal";
import { TrustCarousel } from "@/components/site/trust-carousel";
import { HeroVisual } from "@/components/site/hero-visual";
import { HaramainGlobe } from "@/components/site/haramain-globe";
import { HaramainGalleryImage } from "@/components/site/haramain-gallery-image";
import { DestinationsMarquee } from "@/components/site/destinations-marquee";
import { HowItWorks } from "@/components/site/how-it-works";
import { PlanCard } from "@/components/plans/plan-card";
import { listPublicPlans } from "@/lib/plans/store";

export const dynamic = "force-dynamic";

const HONEST_FACTS = [
  "Data only, so there's no phone number",
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
    body: "One clear price in GBP. No account, no subscription.",
  },
];

const FEATURE_TONE: Record<"gold" | "green", string> = {
  gold: "text-gold",
  green: "text-[#69e6ab]",
};

function isFeatured(badge: string | null) {
  return Boolean(badge && badge.toLowerCase().includes("popular"));
}

export default async function Home() {
  const plans = await listPublicPlans();
  // Mirror the plans page's "Most popular": badged plans lead, cheapest
  // first, topped up with other plans if fewer than three carry a badge.
  const badged = plans
    .filter((p) => p.badge != null)
    .sort(
      (a, b) =>
        (a.retailPricePence ?? Infinity) - (b.retailPricePence ?? Infinity)
    );
  const featuredPlans = [
    ...badged,
    ...plans.filter((p) => p.badge == null),
  ].slice(0, 3);

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ameen-esim.co.uk";
  const heroQr = await QRCode.toDataURL(siteUrl, {
    errorCorrectionLevel: "M",
    margin: 0,
    width: 320,
    color: { dark: "#19202e", light: "#ffffff" },
  });

  return (
    <>
      {/* Hero — full-bleed navy with a fine tech grid, drifting gold aurora
          and a travelling glint along the base line. */}
      <section className="relative isolate overflow-hidden bg-navy text-cream">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          {/* Khatam star lattice (brand pattern, gold on black) — screen-blended
              so only the gold lines show over the navy, fading at the edges. */}
          <div
            className="absolute inset-0 opacity-[0.05] mix-blend-screen"
            style={{
              backgroundImage: "url(/patterns/khatam-lattice.webp)",
              backgroundSize: "620px",
              backgroundPosition: "center",
              maskImage:
                "radial-gradient(ellipse 90% 85% at 50% 35%, black, transparent)",
              WebkitMaskImage:
                "radial-gradient(ellipse 90% 85% at 50% 35%, black, transparent)",
            }}
          />
          {/* Still gold/green washes — plain radial gradients (already soft, so
              no blur filter, which Safari composites badly when animated). */}
          <div
            className="absolute -left-[12%] top-[-25%] h-[520px] w-[640px] opacity-60"
            style={{
              background:
                "radial-gradient(closest-side, rgba(201,169,97,0.30), transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-[-30%] right-[-18%] h-[480px] w-[560px] opacity-45"
            style={{
              background:
                "radial-gradient(closest-side, rgba(52,178,123,0.17), transparent 70%)",
            }}
          />
          {/* Base line marking the navy → cream border: a solid gold hairline,
              a soft blurred glow that breathes above it, and a travelling
              glint riding along it. */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
          <div className="animate-glow-pulse absolute inset-x-0 bottom-0 h-[5px] bg-gradient-to-r from-transparent via-gold to-transparent blur-[3px]" />
          <div className="absolute inset-x-0 bottom-0 h-px overflow-hidden">
            <div className="animate-beam h-full w-1/3 bg-gradient-to-r from-transparent via-gold-pale to-transparent" />
          </div>
        </div>

        <div className="container grid items-center gap-14 py-16 sm:py-20 lg:grid-cols-[1.08fr_0.92fr] lg:py-24">
          <div className="text-center lg:text-left">
            <p className="animate-fade-up inline-flex items-center gap-2.5 rounded-full border border-cream/15 bg-cream/[0.06] px-3.5 py-1.5 text-sm text-cream/80">
              <span className="relative flex size-2" aria-hidden>
                <span className="animate-glow-pulse absolute -inset-1 rounded-full bg-gold/40 blur-[3px]" />
                <span className="relative inline-flex size-2 rounded-full bg-gold" />
              </span>
              By Al-Waseelah Tours · UK Umrah operator
            </p>

            <h1
              className="animate-fade-up mt-7 text-balance text-[2.75rem] leading-[1.04] tracking-[-0.03em] text-cream sm:text-6xl lg:text-7xl"
              style={{ animationDelay: "60ms" }}
            >
              Land in Saudi already{" "}
              <span className="text-gold-pale">connected</span>.
            </h1>

            <p
              className="animate-fade-up mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-cream/75 lg:mx-0"
              style={{ animationDelay: "120ms" }}
            >
              Saudi data eSIMs for Umrah &amp; Hajj, delivered to your inbox in
              minutes. Data only, no phone number, and we tell you exactly what
              you&apos;re buying.
            </p>

            <div
              className="animate-fade-up mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start"
              style={{ animationDelay: "180ms" }}
            >
              <Button asChild size="lg" variant="gold">
                <Link href="/plans">
                  Browse plans
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline-light">
                <Link href="/how-it-works">How it works</Link>
              </Button>
            </div>

            <ul
              className="animate-fade-up mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-cream/60 lg:justify-start"
              style={{ animationDelay: "240ms" }}
            >
              {["Delivered by email", "No account needed", "Pay in GBP"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-1.5">
                    <Check className="size-3.5 text-gold" aria-hidden />
                    {item}
                  </li>
                )
              )}
            </ul>
          </div>

          <div
            className="animate-fade-up flex justify-center lg:justify-end lg:pr-10"
            style={{ animationDelay: "200ms" }}
          >
            <HeroVisual qrDataUri={heroQr} />
          </div>
        </div>
      </section>

      {/* "Why Ameen" — a full-bleed cream chapter between the two navy bands,
          breaking up the blue. Kept plain so the icon tiles carry it. */}
      <section className="relative isolate overflow-hidden bg-cream">
        <Reveal className="container py-12 sm:py-16">
          <TrustCarousel />
        </Reveal>
      </section>

      {/* Global reach — full-bleed band: the world connecting to the Haramain. */}
      <section className="relative isolate overflow-hidden bg-navy text-cream">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="absolute right-[8%] top-1/2 h-[520px] w-[620px] max-w-[60%] -translate-y-1/2 opacity-50"
            style={{
              background:
                "radial-gradient(closest-side, rgba(201,169,97,0.22), transparent 70%)",
            }}
          />
          <div
            className="absolute -bottom-1/4 left-[2%] h-[420px] w-[520px] max-w-[55%] opacity-40"
            style={{
              background:
                "radial-gradient(closest-side, rgba(52,178,123,0.16), transparent 70%)",
            }}
          />
          {/* No lattice here — the pattern stays the hero's signature, and the
              globe + photography carry this section instead. */}
        </div>

        <Reveal className="container grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="text-center lg:text-left">
            <p className="inline-flex items-center gap-2.5 rounded-full border border-cream/15 bg-cream/[0.06] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-gold-pale backdrop-blur-sm">
              <span className="relative flex size-2" aria-hidden>
                <span className="animate-glow-pulse absolute -inset-1 rounded-full bg-[#34b27b]/40 blur-[3px]" />
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
              already online. The same eSIM, the same simple setup, and no
              roaming bills.
            </p>

            {/* Editorial rows with hairline rules — quieter than boxed
                icon-cards, and the copy carries the weight. */}
            <ul className="mx-auto mt-8 max-w-xl divide-y divide-cream/10 border-y border-cream/10 text-left lg:mx-0">
              {GLOBE_FEATURES.map((f) => (
                <li key={f.title} className="flex items-start gap-4 py-4">
                  <f.icon
                    className={`mt-0.5 size-5 shrink-0 ${FEATURE_TONE[f.tone]}`}
                    aria-hidden
                  />
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

      {/* Connectivity around the world — we go beyond Saudi Arabia. Marquee
          cards link to their plans and carry country flags. */}
      <section className="bg-cream py-16 sm:py-20">
        <div className="container">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl text-navy sm:text-4xl">
              Connectivity around the world
            </h2>
            <p className="mt-3 text-pretty leading-relaxed text-slate">
              Saudi Arabia is where we started, not where we stop. From London
              to Sylhet, pick a country and land connected, with the same
              instant email delivery.
            </p>
          </Reveal>
        </div>
        <Reveal className="container mt-10 sm:mt-12">
          <DestinationsMarquee />
        </Reveal>
        <Reveal className="container mt-9 text-center">
          <Button asChild size="lg" variant="blue">
            <Link href="/plans#international">
              Browse international eSIMs
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        </Reveal>
      </section>

      {/* How it works — light two-column with a scroll-fill timeline. */}
      <HowItWorks qrDataUri={heroQr} />

      {/* Popular plans teaser — pulls real catalogue data. */}
      {featuredPlans.length ? (
        <section className="container pb-4">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <h2 className="text-3xl text-navy sm:text-4xl">Popular plans</h2>
              <p className="mt-3 text-pretty leading-relaxed text-slate">
                The sizes most pilgrims pick for a typical Umrah trip. Data,
                validity and limits are stated plainly on every plan.
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

      {/* Sorted before you fly — real flight photo with the honesty checklist.
          Merges the old "Honest by default" panel and final CTA into one close. */}
      <section className="container pb-10 pt-20 sm:pb-14 sm:pt-28">
        <Reveal className="relative isolate overflow-hidden rounded-[2rem] bg-navy text-cream">
          <Image
            src="/gallery/flight-wing.jpg"
            alt=""
            aria-hidden
            fill
            sizes="(min-width: 1200px) 1160px, 100vw"
            className="object-cover object-[75%_center]"
          />
          {/* Navy scrim — heavy where the copy sits, open to the golden sky.
              Below lg the copy spans full width, so keep the right side darker. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-navy/65 lg:to-navy/25"
          />
          {/* Extra darkening below lg only — copy spans the sun's glare there. */}
          <div aria-hidden className="absolute inset-0 bg-navy/30 lg:hidden" />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent"
          />

          <div className="relative grid gap-12 px-6 py-14 sm:px-12 sm:py-20 lg:grid-cols-[1fr_0.8fr] lg:py-24">
            <div className="max-w-xl">
              <h2 className="text-balance text-3xl leading-[1.06] tracking-[-0.02em] text-cream sm:text-5xl">
                Sorted before you fly.{" "}
                <span className="text-gold-pale">Honest by default.</span>
              </h2>
              <p className="mt-5 text-pretty text-lg leading-relaxed text-cream/80">
                Choose a plan, get your QR by email, and land in Saudi Arabia
                already connected. One clear price, no roaming shocks.
              </p>
              <p className="mt-4 text-pretty leading-relaxed text-cream/70">
                And because we inherit Al-Waseelah&apos;s honesty discipline,
                we tell you the truth about a Saudi eSIM before you buy:
              </p>

              <ul className="mt-7 space-y-3.5">
                {HONEST_FACTS.map((fact) => (
                  <li key={fact} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold-pale ring-1 ring-gold/30">
                      <Check className="size-3.5" aria-hidden />
                    </span>
                    <span className="text-pretty leading-snug text-cream/90">
                      {fact}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" variant="gold">
                  <Link href="/plans">
                    Browse plans
                    <ArrowRight aria-hidden />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline-light">
                  <Link href="/compatibility">Check my device</Link>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
