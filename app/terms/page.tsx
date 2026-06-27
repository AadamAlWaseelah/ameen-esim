import Link from "next/link";

import { PageShell, Section, P, Ul } from "@/components/site/prose";
import { SITE } from "@/lib/site-config";

export const metadata = {
  title: "Terms of Service",
  description: `The terms governing your use of ${SITE.brand} and the eSIMs you buy from us.`,
};

export default function TermsPage() {
  return (
    <PageShell
      title="Terms of Service"
      updated="27 June 2026"
      intro={`These terms govern your purchase and use of eSIMs from ${SITE.brand}. Please read them before you buy.`}
    >
      <Section heading="1. Who we are">
        <P>
          {SITE.brand} is a trading name of {SITE.legalName}, a company
          registered in {SITE.country} (company no. {SITE.companyNumber}),
          registered office {SITE.address}. In these terms, &ldquo;we&rdquo;,
          &ldquo;us&rdquo; and &ldquo;our&rdquo; mean {SITE.legalName}. You can
          reach us at{" "}
          <a className="text-gold-deep underline-offset-4 hover:underline" href={`mailto:${SITE.supportEmail}`}>
            {SITE.supportEmail}
          </a>
          .
        </P>
      </Section>

      <Section heading="2. What we sell">
        <P>
          We resell third-party, data-only eSIMs for use in Saudi Arabia. An
          eSIM gives you mobile data only &mdash; there is no phone number, and
          it is not suitable for regular calls or SMS. Coverage, speeds and the
          underlying network are provided by our supplier and their network
          partners, not by us.
        </P>
      </Section>

      <Section heading="3. Your device">
        <P>
          eSIMs only work on eSIM-compatible, network-unlocked phones. It is
          your responsibility to check your device before buying &mdash; see our{" "}
          <Link className="text-gold-deep underline-offset-4 hover:underline" href="/compatibility">
            compatibility checker
          </Link>
          . We cannot refund an eSIM that does not work because your device is
          incompatible or locked.
        </P>
      </Section>

      <Section heading="4. Orders, prices and payment">
        <Ul>
          <li>All prices are in pounds sterling (GBP) and include any applicable taxes.</li>
          <li>Payment is taken securely at checkout via Stripe. We never see or store your full card details.</li>
          <li>Your order is an offer to buy. Our acceptance happens when we email you the eSIM, at which point a contract is formed.</li>
          <li>If we cannot fulfil an order (for example a pricing error or supplier issue), we will not charge you, or we will refund you in full.</li>
        </Ul>
      </Section>

      <Section heading="5. Delivery and activation">
        <P>
          We deliver your eSIM by email &mdash; a QR code plus manual
          installation details &mdash; usually within minutes of payment.
          Install the eSIM before you travel and activate it when you arrive in
          Saudi Arabia. Validity and any daily allowance begin according to the
          plan you bought (typically on first network connection). It is your
          responsibility to install and activate within the plan&apos;s validity
          window.
        </P>
      </Section>

      <Section heading="6. Acceptable use">
        <P>
          You agree to use the eSIM lawfully and in line with the rules of the
          local network and the laws of Saudi Arabia. eSIMs are for personal
          use and must not be resold, tampered with, or used for unlawful
          activity.
        </P>
      </Section>

      <Section heading="7. Service limitations">
        <P>
          Because we resell a third-party network, we cannot guarantee
          uninterrupted service, particular data speeds, or that voice and video
          calling apps (such as WhatsApp) will work &mdash; calling can be
          restricted on Saudi networks. We do not promise the service will be
          error-free or available at all times.
        </P>
      </Section>

      <Section heading="8. Refunds">
        <P>
          eSIMs are digital goods delivered immediately, which affects your
          cancellation rights. Please read our{" "}
          <Link className="text-gold-deep underline-offset-4 hover:underline" href="/refund-policy">
            Refund Policy
          </Link>
          , which forms part of these terms.
        </P>
      </Section>

      <Section heading="9. Our liability">
        <P>
          Nothing in these terms limits liability that cannot be limited by law,
          including for death or personal injury caused by our negligence, fraud,
          or your statutory rights as a consumer. Subject to that, our total
          liability to you for any order is limited to the amount you paid for
          it, and we are not liable for indirect or consequential losses (such
          as missed connectivity, roaming charges on other SIMs, or losses
          arising from an incompatible device).
        </P>
      </Section>

      <Section heading="10. Changes to these terms">
        <P>
          We may update these terms from time to time. The version that applies
          to your order is the one published when you place it.
        </P>
      </Section>

      <Section heading="11. Governing law">
        <P>
          These terms are governed by the law of {SITE.governingLaw}, and the
          courts of {SITE.governingLaw} have exclusive jurisdiction. If you are a
          consumer, you may also have the right to bring proceedings in your own
          country of residence.
        </P>
      </Section>

      <Section heading="12. Contact">
        <P>
          Questions about these terms? Email{" "}
          <a className="text-gold-deep underline-offset-4 hover:underline" href={`mailto:${SITE.supportEmail}`}>
            {SITE.supportEmail}
          </a>
          .
        </P>
      </Section>
    </PageShell>
  );
}
