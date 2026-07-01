import Link from "next/link";

import { PageShell, Section, P } from "@/components/site/prose";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "How it works",
  description: "From buying your eSIM to getting online in Saudi Arabia, in four simple steps.",
};

const STEPS = [
  {
    n: "1",
    title: "Choose your plan",
    body: "Pick a daily allowance or a fixed bundle that suits your trip length. Every plan is data only and one-off, with no contract and no auto-renewal.",
  },
  {
    n: "2",
    title: "Pay securely",
    body: "Check out in seconds with card payment via Stripe. Prices are in pounds, with nothing hidden.",
  },
  {
    n: "3",
    title: "Get your eSIM by email",
    body: "Within minutes you'll receive a QR code and manual installation details. Install it on your phone before you travel, but don't switch the line on yet.",
  },
  {
    n: "4",
    title: "Activate on arrival",
    body: "When you land in Saudi Arabia, turn on the eSIM line and you're connected. Your validity and allowance start then, so you get the full benefit of your plan.",
  },
];

export default function HowItWorksPage() {
  return (
    <PageShell
      title="How it works"
      intro="Online in Saudi Arabia in four simple steps. Most travellers are set up before they even board."
    >
      <div className="space-y-4">
        {STEPS.map((step) => (
          <div
            key={step.n}
            className="flex gap-4 rounded-2xl border border-line bg-paper p-5"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-semibold text-cream">
              {step.n}
            </span>
            <div>
              <h2 className="font-semibold text-navy">{step.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-slate">{step.body}</p>
            </div>
          </div>
        ))}
      </div>

      <Section heading="Before you buy">
        <P>
          eSIMs only work on eSIM-compatible, unlocked phones. Take a moment to{" "}
          <Link className="text-gold-deep underline-offset-4 hover:underline" href="/compatibility">
            check your device
          </Link>{" "}
          first. Still unsure which plan to pick? Our{" "}
          <Link className="text-gold-deep underline-offset-4 hover:underline" href="/faq">
            FAQ
          </Link>{" "}
          can help.
        </P>
      </Section>

      <div className="pt-2">
        <Button asChild>
          <Link href="/plans">Browse plans</Link>
        </Button>
      </div>
    </PageShell>
  );
}
