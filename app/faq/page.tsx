import Link from "next/link";

import { PageShell } from "@/components/site/prose";
import { SITE } from "@/lib/site-config";

export const metadata = {
  title: "FAQ",
  description: "Honest answers to the common questions about Saudi data eSIMs.",
};

const FAQS: { q: string; a: string }[] = [
  {
    q: "Will my phone work with an eSIM?",
    a: "Most phones from the last few years support eSIM, but some older or network-locked handsets don't. Check for ‘Add eSIM’ in your settings, or use our device checker, before you buy.",
  },
  {
    q: "Is there a phone number?",
    a: "No. Our Saudi eSIMs are data only, ideal for maps, messaging and browsing. There's no local number for regular calls or SMS.",
  },
  {
    q: "How and when do I get my eSIM?",
    a: "By email, usually within minutes of payment. You get a QR code plus manual installation details. Install it before you travel.",
  },
  {
    q: "When should I activate it?",
    a: "Install before you fly, but only switch the eSIM line on when you arrive in Saudi Arabia, so your validity and allowance start on arrival rather than at home.",
  },
  {
    q: "Do calling apps like WhatsApp work?",
    a: "Sometimes. Voice and video calling can be restricted on Saudi networks. We won't promise it works, so please verify for your own situation.",
  },
  {
    q: "What's the difference between daily plans and fixed bundles?",
    a: "Daily plans give you an allowance that refreshes each day. Fixed bundles give you a set amount of data over a set number of days. Pick whichever matches how you'll travel.",
  },
  {
    q: "What are the ‘fair-use’ plans?",
    a: "Some daily plans keep you connected after your daily high-speed allowance by slowing the speed (to around 1Mbps) rather than cutting you off. They're hidden by default. Toggle ‘Show fair-use options’ on the plans page to see them.",
  },
  {
    q: "Can I use one eSIM on two phones?",
    a: "No. Each eSIM installs on a single device. If you need data on two phones, buy two eSIMs.",
  },
  {
    q: "Can I get a refund?",
    a: "eSIMs are digital and delivered instantly, so they're generally non-refundable once delivered. If an eSIM is faulty and we can't fix it, we'll refund or replace it. See our refund policy for full details.",
  },
];

export default function FaqPage() {
  return (
    <PageShell
      title="Frequently asked questions"
      intro="The honest essentials before and after you buy a Saudi eSIM."
    >
      <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line">
        {FAQS.map((faq) => (
          <details key={faq.q} className="group bg-paper">
            <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 font-medium text-navy marker:content-none">
              {faq.q}
              <span className="text-slate transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="px-5 pb-5 text-sm leading-relaxed text-slate">
              {faq.a}
            </p>
          </details>
        ))}
      </div>

      <p className="text-sm text-slate">
        Still stuck? Email{" "}
        <a className="text-gold-deep underline-offset-4 hover:underline" href={`mailto:${SITE.supportEmail}`}>
          {SITE.supportEmail}
        </a>{" "}
        or see{" "}
        <Link className="text-gold-deep underline-offset-4 hover:underline" href="/contact">
          Contact
        </Link>
        .
      </p>
    </PageShell>
  );
}
