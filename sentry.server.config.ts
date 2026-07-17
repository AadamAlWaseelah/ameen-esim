import * as Sentry from "@sentry/nextjs";

/*
  Server-side error monitoring. Inert until NEXT_PUBLIC_SENTRY_DSN is set
  (create a free Sentry project and add the DSN to Vercel + .env.local).
  Errors only — tracing/replay stay off to keep the free tier roomy and the
  overhead near zero.
*/
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 0,
    enableLogs: false,
  });
}
