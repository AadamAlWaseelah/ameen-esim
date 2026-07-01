import Link from "next/link";

import { PageShell, Section, P, Ul } from "@/components/site/prose";
import { SITE } from "@/lib/site-config";

export const metadata = {
  title: "Refund Policy",
  description: "When eSIM purchases can and cannot be refunded, and how to make a claim.",
};

export default function RefundPolicyPage() {
  return (
    <PageShell
      title="Refund Policy"
      updated="27 June 2026"
      intro="eSIMs are digital goods delivered instantly, so refunds work differently to physical products. Here's exactly where you stand."
    >
      <Section heading="Immediate delivery and your cancellation rights">
        <P>
          An eSIM is digital content delivered to you straight after payment.
          Under the UK Consumer Contracts Regulations you normally have 14 days
          to cancel a purchase, but for digital content that right ends
          once delivery has begun, provided you agreed to immediate delivery.
        </P>
        <P>
          By completing checkout you ask us to deliver your eSIM immediately and
          you acknowledge that, once it has been delivered (the QR code and
          activation details emailed to you), you lose the 14-day right to
          cancel. In short: <strong>once an eSIM has been delivered, it is
          generally non-refundable.</strong>
        </P>
      </Section>

      <Section heading="When we will refund or replace">
        <P>
          We want you connected. If something is genuinely wrong on our side,
          we&apos;ll put it right with a replacement or a refund:
        </P>
        <Ul>
          <li>The eSIM is faulty or fails to install, and our support team cannot resolve it.</li>
          <li>The eSIM was never delivered (for example an email failure) and we cannot re-issue it.</li>
          <li>You were charged in error, or charged more than once for the same order.</li>
        </Ul>
      </Section>

      <Section heading="When we cannot refund">
        <Ul>
          <li>Your phone is not eSIM-compatible or is network-locked. Please use our <Link className="text-gold-deep underline-offset-4 hover:underline" href="/compatibility">compatibility checker</Link> before buying.</li>
          <li>Change of mind after the eSIM has been delivered.</li>
          <li>The eSIM has been installed, activated, or partly used.</li>
          <li>You did not activate the eSIM within its validity period.</li>
          <li>Coverage, speed or app restrictions that come from the local network and are outside our control (calling apps such as WhatsApp can be limited in Saudi Arabia).</li>
          <li>You bought the wrong plan by mistake after it was delivered.</li>
        </Ul>
      </Section>

      <Section heading="How to make a claim">
        <P>
          Email{" "}
          <a className="text-gold-deep underline-offset-4 hover:underline" href={`mailto:${SITE.supportEmail}`}>
            {SITE.supportEmail}
          </a>{" "}
          within 14 days of purchase with your order number and a description of
          the problem. We may ask you to try some troubleshooting steps first.
          Approved refunds are made to your original payment method, usually
          within 5&ndash;10 business days.
        </P>
      </Section>

      <Section heading="Your statutory rights">
        <P>
          Nothing in this policy affects your legal rights as a consumer,
          including the right to a remedy if digital content is not of
          satisfactory quality, fit for purpose, or as described. This policy is
          part of our{" "}
          <Link className="text-gold-deep underline-offset-4 hover:underline" href="/terms">
            Terms of Service
          </Link>
          .
        </P>
      </Section>
    </PageShell>
  );
}
