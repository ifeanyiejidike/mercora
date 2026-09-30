import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Globe2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Onboarding Currency | Mercora",
  description: "Choose currency preferences during Mercora onboarding.",
};

export default function OnboardingCurrencyPage() {
  return (
    <main>
      <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.74),rgba(8,12,28,0.96))] shadow-[0_24px_70px_rgba(0,0,0,0.24)]">
        <div className="border-b border-white/10 px-6 py-6 sm:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
            <Globe2 className="h-4 w-4" />
            Step 3 — Currency
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
            Choose your currency direction.
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
            Set the default currency experience for your storefront, reporting, and payment flow.
          </p>
        </div>

        <form className="space-y-6 p-6 sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="defaultCurrency" className="mb-2 block text-sm font-medium text-slate-200">
                Default currency
              </label>
              <select
                id="defaultCurrency"
                name="defaultCurrency"
                defaultValue=""
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-indigo-400/50 focus:bg-white/[0.06]"
              >
                <option value="" disabled className="bg-neutral-2 text-slate-300">
                  Select currency
                </option>
                <option value="NGN" className="bg-neutral-2 text-slate-300">
                  NGN — Nigerian Naira
                </option>
                <option value="KES" className="bg-neutral-2 text-slate-300">
                  KES — Kenyan Shilling
                </option>
                <option value="GHS" className="bg-neutral-2 text-slate-300">
                  GHS — Ghanaian Cedi
                </option>
                <option value="USD" className="bg-neutral-2 text-slate-300">
                  USD — US Dollar
                </option>
              </select>
            </div>

            <div>
              <label htmlFor="settlementCurrency" className="mb-2 block text-sm font-medium text-slate-200">
                Settlement currency
              </label>
              <select
                id="settlementCurrency"
                name="settlementCurrency"
                defaultValue=""
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-indigo-400/50 focus:bg-white/[0.06]"
              >
                <option value="" disabled className="bg-neutral-2 text-slate-300">
                  Select settlement currency
                </option>
                <option value="NGN" className="bg-neutral-2 text-slate-300">
                  NGN — Nigerian Naira
                </option>
                <option value="KES" className="bg-neutral-2 text-slate-300">
                  KES — Kenyan Shilling
                </option>
                <option value="GHS" className="bg-neutral-2 text-slate-300">
                  GHS — Ghanaian Cedi
                </option>
                <option value="USD" className="bg-neutral-2 text-slate-300">
                  USD — US Dollar
                </option>
              </select>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="priceDisplay" className="mb-2 block text-sm font-medium text-slate-200">
                Price display style
              </label>
              <select
                id="priceDisplay"
                name="priceDisplay"
                defaultValue=""
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-indigo-400/50 focus:bg-white/[0.06]"
              >
                <option value="" disabled className="bg-neutral-2 text-slate-300">
                  Select display style
                </option>
                <option value="local" className="bg-neutral-2 text-slate-300">
                  Local primary pricing
                </option>
                <option value="multi" className="bg-neutral-2 text-slate-300">
                  Multi-currency display
                </option>
              </select>
            </div>

            <div>
              <label htmlFor="exchangeHandling" className="mb-2 block text-sm font-medium text-slate-200">
                Exchange handling
              </label>
              <select
                id="exchangeHandling"
                name="exchangeHandling"
                defaultValue=""
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-indigo-400/50 focus:bg-white/[0.06]"
              >
                <option value="" disabled className="bg-neutral-2 text-slate-300">
                  Select exchange handling
                </option>
                <option value="manual" className="bg-neutral-2 text-slate-300">
                  Manual control
                </option>
                <option value="platform" className="bg-neutral-2 text-slate-300">
                  Platform-managed
                </option>
              </select>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm font-medium text-slate-400">Why this matters</p>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Clear currency direction affects storefront trust, reporting clarity,
              buyer understanding, and how payments and settlements are communicated later.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Link
              href="/onboarding/store"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/14 bg-white/[0.03] px-6 text-sm font-semibold text-white transition duration-300 hover:bg-white/[0.06]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>

            <Link
              href="/onboarding/payments"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[image:var(--brand-gradient)] px-6 text-sm font-semibold text-white shadow-[0_16px_38px_rgba(79,70,229,0.34)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(79,70,229,0.42)]"
            >
              Continue to payments
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}