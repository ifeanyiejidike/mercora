"use client";

import Image from "next/image";
import { FadeUp, StaggerGroup, StaggerItem } from "@/components/shared/motion";
import { testimonials } from "./home.data";

export default function HomeTestimonials() {
  return (
    <section className="border-t border-white/5 bg-neutral-1 pt-20 sm:pt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <FadeUp>
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              Merchants Love Mercora
            </div>
            <h2 className="mt-3 text-3xl font-bold leading-tight tracking-[-0.04em] text-white sm:text-4xl">
              Built for People
              <br />
              Who Build.
            </h2>
          </FadeUp>

          <StaggerGroup className="grid gap-4 md:grid-cols-3">
            {testimonials.map((item) => (
              <StaggerItem key={item.name}>
                <article className="group rounded-[20px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.58),rgba(8,12,28,0.95))] p-5 transition duration-300 hover:-translate-y-1 hover:border-white/15 hover:shadow-[0_18px_40px_rgba(0,0,0,0.2)]">
                  <p className="text-sm leading-7 text-slate-300">&ldquo;{item.quote}&rdquo;</p>

                  <div className="mt-6 flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-1 ring-white/10">
                      <Image
                        src={item.image}
                        alt={item.alt}
                        fill
                        sizes="48px"
                        className="object-cover transition duration-500 group-hover:scale-[1.05]"
                      />
                    </div>

                    <div>
                      <div className="text-sm font-semibold text-white">{item.name}</div>
                      <div className="mt-1 text-xs text-slate-400">{item.role}</div>
                    </div>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </div>
    </section>
  );
}