"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Building2, Loader2, Search } from "lucide-react";
import { formatDate, formatMoney, platformAdminApi } from "@/lib/api/platform-admin";
import type { PlatformMerchant } from "@/types/platform-admin";

export default function PlatformMerchantsPageClient() {
  const [merchants, setMerchants] = useState<PlatformMerchant[]>([]);
  const [search, setSearch] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    void load();
  }, []);

  async function load(refresh = false) {
    setError("");
    refresh ? setIsRefreshing(true) : setIsLoading(true);

    try {
      const data = await platformAdminApi.listMerchants({
        search: search || undefined,
        country_code: countryCode || undefined,
      });
      setMerchants(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load merchants.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  if (isLoading) {
    return <LoadingPanel text="Loading platform merchants..." />;
  }

  return (
    <main className="space-y-6">
      <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.82),rgba(8,12,28,0.96))] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
              <Building2 className="h-4 w-4" />
              Platform merchants
            </div>
            <h1 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
              Merchant oversight
            </h1>
          </div>

          <button
            type="button"
            onClick={() => void load(true)}
            disabled={isRefreshing}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[image:var(--brand-gradient)] px-5 text-sm font-semibold text-white"
          >
            {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Refresh
          </button>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_220px_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search merchant name, legal name, or support email..."
              className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white outline-none"
            />
          </div>

          <input
            value={countryCode}
            onChange={(event) => setCountryCode(event.target.value.toUpperCase())}
            placeholder="Country code"
            className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none"
          />

          <button
            type="button"
            onClick={() => void load(true)}
            className="h-11 rounded-xl border border-white/14 bg-white/[0.03] px-5 text-sm font-semibold text-white"
          >
            Apply
          </button>
        </div>
      </section>

      {error ? (
        <div className="rounded-[18px] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      <section className="space-y-4">
        {merchants.length === 0 ? (
          <EmptyPanel text="No merchants found." />
        ) : (
          merchants.map((merchant) => (
            <Link
              key={merchant.id}
              href={`/platform-admin/merchants/${merchant.id}`}
              className="group block rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.66),rgba(8,12,28,0.94))] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1 hover:border-indigo-500/20"
            >
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag>{merchant.country_code || "country"}</Tag>
                    <Tag>{merchant.activation_state || "activation"}</Tag>
                    <Tag>{merchant.onboarding_state || "onboarding"}</Tag>
                    {merchant.is_suspended ? <Tag>Suspended</Tag> : null}
                  </div>

                  <h2 className="mt-4 truncate text-2xl font-semibold tracking-[-0.03em] text-white">
                    {merchant.public_display_name || merchant.legal_business_name || "Merchant"}
                  </h2>

                  <div className="mt-2 text-sm text-slate-400">
                    {merchant.legal_business_name || "No legal business name"}
                  </div>

                  <div className="mt-3 grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
                    <div>{merchant.support_email || "No support email"}</div>
                    <div>{merchant.support_phone_number || "No support phone"}</div>
                  </div>

                  <div className="mt-3 text-xs text-slate-500">
                    Created: {formatDate(merchant.created_at)}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:min-w-[360px] xl:grid-cols-2">
                  <MetricTile label="Storefronts" value={String(merchant.storefront_count)} />
                  <MetricTile label="Orders" value={String(merchant.orders_count)} />
                  <MetricTile label="Successful payments" value={String(merchant.successful_payments_count)} />
                  <MetricTile label="Gross order amount" value={formatMoney(merchant.gross_order_amount, merchant.base_currency || "NGN")} />
                  <MetricTile label="Eligible settlement net" value={formatMoney(merchant.eligible_net_settlement_amount, merchant.default_settlement_currency || merchant.base_currency || "NGN")} />
                  <MetricTile label="Current plan" value={merchant.current_plan_name || "No active plan"} />
                </div>
              </div>

              <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white">
                Open merchant
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))
        )}
      </section>
    </main>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-300">
      {children}
    </span>
  );
}

function MetricTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
      <div className="text-xs uppercase tracking-[0.14em] text-slate-500">{label}</div>
      <div className="mt-2 text-sm font-semibold text-white">{value}</div>
    </div>
  );
}

function LoadingPanel({ text }: { text: string }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
      <p className="mt-4 text-sm text-slate-300">{text}</p>
    </div>
  );
}

function EmptyPanel({ text }: { text: string }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-12 text-center text-slate-300">
      {text}
    </div>
  );
}