import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Check, Sparkles } from "lucide-react";

const PAGE_TITLE = "Mercora Pricing";
const PAGE_DESC =
  "Explore Mercora pricing for merchants that need premium storefronts, payment visibility, professional receipts, and stronger operational control.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    url: "/pricing",
    type: "website",
    siteName: "Mercora",
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESC,
  },
};

const plans = [
  {
    name: "Starter",
    price: "₦6,000",
    period: "/month",
    tagline: "For merchants getting started with a clean foundation",
    description:
      "A low-friction entry point for merchants who want a professional storefront and core transaction structure without managed checkout complexity.",
    features: [
      "Merchant-direct payments",
      "Professional receipts",
      "Basic storefront",
      "No managed gateway required",
      "Responsive public pages",
    ],
    feeLabel: "Managed payment fee",
    feeValue: "Not required",
    featured: false,
  },
  {
    name: "Growth",
    price: "₦15,000",
    period: "/month",
    tagline: "For merchants ready for stronger conversion and operational clarity",
    description:
      "A more commercially balanced tier for merchants who want better branding, better visibility, and Mercora-managed checkout support.",
    features: [
      "Flutterwave checkout enabled",
      "Better analytics",
      "More product capacity",
      "Better branding and customization",
      "Stronger operating visibility",
    ],
    feeLabel: "Managed payment fee",
    feeValue: "2%",
    featured: true,
  },
  {
    name: "Pro",
    price: "₦35,000",
    period: "/month",
    tagline: "For serious merchants that need scale, control, and support",
    description:
      "A stronger operating tier for merchants that need team access, more advanced reporting, a more premium setup, and better commercial efficiency.",
    features: [
      "Staff and team access",
      "Custom domain",
      "Advanced analytics",
      "Premium support",
      "Lower managed-payment fee",
    ],
    feeLabel: "Managed payment fee",
    feeValue: "1.5%",
    featured: false,
  },
];

const whyThisWorks = [
  {
    title: "Starter drives adoption",
    text: "The entry point stays affordable enough to reduce hesitation while still positioning the product as serious software.",
  },
  {
    title: "Growth becomes the revenue tier",
    text: "The mid-tier is strong enough to attract merchants that want better branding, visibility, and managed checkout support.",
  },
  {
    title: "Pro captures higher-value merchants",
    text: "More advanced businesses get access to team workflows, stronger reporting, premium support, and better fee efficiency.",
  },
];

const faqs = [
  {
    q: "Why does this pricing structure work well for launch?",
    a: "Because it balances fast adoption with sustainable monetization. The entry plan stays accessible, the middle tier becomes attractive, and the top tier captures merchants with more advanced needs.",
  },
  {
    q: "Does Mercora charge a managed payment fee on every plan?",
    a: "No. The Starter tier is designed so merchants can operate without managed checkout being required. Managed-payment fees apply where Mercora-managed flows are enabled.",
  },
  {
    q: "Why is Growth positioned as the main value tier?",
    a: "Because it combines better branding, better analytics, more product capacity, and managed checkout support at a commercially strong price point.",
  },
  {
    q: "Can a merchant upgrade later?",
    a: "Yes. The pricing structure is designed to create a clear upgrade path as a merchant moves from setup into stronger operations and higher transaction needs.",
  },
];

export default function PricingPage() {
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
              <Sparkles className="h-4 w-4" />
              Mercora Pricing
            </div>

            <h1 className="mt-6 text-4xl font-bold leading-[1.03] tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
              Launch pricing designed for adoption, growth, and commercial balance.
            </h1>

            <p className="mt-6 text-base leading-8 text-slate-300 sm:text-lg">
              Mercora pricing is structured to help merchants start with confidence,
              upgrade naturally as operations grow, and access stronger value as
              complexity increases.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/book-demo"
                className="inline-flex h-14 items-center justify-center rounded-2xl bg-[image:var(--brand-gradient)] px-7 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(79,70,229,0.38)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_rgba(79,70,229,0.42)]"
              >
                Book Demo
              </Link>

              <Link
                href="/contact"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border border-white/14 bg-white/[0.03] px-6 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white/[0.06]"
              >
                Contact Sales
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/5 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 xl:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={[
                  "rounded-[30px] border p-6 shadow-[0_20px_55px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-1",
                  plan.featured
                    ? "border-indigo-500/30 bg-[linear-gradient(180deg,rgba(28,24,78,0.9),rgba(12,16,36,0.96))]"
                    : "border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.68),rgba(8,12,28,0.94))]",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white">
                      {plan.name}
                    </h2>
                    <p className="mt-2 text-sm text-slate-400">{plan.tagline}</p>
                  </div>

                   {plan.featured ? (
                    <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-indigo-200">
                      <BadgeCheck className="h-3.5 w-3.5" />
                      Recommended
                    </div>
                  ) : null}
                </div>

                <div className="mt-8 flex items-end gap-1">
                  <div className="text-5xl font-bold tracking-[-0.06em] text-white">
                    {plan.price}
                  </div>
                  <div className="pb-1 text-sm text-slate-400">{plan.period}</div>
                </div>

                <p className="mt-4 text-sm leading-7 text-slate-300">
                  {plan.description}
                </p>

                <div className="mt-6 rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-4">
                  <div className="text-xs uppercase tracking-[0.14em] text-slate-400">
                    {plan.feeLabel}
                  </div>
                  <div className="mt-2 text-lg font-semibold text-white">{plan.feeValue}</div>
                </div>

                <div className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3"
                    >
                      <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-300">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-sm leading-6 text-slate-200">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <Link
                    href="/book-demo"
                    className={[
                      "inline-flex h-12 w-full items-center justify-center rounded-xl px-5 text-sm font-semibold transition duration-300",
                      plan.featured
                        ? "bg-white text-ink hover:bg-slate-100"
                        : "border border-white/14 bg-white/[0.04] text-white hover:bg-white/[0.07]",
                    ].join(" ")}
                  >
                    Book Demo
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/5 py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:px-8">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              Launch Strategy
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
              Why this pricing structure is commercially strong.
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {whyThisWorks.map((item) => (
              <div
                key={item.title}
                className="rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,18,38,0.78),rgba(8,12,28,0.96))] p-5"
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
              Pricing FAQ
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
              Common questions before launch decisions are made.
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((item) => (
              <div
                key={item.q}
                className="rounded-[22px] border border-white/10 bg-white/[0.03] p-5"
              >
                <h3 className="text-lg font-semibold text-white">{item.q}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{item.a}</p>
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
                  Need help choosing a plan?
                </div>

                <h2 className="mt-4 max-w-xl text-3xl font-bold leading-tight tracking-[-0.04em] text-white sm:text-4xl">
                  Let’s match Mercora to your business stage.
                </h2>
              </div>

              <p className="max-w-md text-sm leading-7 text-indigo-100/80">
                Book a conversation to choose the right plan based on your workflow,
                growth stage, and how much operational control you need.
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
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}