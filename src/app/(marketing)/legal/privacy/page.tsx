import type { Metadata } from "next";
import Link from "next/link";
import { Mail, ShieldCheck } from "lucide-react";

const PAGE_TITLE = "Privacy Policy | Mercora";
const PAGE_DESC =
  "Read Mercora’s privacy policy covering data collection, use, retention, security, and contact information.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    url: "/privacy",
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
    title: "1. Introduction",
    text: "This Privacy Policy explains how Mercora collects, uses, stores, and protects information when you use our website, request a demo, contact us, or interact with our services.",
  },
  {
    title: "2. Information We Collect",
    text: "We may collect information you provide directly, including your name, email address, company name, enquiry details, and any information submitted through forms, demo requests, or support messages.",
  },
  {
    title: "3. How We Use Information",
    text: "We use collected information to respond to enquiries, provide demos, support onboarding and product communication, improve our public website experience, and maintain the reliability and security of the platform.",
  },
  {
    title: "4. Cookies and Analytics",
    text: "Mercora may use cookies, analytics tools, and related technologies to understand site usage, improve performance, and measure engagement across our public pages.",
  },
  {
    title: "5. Sharing of Information",
    text: "We do not sell personal information. We may share data with trusted service providers or infrastructure partners where necessary to operate the website, deliver services, process communication, or maintain security and compliance.",
  },
  {
    title: "6. Data Retention",
    text: "We retain information only for as long as reasonably necessary to support legitimate business, operational, legal, or security purposes.",
  },
  {
    title: "7. Security",
    text: "Mercora uses reasonable technical and organisational measures to protect information against unauthorised access, misuse, or loss. No online system can guarantee absolute security, but protection of merchant and visitor data is taken seriously.",
  },
  {
    title: "8. Your Rights",
    text: "Depending on your jurisdiction, you may have rights to request access, correction, deletion, or limitation of certain personal data. Requests can be directed to our support contact.",
  },
  {
    title: "9. Third-Party Services",
    text: "Our site or platform may integrate third-party services such as analytics, payment infrastructure, scheduling tools, or communication services. Their handling of data may also be governed by their own privacy policies.",
  },
  {
    title: "10. Policy Updates",
    text: "We may update this Privacy Policy from time to time to reflect product, legal, operational, or security changes. Continued use of the site after updates may constitute acceptance of the revised policy.",
  },
  {
    title: "11. Contact",
    text: "If you have any privacy-related questions or requests, please contact Mercora through the support details provided on the site.",
  },
];

export default function PrivacyPage() {
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
              <ShieldCheck className="h-4 w-4" />
              Privacy Policy
            </div>

            <h1 className="mt-6 text-4xl font-bold leading-[1.03] tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
              Privacy, clarity, and responsible data handling.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              This page provides a strong public-facing privacy policy structure for Mercora.
              It should still be reviewed before final production use.
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
              How Mercora handles information.
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
                <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/85">
                  Questions about privacy?
                </div>

                <h2 className="mt-4 max-w-xl text-3xl font-bold leading-tight tracking-[-0.04em] text-white sm:text-4xl">
                  Reach out for clarification.
                </h2>
              </div>

              <p className="max-w-md text-sm leading-7 text-indigo-100/80">
                For privacy-related questions, data requests, or clarification, contact Mercora directly.
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