import Link from "next/link";
import Image from "next/image";

import { getOrderByStripeSession } from "@/lib/orders/store";
import { refreshProvisioning } from "@/lib/orders/provision";
import { formatMoney } from "@/lib/money";

import { AutoRefresh } from "./auto-refresh";

export const dynamic = "force-dynamic";

export const metadata = { title: "Order confirmed" };

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const sessionId = searchParams?.session_id;
  let order = sessionId ? await getOrderByStripeSession(sessionId) : null;

  // If the eSIM was still allocating when the webhook ran, finish it now (and
  // on each refresh) so the QR appears as soon as the provider has it ready.
  if (order && order.status === "provisioning") {
    order = (await refreshProvisioning(order.id)) ?? order;
  }

  return (
    <main className="container py-12 sm:py-20">
      <div className="mx-auto max-w-xl">
        <p className="text-sm font-medium text-gold-deep">Payment received</p>
        <h1 className="mt-3 text-4xl text-navy sm:text-5xl">Thank you</h1>

        {!order ? (
          <p className="mt-5 text-lg leading-relaxed text-slate">
            Your payment was received. If you don&apos;t see your eSIM details
            shortly, check your email. We&apos;ll send the QR code as soon as
            it&apos;s provisioned.
          </p>
        ) : order.status === "delivered" ? (
          <DeliveredOrder order={order} />
        ) : order.status === "failed" ? (
          <div className="mt-5 rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-navy">
            <p className="font-medium">We hit a problem provisioning your eSIM.</p>
            <p className="mt-2 text-sm text-slate">
              You&apos;ve been charged for order{" "}
              <span className="font-mono">{order.id}</span>, and we&apos;re on
              it. Please contact support and we&apos;ll sort it out fast.
            </p>
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-line bg-paper p-6 text-navy">
            <p className="font-medium">Provisioning your eSIM…</p>
            <p className="mt-2 text-sm text-slate">
              This usually takes a few seconds, and this page will update
              automatically. We&apos;ll also email the QR code the moment
              it&apos;s ready.
            </p>
            <AutoRefresh seconds={5} />
          </div>
        )}

        <div className="mt-10">
          <Link
            href="/plans"
            className="text-sm font-medium text-gold-deep underline-offset-4 hover:underline"
          >
            Back to all plans
          </Link>
        </div>
      </div>
    </main>
  );
}

function DeliveredOrder({
  order,
}: {
  order: Awaited<ReturnType<typeof getOrderByStripeSession>>;
}) {
  if (!order) return null;
  return (
    <>
      <p className="mt-5 text-lg leading-relaxed text-slate">
        Your <span className="font-medium text-navy">{order.planTitle}</span>{" "}
        eSIM is ready. Scan the QR code below on the device you&apos;ll use in
        Saudi Arabia. We&apos;ve also emailed it to{" "}
        <span className="font-medium text-navy">{order.email}</span>.
      </p>

      <p className="mt-4 rounded-xl border border-gold/30 bg-gold/5 p-4 text-sm text-navy">
        💡 When your phone asks you to name the plan, label it{" "}
        <span className="font-medium">&ldquo;Ameen eSIM&rdquo;</span> so it&apos;s
        easy to find. You can rename it any time in your phone&apos;s mobile-data
        settings.
      </p>

      {order.qrImageDataUri ? (
        <div className="mt-8 flex justify-center rounded-2xl border border-line bg-paper p-6">
          <Image
            src={order.qrImageDataUri}
            alt="eSIM QR code"
            width={260}
            height={260}
            unoptimized
            className="rounded-xl"
          />
        </div>
      ) : null}

      <div className="mt-6 rounded-2xl border border-line bg-paper p-6">
        <h2 className="text-lg text-navy">Install manually</h2>
        <p className="mt-1 text-sm text-slate">
          If you can&apos;t scan the code, add the eSIM manually with:
        </p>
        <dl className="mt-4 space-y-2 text-sm">
          <Row label="SM-DP+ Address" value={order.smdpAddress} />
          <Row label="Activation Code" value={order.activationCode} />
        </dl>
        <p className="mt-4 text-xs text-slate">
          Paid {formatMoney(order.amountPence)} · Order{" "}
          <span className="font-mono">{order.id}</span>
        </p>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-slate">{label}</dt>
      <dd className="font-mono text-navy">{value ?? "—"}</dd>
    </div>
  );
}
