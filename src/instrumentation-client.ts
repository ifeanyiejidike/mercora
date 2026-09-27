import * as Sentry from "@sentry/nextjs";

// Client-side Sentry initialization. No-op unless NEXT_PUBLIC_SENTRY_DSN
// is set (it's a NEXT_PUBLIC_ var since this file runs in the browser).
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV,
    tracesSampleRate: 0.1,
  });
}
