"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertTriangle, ArrowRight, Loader2, Search } from "lucide-react";
import { formatDate, formatMoney, platformAdminApi } from "@/lib/api/platform-admin";
import type { PlatformDispute } from "@/types/platform-admin";

export default function PlatformDisputesPageClient() {
  const [days, setDays] = useState(30);
  const [disputes, setDisputes] = useState<PlatformDispute[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [provider, setProvider] = useState("");
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
      const data = await platformAdminApi.listDisputes({
        days,
        search: search || undefined,
        status: status || undefined,
        provider: provider || undefined,
      });
      setDisputes(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load disputes.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  if (isLoading) {
    return <LoadingPanel text="Loading disputes..." />;
  }

  return (
    <main className="space-y-6">
      <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.82),rgba(8,12,28,0.96))] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
              <AlertTriangle className="h-4 w-4" />
              Platform disputes
            </div>
            <h1 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
              Dispute monitoring
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

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_220px_220px_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search dispute ID or reason..."
              className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white outline-none"
            />
          </div>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="h-11 rounded-xl border border-white/10 bg-neutral-2 px-4 text-sm text-white outline-none"
          >
            <option value="">All status</option>
            <option value="open">Open</option>
            <option value="under_review">Under review</option>
            <option value="closed">Closed</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </select>

          <select
            value={provider}
            onChange={(event) => setProvider(event.target.value)}
            className="h-11 rounded-xl border border-white/10 bg-neutral-2 px-4 text-sm text-white outline-none"
          >
            <option value="">All providers</option>
            <option value="flutterwave">Flutterwave</option>
            <option value="paystack">Paystack</option>
            <option value="opay">OPay</option>
          </select>

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
        {disputes.length === 0 ? (
          <EmptyPanel text="No disputes found." />
        ) : (
          disputes.map((dispute) => (
            <Link
              key={dispute.id}
              href={`/platform-admin/disputes/${dispute.id}`}
              className="group block rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.66),rgba(8,12,28,0.94))] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1 hover:border-indigo-500/20"
            >
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    {dispute.provider_dispute_id ? <Tag>{dispute.provider_dispute_id}</Tag> : null}
                    <Tag>{dispute.provider}</Tag>
                    <Tag>{dispute.status}</Tag>
                  </div>

                  <div className="mt-4 text-lg font-semibold text-white">
                    {formatMoney(dispute.amount, dispute.currency || "NGN")}
                  </div>

                  <div className="mt-2 text-sm text-slate-300">
                    {dispute.reason || "No reason provided"}
                  </div>

                  <div className="mt-3 grid gap-2 text-sm text-slate-400 sm:grid-cols-2">
                    <div>Opened: {formatDate(dispute.opened_at || dispute.created_at)}</div>
                    <div>Evidence due: {formatDate(dispute.evidence_due_at)}</div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:min-w-[280px] xl:grid-cols-2">
                  <MetricTile label="Currency" value={dispute.currency || "—"} />
                  <MetricTile label="Reason code" value={dispute.provider_reason_code || "—"} />
                  <MetricTile label="Payment ID" value={dispute.payment || "—"} />
                  <MetricTile label="Order ID" value={dispute.order || "—"} />
                </div>
              </div>

              <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white">
                Open dispute
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
      <div className="mt-2 break-all text-sm font-semibold text-white">{value}</div>
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