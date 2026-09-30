"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  CreditCard,
  Loader2,
  ReceiptText,
  ShoppingBag,
  Store,
  Wallet,
} from "lucide-react";
import { formatMoney, platformAdminApi } from "@/lib/api/platform-admin";
import type { PlatformDashboardSummary } from "@/types/platform-admin";

export default function PlatformAnalyticsPageClient() {
  const [days, setDays] = useState(30);
  const [summary, setSummary] = useState<PlatformDashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    void load();
  }, [days]);

  async function load(refresh = false) {
    setError("");
    refresh ? setIsRefreshing(true) : setIsLoading(true);

    try {
      const data = await platformAdminApi.dashboard(days);
      setSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load platform analytics.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
        <p className="mt-4 text-sm text-slate-300">Loading analytics...</p>
      </div>
    );
  }

  const currency = "NGN";

  return (
    <main className="space-y-6">
      <section className="overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.82),rgba(8,12,28,0.96))] shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
        <div className="flex flex-col gap-4 border-b border-white/10 px-6 py-6 sm:px-8 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
              <BarChart3 className="h-4 w-4" />
              Platform analytics
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
              Analytics overview
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
              Live platform analytics currently derive from the platform dashboard aggregate contract.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={days}
              onChange={(event) => setDays(Number(event.target.value))}
              className="h-11 rounded-xl border border-white/10 bg-neutral-2 px-4 text-sm text-white outline-none"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>

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
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-2 xl:grid-cols-4 sm:p-8">
          <StatCard
            icon={<Store className="h-4 w-4 text-indigo-300" />}
            label="Storefronts"
            value={String(summary?.storefronts.total_storefronts || 0)}
          />
          <StatCard
            icon={<ShoppingBag className="h-4 w-4 text-indigo-300" />}
            label="Orders"
            value={String(summary?.orders.total_orders || 0)}
          />
          <StatCard
            icon={<CreditCard className="h-4 w-4 text-indigo-300" />}
            label="Successful payment value"
            value={formatMoney(summary?.payments.successful_payment_amount, currency)}
          />
          <StatCard
            icon={<Wallet className="h-4 w-4 text-indigo-300" />}
            label="Eligible settlements"
            value={String(summary?.settlements.eligible_settlements || 0)}
          />
        </div>
      </section>

      {error ? (
        <div className="rounded-[18px] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-3">
        <MetricPanel
          title="Commerce"
          items={[
            ["Gross order amount", formatMoney(summary?.orders.gross_order_amount, currency)],
            ["Successful payments", String(summary?.payments.successful_payments || 0)],
            ["Failed payments", String(summary?.payments.failed_payments || 0)],
            ["Disputed payments", String(summary?.payments.disputed_payments || 0)],
          ]}
        />

        <MetricPanel
          title="Financial operations"
          items={[
            ["Eligible settlements", String(summary?.settlements.eligible_settlements || 0)],
            ["On-hold settlements", String(summary?.settlements.on_hold_settlements || 0)],
            ["Paid-out settlements", String(summary?.settlements.paid_out_settlements || 0)],
            ["Issued receipts", String(summary?.receipts.issued_receipts || 0)],
          ]}
        />

        <MetricPanel
          title="Support and subscriptions"
          items={[
            ["Open tickets", String(summary?.support.open_tickets || 0)],
            ["Tickets created", String(summary?.support.tickets_created || 0)],
            ["Open disputes", String(summary?.disputes.open_disputes || 0)],
            ["Active current subscriptions", String(summary?.subscriptions.active_current_subscriptions || 0)],
          ]}
        />
      </section>

      <section className="rounded-[30px] border border-amber-500/20 bg-amber-500/10 p-6">
        <div className="flex items-start gap-3">
          <ReceiptText className="mt-0.5 h-5 w-5 text-amber-100" />
          <p className="text-sm leading-7 text-amber-100">
            Dedicated platform analytics endpoints like series, segmentation, cohorting, and cross-domain drill-down are not exposed yet, so this page currently uses the platform dashboard aggregate as the live analytics source.
          </p>
        </div>
      </section>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-slate-400">
        {icon}
        {label}
      </div>
      <div className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white">
        {value}
      </div>
    </div>
  );
}

function MetricPanel({
  title,
  items,
}: {
  title: string;
  items: [string, string][];
}) {
  return (
    <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.72),rgba(8,12,28,0.94))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
      <h2 className="text-xl font-semibold text-white">{title}</h2>

      <div className="mt-5 space-y-3">
        {items.map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4"
          >
            <span className="text-sm text-slate-400">{label}</span>
            <span className="text-right text-sm font-semibold text-white">{value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}