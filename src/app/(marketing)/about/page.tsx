import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Globe2,
  Layers3,
  Receipt,
  ShieldCheck,
  Store,
  Wallet,
} from "lucide-react";

const PAGE_TITLE = "About Mercora";
const PAGE_DESC =
  "Mercora helps modern merchants launch storefronts, manage payments, issue receipts, and gain clearer settlement visibility with a more professional commerce operating system.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: "/about" },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    url: "/about",
    type: "website",
    siteName: "Mercora",
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESC,
  },
};

const pillars = [
  {
    title: "Commerce infrastructure, not scattered tools",
    description:
      "Mercora is built to bring storefront presentation, payments, receipts, and settlement visibility into one cleaner operating system.",
    icon: Layers3,
  },
  {
    title: "Designed for trust",
    description:
      "From how a storefront is presented to how receipts are delivered, the platform is shaped to help merchants look more credible and operationally organised.",
    icon: ShieldCheck,
  },
  {
    title: "Built for modern African merchants",
    description:
      "Mercora is designed around the realities of growing businesses that need stronger transaction clarity, better buyer confidence, and more operational control.",
    icon: Globe2,
  },
];

const values = [
  {
    title: "Clarity",
    text: "Merchants should clearly understand what was ordered, what was paid, what was receipted, and what is settling.",
  },
  {
    title: "Professionalism",
    text: "Commerce systems should help businesses feel organised, polished, and trustworthy in the eyes of buyers.",
  },
  {
    title: "Control",
    text: "Growth becomes easier when merchants have stronger visibility into their operations instead of relying on guesswork.",
  },
  {
    title: "Scalability",
    text: "The platform should support merchants from clean setup through stronger, more mature business workflows.",
  },
];

const capabilityCards = [
  {
    label: "Storefronts",
    title: "Launch a cleaner buyer-facing experience.",
    text: "Mercora helps merchants present products, categories, and checkout paths more professionally.",
    icon: Store,
  },
  {
    label: "Payments",
    title: "Track transaction flow with more confidence.",
    text: "Support clearer payment visibility so merchants better understand what has been completed and what still needs attention.",
    icon: Wallet,
  },
  {
    label: "Receipts",
    title: "Make every transaction feel more organised.",
    text: "Professional receipts reinforce trust and help the business feel more structured after payment.",
    icon: Receipt,
  },
  {
    label: "Operations",
    title: "Support growth with stronger business structure.",
    text: "Mercora is built to support real merchant operations, not just a storefront surface.",
    icon: Building2,
  },
];

export default function AboutPage() {
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
                About Mercora
              </div>

              <h1 className="mt-6 text-4xl font-bold leading-[1.03] tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
                Built to help merchants operate with more clarity, trust, and control.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                Mercora exists for merchants that need more than a basic storefront.
                It is designed to help businesses present themselves better, handle
                transactions more cleanly, issue structured receipts, and understand
                how money moves after payment.
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

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.78),rgba(8,12,28,0.96))] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.24)] sm:col-span-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-500/25 bg-indigo-500/10 text-indigo-300">
                  <Layers3 className="h-6 w-6" />
                </div>

                <h2 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-white">
                  Why Mercora was built
                </h2>

                <p className="mt-3 text-sm leading-7 text-slate-300">
                  Too many merchants are forced to piece together storefronts,
                  payments, receipts, and operational tracking across disconnected
                  tools. Mercora is built to make that experience cleaner, more
                  professional, and easier to manage.
                </p>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                <div className="text-3xl font-bold tracking-[-0.04em] text-white">
                  Trust
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Stronger buyer confidence through cleaner public and post-payment experiences.
                </p>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                <div className="text-3xl font-bold tracking-[-0.04em] text-white">
                  Clarity
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Better visibility into business operations, not just a payment event.
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
              Core Principles
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
              The principles shaping the platform.
            </h2>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {pillars.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.62),rgba(8,12,28,0.94))] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1 hover:border-indigo-500/25"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-500/25 bg-indigo-500/10 text-indigo-300">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-6 text-xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-white/5 py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:px-8">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              What Mercora Supports
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
              The commerce capabilities merchants need most.
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {capabilityCards.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-[22px] border border-white/10 bg-white/[0.03] p-5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="mt-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    {item.label}
                  </div>
                  <h3 className="mt-2 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-white/5 py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:px-8">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              What We Value
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
              The standards behind the experience.
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {values.map((item) => (
              <div
                key={item.title}
                className="rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,18,38,0.78),rgba(8,12,28,0.96))] p-5"
              >
                <div className="flex items-center gap-2 text-white">
                  <BadgeCheck className="h-4 w-4 text-indigo-300" />
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-300">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[28px] border border-indigo-500/20 bg-[linear-gradient(135deg,#2e1c8c_0%,#1f2d7a_58%,#1f3f8f_100%)] px-6 py-8 shadow-[0_20px_60px_rgba(44,34,130,0.35)] sm:px-8 lg:px-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.75fr_auto] lg:items-center">
              <div>
                <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/85">
                  Want to see the platform clearly?
                </div>

                <h2 className="mt-4 max-w-xl text-3xl font-bold leading-tight tracking-[-0.04em] text-white sm:text-4xl">
                  Book a walkthrough and see how Mercora fits your business.
                </h2>
              </div>

              <p className="max-w-md text-sm leading-7 text-indigo-100/80">
                Explore how Mercora supports storefront setup, payment visibility,
                receipts, and stronger merchant operations.
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