import { Resend } from "resend";

import type { Order } from "@/lib/db/schema";
import { countryName } from "@/lib/flags";
import { formatMoney } from "@/lib/money";
import { getPlanBySlug } from "@/lib/plans/store";

/*
  Order delivery email. Best-effort by design: a missing RESEND_API_KEY or a
  send failure must never break provisioning. The order is already paid and
  fulfilled, and the QR can be re-sent from the order record. Callers should
  not await this in a way that fails the request.

  The QR is embedded as a CID inline attachment (src="cid:...") because Gmail
  and Outlook strip data: URI images, which is why the old email showed a
  broken code for many customers. The same attachment also appears as a
  downloadable file, so it can be opened on another screen and scanned.
*/

const QR_CID = "ameen-esim-qr";

// Brand palette (email-safe hex, mirrors globals.css).
const NAVY = "#19202e";
const GOLD = "#c9a961";
const GOLD_DEEP = "#a8863f";
const GOLD_PALE = "#e7d592";
const CREAM = "#faf8f2";
const SLATE = "#565d71";
const LINE = "#e5e1d8";

export function fromAddress(): string {
  // Resend requires a verified domain for the from-address in production.
  // Falls back to Resend's shared onboarding sender for local testing.
  return process.env.ORDER_EMAIL_FROM ?? "Ameen eSIM <onboarding@resend.dev>";
}

function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ameen-esim.co.uk";
}

/** Where the customer will use the eSIM, resolved from the purchased plan. */
export type Destination = {
  name: string;
  /** flagcdn PNG for single-country plans; null for regional bundles. */
  flagUrl: string | null;
};

// Country names that read wrong without "the" ("land in United Kingdom").
const NEEDS_ARTICLE = new Set([
  "United Kingdom",
  "United States",
  "Netherlands",
  "United Arab Emirates",
  "Maldives",
  "Philippines",
  "Bahamas",
  "Dominican Republic",
  "Czech Republic",
  "Gambia",
]);

/** "United Kingdom" → "the United Kingdom", for use mid-sentence. */
function inSentence(name: string): string {
  return NEEDS_ARTICLE.has(name) ? `the ${name}` : name;
}

