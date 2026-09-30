"use client";

import { useEffect, useState } from "react";
import { Loader2, ScrollText, Search } from "lucide-react";
import { formatDate, platformAdminApi } from "@/lib/api/platform-admin";
import type { PlatformActionLog } from "@/types/platform-admin";

export default function PlatformActionLogsPageClient() {
  const [days, setDays] = useState(30);
  const [logs, setLogs] = useState<PlatformActionLog[]>([]);
  const [search, setSearch] = useState("");
  const [actionType, setActionType] = useState("");
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
      const data = await platformAdminApi.listActionLogs({
        days,
        action_type: actionType || undefined,
        search: search || undefined,
      });
      setLogs(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load action logs.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  if (isLoading) {
    return <LoadingPanel text="Loading platform action logs..." />;
  }

  return (
    <main className="space-y-6">
      <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.82),rgba(8,12,28,0.96))] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
              <ScrollText className="h-4 w-4" />
              Platform action logs
            </div>
            <h1 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
              Action logs
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

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_260px_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search title, description, target..."
              className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white outline-none"
            />
          </div>

          <select
            value={actionType}
            onChange={(event) => setActionType(event.target.value)}
            className="h-11 rounded-xl border border-white/10 bg-neutral-2 px-4 text-sm text-white outline-none"
          >
            <option value="">All action types</option>
            <option value="merchant_moderation">Merchant moderation</option>
            <option value="payout_status_update">Payout status update</option>
            <option value="dispute_review">Dispute review</option>
            <option value="support_override">Support override</option>
            <option value="system_note">System note</option>
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
        {logs.length === 0 ? (
          <EmptyPanel text="No action logs found." />
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.66),rgba(8,12,28,0.94))] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)]"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Tag>{log.action_type}</Tag>
                {log.target_type ? <Tag>{log.target_type}</Tag> : null}
                {log.target_id ? <Tag>{log.target_id}</Tag> : null}
              </div>

              <div className="mt-4 text-xl font-semibold text-white">
                {log.title}
              </div>

              <div className="mt-2 text-sm leading-7 text-slate-300">
                {log.description || "No description provided."}
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <MetricTile label="Admin user" value={log.admin_user || "—"} />
                <MetricTile label="Merchant" value={log.merchant || "—"} />
                <MetricTile label="Moderation case" value={log.moderation_case || "—"} />
                <MetricTile label="Created" value={formatDate(log.created_at)} />
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                <div className="text-xs uppercase tracking-[0.14em] text-slate-500">
                  Metadata
                </div>
                <pre className="mt-3 whitespace-pre-wrap break-words text-xs leading-6 text-slate-300">
                  {JSON.stringify(log.metadata || {}, null, 2)}
                </pre>
              </div>
            </div>
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