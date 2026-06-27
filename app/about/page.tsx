import Link from "next/link";

import { PageShell, Section, P } from "@/components/site/prose";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site-config";

export const metadata = {
  title: "About",
  description: `Who's behind ${SITE.brand} and why we built it.`,
};

export default function AboutPage() {
  return (
    <PageShell
      title="About Ameen eSIM"
      intro="Simple, honest data eSIMs for pilgrims travelling to Saudi Arabia for Umrah and Hajj."
    >
      <Section heading="Why we exist">
        <P>
          Getting online when you land for Umrah or Hajj should be the last thing
          you worry about. Roaming is expensive, local SIMs mean queues and
          paperwork, and many eSIM sites bury you in confusing options. We built{" "}
          {SITE.brand} to make it straightforward: pick a plan, pay, and get your
          eSIM by email in minutes &mdash; ready to scan before you fly.
        </P>
      </Section>

      <Section heading="Honest by default">
        <P>
          We sell data-only eSIMs, so there&apos;s no phone number, and speeds and
          coverage depend on the local network &mdash; we won&apos;t pretend
          otherwise. We tell you plainly what each plan does, flag when calling
          apps may be restricted, and ask you to check your phone is compatible
          before you buy. No inflated claims, no hidden extras.
        </P>
      </Section>

      <Section heading="Who we are">
        <P>
          {SITE.brand} is a trading name of {SITE.legalName}, a company
          registered in {SITE.country} (company no. {SITE.companyNumber}). We&apos;re
          part of the same family that runs Al-Waseelah&apos;s travel services for
          pilgrims, so connectivity is a natural extension of helping people on
          their journey.
        </P>
      </Section>

      <div className="flex flex-wrap gap-3 pt-2">
        <Button asChild>
          <Link href="/plans">Browse plans</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/how-it-works">How it works</Link>
        </Button>
      </div>
    </PageShell>
  );
}
