import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, LayoutGrid, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Onboarding | Mercora",
  description:
    "Start onboarding for your Mercora account and configure your merchant setup.",
  alternates: { canonical: "/onboarding" },
};

export default function OnboardingOverviewPage() {
  return (
    <main>
      <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.74),rgba(8,12,28,0.96))] shadow-[0_24px_70px_rgba(0,0,0,0.24)]">
        <div className="border-b border-white/10 px-6 py-6 sm:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
            <LayoutGrid className="h-4 w-4" />
            Onboarding overview
          </div>

          <h1 className="mt-5 text-3xl font-bold leading-tight tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
            Let&apos;s set up your merchant foundation the right way.
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
            This onboarding flow helps you define the key parts of your business setup,
            store identity, currency choices, payments, and plan direction before you continue.
          </p>
        </div>

        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.04fr_0.96fr]">
          <div className="space-y-4">
            {[
              "Add your business details",
              "Set up store identity and public-facing structure",
              "Choose default currency direction",
              "Configure your payment flow",
              "Review plan fit and complete setup",
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4"
              >
                <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-300">
                  <BadgeCheck className="h-3.5 w-3.5" />
                </div>
                <p className="text-sm leading-7 text-slate-300">{item}</p>
              </div>
            ))}
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center gap-2 text-white">
              <ShieldCheck className="h-5 w-5 text-indigo-300" />
              <h2 className="text-2xl font-semibold tracking-[-0.03em]">
                What this helps you achieve
              </h2>
            </div>

            <div className="mt-6 space-y-4 text-sm leading-7 text-slate-300">
              <p>
                A stronger onboarding flow makes the rest of the platform easier to use,
                because your business structure, store identity, and payment direction are clearer from the beginning.
              </p>
              <p>
                It also reduces setup confusion and creates a better transition into merchant operations later.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/onboarding/business"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[image:var(--brand-gradient)] px-6 text-sm font-semibold text-white shadow-[0_16px_38px_rgba(79,70,229,0.34)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(79,70,229,0.42)]"
              >
                Start onboarding
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/book-demo"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/14 bg-white/[0.03] px-6 text-sm font-semibold text-white transition duration-300 hover:bg-white/[0.06]"
              >
                Book demo instead
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}