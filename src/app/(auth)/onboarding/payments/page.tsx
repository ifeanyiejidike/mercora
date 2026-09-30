import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CreditCard, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Onboarding Payments | Mercora",
  description: "Configure payment preferences during Mercora onboarding.",
};

export default function OnboardingPaymentsPage() {
  return (
    <main>
      <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.74),rgba(8,12,28,0.96))] shadow-[0_24px_70px_rgba(0,0,0,0.24)]">
        <div className="border-b border-white/10 px-6 py-6 sm:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
            <CreditCard className="h-4 w-4" />
            Step 4 — Payments
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
            Configure how you want payments handled.
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
            Choose the payment model that best fits your current stage and how you want transactions managed.
          </p>
        </div>

        <form className="space-y-6 p-6 sm:p-8">
          <div className="grid gap-4 lg:grid-cols-2">
            <label className="block cursor-pointer rounded-[24px] border border-white/10 bg-white/[0.03] p-5 transition hover:border-indigo-500/25">
              <input type="radio" name="paymentMode" className="sr-only" />
              <div className="text-lg font-semibold text-white">
                Merchant-direct payments
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Best for merchants who want a simpler setup where payments go directly through their own flow.
              </p>
            </label>

            <label className="block cursor-pointer rounded-[24px] border border-white/10 bg-white/[0.03] p-5 transition hover:border-indigo-500/25">
              <input type="radio" name="paymentMode" className="sr-only" />
              <div className="text-lg font-semibold text-white">
                Managed checkout
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Best for merchants that want platform-managed checkout support, structured flows, and stronger payment control.
              </p>
            </label>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="provider" className="mb-2 block text-sm font-medium text-slate-200">
                Preferred provider
              </label>
              <select
                id="provider"
                name="provider"
                defaultValue=""
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-indigo-400/50 focus:bg-white/[0.06]"
              >
                <option value="" disabled className="bg-neutral-2 text-slate-300">
                  Select provider
                </option>
                <option value="flutterwave" className="bg-neutral-2 text-slate-300">
                  Flutterwave
                </option>
                <option value="paystack" className="bg-neutral-2 text-slate-300">
                  Paystack
                </option>
                <option value="manual" className="bg-neutral-2 text-slate-300">
                  Manual / bank transfer
                </option>
              </select>
            </div>

            <div>
              <label htmlFor="settlementTiming" className="mb-2 block text-sm font-medium text-slate-200">
                Settlement preference
              </label>
              <select
                id="settlementTiming"
                name="settlementTiming"
                defaultValue=""
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-indigo-400/50 focus:bg-white/[0.06]"
              >
                <option value="" disabled className="bg-neutral-2 text-slate-300">
                  Select settlement preference
                </option>
                <option value="standard" className="bg-neutral-2 text-slate-300">
                  Standard settlement
                </option>
                <option value="managed" className="bg-neutral-2 text-slate-300">
                  Managed payout routing
                </option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="mb-2 block text-sm font-medium text-slate-200">
              Payment notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={5}
              placeholder="Anything important about how your business wants payments handled..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400/50 focus:bg-white/[0.06]"
            />
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center gap-2 text-white">
              <ShieldCheck className="h-5 w-5 text-indigo-300" />
              <h2 className="text-lg font-semibold">Why this matters</h2>
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Payment configuration affects customer trust, transaction structure,
              settlement visibility, and which pricing tier fits your merchant setup best.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Link
              href="/onboarding/currency"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/14 bg-white/[0.03] px-6 text-sm font-semibold text-white transition duration-300 hover:bg-white/[0.06]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>

            <Link
              href="/onboarding/plan"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[image:var(--brand-gradient)] px-6 text-sm font-semibold text-white shadow-[0_16px_38px_rgba(79,70,229,0.34)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(79,70,229,0.42)]"
            >
              Continue to plan
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}