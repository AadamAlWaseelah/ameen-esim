import Link from "next/link";

const PRODUCT_LINKS = [
  { href: "/plans", label: "Plans" },
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
        <div className="container flex flex-col gap-3 py-8 text-xs leading-relaxed text-cream/60">
          <p>
            Ameen eSIM is a trading name of Al-Waseelah Tours Ltd, a company
            registered in England &amp; Wales (company no.{" "}
            {"{{COMPANY_NUMBER}}"}). Registered office:{" "}
            {"{{REGISTERED_ADDRESS}}"}.
          </p>
          <p>
            Registered with the Information Commissioner&apos;s Office (ICO),
            reference {"{{ICO_NUMBER}}"}. Ameen eSIM resells third-party
            data-only eSIMs; service is network-dependent.
          </p>
          <p className="text-cream/50">© {year} Al-Waseelah Tours Ltd. All rights reserved.</p>
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
