import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BadgeCheck,
  Building2,
  CreditCard,
  Receipt,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  Wallet,
} from "lucide-react";

const PAGE_TITLE = "Mercora Features";
const PAGE_DESC =
  "Explore Mercora’s storefront, payments, receipts, analytics, and settlement visibility tools for modern merchants.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: "/features" },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    url: "/features",
    type: "website",
    siteName: "Mercora",
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESC,
  },
};

const featureCards = [
  {
    title: "Storefronts",
    description:
      "Launch premium storefronts that present products clearly and create a stronger path from discovery to checkout.",
    icon: Store,
  },
  {
    title: "Products & Orders",
    description:
      "Manage catalogue structure, product visibility, and order flow with a cleaner operating experience.",
    icon: ShoppingBag,
  },
  {
    title: "Payments",
    description:
      "Support merchant-direct and managed checkout flows with clearer payment visibility and stronger transaction structure.",
    icon: CreditCard,
  },
  {
    title: "Receipts",
    description:
      "Issue structured, professional receipts that make transactions feel more credible and more organised.",
    icon: Receipt,
  },
  {
    title: "Settlement Visibility",
    description:
      "Understand what is pending, what is completed, and how money is moving after payment.",
    icon: Wallet,
  },
  {
    title: "Analytics",
    description:
      "See clearer performance signals around sales, orders, and payment outcomes without relying on guesswork.",
    icon: BarChart3,
  },
];

const highlights = [
  {
    eyebrow: "Trust",
    title: "A stronger buyer-facing experience",
    text: "Mercora is designed to help merchants look more credible from the first interaction through checkout and after payment.",
    icon: ShieldCheck,
  },
  {
    eyebrow: "Structure",
    title: "Operational clarity beyond just payments",
    text: "The platform helps merchants understand not only that a payment happened, but what followed it — including receipts and settlement visibility.",
    icon: Building2,
  },
  {
    eyebrow: "Growth",
    title: "A setup that can support the next stage",
    text: "Merchants can start with a cleaner foundation and move toward stronger controls, better visibility, and more serious workflows over time.",
    icon: Sparkles,
  },
];

const merchantTypes = [
  {
    title: "Getting started merchants",
    text: "Need a clean storefront foundation, basic payment structure, and professional transaction handling without complexity.",
  },
  {
    title: "Growing merchants",
    text: "Need better branding, better analytics, more product capacity, and a clearer operational view as activity increases.",
  },
  {
    title: "Serious operators",
    text: "Need team workflows, stronger reporting, deeper control, and more scalable commercial structure.",
  },
];

export default function FeaturesPage() {
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
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
                <Sparkles className="h-4 w-4" />
                Mercora Features
              </div>

              <h1 className="mt-6 text-4xl font-bold leading-[1.03] tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
                Built to support the full commerce flow, not just one part of it.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                Mercora brings storefronts, payments, receipts, analytics, and
                settlement visibility into one cleaner system designed for modern merchants.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/book-demo"
                  className="inline-flex h-14 items-center justify-center rounded-2xl bg-[image:var(--brand-gradient)] px-7 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(79,70,229,0.38)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_rgba(79,70,229,0.42)]"
                >
                  Book Demo
                </Link>

                <Link
                  href="/pricing"
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border border-white/14 bg-white/[0.03] px-6 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white/[0.06]"
                >
                  View Pricing
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.78),rgba(8,12,28,0.96))] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.24)] sm:col-span-2">
                <div className="text-sm font-medium text-slate-400">
                  Platform value
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {[
                    "Premium storefront presentation",
                    "Professional receipt workflows",
                    "Better payment visibility",
                    "Clearer settlement understanding",
                  ].map((item) => (
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

              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                <div className="text-3xl font-bold tracking-[-0.04em] text-white">
                  Trust
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Cleaner buyer confidence from storefront to receipt.
                </p>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                <div className="text-3xl font-bold tracking-[-0.04em] text-white">
                  Clarity
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Better visibility into what happens after payment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/5 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              Core Capabilities
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
              The features merchants actually need.
            </h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featureCards.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.62),rgba(8,12,28,0.94))] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1 hover:border-indigo-500/25"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-500/25 bg-indigo-500/10 text-indigo-300">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-6 text-xl font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-white/5 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
          {highlights.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="grid gap-6 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,18,38,0.82),rgba(8,12,28,0.96))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.2)] lg:grid-cols-[84px_1fr]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-500/25 bg-indigo-500/10 text-indigo-300">
                  <Icon className="h-6 w-6" />
                </div>

                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    {item.eyebrow}
                  </div>
                  <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white">
                    {item.title}
                  </h3>
                  <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-300">
                    {item.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-b border-white/5 py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:px-8">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              Merchant Fit
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
              Designed to support different growth stages.
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {merchantTypes.map((item) => (
              <div
                key={item.title}
                className="rounded-[22px] border border-white/10 bg-white/[0.03] p-5"
              >
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{item.text}</p>
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
                  Ready to explore the platform?
                </div>

                <h2 className="mt-4 max-w-xl text-3xl font-bold leading-tight tracking-[-0.04em] text-white sm:text-4xl">
                  See how Mercora fits your storefront and operations.
                </h2>
              </div>

              <p className="max-w-md text-sm leading-7 text-indigo-100/80">
                Walk through the platform and see how Mercora supports your business
                from setup to stronger merchant operations.
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