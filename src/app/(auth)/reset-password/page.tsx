import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, KeySquare, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Reset Password | Mercora",
  description:
    "Create a new password for your Mercora account.",
};

export default function ResetPasswordPage() {
  return (
    <main className="bg-neutral-1 text-white">
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute left-0 top-0 h-[340px] w-[340px] rounded-full bg-indigo-600/10 blur-3xl" />
          <div className="absolute right-0 top-[120px] h-[300px] w-[300px] rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_32%)]" />
        </div>

        <div className="relative mx-auto flex min-h-[calc(100vh-120px)] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid w-full items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
                <KeySquare className="h-4 w-4" />
                Set new password
              </div>

              <h1 className="mt-6 text-4xl font-bold leading-[1.03] tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
                Create a new secure password for your account.
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
                Use a strong password you haven&apos;t used elsewhere so your account stays protected.
              </p>

              <div className="mt-8 space-y-3">
                {[
                  "Use at least one strong, unique password",
                  "Avoid using an old password again",
                  "Sign in immediately after reset if needed",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3"
                  >
                    <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-300">
                      <ShieldCheck className="h-3.5 w-3.5" />
                    </div>
                    <p className="text-sm leading-7 text-slate-300">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mx-auto w-full max-w-[560px] overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.74),rgba(8,12,28,0.96))] shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
              <div className="border-b border-white/10 px-6 py-5">
                <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white">
                  Reset password
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  Enter your new password below.
                </p>
              </div>

              <form className="space-y-5 p-6 sm:p-7">
                <div>
                  <label htmlFor="newPassword" className="mb-2 block text-sm font-medium text-slate-200">
                    New password
                  </label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-indigo-400/50 focus:bg-white/[0.06]"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-slate-200">
                    Confirm password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-indigo-400/50 focus:bg-white/[0.06]"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[image:var(--brand-gradient)] px-6 text-sm font-semibold text-white shadow-[0_16px_38px_rgba(79,70,229,0.34)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(79,70,229,0.42)]"
                >
                  Save new password
                  <ArrowRight className="h-4 w-4" />
                </button>

                <div className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4 text-center">
                  <p className="text-sm text-slate-300">
                    Return to{" "}
                    <Link
                      href="/sign-in"
                      className="font-semibold text-white transition hover:text-indigo-200"
                    >
                      sign in
                    </Link>
                    .
                  </p>
                </div>

                <p className="text-center text-xs leading-6 text-slate-400">
                  Connect your actual reset-password confirm action later.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}