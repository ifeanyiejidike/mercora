import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, Mail, RotateCcw } from "lucide-react";

const PAGE_TITLE = "Refund Policy | Mercora";
const PAGE_DESC =
  "Read Mercora’s refund policy covering subscription billing, managed payment flows, review conditions, and support contact.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: "/legal/refunds" },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    url: "/legal/refunds",
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
    title: "1. Scope of this policy",
    text: "This Refund Policy explains how Mercora may handle refund-related requests associated with subscriptions, service charges, or certain platform-managed payment situations where applicable.",
  },
  {
    title: "2. Subscription charges",
    text: "Subscription fees may generally cover access to software, platform features, and operational capability over the billing period purchased. Unless otherwise agreed, subscription charges are typically reviewed in relation to service access already granted.",
  },
  {
    title: "3. Managed payment considerations",
    text: "Where Mercora supports managed payment flows, refund handling may depend on transaction status, settlement stage, merchant policy, operational review, and any payment-provider constraints tied to that transaction.",
  },
  {
    title: "4. Merchant-specific product refunds",
    text: "Where goods or services are sold by a merchant using Mercora, product-level refund outcomes may also depend on that merchant’s own refund, delivery, or service policy in addition to platform rules.",
  },
  {
    title: "5. Review basis",
    text: "Refund requests may be reviewed based on timing, payment status, whether platform access has already been used, whether a transaction has settled, and whether there is evidence of technical or operational error.",
  },
  {
    title: "6. Non-refundable situations",
    text: "Some fees, already-consumed service periods, completed configuration work, or settled operational charges may not be refundable except where required by law or where Mercora determines a refund is appropriate.",
  },
  {
    title: "7. Disputes and chargebacks",
    text: "If a transaction is disputed through a payment provider or financial institution, Mercora may review the matter alongside relevant transaction, receipt, order, and settlement records.",
  },
  {
    title: "8. Processing timelines",
    text: "Where a refund is approved, processing time may depend on the payment method used, provider timelines, settlement status, and financial institution handling.",
  },
  {
    title: "9. Policy updates",
    text: "Mercora may update this Refund Policy over time to reflect changes in platform operations, pricing structure, provider relationships, legal requirements, or commercial terms.",
  },
  {
    title: "10. Contact",
    text: "Questions about refunds, transaction review, billing, or merchant-specific payment handling should be directed to Mercora support.",
  },
];

const principles = [
  "Requests should be reviewed clearly and fairly",
  "Transaction status matters",
  "Settlement stage matters",
  "Merchant policy may also affect outcome",
];

export default function RefundsPage() {
  return (
    <main className="bg-neutral-1 text-white">
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0">
          <div className="absolute left-0 top-0 h-[340px] w-[340px] rounded-full bg-indigo-600/10 blur-3xl" />
          <div className="absolute right-0 top-[120px] h-[300px] w-[300px] rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_32%)]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
                <RotateCcw className="h-4 w-4" />
                Refund Policy
              </div>

              <h1 className="mt-6 text-4xl font-bold leading-[1.03] tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
                A clearer refund policy for subscriptions and platform-managed flows.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                This page outlines how Mercora may review refund-related requests
                across billing, transactions, merchant workflows, and operational charges.
              </p>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.78),rgba(8,12,28,0.96))] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
              <div className="text-sm font-medium text-slate-400">
                Review principles
              </div>

              <div className="mt-5 space-y-3">
                {principles.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-300">
                      <BadgeCheck className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-sm text-slate-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>
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
              Refund review, billing context, and merchant considerations.
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
                  Need help with a refund-related question?
                </div>

                <h2 className="mt-4 max-w-xl text-3xl font-bold leading-tight tracking-[-0.04em] text-white sm:text-4xl">
                  Contact support for transaction review.
                </h2>
              </div>

              <p className="max-w-md text-sm leading-7 text-indigo-100/80">
                For billing questions, platform fees, or transaction review, contact Mercora directly.
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