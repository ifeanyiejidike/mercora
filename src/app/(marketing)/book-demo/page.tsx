import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Mail,
  MessageSquareMore,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const PAGE_TITLE = "Book a Demo | Mercora";
const PAGE_DESC =
  "Book a Mercora demo to explore storefronts, payments, receipts, analytics, and settlement visibility.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: "/book-demo" },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    url: "/book-demo",
    type: "website",
    siteName: "Mercora",
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESC,
  },
};

const demoPoints = [
  "Walk through the storefront experience",
  "Understand payment and receipt flow",
  "See how settlement visibility works",
  "Discuss the right plan for your business",
];

const demoTypes = [
  {
    title: "Product walkthrough",
    text: "Best for understanding the platform clearly from storefront setup through transactions and operational visibility.",
  },
  {
    title: "Pricing fit discussion",
    text: "Best for merchants deciding between Starter, Growth, and Pro based on real workflow needs.",
  },
  {
    title: "Implementation conversation",
    text: "Best for teams that want to discuss setup direction, launch approach, and platform readiness.",
  },
];

const steps = [
  {
    title: "Share your business context",
    text: "Tell us about your business stage, what you sell, and what you need Mercora to support.",
  },
  {
    title: "See the relevant workflow",
    text: "We focus the walkthrough on the parts that matter most to your current operations and growth stage.",
  },
  {
    title: "Leave with clear next steps",
    text: "You should leave with a better understanding of fit, pricing direction, and the right next move.",
  },
];

export default function BookDemoPage() {
  return (
    <main className="bg-neutral-1 text-white">
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0">
          <div className="absolute left-0 top-0 h-[360px] w-[360px] rounded-full bg-indigo-600/10 blur-3xl" />
          <div className="absolute right-0 top-[120px] h-[320px] w-[320px] rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_32%)]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
          <div className="grid items-start gap-12 lg:grid-cols-[0.96fr_1.04fr]">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
                <CalendarDays className="h-4 w-4" />
                Book a Demo
              </div>

              <h1 className="mt-6 text-4xl font-bold leading-[1.03] tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
                See Mercora clearly before you commit.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                Book a guided walkthrough to explore storefronts, payments, receipts,
                analytics, and settlement visibility in a way that fits your business stage.
              </p>

              <div className="mt-8 space-y-3">
                {demoPoints.map((item) => (
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

              <div className="mt-8 flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-slate-300">
                  <Clock3 className="h-4 w-4 text-indigo-300" />
                  Usually 20–30 minutes
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-slate-300">
                  <MessageSquareMore className="h-4 w-4 text-indigo-300" />
                  Focused on your workflow
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.74),rgba(8,12,28,0.96))] shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
              <div className="border-b border-white/10 px-6 py-5">
                <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white">
                  Request a demo
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  Share a few details so the conversation can be relevant and efficient.
                </p>
              </div>

              <form className="space-y-5 p-6 sm:p-7">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="mb-2 block text-sm font-medium text-slate-200">
                      First name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="John"
                      className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-indigo-400/50 focus:bg-white/[0.06]"
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="mb-2 block text-sm font-medium text-slate-200">
                      Last name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Doe"
                      className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-indigo-400/50 focus:bg-white/[0.06]"
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-200">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@company.com"
                      className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-indigo-400/50 focus:bg-white/[0.06]"
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="mb-2 block text-sm font-medium text-slate-200">
                      Company
                    </label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      placeholder="Your business"
                      className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-indigo-400/50 focus:bg-white/[0.06]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="businessStage" className="mb-2 block text-sm font-medium text-slate-200">
                    Business stage
                  </label>
                  <select
                    id="businessStage"
                    name="businessStage"
                    defaultValue=""
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-indigo-400/50 focus:bg-white/[0.06]"
                  >
                    <option value="" disabled className="bg-neutral-2 text-slate-300">
                      Select your stage
                    </option>
                    <option value="starting" className="bg-neutral-2 text-slate-300">
                      Getting started
                    </option>
                    <option value="growing" className="bg-neutral-2 text-slate-300">
                      Growing
                    </option>
                    <option value="advanced" className="bg-neutral-2 text-slate-300">
                      More advanced
                    </option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium text-slate-200">
                    What do you want to see?
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    placeholder="Tell us what matters most for your demo..."
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400/50 focus:bg-white/[0.06]"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-[image:var(--brand-gradient)] px-6 text-sm font-semibold text-white shadow-[0_16px_38px_rgba(79,70,229,0.34)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(79,70,229,0.42)]"
                >
                  Request Demo
                </button>

                <div className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4">
                  <p className="text-xs leading-6 text-slate-400">
                    This is the public-page form UI. Connect your backend action or API route later.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/5 py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:px-8">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              What Demo Type Fits?
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
              Different merchants need different conversations.
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {demoTypes.map((item) => (
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

      <section className="border-b border-white/5 py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:px-8">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              What Happens Next
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
              A simple, clear process.
            </h2>
          </div>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="grid gap-5 rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,18,38,0.82),rgba(8,12,28,0.96))] p-5 sm:grid-cols-[72px_1fr]"
              >
                <div className="text-4xl font-bold tracking-[-0.05em] text-white">
                  0{index + 1}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{step.text}</p>
                </div>
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
                  Need a direct response?
                </div>

                <h2 className="mt-4 max-w-xl text-3xl font-bold leading-tight tracking-[-0.04em] text-white sm:text-4xl">
                  Prefer to reach out first?
                </h2>
              </div>

              <p className="max-w-md text-sm leading-7 text-indigo-100/80">
                You can also send a direct enquiry if you have a specific workflow,
                pricing, or implementation question.
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
                  Email Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}