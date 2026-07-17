import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Required on Next 14 for instrumentation.ts (Sentry init per runtime).
    instrumentationHook: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Nothing on this site is meant to be embedded in a frame; blocks
          // clickjacking (especially of the /admin pages).
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          // The checkout success URL carries the Stripe session id — the only
          // key needed to view an order's QR/activation codes — so never send
          // full URLs to other origins.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
        ],
      },
    ];
  },
};

// withSentryConfig injects the client init (sentry.client.config.ts) into the
// browser bundle — on Next 14 nothing else loads it. Source-map upload is
// disabled so no SENTRY_AUTH_TOKEN is required; monitoring itself only
// activates when NEXT_PUBLIC_SENTRY_DSN is set.
export default withSentryConfig(nextConfig, {
  silent: true,
  sourcemaps: { disable: true },
  telemetry: false,
});
