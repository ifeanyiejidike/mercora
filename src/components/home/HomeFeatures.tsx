"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeUp, StaggerGroup, StaggerItem } from "@/components/shared/motion";
import { featureCards } from "./home.data";

export default function HomeFeatures() {
  return (
    <section id="features" className="border-t border-white/5 bg-neutral-1 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                Everything You Need to Sell and Grow
              </div>
              <h2 className="mt-3 text-3xl font-bold leading-tight tracking-[-0.04em] text-white sm:text-4xl">
                Powerful Tools.
                <br />
                Built for Real Business.
              </h2>
            </div>

            <Link
              href="/overview"
              className="inline-flex items-center gap-2 text-sm font-medium text-indigo-400 transition duration-300 hover:translate-x-1 hover:text-indigo-300"
            >
              Explore All Features
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </FadeUp>

        <StaggerGroup className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featureCards.map((feature) => {
            const Icon = feature.icon;

            return (
              <StaggerItem key={feature.title}>
                <article className="group rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.62),rgba(8,12,28,0.94))] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1 hover:border-indigo-500/25 hover:bg-[linear-gradient(180deg,rgba(18,25,54,0.78),rgba(8,12,28,0.98))] hover:shadow-[0_24px_50px_rgba(0,0,0,0.24)]">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-500/25 bg-indigo-500/10 text-indigo-300 transition duration-300 group-hover:scale-[1.04] group-hover:bg-indigo-500/15">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-6 text-xl font-semibold text-white">{feature.title}</h3>
                  <p className="mt-3 max-w-sm text-sm leading-7 text-slate-300">
                    {feature.description}
                  </p>
                </article>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}