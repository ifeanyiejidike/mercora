import type { MetadataRoute } from "next";

// Was hardcoded to "https://www.mercora.com" — didn't match
// NEXT_PUBLIC_SITE_URL used elsewhere, so sitemap URLs would have been
// wrong in production.
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const publicRoutes = [
  "",
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
  "/login",
  "/sign-up",
  "/verify-email",
  "/forgot-password",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route.startsWith("/legal/") ? 0.5 : 0.8,
  }));
}