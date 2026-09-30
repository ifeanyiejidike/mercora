import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, CheckCircle2, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Onboarding Complete | Mercora",
  description: "Finish your Mercora onboarding and continue into your next step.",
};

export default function OnboardingCompletePage() {
  return (
    <main>
      <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.74),rgba(8,12,28,0.96))] shadow-[0_24px_70px_rgba(0,0,0,0.24)]">
        <div className="border-b border-white/10 px-6 py-8 text-center sm:px-8">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
            <BadgeCheck className="h-4 w-4" />
            Onboarding complete
          </div>

          <div className="mx-auto mt-6 flex h-16 w-16 items-center justify-center rounded-[1.4rem] border border-indigo-500/25 bg-indigo-500/10 text-indigo-300">
            <Sparkles className="h-7 w-7" />
          </div>

          <h1 className="mt-6 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
            Your merchant setup foundation is ready.
          </h1>

          <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
            You’ve completed the onboarding flow. Your business, store, currency,
            payment direction, and plan structure are now defined for the next stage.
          </p>
        </div>

        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.04fr_0.96fr]">
          <div className="space-y-4">
            {[
              "Business profile has been captured",
              "Store identity has been configured",
              "Currency direction has been selected",
              "Payment configuration has been chosen",
              "Plan direction has been defined",
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4"
              >
                <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-300">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
                <p className="text-sm leading-7 text-slate-300">{item}</p>
              </div>
            ))}
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white">
              What happens next
            </h2>

            <div className="mt-6 space-y-4 text-sm leading-7 text-slate-300">
              <p>
                From here, you can move into the merchant experience, continue store setup,
                or connect the deeper operational pieces that your business needs next.
              </p>
              <p>
                This is also the right place to branch into dashboard access, product setup,
                branding work, or payment refinement.
              </p>
            </div>

            <div className="mt-8 grid gap-3">
              <Link
                href="/sign-in"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[image:var(--brand-gradient)] px-6 text-sm font-semibold text-white shadow-[0_16px_38px_rgba(79,70,229,0.34)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(79,70,229,0.42)]"
              >
                Continue to sign in
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/book-demo"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/14 bg-white/[0.03] px-6 text-sm font-semibold text-white transition duration-300 hover:bg-white/[0.06]"
              >
                Book a guided walkthrough
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}