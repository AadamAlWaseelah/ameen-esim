import Link from "next/link";

import { PageShell, Section, P, Ul } from "@/components/site/prose";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Coverage",
  description: "Where our Saudi eSIMs work, and what to expect from speeds and networks.",
};

export default function CoveragePage() {
  return (
    <PageShell
      title="Coverage in Saudi Arabia"
      intro="Our eSIMs connect to leading Saudi mobile networks across the country, including the key cities for Umrah and Hajj."
    >
      <Section heading="Where it works">
        <P>
          Coverage spans Saudi Arabia, including Makkah, Madinah, Jeddah and
          Riyadh, as well as major roads and the Haramain high-speed rail route.
          Your eSIM automatically connects to an available partner network when
          you arrive, so there&apos;s nothing to configure beyond switching the
          line on.
        </P>
      </Section>

      <Section heading="What to expect">
        <Ul>
          <li><strong>Data only.</strong> Great for maps, messaging, browsing and uploading photos. There is no phone number for regular calls or texts.</li>
          <li><strong>Network-dependent speeds.</strong> You&apos;ll typically get 4G/5G where available. Speeds depend on the network, location and how busy it is.</li>
          <li><strong>Calling apps may be limited.</strong> Voice and video calling on apps like WhatsApp can be restricted on Saudi networks. We can&apos;t guarantee they will work.</li>
        </Ul>
      </Section>

      <Section heading="Honest about limits">
        <P>
          We resell a third-party network, so we can&apos;t control coverage or
          speed in every spot, and we won&apos;t pretend to. If you ever can&apos;t get
          online, our support team will help you troubleshoot.
        </P>
      </Section>

      <div className="flex flex-wrap gap-3 pt-2">
        <Button asChild>
          <Link href="/plans">Browse plans</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/compatibility">Check my device</Link>
        </Button>
      </div>
    </PageShell>
  );
}
