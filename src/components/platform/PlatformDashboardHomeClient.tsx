"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Building2,
  LifeBuoy,
  Loader2,
  ScrollText,
  Store,
  Wallet,
} from "lucide-react";
import {
  formatMoney,
  platformAdminApi,
} from "@/lib/api/platform-admin";
import type { PlatformDashboardSummary } from "@/types/platform-admin";

export default function PlatformDashboardHomeClient() {
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
      setError(
        err instanceof Error ? err.message : "Unable to load platform dashboard.",
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  if (isLoading) {
    return <LoadingPanel text="Loading platform dashboard..." />;
  }

  const currency = "NGN";

  return (
    <main className="space-y-6">
      <section className="overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.82),rgba(8,12,28,0.96))] shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
        <div className="flex flex-col gap-4 border-b border-white/10 px-6 py-6 sm:px-8 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
              <Store className="h-4 w-4" />
              Platform command center
            </div>
            <h1 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
              Platform overview
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
              Central visibility across merchants, payouts, disputes, support, subscriptions, and financial throughput.
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
          <StatCard label="Total merchants" value={String(summary?.merchants.total_merchants || 0)} />
          <StatCard label="New merchants" value={String(summary?.merchants.new_merchants_in_window || 0)} />
          <StatCard
            label="Gross order amount"
            value={formatMoney(summary?.orders.gross_order_amount, currency)}
          />
          <StatCard
            label="Successful payments"
            value={formatMoney(summary?.payments.successful_payment_amount, currency)}
          />
        </div>
      </section>

      {error ? (
        <div className="rounded-[18px] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.72),rgba(8,12,28,0.94))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
          <h2 className="text-xl font-semibold text-white">Quick access</h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <QuickLink
              href="/platform-admin/merchants"
              icon={<Building2 className="h-4 w-4 text-indigo-300" />}
              title="Merchants"
              subtitle="Merchant oversight and moderation"
            />
            <QuickLink
              href="/platform-admin/payout-batches"
              icon={<Wallet className="h-4 w-4 text-indigo-300" />}
              title="Payout Batches"
              subtitle="Payout status review and updates"
            />
            <QuickLink
              href="/platform-admin/disputes"
              icon={<AlertTriangle className="h-4 w-4 text-indigo-300" />}
              title="Disputes"
              subtitle="Dispute monitoring and escalation visibility"
            />
            <QuickLink
              href="/platform-admin/support/tickets"
              icon={<LifeBuoy className="h-4 w-4 text-indigo-300" />}
              title="Support Tickets"
              subtitle="Platform-wide support oversight"
            />
            <QuickLink
              href="/platform-admin/action-logs"
              icon={<ScrollText className="h-4 w-4 text-indigo-300" />}
              title="Action Logs"
              subtitle="Operator traceability and audit visibility"
            />
          </div>
        </section>

        <section className="space-y-6">
          <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.72),rgba(8,12,28,0.94))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
            <h2 className="text-xl font-semibold text-white">Operations snapshot</h2>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <MetricTile label="Suspended merchants" value={String(summary?.merchants.suspended_merchants || 0)} />
              <MetricTile label="Storefronts" value={String(summary?.storefronts.total_storefronts || 0)} />
              <MetricTile label="Eligible settlements" value={String(summary?.settlements.eligible_settlements || 0)} />
              <MetricTile label="On-hold settlements" value={String(summary?.settlements.on_hold_settlements || 0)} />
              <MetricTile label="Scheduled payout batches" value={String(summary?.settlements.payout_batches_scheduled || 0)} />
              <MetricTile label="Processing payout batches" value={String(summary?.settlements.payout_batches_processing || 0)} />
              <MetricTile label="Failed payout batches" value={String(summary?.settlements.payout_batches_failed || 0)} />
              <MetricTile label="Issued receipts" value={String(summary?.receipts.issued_receipts || 0)} />
            </div>
          </section>

          <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.72),rgba(8,12,28,0.94))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
            <h2 className="text-xl font-semibold text-white">Risk and support</h2>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <MetricTile label="Open disputes" value={String(summary?.disputes.open_disputes || 0)} />
              <MetricTile label="Closed disputes" value={String(summary?.disputes.closed_disputes || 0)} />
              <MetricTile label="Tickets created" value={String(summary?.support.tickets_created || 0)} />
              <MetricTile label="Open tickets" value={String(summary?.support.open_tickets || 0)} />
              <MetricTile label="Subscriptions created" value={String(summary?.subscriptions.subscriptions_created || 0)} />
              <MetricTile label="Active current subscriptions" value={String(summary?.subscriptions.active_current_subscriptions || 0)} />
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}

function QuickLink({
  href,
  icon,
  title,
  subtitle,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4 transition hover:border-indigo-500/20 hover:bg-white/[0.04]"
    >
      <div className="flex items-center gap-2 text-white">
        {icon}
        <span className="font-semibold">{title}</span>
      </div>
      <p className="mt-2 text-sm leading-7 text-slate-300">{subtitle}</p>
    </Link>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-4">
      <div className="text-xs uppercase tracking-[0.14em] text-slate-400">{label}</div>
      <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">{value}</div>
    </div>
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