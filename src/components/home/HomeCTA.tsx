"use client";

import Link from "next/link";
import { FadeUp } from "@/components/shared/motion";

export default function HomeCTA() {
  return (
    <section className="bg-neutral-1 pb-20 pt-10 sm:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="overflow-hidden rounded-[24px] border border-indigo-500/20 bg-[linear-gradient(135deg,#2e1c8c_0%,#1f2d7a_58%,#1f3f8f_100%)] px-6 py-8 shadow-[0_20px_60px_rgba(44,34,130,0.35)] transition duration-300 hover:shadow-[0_26px_72px_rgba(44,34,130,0.42)] sm:px-8 lg:px-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr_auto] lg:items-center">
              <div>
                <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/85">
                  Ready to Sell Smarter?
                </div>

                <h3 className="mt-4 max-w-xl text-3xl font-bold leading-tight tracking-[-0.04em] text-white sm:text-4xl">
                  Your Business Deserves a Commerce Operating System.
                </h3>
              </div>

              <p className="max-w-md text-sm leading-7 text-indigo-100/80">
                Join thousands of African merchants who trust Mercora to power their growth.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <Link
                  href="/signup"
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-6 text-sm font-semibold text-ink transition duration-300 hover:-translate-y-0.5 hover:bg-slate-100"
                >
                  Start Free
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white/10"
                >
                  Book Demo
                </Link>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}