import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BadgeCheck, Check, Wallet } from "lucide-react";

export const metadata: Metadata = {
  title: "Onboarding Plan | Mercora",
  description: "Choose the plan that fits your business during Mercora onboarding.",
};

const plans = [
  {
    name: "Starter",
    price: "₦6,000",
    period: "/month",
    tagline: "For merchants getting started with a clean foundation",
    features: [
      "Merchant-direct payments",
      "Professional receipts",
      "Basic storefront",
      "No managed gateway required",
      "Low-friction setup",
    ],
    featured: false,
  },
  {
    name: "Growth",
    price: "₦15,000",
    period: "/month",
    tagline: "For merchants ready for stronger conversion and operational clarity",
    features: [
      "Flutterwave checkout enabled",
      "Better analytics",
      "More products",
      "Better branding and customization",
      "2% managed-payment fee",
    ],
    featured: true,
  },
  {
    name: "Pro",
    price: "₦35,000",
    period: "/month",
    tagline: "For merchants that need scale, control, and premium support",
    features: [
      "Staff and team access",
      "Custom domain",
      "Advanced analytics",
      "Premium support",
      "1.5% managed-payment fee",
    ],
    featured: false,
  },
];

export default function OnboardingPlanPage() {
  return (
    <main>
      <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.74),rgba(8,12,28,0.96))] shadow-[0_24px_70px_rgba(0,0,0,0.24)]">
        <div className="border-b border-white/10 px-6 py-6 sm:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
            <Wallet className="h-4 w-4" />
            Step 5 — Plan
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
            Choose the plan that fits your current stage.
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
            Start with the plan that matches your payment model, visibility needs,
            and current operational maturity. You can expand later as the business grows.
          </p>
        </div>

        <div className="space-y-6 p-6 sm:p-8">
          <div className="grid gap-5 xl:grid-cols-3">
            {plans.map((plan) => (
              <label
                key={plan.name}
                className={`block cursor-pointer rounded-[28px] border p-6 shadow-[0_20px_55px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-1 ${
                  plan.featured
                    ? "border-indigo-500/30 bg-[linear-gradient(180deg,rgba(28,24,78,0.9),rgba(12,16,36,0.96))]"
                    : "border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.68),rgba(8,12,28,0.94))]"
                }`}
              >
                <input type="radio" name="plan" className="sr-only" />

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
              </label>
            ))}
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm font-medium text-slate-400">Why this matters</p>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Your plan affects payment flow availability, reporting depth, product capacity,
              customization level, and how much operational control you get from the start.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Link
              href="/onboarding/payments"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/14 bg-white/[0.03] px-6 text-sm font-semibold text-white transition duration-300 hover:bg-white/[0.06]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>

            <Link
              href="/onboarding/complete"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[image:var(--brand-gradient)] px-6 text-sm font-semibold text-white shadow-[0_16px_38px_rgba(79,70,229,0.34)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(79,70,229,0.42)]"
            >
              Continue to complete
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}