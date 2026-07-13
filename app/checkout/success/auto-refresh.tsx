"use client";

import { useEffect } from "react";

/*
  While an order is still provisioning, reload the page on an interval so the
  server component re-checks the provider and renders the QR once it's ready.

  Every reload triggers a provider API call (refreshProvisioning), so the loop
  is capped: after MAX_REFRESHES the page stops reloading and the customer
  falls back to the email path (the cron sweep delivers + emails unattended).
  The counter lives in sessionStorage so it survives the reloads themselves.
*/

const MAX_REFRESHES = 36; // 36 × 5s = ~3 minutes of polling
const STORAGE_KEY = "ameen-success-refreshes";

export function AutoRefresh({ seconds }: { seconds: number }) {
  useEffect(() => {
    // Per-order counter: a later purchase in the same tab polls afresh.
    const key = `${STORAGE_KEY}:${window.location.search}`;
    let count = 0;
    try {
      count = Number(sessionStorage.getItem(key)) || 0;
    } catch {
      // Storage unavailable (private mode etc.) — poll without a cap, as before.
    }
    if (count >= MAX_REFRESHES) return;

    const id = setTimeout(() => {
      try {
        sessionStorage.setItem(key, String(count + 1));
      } catch {
        // ignore
      }
      window.location.reload();
    }, seconds * 1000);
    return () => clearTimeout(id);
  }, [seconds]);
  return null;
}
