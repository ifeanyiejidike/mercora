import type { MetadataRoute } from "next";

// Same fix as sitemap.ts — was hardcoded to a domain that didn't match
// NEXT_PUBLIC_SITE_URL used everywhere else.
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/features",
          "/pricing",
          "/how-it-works",
          "/about",
          "/contact",
          "/faq",
          "/book-demo",
          "/legal/privacy",
          "/legal/terms",
          "/legal/cookies",
          "/legal/refunds",
          "/sign-in",
          "/sign-up",
          "/verify-email",
          "/forgot-password",
        ],
        disallow: [
          "/onboarding/",
          "/platform/",
          "/dashboard/",
          "/_stores/",
          "/api/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}