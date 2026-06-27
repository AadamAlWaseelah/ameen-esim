import Link from "next/link";

import { PageShell, Section, P } from "@/components/site/prose";
import { SITE } from "@/lib/site-config";

export const metadata = {
  title: "Find my eSIM",
  description: "Lost your QR code? Here's how to get your eSIM details re-sent.",
};

export default function OrdersPage() {
  return (
    <PageShell
      title="Find my eSIM"
      intro="Lost the email with your QR code, or need your eSIM details again? We can help."
    >
      <Section heading="Re-send my eSIM">
        <P>
          Email us at{" "}
          <a className="text-gold-deep underline-offset-4 hover:underline" href={`mailto:${SITE.supportEmail}`}>
            {SITE.supportEmail}
          </a>{" "}
          from the address you used to order, and include your{" "}
          <strong>order number</strong> if you have it (it&apos;s on your
          confirmation page and email). We&apos;ll re-send your QR code and
          installation details.
        </P>
      </Section>

      <Section heading="Check your email first">
        <P>
          Your eSIM was sent right after purchase &mdash; it&apos;s worth checking
          your spam or promotions folder for a message from{" "}
          <strong>orders@alwaseelahtravel.co.uk</strong> before getting in touch.
        </P>
      </Section>

      <Section heading="Need something else?">
        <P>
          For compatibility, activation and other common questions, see our{" "}
          <Link className="text-gold-deep underline-offset-4 hover:underline" href="/faq">
            FAQ
          </Link>
          , or visit{" "}
          <Link className="text-gold-deep underline-offset-4 hover:underline" href="/contact">
            Contact
          </Link>
          .
        </P>
      </Section>
    </PageShell>
  );
}
