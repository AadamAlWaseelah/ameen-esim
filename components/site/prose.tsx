import type { ReactNode } from "react";

/*
  Shared layout + typography primitives for legal and content pages, so they
  all share consistent spacing and styling without the Tailwind typography
  plugin.
*/

export function PageShell({
  title,
  intro,
  updated,
  children,
}: {
  title: string;
  intro?: ReactNode;
  updated?: string;
  children: ReactNode;
}) {
  return (
    // div, not main — the root layout already renders <main id="main">.
    <div className="container pb-6 pt-12 sm:pb-8 sm:pt-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="animate-fade-up text-balance text-4xl tracking-[-0.025em] text-navy sm:text-5xl">
          {title}
        </h1>
        {intro ? (
          <p
            className="animate-fade-up mt-4 text-pretty text-lg leading-relaxed text-slate"
            style={{ animationDelay: "60ms" }}
          >
            {intro}
          </p>
        ) : null}
        {updated ? (
          <p className="mt-3 text-sm text-slate/80">Last updated: {updated}</p>
        ) : null}
        <div className="mt-10 space-y-8">{children}</div>
      </div>
    </div>
  );
}

export function Section({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold text-navy">{heading}</h2>
      {children}
    </section>
  );
}

export function P({ children }: { children: ReactNode }) {
  return <p className="leading-relaxed text-slate">{children}</p>;
}

export function Ul({ children }: { children: ReactNode }) {
  return (
    <ul className="list-disc space-y-1.5 pl-5 leading-relaxed text-slate marker:text-gold-deep">
      {children}
    </ul>
  );
}
