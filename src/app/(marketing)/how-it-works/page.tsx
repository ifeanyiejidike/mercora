import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Receipt,
  ShieldCheck,
  Store,
  Wallet,
} from "lucide-react";

const PAGE_TITLE = "How Mercora Works";
const PAGE_DESC =
  "Understand how Mercora helps merchants move from storefront setup to payments, receipts, and settlement visibility.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: "/how-it-works" },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    url: "/how-it-works",
    type: "website",
    siteName: "Mercora",
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESC,
  },
};

const steps = [
  {
    number: "01",
    title: "Set up your storefront",
    description:
      "Create a cleaner buyer-facing storefront, organise products, and establish a stronger path from discovery to purchase.",
    icon: Store,
  },
  {
    number: "02",
    title: "Start receiving orders and payments",
    description:
      "Use Mercora to support the transaction flow with better visibility into what has been ordered and what has been paid.",
    icon: CreditCard,
  },
  {
    number: "03",
    title: "Issue professional receipts",
    description:
      "Every successful transaction can be reflected with a more organised, buyer-friendly receipt experience.",
    icon: Receipt,
  },
  {
    number: "04",
    title: "Track settlement visibility",
    description:
      "Understand how funds move after payments so your business has clearer operational awareness and less confusion.",
    icon: Wallet,
  },
];

const merchantSide = [
  "Storefront goes live with stronger presentation",
  "Orders and payments become easier to follow",
  "Receipts reinforce professionalism",
  "Settlement visibility improves operational clarity",
];

const buyerSide = [
  "Cleaner browsing and purchase flow",
  "More confidence during checkout",
  "Better clarity after payment",
  "A more trustworthy overall experience",
];

export default function HowItWorksPage() {
  return (
    <main className="bg-neutral-1 text-white">
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0">
          <div className="absolute left-0 top-0 h-[360px] w-[360px] rounded-full bg-indigo-600/10 blur-3xl" />
          <div className="absolute right-0 top-[120px] h-[320px] w-[320px] rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_32%)]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
            <div className="max-w-3xl">
              <div className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
                How Mercora Works
              </div>

              <h1 className="mt-6 text-4xl font-bold leading-[1.03] tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
                From setup to settlement in one clearer merchant workflow.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                Mercora is designed to help merchants move from storefront setup to
                payments, receipts, and settlement visibility without depending on
                disconnected tools.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/book-demo"
                  className="inline-flex h-14 items-center justify-center rounded-2xl bg-[image:var(--brand-gradient)] px-7 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(79,70,229,0.38)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_rgba(79,70,229,0.42)]"
                >
                  Book Demo
                </Link>

                <Link
                  href="/features"
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border border-white/14 bg-white/[0.03] px-6 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white/[0.06]"
                >
                  Explore Features
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,18,38,0.88),rgba(8,12,28,0.96))] shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
              <div className="border-b border-white/10 px-6 py-5">
                <div className="text-sm font-medium text-slate-400">
                  Workflow Snapshot
                </div>
              </div>

              <div className="space-y-3 p-6 sm:p-7">
                {[
                  "Merchant storefront goes live",
                  "Buyer places order",
                  "Payment becomes visible",
                  "Receipt is generated",
                  "Settlement progress is tracked",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500/15 text-sm font-semibold text-indigo-200">
                      {index + 1}
                    </div>
                    <span className="text-sm text-slate-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/5 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="grid gap-6 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,18,38,0.82),rgba(8,12,28,0.96))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.2)] lg:grid-cols-[120px_72px_1fr]"
              >
                <div className="text-4xl font-bold tracking-[-0.05em] text-white">
                  {step.number}
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-500/25 bg-indigo-500/10 text-indigo-300">
                  <Icon className="h-6 w-6" />
                </div>

                <div>
                  <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white">
                    {step.title}
                  </h2>
                  <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-300">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-b border-white/5 py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.68),rgba(8,12,28,0.95))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.2)]">
            <div className="flex items-center gap-2 text-white">
              <ShieldCheck className="h-5 w-5 text-indigo-300" />
              <h2 className="text-2xl font-semibold tracking-[-0.03em]">
                Merchant side
              </h2>
            </div>

            <div className="mt-6 space-y-3">
              {merchantSide.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3"
                >
                  <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-300">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <p className="text-sm leading-7 text-slate-300">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.68),rgba(8,12,28,0.95))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.2)]">
            <div className="flex items-center gap-2 text-white">
              <ShieldCheck className="h-5 w-5 text-indigo-300" />
              <h2 className="text-2xl font-semibold tracking-[-0.03em]">
                Buyer side
              </h2>
            </div>

            <div className="mt-6 space-y-3">
              {buyerSide.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3"
                >
                  <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-300">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <p className="text-sm leading-7 text-slate-300">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/5 py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:px-8">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              Why This Matters
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
              Better structure creates better business confidence.
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Stronger buyer trust through cleaner presentation",
              "More visibility across payments and receipts",
              "Better understanding of what happens after payment",
              "A more organised operating layer for growth",
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-[22px] border border-white/10 bg-white/[0.03] p-5"
              >
                <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-300">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
                <p className="text-sm leading-7 text-slate-300">{item}</p>
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
                  Want the full walkthrough?
                </div>

                <h2 className="mt-4 max-w-xl text-3xl font-bold leading-tight tracking-[-0.04em] text-white sm:text-4xl">
                  See the full Mercora flow in a guided demo.
                </h2>
              </div>

              <p className="max-w-md text-sm leading-7 text-indigo-100/80">
                Walk through storefront setup, transaction flow, receipts, and
                settlement visibility with a clearer product demonstration.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <Link
                  href="/book-demo"
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-6 text-sm font-semibold text-ink transition duration-300 hover:bg-slate-100"
                >
                  Book Demo
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 text-sm font-semibold text-white transition duration-300 hover:bg-white/10"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}