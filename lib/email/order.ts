import { Resend } from "resend";

import type { Order } from "@/lib/db/schema";
import { formatMoney } from "@/lib/money";

/*
  Order delivery email. Best-effort by design: a missing RESEND_API_KEY or a
  send failure must never break provisioning — the order is already paid and
  fulfilled, and the QR can be re-sent from the order record. Callers should
  not await this in a way that fails the request.
*/

function fromAddress(): string {
  // Resend requires a verified domain for the from-address in production.
  // Falls back to Resend's shared onboarding sender for local testing.
  return process.env.ORDER_EMAIL_FROM ?? "Ameen eSIM <onboarding@resend.dev>";
}

export type OrderEmailResult =
  | { sent: true }
  | { sent: false; reason: string };

export async function sendOrderEmail(order: Order): Promise<OrderEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { sent: false, reason: "RESEND_API_KEY not set" };
  }
  if (!order.lpaString || !order.qrImageDataUri) {
    return { sent: false, reason: "order has no provisioned eSIM yet" };
  }

  const resend = new Resend(apiKey);
  const support = process.env.SUPPORT_EMAIL ?? process.env.OWNER_EMAIL ?? "";

  try {
    const { error } = await resend.emails.send({
      from: fromAddress(),
      to: order.email,
      subject: `Your ${order.planTitle} eSIM is ready`,
      html: renderHtml(order, support),
      attachments: [
        {
          filename: "ameen-esim-qr.png",
          // data URI → base64 payload for the attachment.
          content: order.qrImageDataUri.replace(/^data:image\/png;base64,/, ""),
        },
      ],
    });
    if (error) return { sent: false, reason: error.message };
    return { sent: true };
  } catch (err) {
    return {
      sent: false,
      reason: err instanceof Error ? err.message : String(err),
    };
  }
}

function renderHtml(order: Order, support: string): string {
  const price = formatMoney(order.amountPence);
  const supportLine = support
    ? `<p style="color:#5b6473;font-size:14px">Questions? Email <a href="mailto:${support}">${support}</a>.</p>`
    : "";

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#19202E">
    <h1 style="font-size:22px;margin:0 0 8px">Your eSIM is ready</h1>
    <p style="color:#5b6473;font-size:15px;margin:0 0 20px">
      Thank you for your order. Scan the QR code below on the device you'll use in Saudi Arabia.
    </p>

    <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:20px">
      <tr><td style="padding:6px 0;color:#5b6473">Plan</td><td style="padding:6px 0;text-align:right">${order.planTitle}</td></tr>
      <tr><td style="padding:6px 0;color:#5b6473">Quantity</td><td style="padding:6px 0;text-align:right">${order.quantity}</td></tr>
      <tr><td style="padding:6px 0;color:#5b6473">Paid</td><td style="padding:6px 0;text-align:right">${price}</td></tr>
      <tr><td style="padding:6px 0;color:#5b6473">Order</td><td style="padding:6px 0;text-align:right">${order.id}</td></tr>
    </table>

    <div style="text-align:center;margin:24px 0">
      <img src="${order.qrImageDataUri}" alt="eSIM QR code" width="240" height="240" style="border:1px solid #e7e3da;border-radius:12px" />
    </div>

    <p style="background:#fbf7ec;border:1px solid #e8d9a8;border-radius:8px;padding:12px;color:#19202E;font-size:14px;margin:0 0 20px">
      💡 When your phone asks you to name the plan, label it
      <strong>&ldquo;Ameen eSIM&rdquo;</strong> so it's easy to find. You can
      rename it any time in your mobile-data settings.
    </p>

    <h2 style="font-size:16px;margin:0 0 8px">Install manually</h2>
    <p style="color:#5b6473;font-size:14px;margin:0 0 4px">If you can't scan the code, add the eSIM manually with:</p>
    <table style="width:100%;border-collapse:collapse;font-size:13px;background:#faf8f4;border-radius:8px">
      <tr><td style="padding:8px 12px;color:#5b6473">SM-DP+ Address</td><td style="padding:8px 12px;text-align:right;font-family:monospace">${order.smdpAddress ?? "—"}</td></tr>
      <tr><td style="padding:8px 12px;color:#5b6473">Activation Code</td><td style="padding:8px 12px;text-align:right;font-family:monospace">${order.activationCode ?? "—"}</td></tr>
    </table>

    <p style="color:#5b6473;font-size:13px;margin:20px 0 0">
      Tip: install before you travel, but only enable the line when you arrive. Older or carrier-locked phones may not support eSIM.
    </p>
    ${supportLine}
  </div>`;
}
