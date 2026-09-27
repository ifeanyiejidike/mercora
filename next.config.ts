import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs/config";

const isProd = process.env.NODE_ENV === "production";

// Derived from NEXT_PUBLIC_API_URL so the media remotePattern always
// matches whatever backend this build is actually configured against,
// instead of hardcoding one environment's hostname.
const apiUrl = new URL(
  process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:8000",
);

const securityHeaders = [
  // Clickjacking protection (belt-and-suspenders with CSP frame-ancestors below).
  { key: "X-Frame-Options", value: "DENY" },
  // Prevent MIME-sniffing away from the declared Content-Type.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Only send full referrer to same-origin destinations.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Restrict powerful browser APIs this storefront doesn't use.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js needs 'unsafe-inline' for its inline hydration scripts;
      // 'unsafe-eval' is intentionally omitted (not required in prod builds).
      "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      `img-src 'self' data: blob: ${apiUrl.origin} https://images.unsplash.com https://plus.unsplash.com https://res.cloudinary.com`,
      `connect-src 'self' ${apiUrl.origin} https://vitals.vercel-insights.com https://*.ingest.sentry.io https://*.ingest.us.sentry.io https://*.ingest.de.sentry.io`,
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  // Enables a minimal, self-contained production build (used by the
  // Dockerfile). Doesn't affect the normal Vercel deployment path.
  output: "standalone",

  images: {
    remotePatterns: [
      // Django backend media — derived from NEXT_PUBLIC_API_URL above.
      {
        protocol: apiUrl.protocol.replace(":", "") as "http" | "https",
        hostname: apiUrl.hostname,
        port: apiUrl.port || undefined,
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },

  async headers() {
    // Only enforced in production builds — CSP in particular is easy
    // to fight with during local dev (HMR, devtools, etc.).
    if (!isProd) return [];

    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  // Source-map upload (release tracking) requires SENTRY_AUTH_TOKEN,
  // SENTRY_ORG, and SENTRY_PROJECT — all unset by default, so this stays
  // a no-op build-time wrapper until those are configured. Sentry error
  // capture itself (instrumentation.ts / instrumentation-client.ts)
  // works independently of this and only needs NEXT_PUBLIC_SENTRY_DSN.
  silent: true,
  sourcemaps: {
    disable: !process.env.SENTRY_AUTH_TOKEN,
  },
  telemetry: false,
});
