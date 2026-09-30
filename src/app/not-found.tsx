import Link from "next/link";
import { ArrowLeft, Compass, Search } from "lucide-react";

export default function NotFoundPage() {
  return (
    <section className="relative isolate overflow-hidden bg-neutral-1">
      <div className="absolute inset-0">
        <div className="absolute left-0 top-0 h-[320px] w-[320px] rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute right-0 top-[80px] h-[280px] w-[280px] rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_30%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,10,24,0.2)_0%,rgba(4,10,24,0.96)_100%)]" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-160px)] w-full max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
              <Compass className="h-4 w-4" />
              Page not found
            </div>

            <p className="mt-6 text-6xl font-bold leading-none tracking-[-0.06em] text-white sm:text-7xl">
              404
            </p>

            <h1 className="mt-5 max-w-2xl text-3xl font-bold leading-tight tracking-[-0.04em] text-white sm:text-5xl">
              This page seems to have taken a wrong turn.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
              The page you’re looking for may have been moved, renamed, or no longer exists.
              Let’s get you back to something useful.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-[image:var(--brand-gradient)] px-7 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(79,70,229,0.38)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_rgba(79,70,229,0.42)]"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to homepage
              </Link>

              <Link
                href="/contact"
                className="inline-flex h-14 items-center justify-center rounded-2xl border border-white/14 bg-white/[0.03] px-6 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white/[0.06]"
              >
                Contact support
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
                <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-300">
                      <Search className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Nothing here</p>
                      <p className="mt-1 text-xs text-slate-400">
                        We couldn’t match this route to an existing public page.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {[
                      "Check the URL for any spelling mistakes",
                      "Return to the homepage and navigate from there",
                      "Use the contact page if you need help finding something",
                    ].map((item) => (
                      <div
                        key={item}
                        className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-slate-300"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Link
                    href="/"
                    className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm font-semibold text-white transition duration-300 hover:bg-white/[0.06]"
                  >
                    Homepage
                  </Link>
                  <Link
                    href="/contact"
                    className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm font-semibold text-white transition duration-300 hover:bg-white/[0.06]"
                  >
                    Contact
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}