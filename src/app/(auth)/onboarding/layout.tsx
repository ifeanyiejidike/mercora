"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BadgeCheck,
  Building2,
  CreditCard,
  Globe2,
  LayoutGrid,
  Store,
  Wallet,
} from "lucide-react";

type OnboardingLayoutProps = {
  children: ReactNode;
};

const steps = [
  {
    label: "Overview",
    href: "/onboarding",
    icon: LayoutGrid,
  },
  {
    label: "Business",
    href: "/onboarding/business",
    icon: Building2,
  },
  {
    label: "Store",
    href: "/onboarding/store",
    icon: Store,
  },
  {
    label: "Currency",
    href: "/onboarding/currency",
    icon: Globe2,
  },
  {
    label: "Payments",
    href: "/onboarding/payments",
    icon: CreditCard,
  },
  {
    label: "Plan",
    href: "/onboarding/plan",
    icon: Wallet,
  },
  {
    label: "Complete",
    href: "/onboarding/complete",
    icon: BadgeCheck,
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/onboarding") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  const pathname = usePathname() ?? "/onboarding";

  return (
    <div className="min-h-screen bg-neutral-1 text-white">
      <div className="grid min-h-screen lg:grid-cols-[320px_1fr]">
        <aside className="border-b border-white/10 bg-[linear-gradient(180deg,rgba(10,15,34,0.98),rgba(6,10,24,1))] lg:border-b-0 lg:border-r">
          <div className="sticky top-0 px-5 py-6 sm:px-6 lg:px-7">
            <Link
              href="/"
              className="inline-flex items-center gap-3 rounded-2xl transition hover:opacity-95"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[image:var(--brand-gradient)] text-sm font-bold text-white">
                M
              </div>
              <div>
                <div className="text-base font-bold tracking-[-0.04em] text-white">
                  MERCORA
                </div>
                <div className="text-xs text-slate-400">Onboarding flow</div>
              </div>
            </Link>

            <div className="mt-8 rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                Setup progress
              </p>
              <h2 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-white">
                Build your merchant setup step by step.
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Complete each step to create a stronger foundation for storefronts,
                payments, receipts, and merchant operations.
              </p>
            </div>

            <nav className="mt-6 space-y-2" aria-label="Onboarding steps">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const active = isActive(pathname, step.href);

                return (
                  <Link
                    key={step.href}
                    href={step.href}
                    className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                      active
                        ? "border-white/15 bg-white/[0.08]"
                        : "border-transparent text-slate-300 hover:border-white/10 hover:bg-white/[0.04] hover:text-white"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                        active
                          ? "bg-indigo-500/20 text-indigo-200"
                          : "bg-white/[0.05] text-slate-300"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
                        Step {index + 1}
                      </div>
                      <div className="truncate text-sm font-semibold text-white">
                        {step.label}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        <section className="min-w-0">
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
            {children}
          </div>
        </section>
      </div>
    </div>
  );
}