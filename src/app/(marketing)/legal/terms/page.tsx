import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Mail } from "lucide-react";

const PAGE_TITLE = "Terms of Service | Mercora";
const PAGE_DESC =
  "Read Mercora’s terms of service covering use of the website, demos, platform access, responsibilities, and legal limitations.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: "/terms" },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    url: "/terms",
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
    title: "1. Acceptance of Terms",
    text: "By accessing or using Mercora’s website, demos, or services, you agree to these Terms of Service. If you do not agree, you should not use the site or services.",
  },
  {
    title: "2. Services",
    text: "Mercora provides commerce-related software and website functionality intended to support storefronts, payments, receipts, analytics, and operational visibility. Specific features may vary by plan, rollout stage, or commercial agreement.",
  },
  {
    title: "3. Eligibility and Account Responsibility",
    text: "You are responsible for ensuring that any information you provide is accurate and that any account credentials or access permissions connected to your use of the platform are handled securely.",
  },
  {
    title: "4. Acceptable Use",
    text: "You agree not to misuse the website or services, interfere with platform operation, attempt unauthorized access, or use Mercora in a way that violates applicable law or harms other users, merchants, or infrastructure.",
  },
  {
    title: "5. Commercial Terms",
    text: "Pricing, plan structure, managed payment fees, and onboarding terms may depend on the specific commercial arrangement agreed between Mercora and the merchant.",
  },
  {
    title: "6. Intellectual Property",
    text: "Unless otherwise stated, Mercora retains rights in the platform, public website, branding, design systems, software, and related content. Use of the services does not transfer ownership of Mercora intellectual property.",
  },
  {
    title: "7. Third-Party Services",
    text: "Mercora may rely on or integrate with third-party providers such as payment infrastructure, analytics, hosting, communication, or scheduling services. Availability and behavior of those services may affect the overall experience.",
  },
  {
    title: "8. Availability and Changes",
    text: "Mercora may improve, modify, suspend, or discontinue parts of the website or services at any time, including where required for operational, technical, legal, or commercial reasons.",
  },
  {
    title: "9. Disclaimers",
    text: "The website and services may be provided on an 'as is' and 'as available' basis to the extent permitted by law. Mercora does not guarantee uninterrupted availability, absolute accuracy, or error-free operation at all times.",
  },
  {
    title: "10. Limitation of Liability",
    text: "To the extent permitted by law, Mercora will not be liable for indirect, incidental, special, consequential, or punitive damages arising from use of the website or services.",
  },
  {
    title: "11. Termination",
    text: "Mercora may suspend or terminate access where misuse, security concerns, breach of terms, or operational risk make such action necessary.",
  },
  {
    title: "12. Governing Terms and Updates",
    text: "These terms may be updated from time to time. Continued use of the website or services after updates may constitute acceptance of the revised terms.",
  },
];

export default function TermsPage() {
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
              <FileText className="h-4 w-4" />
              Terms of Service
            </div>

            <h1 className="mt-6 text-4xl font-bold leading-[1.03] tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
              Clear terms for use of the Mercora website and services.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              This is a strong public-facing terms page structure for Mercora.
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
              Terms Sections
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
              The legal structure behind use of the platform.
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
                  Questions about these terms?
                </div>

                <h2 className="mt-4 max-w-xl text-3xl font-bold leading-tight tracking-[-0.04em] text-white sm:text-4xl">
                  Reach out for clarification.
                </h2>
              </div>

              <p className="max-w-md text-sm leading-7 text-indigo-100/80">
                For questions about these terms, platform usage, or commercial direction, contact Mercora directly.
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