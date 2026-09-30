import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, MailCheck, RefreshCw } from "lucide-react";

export const metadata: Metadata = {
  title: "Verify Email | Mercora",
  description:
    "Verify your email address to continue setting up your Mercora account.",
  alternates: { canonical: "/verify-email" },
};

export default function VerifyEmailPage() {
  return (
    <main className="bg-neutral-1 text-white">
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute left-0 top-0 h-[340px] w-[340px] rounded-full bg-indigo-600/10 blur-3xl" />
          <div className="absolute right-0 top-[120px] h-[300px] w-[300px] rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_32%)]" />
        </div>

        <div className="relative mx-auto flex min-h-[calc(100vh-120px)] max-w-7xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="w-full max-w-[680px] overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.76),rgba(8,12,28,0.96))] shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
            <div className="border-b border-white/10 px-6 py-5 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-500/25 bg-indigo-500/10 text-indigo-300">
                <MailCheck className="h-6 w-6" />
              </div>
              <h1 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
                Check your email
              </h1>
              <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">
                We&apos;ve sent a verification link to your email address. Verify your account
                to continue with setup and onboarding.
              </p>
            </div>

            <div className="space-y-5 p-6 sm:p-7">
              <div className="space-y-3">
                {[
                  "Open the email linked to your Mercora account",
                  "Click the verification link in that message",
                  "Return here and continue setup after verification",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3"
                  >
                    <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-300">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>
                    <p className="text-sm leading-7 text-slate-300">{item}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[image:var(--brand-gradient)] px-6 text-sm font-semibold text-white shadow-[0_16px_38px_rgba(79,70,229,0.34)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(79,70,229,0.42)]"
                >
                  <RefreshCw className="h-4 w-4" />
                  Resend verification email
                </button>

                <Link
                  href="/sign-in"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-white/14 bg-white/[0.03] px-6 text-sm font-semibold text-white transition duration-300 hover:bg-white/[0.06]"
                >
                  Back to sign in
                </Link>
              </div>

              <div className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4">
                <p className="text-sm leading-7 text-slate-300">
                  Didn&apos;t get the email? Check spam, promotions, or any filtered inboxes first.
                </p>
              </div>

              <p className="text-center text-xs leading-6 text-slate-400">
                Connect your actual resend verification action later.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}