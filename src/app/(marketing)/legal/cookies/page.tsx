import type { Metadata } from "next";
import Link from "next/link";
import { Cookie, Mail, ShieldCheck } from "lucide-react";

const PAGE_TITLE = "Cookie Policy | Mercora";
const PAGE_DESC =
  "Read Mercora’s cookie policy covering essential cookies, analytics, preferences, and cookie management.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: "/legal/cookies" },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    url: "/legal/cookies",
    type: "website",
    siteName: "Mercora",
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESC,
  },
};

const sections = [
  {
    title: "1. What this policy covers",
    text: "This Cookie Policy explains how Mercora uses cookies and similar technologies across its public website and related digital experiences. It is intended to help visitors understand what these technologies do and how they affect browsing, performance, and site preferences.",
  },
  {
    title: "2. What cookies are",
    text: "Cookies are small text files stored on a device when a user visits a website. They help a site remember preferences, maintain session behavior, improve performance, and support analytics or feature delivery.",
  },
  {
    title: "3. Why Mercora uses cookies",
    text: "Mercora may use cookies and related technologies to keep the site functioning correctly, improve usability, understand visitor behavior, support analytics, and deliver a more stable and responsive public experience.",
  },
  {
    title: "4. Types of cookies we may use",
    text: "These may include essential cookies for core site behavior, performance or analytics cookies for understanding usage patterns, and preference cookies for remembering site settings or user choices where applicable.",
  },
  {
    title: "5. Essential cookies",
    text: "Essential cookies help core parts of the site operate correctly. Without them, certain features, navigation flows, or security-related behavior may not function as intended.",
  },
  {
    title: "6. Analytics and performance cookies",
    text: "Mercora may use analytics-related cookies to understand how visitors interact with public pages, which sections are most useful, where performance can be improved, and how overall site experience can be made stronger.",
  },
  {
    title: "7. Preference cookies",
    text: "Preference cookies may be used to remember non-critical choices such as language, interface behavior, or other settings that improve repeat visit experience.",
  },
  {
    title: "8. Third-party technologies",
    text: "Some cookies or similar technologies may come from trusted third-party services used for analytics, communication, scheduling, performance measurement, or embedded functionality. Their handling of data may also be governed by their own policies.",
  },
  {
    title: "9. Managing cookies",
    text: "Most browsers allow users to review, block, or delete cookies. If cookies are disabled, some parts of the site may become less functional or less convenient to use.",
  },
  {
    title: "10. Policy updates",
    text: "Mercora may update this Cookie Policy from time to time to reflect technical, legal, operational, or product changes. Continued use of the site after an update may indicate acceptance of the revised policy.",
  },
  {
    title: "11. Contact",
    text: "For questions about Mercora’s use of cookies or related technologies, visitors can reach out through the support contact provided on the site.",
  },
];

export default function CookiesPage() {
  return (
    <main className="bg-neutral-1 text-white">
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0">
          <div className="absolute left-0 top-0 h-[340px] w-[340px] rounded-full bg-indigo-600/10 blur-3xl" />
          <div className="absolute right-0 top-[120px] h-[300px] w-[300px] rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_32%)]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
              <Cookie className="h-4 w-4" />
              Cookie Policy
            </div>

            <h1 className="mt-6 text-4xl font-bold leading-[1.03] tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
              How Mercora uses cookies and similar technologies.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              This page explains how Mercora may use cookies to support functionality,
              performance, analytics, and a more stable public-site experience.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-white/5 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.66),rgba(8,12,28,0.95))] p-6">
            <p className="text-sm leading-7 text-slate-300">
              Effective date: <span className="font-semibold text-white">[Insert date]</span>
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Last updated: <span className="font-semibold text-white">[Insert date]</span>
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-white/5 py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:px-8">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              Policy Sections
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
              Cookie use, control, and transparency.
            </h2>
          </div>

          <div className="space-y-4">
            {sections.map((section) => (
              <div
                key={section.title}
                className="rounded-[22px] border border-white/10 bg-white/[0.03] p-5"
              >
                <h3 className="text-lg font-semibold text-white">{section.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{section.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[28px] border border-indigo-500/20 bg-[linear-gradient(135deg,#2e1c8c_0%,#1f2d7a_58%,#1f3f8f_100%)] px-6 py-8 shadow-[0_20px_60px_rgba(44,34,130,0.35)] sm:px-8 lg:px-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr_auto] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/85">
                  <ShieldCheck className="h-4 w-4" />
                  Need clarification?
                </div>

                <h2 className="mt-4 max-w-xl text-3xl font-bold leading-tight tracking-[-0.04em] text-white sm:text-4xl">
                  Reach out about privacy or cookie use.
                </h2>
              </div>

              <p className="max-w-md text-sm leading-7 text-indigo-100/80">
                If you have questions about how Mercora handles cookies or related
                technologies, contact us directly.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <Link
                  href="/contact"
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-6 text-sm font-semibold text-ink transition duration-300 hover:bg-slate-100"
                >
                  Contact Us
                </Link>

                <a
                  href="mailto:support@mercora.com"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 text-sm font-semibold text-white transition duration-300 hover:bg-white/10"
                >
                  <Mail className="h-4 w-4" />
                  support@mercora.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}