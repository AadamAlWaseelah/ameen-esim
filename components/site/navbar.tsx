"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "/plans", label: "Plans" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/coverage", label: "Coverage" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  // Close the mobile menu whenever the route changes.
  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/85 backdrop-blur supports-[backdrop-filter]:bg-cream/70">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center"
          aria-label="Ameen eSIM home"
        >
          {/* Full brand lockup — do not recolour. eslint-disable: SVG logo. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/ameen-logo.svg"
            alt="Ameen eSIM"
            className="h-8 w-auto md:h-9"
          />
        </Link>

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Primary"
        >
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150 ease-out-strong",
                  active
                    ? "text-navy"
                    : "text-slate hover:text-navy"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="primary" size="sm" className="hidden sm:inline-flex">
            <Link href="/plans">Buy eSIM</Link>
          </Button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-navy transition-transform duration-150 ease-out-strong active:scale-[0.94] lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="border-t border-line bg-cream lg:hidden"
      >
        <nav className="container flex flex-col gap-1 py-4" aria-label="Mobile">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2.5 text-base font-medium text-navy transition-colors hover:bg-navy/5"
            >
              {link.label}
            </Link>
          ))}
          <Button asChild variant="primary" size="lg" className="mt-2">
            <Link href="/plans">Buy eSIM</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
