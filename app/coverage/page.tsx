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
          <li><strong>Calling apps are restricted.</strong> WhatsApp voice and video calls are usually blocked on Saudi networks. The full picture is below.</li>
        </Ul>
      </Section>

      <Section heading="Calling home: what actually works">
        <P>
          Saudi Arabia restricts internet calling on most apps, and this
          catches many pilgrims out. Here is the honest picture, based on
          consistent traveller reports:
        </P>
        <Ul>
          <li><strong>WhatsApp messages, photos and voice notes work fine.</strong> Only voice and video <em>calls</em> are blocked. Many pilgrims simply agree with family to use voice notes.</li>
          <li><strong>Botim and IMO calls work.</strong> These calling apps are permitted on Saudi networks, and travellers consistently report reliable voice and video calls on both. Install one before you fly and have your family do the same.</li>
          <li><strong>Google Meet and Zoom generally work</strong> for scheduled video calls.</li>
          <li><strong>Telegram and FaceTime calls are also restricted</strong>, so don&apos;t plan around them.</li>
        </Ul>
        <P>
          Two things worth knowing. First, WhatsApp calls have occasionally
          started working in Saudi Arabia (most recently in early 2026), but
          there has been no official change, access comes and goes by network,
          and previous openings were reversed, so please don&apos;t rely on it.
          Second, many travellers report that WhatsApp calls connect over a
          VPN. VPN use is not in itself illegal in Saudi Arabia, but using one
          to get around network restrictions is a grey area, so that choice
          and its consequences are yours. If you intend to try, set the VPN up
          before you travel.
        </P>
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
