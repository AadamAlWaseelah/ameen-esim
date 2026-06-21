import Link from "next/link";

const PRODUCT_LINKS = [
  { href: "/plans", label: "Plans" },
  { href: "/compatibility", label: "Device check" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/coverage", label: "Coverage" },
  { href: "/faq", label: "FAQ" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/orders", label: "Find my eSIM" },
];

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/refund-policy", label: "Refunds" },
  { href: "/cookies", label: "Cookies" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-line bg-navy text-cream">
      <div className="container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="font-display text-xl tracking-tight text-cream">
            Ameen eSIM
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-cream/70">
            Saudi data eSIMs for Umrah and Hajj pilgrims. Instant delivery,
            honest data. {/* TODO(ameen): refine one-line promise */}
          </p>
        </div>

        <FooterColumn title="Product" links={PRODUCT_LINKS} />
        <FooterColumn title="Company" links={COMPANY_LINKS} />
        <FooterColumn title="Legal" links={LEGAL_LINKS} />
      </div>

      <div className="border-t border-cream/10">
        <div className="container py-10 text-sm leading-relaxed text-cream/60 sm:text-base">
          <div className="space-y-5 border-b border-cream/10 pb-9">
            <p>
              <strong className="font-semibold text-cream">
                Al-Waseelah Tours Ltd
              </strong>{" "}
              &mdash; registered in England &amp; Wales, company no. 16268888.
              Ameen eSIM is a trading name of Al-Waseelah Tours Ltd. Registered
              office: 65 Berkeley Road, Yardley, Birmingham, West Midlands,
              B25 8NW.
            </p>
            <p>
              Ameen eSIM resells third-party, data-only eSIMs for use in Saudi
              Arabia. Data plans carry no phone number, and speeds and coverage
              are network-dependent. Always check your phone is{" "}
              <Link
                href="/compatibility"
                className="text-cream underline decoration-cream/45 underline-offset-4 transition-colors hover:text-gold-pale"
              >
                eSIM compatible
              </Link>{" "}
              before you buy.
            </p>
            <p className="text-cream/45">
              Registered with the Information Commissioner&apos;s Office (ICO),
              reference {"{{ICO_NUMBER}}"}. Questions? Email{" "}
              <a
                href="mailto:{{SUPPORT_EMAIL}}"
                className="text-cream underline decoration-cream/45 underline-offset-4 transition-colors hover:text-gold-pale"
              >
                {"{{SUPPORT_EMAIL}}"}
              </a>
              .
            </p>
          </div>

          <div className="flex flex-col gap-4 pt-8 text-sm text-cream/45 sm:flex-row sm:items-center sm:justify-between">
            <p>© {year} Al-Waseelah Tours Ltd. All rights reserved.</p>
            <Link
              href="/admin/plans"
              className="transition-colors hover:text-gold-pale"
            >
              Staff login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-cream">{title}</h2>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-cream/70 transition-colors duration-150 hover:text-gold-pale"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
