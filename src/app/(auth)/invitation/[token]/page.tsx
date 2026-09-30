import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  ShieldCheck,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Accept Invitation | Mercora",
  description:
    "Accept your Mercora invitation and continue into the right workspace.",
};

export default function InvitationPage() {
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
                <Users className="h-4 w-4" />
                Team invitation
              </div>

              <h1 className="mt-6 text-4xl font-bold leading-[1.03] tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
                You&apos;ve been invited to join a Mercora workspace.
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
                Accept the invitation to access the right merchant team, workspace,
                and operational tools for your assigned role.
              </p>

              <div className="mt-8 space-y-3">
                {[
                  "Join the correct merchant workspace",
                  "Get access based on your assigned role",
                  "Continue directly into the right onboarding or dashboard flow",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3"
                  >
                    <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-300">
                      <BadgeCheck className="h-3.5 w-3.5" />
                    </div>
                    <p className="text-sm leading-7 text-slate-300">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mx-auto w-full max-w-[560px] overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.74),rgba(8,12,28,0.96))] shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
              <div className="border-b border-white/10 px-6 py-5">
                <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white">
                  Invitation details
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  Review the invitation and continue with the appropriate account.
                </p>
              </div>

              <div className="space-y-5 p-6 sm:p-7">
                <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300">
                      <Building2 className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-400">Workspace</p>
                      <p className="mt-1 text-lg font-semibold text-white">
                        Zuri &amp; Co.
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        You have been invited to collaborate in this workspace.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-sm font-medium text-slate-400">Assigned role</p>
                  <div className="mt-2 inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-blue-200">
                    Merchant Staff
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Your access level will determine which parts of the workspace you can use.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Link
                    href="/Login"
                    className="inline-flex h-12 items-center justify-center rounded-xl border border-white/14 bg-white/[0.03] px-6 text-sm font-semibold text-white transition duration-300 hover:bg-white/[0.06]"
                  >
                    Login to accept
                  </Link>

                  <Link
                    href="/sign-up"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[image:var(--brand-gradient)] px-6 text-sm font-semibold text-white shadow-[0_16px_38px_rgba(79,70,229,0.34)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(79,70,229,0.42)]"
                  >
                    Create account
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-300">
                      <ShieldCheck className="h-3.5 w-3.5" />
                    </div>
                    <p className="text-sm leading-7 text-slate-300">
                      Connect your actual invitation validation and acceptance flow later.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}