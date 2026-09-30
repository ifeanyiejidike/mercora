"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Brush,
  Building2,
  CreditCard,
  Globe2,
  Landmark,
  Map,
  Palette,
  ScrollText,
  Settings,
  ShieldCheck,
  Store,
  Truck,
} from "lucide-react";
import { env } from "@/lib/config/env";
import { useMerchant } from "@/hooks/use-merchant";
import { useStorefront } from "@/hooks/use-storefront";

function EmptyActiveMerchantState() {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300">
        <Settings className="h-6 w-6" />
      </div>
      <h2 className="mt-4 text-2xl font-semibold text-white">
        No active merchant selected
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-300">
        Select or create a merchant from the dashboard before entering the settings area.
      </p>
      <Link
        href={env.routes.merchantDashboard}
        className="mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-[image:var(--brand-gradient)] px-6 text-sm font-semibold text-white"
      >
        Go to merchant dashboard
      </Link>
    </div>
  );
}

type SettingCard = {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
};

const settingsCards: SettingCard[] = [
  {
    title: "Profile",
    description:
      "Merchant legal identity, support channels, country, base currency, and payment mode preferences.",
    href: "/dashboard/settings/profile",
    icon: Building2,
    badge: "Live",
  },
  {
    title: "Store",
    description:
      "Core storefront structure, public store details, visibility, contact channels, SEO, and order acceptance.",
    href: "/dashboard/settings/store",
    icon: Store,
    badge: "Live",
  },
  {
    title: "Branding",
    description:
      "Logo, banner image, favicon, and primary public CTA settings for the storefront brand presentation.",
    href: "/dashboard/settings/branding",
    icon: Palette,
    badge: "Live",
  },
  {
    title: "Domain",
    description:
      "Custom domain configuration, verification token visibility, and storefront publish/unpublish controls.",
    href: "/dashboard/settings/domain",
    icon: Globe2,
    badge: "Live",
  },
  {
    title: "KYC",
    description:
      "Business verification details, contact person records, document metadata, and review submission.",
    href: "/dashboard/settings/kyc",
    icon: ShieldCheck,
    badge: "Live",
  },
  {
    title: "Payouts",
    description:
      "Bank details, payout method, thresholds, reserve percentage, settlement delay, and review state.",
    href: "/dashboard/settings/payouts",
    icon: Landmark,
    badge: "Live",
  },
  {
    title: "Payment Methods",
    description:
      "Provider enablement, checkout visibility, supported currencies, and provider notes.",
    href: "/dashboard/settings/payment-methods",
    icon: CreditCard,
    badge: "Live",
  },
  {
    title: "Policies",
    description:
      "Storefront-facing refund, privacy, terms, and fulfillment policy content management.",
    href: "/dashboard/settings/policies",
    icon: ScrollText,
    badge: "Live",
  },
  {
    title: "Checkout",
    description:
      "Checkout experience rules, buyer trust flow, and operational consistency for conversion.",
    href: "/dashboard/settings/checkout",
    icon: Brush,
    badge: "Planned",
  },
  {
    title: "Shipping",
    description:
      "Shipping rules, delivery handling, fulfillment visibility, and operational routing.",
    href: "/dashboard/settings/shipping",
    icon: Truck,
    badge: "Planned",
  },
];

export default function MerchantSettingsHomePage() {
  const { activeMerchant } = useMerchant();
  const { activeStorefront } = useStorefront();

  if (!activeMerchant) {
    return <EmptyActiveMerchantState />;
  }

  return (
    <main className="space-y-6">
      <section className="overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.78),rgba(8,12,28,0.96))] shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
        <div className="grid gap-8 px-6 py-6 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
              <Settings className="h-4 w-4" />
              Merchant settings
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
              Manage the operational settings for{" "}
              {activeMerchant.public_display_name}.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              This settings area is the control surface for merchant profile, KYC,
              payouts, provider configuration, storefront identity, public domain,
              and policy management.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard
              label="Merchant status"
              value={activeMerchant.status.replaceAll("_", " ")}
            />
            <StatCard
              label="Onboarding"
              value={activeMerchant.onboarding_status.replaceAll("_", " ")}
            />
            <StatCard
              label="KYC"
              value={(activeMerchant.kyc_status || "unsubmitted").replaceAll(
                "_",
                " ",
              )}
            />
            <StatCard
              label="Storefront"
              value={activeStorefront ? activeStorefront.status : "not created"}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {settingsCards.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.68),rgba(8,12,28,0.94))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.2)] transition duration-300 hover:-translate-y-1 hover:border-indigo-500/20 hover:bg-[linear-gradient(180deg,rgba(24,30,60,0.76),rgba(10,14,30,0.96))]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300 transition group-hover:bg-indigo-500/15">
                  <Icon className="h-5 w-5" />
                </div>

                {item.badge ? (
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${
                      item.badge === "Live"
                        ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-200"
                        : "border border-white/10 bg-white/[0.04] text-slate-300"
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </div>

              <h2 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-white">
                {item.title}
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-300">
                {item.description}
              </p>

              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white">
                Open setting
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </div>
            </Link>
          );
        })}
      </section>

      <section className="rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-6">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300">
            <Map className="h-5 w-5" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">
              Merchant settings progression
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-300">
              The live settings pages currently wired are Profile, Store, Branding,
              Domain, KYC, Payouts, Payment Methods, and Policies. Checkout and
              Shipping remain the next structural settings slices.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-4">
      <div className="text-xs uppercase tracking-[0.14em] text-slate-400">
        {label}
      </div>
      <div className="mt-2 text-sm font-semibold capitalize text-white">
        {value}
      </div>
    </div>
  );
}