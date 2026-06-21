import { BadgeCheck, MailCheck, ShieldCheck, Wallet } from "lucide-react";

import { cn } from "@/lib/utils";

// Honest trust signals only — every claim here is true today. No invented
// badges, certifications, review counts or metrics (brand honesty rule).
const SIGNALS = [
  {
    icon: BadgeCheck,
    title: "By a UK Umrah operator",
    body: "A trading name of Al-Waseelah Tours Ltd, registered in England & Wales.",
  },
  {
    icon: MailCheck,
    title: "Delivered by email",
    body: "Your eSIM QR arrives in minutes — no SIM card in the post, no waiting.",
  },
  {
    icon: ShieldCheck,
    title: "Honest, data-only",
    body: "We state coverage and throttling plainly before you buy. No dark patterns.",
  },
  {
    icon: Wallet,
    title: "Pay in GBP",
    body: "Clear one-off pricing. No account to create, no subscription, no surprises.",
  },
];

export function TrustBar({ className }: { className?: string }) {
  return (
    <ul
      className={cn(
        "grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {SIGNALS.map((signal) => (
        <li key={signal.title} className="bg-paper p-5">
          <span className="inline-flex size-10 items-center justify-center rounded-xl bg-cream text-gold-deep">
            <signal.icon className="size-5" aria-hidden />
          </span>
          <p className="mt-3.5 font-medium text-navy">{signal.title}</p>
          <p className="mt-1 text-sm leading-relaxed text-slate">{signal.body}</p>
        </li>
      ))}
    </ul>
  );
}
