"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Loader2, Search, Wallet } from "lucide-react";
import { formatDate, formatMoney, platformAdminApi } from "@/lib/api/platform-admin";
import type { PlatformPayoutBatch } from "@/types/platform-admin";

export default function PlatformPayoutBatchesPageClient() {
  const [days, setDays] = useState(30);
  const [batches, setBatches] = useState<PlatformPayoutBatch[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [merchantId, setMerchantId] = useState("");
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
      const data = await platformAdminApi.listPayoutBatches({
        days,
        status: status || undefined,
        merchant_id: merchantId || undefined,
        search: search || undefined,
      });
      setBatches(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load payout batches.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  if (isLoading) {
    return <LoadingPanel text="Loading payout batches..." />;
  }

  return (
    <main className="space-y-6">
      <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.82),rgba(8,12,28,0.96))] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
              <Wallet className="h-4 w-4" />
              Platform payout batches
            </div>
            <h1 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
              Payout batch oversight
            </h1>
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

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_220px_1fr_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search batch reference..."
              className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white outline-none"
            />
          </div>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="h-11 rounded-xl border border-white/10 bg-neutral-2 px-4 text-sm text-white outline-none"
          >
            <option value="">All status</option>
            <option value="scheduled">Scheduled</option>
            <option value="processing">Processing</option>
            <option value="paid_out">Paid out</option>
            <option value="partially_failed">Partially failed</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <input
            value={merchantId}
            onChange={(event) => setMerchantId(event.target.value)}
            placeholder="Merchant ID"
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
        {batches.length === 0 ? (
          <EmptyPanel text="No payout batches found." />
        ) : (
          batches.map((batch) => (
            <Link
              key={batch.id}
              href={`/platform-admin/payout-batches/${batch.id}`}
              className="group block rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.66),rgba(8,12,28,0.94))] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1 hover:border-indigo-500/20"
            >
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag>{batch.batch_reference}</Tag>
                    <Tag>{batch.status}</Tag>
                    <Tag>{batch.settlement_currency}</Tag>
                  </div>

                  <div className="mt-4 text-lg font-semibold text-white">
                    {formatMoney(batch.total_net_amount, batch.settlement_currency)}
                  </div>

                  <div className="mt-2 grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
                    <div>Records: {batch.total_records_count}</div>
                    <div>Scheduled: {formatDate(batch.scheduled_for)}</div>
                    <div>Processed: {formatDate(batch.processed_at)}</div>
                    <div>Failed: {formatDate(batch.failed_at)}</div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:min-w-[320px] xl:grid-cols-2">
                  <MetricTile label="Gross" value={formatMoney(batch.total_gross_amount, batch.settlement_currency)} />
                  <MetricTile label="Net" value={formatMoney(batch.total_net_amount, batch.settlement_currency)} />
                  <MetricTile label="Reserve" value={formatMoney(batch.total_reserve_amount, batch.settlement_currency)} />
                  <MetricTile label="Dispute" value={formatMoney(batch.total_dispute_amount, batch.settlement_currency)} />
                </div>
              </div>

              <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white">
                Open payout batch
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