/** @type {import('next-sitemap').IConfig} */
module.exports = {
  // Was hardcoded to a stale domain (gravityconcepts.vercel.app) that
  // didn't match NEXT_PUBLIC_SITE_URL in .env.production
  // (gravity-concepts.com) — sitemap URLs would have been wrong in
  // production. Now derived from the same env var everything else uses.
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  outDir: "./public",
  changefreq: "daily",
  priority: 0.7,
  autoLastmod: true, // <-- ensures <lastmod> is added automatically
  exclude: ["/404", "/_app", "/_document", "/_error"],
};
