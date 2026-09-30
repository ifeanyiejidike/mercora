import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, HelpCircle, MessageSquareMore } from "lucide-react";

const PAGE_TITLE = "Mercora FAQ";
const PAGE_DESC =
  "Frequently asked questions about Mercora storefronts, payments, receipts, settlement visibility, onboarding, and demos.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: "/faq" },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    url: "/faq",
    type: "website",
    siteName: "Mercora",
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESC,
  },
};

const faqGroups = [
  {
    title: "Getting Started",
    items: [
      {
        q: "What is Mercora?",
        a: "Mercora is a commerce operating system that helps merchants manage storefront presentation, payments, receipts, and settlement visibility in one cleaner platform.",
      },
      {
        q: "Who is Mercora built for?",
        a: "Mercora is designed for merchants who need stronger structure, better buyer trust, and clearer day-to-day commerce operations.",
      },
      {
        q: "Can I book a demo before getting started?",
        a: "Yes. Booking a demo is one of the best ways to understand how Mercora fits your stage, workflow, and operational needs.",
      },
    ],
  },
  {
    title: "Payments & Receipts",
    items: [
      {
        q: "Does Mercora only help with storefronts?",
        a: "No. Mercora goes beyond storefront presentation by also supporting payments, receipts, analytics, and settlement visibility.",
      },
      {
        q: "Why are receipts important in Mercora?",
        a: "Receipts help transactions feel more structured and professional. They reinforce trust and improve clarity for both buyers and merchants.",
      },
      {
        q: "What does settlement visibility mean?",
        a: "Settlement visibility means understanding how funds move after payments are made, including what is pending and what has already been completed.",
      },
    ],
  },
  {
    title: "Growth & Operations",
    items: [
      {
        q: "Is Mercora suitable for growing businesses?",
        a: "Yes. Mercora is designed to support merchants from cleaner setup through stronger, more mature operational workflows.",
      },
      {
        q: "Do I need technical knowledge to use Mercora?",
        a: "Mercora is intended to simplify commerce operations, not make them more technical. A guided setup or demo can help you understand the flow clearly.",
      },
      {
        q: "Can a merchant start small and upgrade later?",
        a: "Yes. Mercora is structured so merchants can begin with a simpler setup and move into stronger controls, reporting, and workflows over time.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <main className="bg-neutral-1 text-white">
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0">
          <div className="absolute left-0 top-0 h-[360px] w-[360px] rounded-full bg-indigo-600/10 blur-3xl" />
          <div className="absolute right-0 top-[120px] h-[320px] w-[320px] rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_32%)]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
              <HelpCircle className="h-4 w-4" />
              FAQ
            </div>

            <h1 className="mt-6 text-4xl font-bold leading-[1.03] tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
              Questions merchants usually ask before getting started.
            </h1>

            <p className="mt-6 text-base leading-8 text-slate-300 sm:text-lg">
              Clear answers about the platform, workflow, onboarding, and how Mercora
              supports storefronts, payments, receipts, and operations.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-white/5 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {faqGroups.map((group) => (
              <section
                key={group.title}
                className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.66),rgba(8,12,28,0.95))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.2)]"
              >
                <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white">
                  {group.title}
                </h2>

                <div className="mt-6 space-y-4">
                  {group.items.map((item, index) => (
                    <details
                      key={item.q}
                      className="group rounded-[20px] border border-white/8 bg-white/[0.03] p-4"
                    >
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-xs font-semibold text-indigo-200">
                            {index + 1}
                          </div>
                          <span className="text-sm font-semibold leading-6 text-white">
                            {item.q}
                          </span>
                        </div>

                        <span className="mt-1 text-slate-400 transition group-open:rotate-45">
                          +
                        </span>
                      </summary>

                      <p className="pl-10 pt-4 text-sm leading-7 text-slate-300">
                        {item.a}
                      </p>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/5 py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:px-8">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              Still Deciding?
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
              Get clarity before you commit.
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                title: "Platform fit",
                text: "Understand whether Mercora matches your current stage, workflow, and operational needs.",
              },
              {
                title: "Pricing questions",
                text: "Get clear direction on which plan makes sense based on the level of control and visibility you need.",
              },
              {
                title: "Implementation questions",
                text: "Ask about setup direction, demos, or how the platform supports your specific business flow.",
              },
            ].map((item) => (
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
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/85">
                  <MessageSquareMore className="h-4 w-4" />
                  Need a direct answer?
                </div>

                <h2 className="mt-4 max-w-xl text-3xl font-bold leading-tight tracking-[-0.04em] text-white sm:text-4xl">
                  Speak with us and get clearer direction.
                </h2>
              </div>

              <p className="max-w-md text-sm leading-7 text-indigo-100/80">
                If your question is specific to your business workflow, pricing fit,
                or implementation direction, the best next step is a guided conversation.
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
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 text-sm font-semibold text-white transition duration-300 hover:bg-white/10"
                >
                  Contact Us
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}