export async function resolveDestination(
  planSlug: string,
): Promise<Destination> {
  let country: string | null = null;
  try {
    const plan = await getPlanBySlug(planSlug);
    country = plan?.country ?? null;
  } catch {
    // Plan lookup is cosmetic here; the email still works without it.
  }

  if (!country) return { name: "your destination", flagUrl: null };
  if (country === "SA") {
    return {
      name: "Saudi Arabia",
      flagUrl: "https://flagcdn.com/w40/sa.png",
    };
  }
  if (country === "GCC" || country === "Gulf") {
    return { name: "6 Gulf countries incl. Saudi Arabia", flagUrl: null };
  }
  if (/^[A-Z]{2}$/.test(country)) {
    return {
      name: countryName(country),
      flagUrl: `https://flagcdn.com/w40/${country.toLowerCase()}.png`,
    };
  }
  return { name: country, flagUrl: null };
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
  const destination = await resolveDestination(order.planSlug);

  try {
    const { error } = await resend.emails.send({
      from: fromAddress(),
      to: order.email,
      subject: `Your ${order.planTitle} eSIM is ready`,
      html: renderOrderEmailHtml(order, {
        qrSrc: `cid:${QR_CID}`,
        destination,
        support,
      }),
      attachments: [
        {
          filename: "ameen-esim-qr.png",
          // data URI → base64 payload; contentId lets the body embed it
          // inline (cid:) so it renders even where data URIs are stripped.
          content: order.qrImageDataUri.replace(/^data:image\/png;base64,/, ""),
          contentId: QR_CID,
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

export type OrderEmailRenderOptions = {
  /** Image src for the QR: "cid:..." in real sends, a data URI in previews. */
  qrSrc: string;
  destination: Destination;
  support: string;
  /**
   * Base URL for hosted images (logo, install icons) and site links.
   * Defaults to the configured site URL; the preview route passes the
   * request origin so images resolve on whatever host it's opened from.
   */
  baseUrl?: string;
};

/** One-tap eSIM install for iOS 17.4+, straight from the email. */
function iosInstallLink(lpaString: string): string {
  return `https://esimsetup.apple.com/esim_qrcode_provisioning?carddata=${encodeURIComponent(lpaString)}`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function renderOrderEmailHtml(
  order: Order,
  opts: OrderEmailRenderOptions,
): string {
  const site = opts.baseUrl ?? siteUrl();
  const price = formatMoney(order.amountPence);
  const dest = opts.destination;
  const planTitle = escapeHtml(order.planTitle);
  const destName = escapeHtml(dest.name);

  const destinationCell = dest.flagUrl
    ? `<img src="${dest.flagUrl}" width="20" height="14" alt="" style="width:20px;height:14px;border-radius:2px;vertical-align:-2px;margin-right:7px;border:1px solid rgba(25,32,46,0.15)" />${destName}`
    : destName;

  const supportBlock = opts.support
    ? `<p style="margin:0 0 6px;color:${SLATE};font-size:13px;line-height:20px">Questions or trouble installing? Reply to this email or write to <a href="mailto:${opts.support}" style="color:${NAVY};font-weight:bold">${opts.support}</a>. A real person answers.</p>`
    : "";

  const footerLink = (path: string, label: string) =>
    `<a href="${site}${path}" style="color:${GOLD_PALE};text-decoration:none;font-size:12px">${label}</a>`;

  const step = (n: string, text: string) => `
    <tr>
      <td valign="top" style="padding:0 10px 10px 0">
        <span style="display:inline-block;width:22px;height:22px;line-height:22px;text-align:center;background:${CREAM};border:1px solid ${LINE};border-radius:50%;font-size:12px;font-weight:bold;color:${NAVY}">${n}</span>
      </td>
      <td style="padding:0 0 10px;color:${SLATE};font-size:14px;line-height:21px">${text}</td>
    </tr>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <title>Your eSIM is ready</title>
</head>
<body style="margin:0;padding:0;background:#efece4;-webkit-text-size-adjust:100%">
  <!-- Preheader (hidden preview text) -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all">
    Your ${planTitle} eSIM is inside. Install it in two minutes, switch it on when you land.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#efece4">
    <tr><td align="center" style="padding:24px 12px">

      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">

        <!-- Header: brand logo on a light bar -->
        <tr>
          <td style="background:#ffffff;border-radius:14px 14px 0 0;padding:22px 32px">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td valign="middle">
                  <img src="${site}/email/ameen-logo.png" alt="Ameen eSIM" width="184" height="40" style="display:block;width:184px;height:40px;border:0" />
                </td>
                <td align="right" valign="middle" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:1.5px;color:${GOLD_DEEP};text-transform:uppercase;white-space:nowrap">
                  Order confirmed
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr><td style="height:3px;background:${GOLD};font-size:0;line-height:0">&nbsp;</td></tr>

        <!-- Body card -->
        <tr>
          <td style="background:#ffffff;padding:32px;font-family:Arial,Helvetica,sans-serif">

            <h1 style="margin:0 0 12px;font-size:24px;line-height:30px;color:${NAVY}">Your eSIM is ready</h1>
            <p style="margin:0 0 18px;color:${NAVY};font-size:16px;line-height:24px;font-weight:bold">
              Thank you for your order.
            </p>
            <p style="margin:0 0 24px;color:${SLATE};font-size:15px;line-height:23px">
              Setting up your eSIM is quick and easy. Install it now while you have Wi-Fi, then switch its line on when you land in ${escapeHtml(inSentence(dest.name))}, so your validity starts on arrival.
            </p>

            <!-- Order summary -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${LINE};border-radius:10px;background:${CREAM};font-size:14px;margin-bottom:26px">
              <tr>
                <td style="padding:12px 16px;color:${SLATE};border-bottom:1px solid ${LINE}">Plan</td>
                <td align="right" style="padding:12px 16px;color:${NAVY};font-weight:bold;border-bottom:1px solid ${LINE}">${planTitle}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px;color:${SLATE};border-bottom:1px solid ${LINE}">Destination</td>
                <td align="right" style="padding:12px 16px;color:${NAVY};font-weight:bold;border-bottom:1px solid ${LINE}">${destinationCell}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px;color:${SLATE};border-bottom:1px solid ${LINE}">Paid</td>
                <td align="right" style="padding:12px 16px;color:${NAVY};font-weight:bold;border-bottom:1px solid ${LINE}">${price}${order.quantity > 1 ? ` · ${order.quantity} eSIMs` : ""}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px;color:${SLATE}">Order</td>
                <td align="right" style="padding:12px 16px;color:${SLATE};font-family:Consolas,Menlo,monospace;font-size:12px">${order.id}</td>
              </tr>
            </table>

            <!-- iPhone one-tap install -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px">
              <tr><td align="center">
                <a href="${iosInstallLink(order.lpaString ?? "")}"
                   style="display:inline-block;background:${GOLD};color:${NAVY};font-size:15px;font-weight:bold;text-decoration:none;padding:14px 34px;border-radius:10px">
                  Install on this iPhone
                </a>
              </td></tr>
              <tr><td align="center" style="padding-top:8px;color:${SLATE};font-size:12px;line-height:18px">
                One tap on iPhone (iOS 17.4 or later). On Android, or an older iPhone, use the QR or the manual codes below.
              </td></tr>
            </table>

            <!-- QR -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:18px 0 6px">
              <tr><td align="center">
                <img src="${opts.qrSrc}" width="210" height="210" alt="eSIM installation QR code"
                     style="display:block;width:210px;height:210px;border:1px solid ${LINE};border-radius:12px;padding:10px;background:#ffffff" />
              </td></tr>
              <tr><td align="center" style="padding-top:10px;color:${SLATE};font-size:13px;line-height:19px">
                Scan with the phone that will use the eSIM.<br />
                Reading this on that same phone? You can't scan your own screen, so use the button above or the codes below.
              </td></tr>
            </table>

            <hr style="border:none;border-top:1px solid ${LINE};margin:26px 0" />

            <!-- Install on iPhone -->
            <h2 style="margin:0 0 12px;font-size:16px;color:${NAVY}">
              <img src="${site}/email/icon-apple.png" width="17" height="17" alt="" style="width:17px;height:17px;vertical-align:-2px;margin-right:8px" />Install on iPhone
            </h2>
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:18px">
              ${step("1", `Open <strong style="color:${NAVY}">Settings &rarr; Mobile Service</strong> (or Mobile Data) and tap <strong style="color:${NAVY}">Add eSIM</strong>.`)}
              ${step("2", `Choose <strong style="color:${NAVY}">Use QR Code</strong> and scan the code above, or tap the gold button if you're on this iPhone.`)}
              ${step("3", `Name the plan <strong style="color:${NAVY}">Ameen eSIM</strong> and keep its line <strong style="color:${NAVY}">off</strong> until you arrive.`)}
            </table>

            <!-- Install on Android -->
            <h2 style="margin:0 0 12px;font-size:16px;color:${NAVY}">
              <img src="${site}/email/icon-android.png" width="18" height="18" alt="" style="width:18px;height:18px;vertical-align:-3px;margin-right:7px" />Install on Android
            </h2>
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:4px">
              ${step("1", `Open <strong style="color:${NAVY}">Settings &rarr; Network &amp; internet &rarr; SIMs &rarr; Add eSIM</strong>. On Samsung: <strong style="color:${NAVY}">Settings &rarr; Connections &rarr; SIM manager</strong>.`)}
              ${step("2", `Scan the QR code above, or pick <strong style="color:${NAVY}">Enter it manually</strong> and type the two codes below.`)}
              ${step("3", `Name it <strong style="color:${NAVY}">Ameen eSIM</strong> and keep the line <strong style="color:${NAVY}">off</strong> until you arrive.`)}
            </table>

            <!-- Manual codes -->
            <h2 style="margin:22px 0 8px;font-size:16px;color:${NAVY}">Manual install codes</h2>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${LINE};border-radius:10px;background:${CREAM};font-size:13px;margin-bottom:22px">
              <tr>
                <td style="padding:11px 16px;color:${SLATE};border-bottom:1px solid ${LINE}">SM-DP+ address</td>
                <td align="right" style="padding:11px 16px;color:${NAVY};font-family:Consolas,Menlo,monospace;border-bottom:1px solid ${LINE}">${order.smdpAddress ?? "&mdash;"}</td>
              </tr>
              <tr>
                <td style="padding:11px 16px;color:${SLATE}">Activation code</td>
                <td align="right" style="padding:11px 16px;color:${NAVY};font-family:Consolas,Menlo,monospace;word-break:break-all">${order.activationCode ?? "&mdash;"}</td>
              </tr>
            </table>

            <!-- Honest reminder -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fbf7ec;border:1px solid ${GOLD};border-radius:10px;margin-bottom:24px">
              <tr><td style="padding:14px 16px;color:${NAVY};font-size:13px;line-height:20px">
                <strong>Before you fly:</strong> install now while you have Wi-Fi, but only enable the eSIM line when you land. It's data only, so there's no phone number. Your regular SIM can stay in for calls.
              </td></tr>
            </table>

            ${supportBlock}
            <p style="margin:0;color:${SLATE};font-size:13px;line-height:20px">
              Lost this email later? Retrieve your eSIM any time at <a href="${site}/orders" style="color:${NAVY};font-weight:bold">${site.replace(/^https?:\/\//, "")}/orders</a>.
            </p>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:${NAVY};border-radius:0 0 14px 14px;padding:24px 32px;font-family:Arial,Helvetica,sans-serif">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="padding-bottom:14px">
                  ${footerLink("/how-it-works", "How it works")} &nbsp;·&nbsp;
                  ${footerLink("/compatibility", "Device check")} &nbsp;·&nbsp;
                  ${footerLink("/coverage", "Coverage & calling apps")} &nbsp;·&nbsp;
                  ${footerLink("/faq", "FAQ")} &nbsp;·&nbsp;
                  ${footerLink("/contact", "Contact")}
                </td>
              </tr>
              <tr>
                <td align="center" style="color:rgba(250,248,242,0.55);font-size:11px;line-height:17px">
                  Ameen eSIM is a trading name of Al-Waseelah Tours Ltd,<br />
                  registered in England &amp; Wales, company no. 16268888.
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
