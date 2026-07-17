import * as Sentry from "@sentry/nextjs";

// Edge runtime (middleware) errors. Same errors-only setup as the server.
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 0,
  });
}
