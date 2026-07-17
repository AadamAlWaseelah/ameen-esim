import * as Sentry from "@sentry/nextjs";

// Browser errors (uncaught exceptions, unhandled rejections). Errors only —
// no session replay, no tracing — so the bundle cost stays minimal.
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 0,
  });
}
