import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, MessageSquareMore, Phone, SendHorizonal } from "lucide-react";

const PAGE_TITLE = "Contact Mercora";
const PAGE_DESC =
  "Contact Mercora for demos, pricing conversations, platform questions, and public-site enquiries.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    url: "/contact",
    type: "website",
    siteName: "Mercora",
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESC,
  },
};

const contactCards = [
  {
    title: "Email",
    value: "support@mercora.com",
    href: "mailto:support@mercora.com",
    icon: Mail,
  },
  {
    title: "Phone",
    value: "+234 901 234 5678",
    href: "tel:+2349012345678",
    icon: Phone,
  },
  {
    title: "Location",
    value: "Lagos, Nigeria",
    href: "#",
    icon: MapPin,
  },
];

const topics = [
  "Book a demo",
  "Pricing enquiry",
  "Merchant onboarding",
  "Technical support",
  "Partnership",
  "General enquiry",
];

export default function ContactPage() {
  return (
    <main className="bg-neutral-1 text-white">
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0">
          <div className="absolute left-0 top-0 h-[360px] w-[360px] rounded-full bg-indigo-600/10 blur-3xl" />
          <div className="absolute right-0 top-[120px] h-[320px] w-[320px] rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_32%)]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
          <div className="grid items-start gap-12 lg:grid-cols-[0.88fr_1.12fr]">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
                <MessageSquareMore className="h-4 w-4" />
                Contact Mercora
              </div>

              <h1 className="mt-6 text-4xl font-bold leading-[1.03] tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
                Let’s talk about your commerce setup.
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
                Reach out for demos, pricing conversations, merchant onboarding questions,
                or support enquiries across storefronts, payments, receipts, and settlements.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                {contactCards.map((item) => {
                  const Icon = item.icon;

                  return (
                    <a
                      key={item.title}
                      href={item.href}
                      className="rounded-[22px] border border-white/10 bg-white/[0.03] p-5 transition duration-300 hover:-translate-y-1 hover:border-indigo-500/25"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-500/25 bg-indigo-500/10 text-indigo-300">
                        <Icon className="h-5 w-5" />
                      </div>

                      <p className="mt-5 text-sm font-medium text-slate-400">{item.title}</p>
                      <p className="mt-2 text-sm font-semibold text-white">{item.value}</p>
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.74),rgba(8,12,28,0.96))] shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
              <div className="border-b border-white/10 px-6 py-5">
                <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white">
                  Send a message
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  Share your enquiry and we’ll point you in the right direction.
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
                  <label htmlFor="topic" className="mb-2 block text-sm font-medium text-slate-200">
                    Topic
                  </label>
                  <select
                    id="topic"
                    name="topic"
                    defaultValue=""
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-indigo-400/50 focus:bg-white/[0.06]"
                  >
                    <option value="" disabled className="bg-neutral-2 text-slate-300">
                      Select a topic
                    </option>
                    {topics.map((topic) => (
                      <option key={topic} value={topic} className="bg-neutral-2 text-slate-300">
                        {topic}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium text-slate-200">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={7}
                    placeholder="Tell us about your enquiry..."
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400/50 focus:bg-white/[0.06]"
                  />
                </div>

                <div className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4">
                  <p className="text-xs leading-6 text-slate-400">
                    Best for demos, pricing discussions, implementation questions,
                    and support-related enquiries. A proper backend action can be
                    connected here later.
                  </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-md text-xs leading-6 text-slate-400">
                    By submitting this form, you agree to be contacted regarding your enquiry.
                  </p>

                  <button
                    type="submit"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[image:var(--brand-gradient)] px-6 text-sm font-semibold text-white shadow-[0_16px_38px_rgba(79,70,229,0.34)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(79,70,229,0.42)]"
                  >
                    <SendHorizonal className="h-4 w-4" />
                    Send Message
                  </button>
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
              Preferred Next Steps
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
              A few useful ways to engage Mercora.
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                title: "Book a demo",
                text: "Best for merchants who want to understand product fit and workflow clearly.",
              },
              {
                title: "Ask about pricing",
                text: "Best for businesses comparing tiers, operational needs, and payment models.",
              },
              {
                title: "Request support",
                text: "Best for implementation questions, platform guidance, and related issues.",
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
                <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/85">
                  Need a guided walkthrough?
                </div>

                <h2 className="mt-4 max-w-xl text-3xl font-bold leading-tight tracking-[-0.04em] text-white sm:text-4xl">
                  Book a Mercora demo and see the platform clearly.
                </h2>
              </div>

              <p className="max-w-md text-sm leading-7 text-indigo-100/80">
                Walk through storefront setup, pricing fit, payments, receipts, and
                settlement visibility with a more guided conversation.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <Link
                  href="/book-demo"
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-6 text-sm font-semibold text-ink transition duration-300 hover:bg-slate-100"
                >
                  Book Demo
                </Link>

                <Link
                  href="/pricing"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 text-sm font-semibold text-white transition duration-300 hover:bg-white/10"
                >
                  View Pricing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}