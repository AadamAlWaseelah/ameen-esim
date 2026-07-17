"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

/*
  Root error boundary: a crash anywhere in the App Router tree lands here.
  Reports to Sentry (when configured) and shows a calm, on-brand fallback.
  Must render its own <html>/<body> because it replaces the root layout.
*/
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#faf8f2",
          color: "#19202e",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "28px", marginBottom: "12px" }}>
            Something went wrong
          </h1>
          <p style={{ color: "#565d71", maxWidth: "42ch", lineHeight: 1.6 }}>
            Sorry — that wasn&apos;t supposed to happen. Try again, and if it
            keeps happening email us at alwaseelahtours@gmail.com.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: "20px",
              padding: "10px 24px",
              borderRadius: "10px",
              border: "none",
              background: "#c9a961",
              color: "#19202e",
              fontWeight: 600,
              fontSize: "15px",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
