import { NextResponse } from "next/server";
import QRCode from "qrcode";

import type { Order } from "@/lib/db/schema";
import {
  renderOrderEmailHtml,
  resolveDestination,
} from "@/lib/email/order";

/*
  Preview of the order email so its design can be reviewed without sending a
  real email. Uses sample data only (no real customer info or secrets), so it
  is safe to leave reachable in production for stakeholder review. Optional
  ?slug=<planSlug>&title=<title> switches the sample plan.
*/

export const dynamic = "force-dynamic";

const SAMPLE_LPA = "LPA:1$rsp-eu.simlessly.com$1CF39D18769345478929B18C71F7DF39";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug") ?? "gb-1-7";
  const title = url.searchParams.get("title") ?? "United Kingdom 1GB · 7 Days";

  const qrDataUri = await QRCode.toDataURL(SAMPLE_LPA, {
    errorCorrectionLevel: "M",
    margin: 0,
    width: 420,
    color: { dark: "#19202e", light: "#ffffff" },
  });

  const order = {
    id: "b0cf829a-c219-44ac-99de-7cd1038067b7",
    email: "customer@example.com",
    planId: null,
    planSlug: slug,
    planTitle: title,
    quantity: 1,
    amountPence: 199,
    currency: "GBP",
    providerId: "esimaccess",
    providerRef: "CKH253",
    stripeSessionId: null,
    stripePaymentIntentId: null,
    providerOrderRef: "B26062411470016",
    iccid: null,
    lpaString: SAMPLE_LPA,
    smdpAddress: "rsp-eu.simlessly.com",
    activationCode: "1CF39D18769345478929B18C71F7DF39",
    qrImageDataUri: qrDataUri,
    status: "delivered",
    errorMessage: null,
    emailSentAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Order;

  const destination = await resolveDestination(order.planSlug);
  const html = renderOrderEmailHtml(order, {
    // The browser renders data URIs fine; real sends use cid: instead.
    qrSrc: qrDataUri,
    destination,
    support: "alwaseelahtours@gmail.com",
    // Load logo/icons from the host this preview is opened on, so the link
    // works regardless of whether NEXT_PUBLIC_SITE_URL is configured.
    baseUrl: url.origin,
  });

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
