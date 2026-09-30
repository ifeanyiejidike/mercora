import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Store } from "lucide-react";

export const metadata: Metadata = {
  title: "Onboarding Store | Mercora",
  description: "Set up your store identity during Mercora onboarding.",
};

export default function OnboardingStorePage() {
  return (
    <main>
      <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.74),rgba(8,12,28,0.96))] shadow-[0_24px_70px_rgba(0,0,0,0.24)]">
        <div className="border-b border-white/10 px-6 py-6 sm:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
            <Store className="h-4 w-4" />
            Step 2 — Store
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
            Define your store identity.
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
            Set the public-facing basics that shape how customers will experience your storefront.
          </p>
        </div>

        <form className="space-y-6 p-6 sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="storeName" className="mb-2 block text-sm font-medium text-slate-200">
                Store name
              </label>
              <input
                id="storeName"
                name="storeName"
                type="text"
                placeholder="Zuri & Co."
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-indigo-400/50 focus:bg-white/[0.06]"
              />
            </div>

            <div>
              <label htmlFor="storeSlug" className="mb-2 block text-sm font-medium text-slate-200">
                Store slug
              </label>
              <input
                id="storeSlug"
                name="storeSlug"
                type="text"
                placeholder="zuri-and-co"
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-indigo-400/50 focus:bg-white/[0.06]"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="storeCategory" className="mb-2 block text-sm font-medium text-slate-200">
                Primary category
              </label>
              <select
                id="storeCategory"
                name="storeCategory"
                defaultValue=""
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-indigo-400/50 focus:bg-white/[0.06]"
              >
                <option value="" disabled className="bg-neutral-2 text-slate-300">
                  Select category
                </option>
                <option value="fashion" className="bg-neutral-2 text-slate-300">
                  Fashion
                </option>
                <option value="beauty" className="bg-neutral-2 text-slate-300">
                  Beauty
                </option>
                <option value="electronics" className="bg-neutral-2 text-slate-300">
                  Electronics
                </option>
                <option value="home" className="bg-neutral-2 text-slate-300">
                  Home & lifestyle
                </option>
              </select>
            </div>

            <div>
              <label htmlFor="supportEmail" className="mb-2 block text-sm font-medium text-slate-200">
                Support email
              </label>
              <input
                id="supportEmail"
                name="supportEmail"
                type="email"
                placeholder="support@store.com"
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-indigo-400/50 focus:bg-white/[0.06]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="tagline" className="mb-2 block text-sm font-medium text-slate-200">
              Store tagline
            </label>
            <input
              id="tagline"
              name="tagline"
              type="text"
              placeholder="Handcrafted for modern living"
              className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-indigo-400/50 focus:bg-white/[0.06]"
            />
          </div>

          <div>
            <label htmlFor="storeDescription" className="mb-2 block text-sm font-medium text-slate-200">
              Store description
            </label>
            <textarea
              id="storeDescription"
              name="storeDescription"
              rows={5}
              placeholder="Describe your brand and what customers should expect..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400/50 focus:bg-white/[0.06]"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Link
              href="/onboarding/business"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/14 bg-white/[0.03] px-6 text-sm font-semibold text-white transition duration-300 hover:bg-white/[0.06]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>

            <Link
              href="/onboarding/currency"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[image:var(--brand-gradient)] px-6 text-sm font-semibold text-white shadow-[0_16px_38px_rgba(79,70,229,0.34)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(79,70,229,0.42)]"
            >
              Continue to currency
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}