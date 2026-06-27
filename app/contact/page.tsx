import Link from "next/link";

import { PageShell, Section, P } from "@/components/site/prose";
import { SITE } from "@/lib/site-config";

export const metadata = {
  title: "Contact",
  description: `Get in touch with the ${SITE.brand} team.`,
};

export default function ContactPage() {
  return (
    <PageShell
      title="Contact us"
      intro="Got a question before you buy, or need a hand with an eSIM you've ordered? We're happy to help."
    >
      <Section heading="Email us">
        <P>
          The fastest way to reach us is by email at{" "}
          <a className="text-gold-deep underline-offset-4 hover:underline" href={`mailto:${SITE.supportEmail}`}>
            {SITE.supportEmail}
          </a>
          . We aim to reply within one business day. If your question is about an
          existing order, please include your order number so we can find it
          quickly.
        </P>
      </Section>

      <Section heading="Already ordered?">
        <P>
          Lost your QR code or need it re-sent? See{" "}
          <Link className="text-gold-deep underline-offset-4 hover:underline" href="/orders">
            Find my eSIM
          </Link>
          . For common questions, our{" "}
          <Link className="text-gold-deep underline-offset-4 hover:underline" href="/faq">
            FAQ
          </Link>{" "}
          covers compatibility, activation and more.
        </P>
      </Section>

      <Section heading="Company details">
        <P>
          {SITE.brand} is a trading name of {SITE.legalName}, registered in{" "}
          {SITE.country} (company no. {SITE.companyNumber}). Registered office:{" "}
          {SITE.address}.
        </P>
      </Section>
    </PageShell>
  );
}
