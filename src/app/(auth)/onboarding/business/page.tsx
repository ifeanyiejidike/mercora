import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Building2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Onboarding Business | Mercora",
  description: "Set up your business details in Mercora onboarding.",
};

export default function OnboardingBusinessPage() {
  return (
    <main>
      <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.74),rgba(8,12,28,0.96))] shadow-[0_24px_70px_rgba(0,0,0,0.24)]">
        <div className="border-b border-white/10 px-6 py-6 sm:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
            <Building2 className="h-4 w-4" />
            Step 1 — Business
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
            Tell us about your business.
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
            Start with the core business details that shape your merchant profile and account structure.
          </p>
        </div>

        <form className="space-y-6 p-6 sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="businessName" className="mb-2 block text-sm font-medium text-slate-200">
                Business name
              </label>
              <input
                id="businessName"
                name="businessName"
                type="text"
                placeholder="Zuri & Co."
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-indigo-400/50 focus:bg-white/[0.06]"
              />
            </div>

            <div>
              <label htmlFor="businessType" className="mb-2 block text-sm font-medium text-slate-200">
                Business type
              </label>
              <select
                id="businessType"
                name="businessType"
                defaultValue=""
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-indigo-400/50 focus:bg-white/[0.06]"
              >
                <option value="" disabled className="bg-neutral-2 text-slate-300">
                  Select business type
                </option>
                <option value="retail" className="bg-neutral-2 text-slate-300">
                  Retail
                </option>
                <option value="fashion" className="bg-neutral-2 text-slate-300">
                  Fashion
                </option>
                <option value="electronics" className="bg-neutral-2 text-slate-300">
                  Electronics
                </option>
                <option value="food" className="bg-neutral-2 text-slate-300">
                  Food & lifestyle
                </option>
              </select>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="businessEmail" className="mb-2 block text-sm font-medium text-slate-200">
                Business email
              </label>
              <input
                id="businessEmail"
                name="businessEmail"
                type="email"
                placeholder="hello@company.com"
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-indigo-400/50 focus:bg-white/[0.06]"
              />
            </div>

            <div>
              <label htmlFor="businessPhone" className="mb-2 block text-sm font-medium text-slate-200">
                Business phone
              </label>
              <input
                id="businessPhone"
                name="businessPhone"
                type="tel"
                placeholder="+234 800 000 0000"
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-indigo-400/50 focus:bg-white/[0.06]"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="country" className="mb-2 block text-sm font-medium text-slate-200">
                Country
              </label>
              <select
                id="country"
                name="country"
                defaultValue=""
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-indigo-400/50 focus:bg-white/[0.06]"
              >
                <option value="" disabled className="bg-neutral-2 text-slate-300">
                  Select country
                </option>
                <option value="ng" className="bg-neutral-2 text-slate-300">
                  Nigeria
                </option>
                <option value="ke" className="bg-neutral-2 text-slate-300">
                  Kenya
                </option>
                <option value="gh" className="bg-neutral-2 text-slate-300">
                  Ghana
                </option>
              </select>
            </div>

            <div>
              <label htmlFor="city" className="mb-2 block text-sm font-medium text-slate-200">
                City
              </label>
              <input
                id="city"
                name="city"
                type="text"
                placeholder="Lagos"
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-indigo-400/50 focus:bg-white/[0.06]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="businessDescription" className="mb-2 block text-sm font-medium text-slate-200">
              Business description
            </label>
            <textarea
              id="businessDescription"
              name="businessDescription"
              rows={5}
              placeholder="Describe what your business sells and who it serves..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400/50 focus:bg-white/[0.06]"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Link
              href="/onboarding"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/14 bg-white/[0.03] px-6 text-sm font-semibold text-white transition duration-300 hover:bg-white/[0.06]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>

            <Link
              href="/onboarding/store"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[image:var(--brand-gradient)] px-6 text-sm font-semibold text-white shadow-[0_16px_38px_rgba(79,70,229,0.34)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(79,70,229,0.42)]"
            >
              Continue to store
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}