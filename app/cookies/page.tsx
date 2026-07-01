import Link from "next/link";

import { PageShell, Section, P, Ul } from "@/components/site/prose";
import { SITE } from "@/lib/site-config";

export const metadata = {
  title: "Cookie Policy",
  description: "The small number of cookies we use and why.",
};

export default function CookiesPage() {
  return (
    <PageShell
      title="Cookie Policy"
      updated="27 June 2026"
      intro="We keep cookies to a minimum: only what's needed to run the site and checkout securely."
    >
      <Section heading="What we use">
        <Ul>
          <li><strong>Essential cookies</strong>, needed for the site to work, to keep your session secure, and to protect the admin area.</li>
          <li><strong>Checkout cookies</strong>, set by Stripe during payment to process your order and help prevent fraud.</li>
        </Ul>
        <P>
          We do not use advertising or cross-site tracking cookies, and we
          don&apos;t sell your data to advertisers.
        </P>
      </Section>

      <Section heading="Managing cookies">
        <P>
          You can block or delete cookies in your browser settings, but note the
          site and checkout may not work properly without the essential ones.
        </P>
      </Section>

      <Section heading="More information">
        <P>
          For how we handle personal data more generally, see our{" "}
          <Link className="text-gold-deep underline-offset-4 hover:underline" href="/privacy">
            Privacy Policy
          </Link>
          , or email{" "}
          <a className="text-gold-deep underline-offset-4 hover:underline" href={`mailto:${SITE.supportEmail}`}>
            {SITE.supportEmail}
          </a>
          .
        </P>
      </Section>
    </PageShell>
  );
}
