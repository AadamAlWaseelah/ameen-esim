import { Resend } from "resend";

import { fromAddress } from "@/lib/email/order";
import { SITE } from "@/lib/site-config";

/*
  Owner failure alerts — a paid order that fails to provision (or delivers but
  can't be emailed) must reach the owner without waiting for a customer
  complaint. Best-effort by design: alerting must never throw into the
  payment/fulfilment path, so every failure here is logged and swallowed.

  Recipient: OWNER_EMAIL, falling back to SUPPORT_EMAIL, then the site
  support address.
*/
export async function sendOwnerAlert(
  subject: string,
  lines: string[],
): Promise<void> {
  const to =
    process.env.OWNER_EMAIL ??
    process.env.SUPPORT_EMAIL ??
    SITE.supportEmail;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error(
      `[owner alert] RESEND_API_KEY not set; alert not sent: ${subject}`,
    );
    return;
  }

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from: fromAddress(),
      to,
      subject: `[Ameen eSIM alert] ${subject}`,
      text: lines.join("\n"),
    });
    if (error) {
      console.error(`[owner alert] Not sent (${subject}): ${error.message}`);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[owner alert] Not sent (${subject}): ${message}`);
  }
}

/** Standard order summary lines for alert bodies. */
export function orderAlertLines(order: {
  id: string;
  planTitle: string;
  email: string;
  amountPence: number;
  providerId: string;
  providerOrderRef?: string | null;
}): string[] {
  return [
    `Order: ${order.id}`,
    `Plan: ${order.planTitle}`,
    `Customer: ${order.email}`,
    `Paid: £${(order.amountPence / 100).toFixed(2)}`,
    `Provider: ${order.providerId}${order.providerOrderRef ? ` (ref ${order.providerOrderRef})` : ""}`,
  ];
}
