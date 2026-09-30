import Link from "next/link";
import { ArrowLeft, BadgeAlert, ShieldBan } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <main className="bg-neutral-1 text-white">
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute left-0 top-0 h-[320px] w-[320px] rounded-full bg-amber-500/10 blur-3xl" />
          <div className="absolute right-0 top-[100px] h-[280px] w-[280px] rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_30%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,10,24,0.2)_0%,rgba(4,10,24,0.96)_100%)]" />
        </div>

        <div className="relative mx-auto flex min-h-[calc(100vh-160px)] w-full max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid w-full items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-200">
                <ShieldBan className="h-4 w-4" />
                Unauthorized
              </div>

              <p className="mt-6 text-6xl font-bold leading-none tracking-[-0.06em] text-white sm:text-7xl">
                401
              </p>

              <h1 className="mt-5 max-w-2xl text-3xl font-bold leading-tight tracking-[-0.04em] text-white sm:text-5xl">
                You need to log in to continue.
              </h1>

              <p className="mt-5 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
                This page requires an authenticated session. Log in with the correct
                account, or return to a public page and continue from there.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/login"
                  className="inline-flex h-14 items-center justify-center rounded-2xl bg-[image:var(--brand-gradient)] px-7 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(79,70,229,0.38)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_rgba(79,70,229,0.42)]"
                >
                  Log In
                </Link>

                <Link
                  href="/"
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border border-white/14 bg-white/[0.03] px-6 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white/[0.06]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to homepage
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[520px]">
              <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,15,34,0.96),rgba(7,10,22,0.98))] shadow-[0_30px_80px_rgba(0,0,0,0.36)]">
                <div className="flex items-center gap-2 border-b border-white/10 px-5 py-4">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                </div>

                <div className="p-6 sm:p-7">
                  <div className="rounded-[24px] border border-amber-500/15 bg-amber-500/10 p-5">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-300">
                        <BadgeAlert className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-white">
                          Session required
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-300">
                          This route is available only to authenticated users with a valid backend session cookie.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-sm font-semibold text-white">Recommended next step</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      Log in first. If you expected automatic access, confirm that your session has not expired.
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