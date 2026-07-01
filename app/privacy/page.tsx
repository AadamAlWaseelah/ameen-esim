import Link from "next/link";

import { PageShell, Section, P, Ul } from "@/components/site/prose";
import { SITE } from "@/lib/site-config";

export const metadata = {
  title: "Privacy Policy",
  description: "How we collect, use and protect your personal data.",
};

export default function PrivacyPage() {
  return (
    <PageShell
      title="Privacy Policy"
      updated="27 June 2026"
      intro={`How ${SITE.legalName} (trading as ${SITE.brand}) handles your personal data.`}
    >
      <Section heading="Who is responsible for your data">
        <P>
          The data controller is {SITE.legalName} (company no.{" "}
          {SITE.companyNumber}), registered office {SITE.address}. We are
          registered with the UK Information Commissioner&apos;s Office (ICO),
          reference {SITE.icoNumber}. For any privacy question, email{" "}
          <a className="text-gold-deep underline-offset-4 hover:underline" href={`mailto:${SITE.supportEmail}`}>
            {SITE.supportEmail}
          </a>
          .
        </P>
      </Section>

      <Section heading="What we collect">
        <Ul>
          <li>Your email address, and your name if you provide it.</li>
          <li>Order details: the plan purchased, amount paid, and the eSIM provisioning data (such as ICCID and activation details) needed to deliver your eSIM.</li>
          <li>Payment is processed by Stripe. We receive confirmation of payment but never store your full card number.</li>
          <li>Basic technical data (such as IP address and device/browser information) and how you use the site.</li>
        </Ul>
      </Section>

      <Section heading="Why we use it, and our lawful basis">
        <Ul>
          <li><strong>To fulfil your order:</strong> provisioning and emailing your eSIM, and providing support (performance of a contract).</li>
          <li><strong>To run and protect our business:</strong> fraud prevention, security and improving the service (our legitimate interests).</li>
          <li><strong>To meet legal duties:</strong> tax, accounting and record-keeping (legal obligation).</li>
        </Ul>
      </Section>

      <Section heading="Who we share it with">
        <P>
          We share data only with the providers we need to run the service:
        </P>
        <Ul>
          <li><strong>Stripe</strong> for payment processing.</li>
          <li><strong>eSIM Access (RedteaGo)</strong>, our eSIM supplier, to provision your eSIM.</li>
          <li><strong>Resend</strong> to send your order email.</li>
          <li><strong>Vercel</strong> and <strong>Neon</strong> for website hosting and the database.</li>
        </Ul>
        <P>
          Some of these providers may process data outside the UK. Where they
          do, appropriate safeguards (such as standard contractual clauses) are
          in place. We never sell your personal data.
        </P>
      </Section>

      <Section heading="How long we keep it">
        <P>
          We keep order and transaction records for as long as needed to provide
          the service and to meet our legal and accounting obligations
          (generally up to six years), after which we delete or anonymise them.
        </P>
      </Section>

      <Section heading="Your rights">
        <P>
          You have the right to access, correct, delete, restrict or object to
          our use of your data, and to data portability. To exercise any of
          these, email{" "}
          <a className="text-gold-deep underline-offset-4 hover:underline" href={`mailto:${SITE.supportEmail}`}>
            {SITE.supportEmail}
          </a>
          . You can also complain to the ICO at{" "}
          <a className="text-gold-deep underline-offset-4 hover:underline" href="https://ico.org.uk" target="_blank" rel="noreferrer">
            ico.org.uk
          </a>
          , though we&apos;d appreciate the chance to help first.
        </P>
      </Section>

      <Section heading="Cookies">
        <P>
          We use a small number of cookies to run the site and checkout. See our{" "}
          <Link className="text-gold-deep underline-offset-4 hover:underline" href="/cookies">
            Cookie Policy
          </Link>{" "}
          for details.
        </P>
      </Section>
    </PageShell>
  );
}
