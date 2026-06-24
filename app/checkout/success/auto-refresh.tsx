"use client";

import { useEffect } from "react";

/*
  While an order is still provisioning, reload the page on an interval so the
  server component re-checks the provider and renders the QR once it's ready.
*/
export function AutoRefresh({ seconds }: { seconds: number }) {
  useEffect(() => {
    const id = setTimeout(() => window.location.reload(), seconds * 1000);
    return () => clearTimeout(id);
  }, [seconds]);
  return null;
}
