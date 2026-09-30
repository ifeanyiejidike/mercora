"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { formatDate, formatMoney, platformAdminApi } from "@/lib/api/platform-admin";
import type { PlatformPayoutBatch } from "@/types/platform-admin";

function safeText(value?: string | null) {
  return value && value.trim() ? value : "—";
}

export default function PlatformPayoutBatchDetailPageClient() {
  const params = useParams<{ payoutBatchId: string }>();
  const payoutBatchId = params.payoutBatchId;

  const [batch, setBatch] = useState<PlatformPayoutBatch | null>(null);
  const [status, setStatus] = useState("processing");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      setError("");
      setIsLoading(true);

      try {
        const data = await platformAdminApi.payoutBatchDetail(payoutBatchId);
        setBatch(data);
        setStatus(data.status || "processing");
        setNotes(data.notes || "");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to load payout batch detail.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void run();
  }, [payoutBatchId]);

  async function updateStatus() {
    if (!batch) return;

    setIsSubmitting(true);
    setError("");

    try {
      const updated = await platformAdminApi.updatePayoutBatch(batch.id, {
        status,
        notes,
      });
      setBatch(updated);
      setStatus(updated.status || status);
      setNotes(updated.notes || notes);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update payout batch.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
        <p className="mt-4 text-sm text-slate-300">Loading payout batch detail...</p>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-12 text-center text-slate-300">
        Payout batch not found.
      </div>
    );
  }

  const currency = batch.settlement_currency || "NGN";

  return (
    <main className="space-y-6">
      <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.82),rgba(8,12,28,0.96))] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
        <Link
          href="/platform-admin/payout-batches"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to payout batches
        </Link>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Tag>{safeText(batch.batch_reference)}</Tag>
          <Tag>{safeText(batch.status)}</Tag>
          <Tag>{safeText(batch.settlement_currency)}</Tag>
        </div>

        <h1 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
          Payout batch {safeText(batch.batch_reference)}
        </h1>
      </section>

      {error ? (
        <div className="rounded-[18px] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.72),rgba(8,12,28,0.94))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
          <h2 className="text-xl font-semibold text-white">Batch overview</h2>

          <div className="mt-5 space-y-3">
            <MetricRow label="Status" value={safeText(batch.status)} />
            <MetricRow label="Records" value={String(batch.total_records_count ?? 0)} />
            <MetricRow
              label="Gross amount"
              value={formatMoney(batch.total_gross_amount, currency)}
            />
            <MetricRow
              label="Net amount"
              value={formatMoney(batch.total_net_amount, currency)}
            />
            <MetricRow
              label="Reserve amount"
              value={formatMoney(batch.total_reserve_amount, currency)}
            />
            <MetricRow
              label="Refund amount"
              value={formatMoney(batch.total_refund_amount, currency)}
            />
            <MetricRow
              label="Dispute amount"
              value={formatMoney(batch.total_dispute_amount, currency)}
            />
            <MetricRow label="Scheduled for" value={formatDate(batch.scheduled_for)} />
            <MetricRow label="Processed at" value={formatDate(batch.processed_at)} />
            <MetricRow label="Failed at" value={formatDate(batch.failed_at)} />
            <MetricRow label="Cancelled at" value={formatDate(batch.cancelled_at)} />
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
            <div className="text-sm font-semibold text-white">Metadata</div>
            <pre className="mt-3 whitespace-pre-wrap break-words text-xs leading-6 text-slate-300">
              {JSON.stringify(batch.metadata || {}, null, 2)}
            </pre>
          </div>
        </section>

        <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.72),rgba(8,12,28,0.94))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
          <h2 className="text-xl font-semibold text-white">Update payout batch</h2>

          <div className="mt-5 space-y-4">
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="h-11 w-full rounded-xl border border-white/10 bg-neutral-2 px-4 text-sm text-white outline-none"
            >
              <option value="processing">Processing</option>
              <option value="paid_out">Paid out</option>
              <option value="partially_failed">Partially failed</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <textarea
              rows={5}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Internal notes for this payout batch"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none"
            />

            <button
              type="button"
              onClick={() => void updateStatus()}
              disabled={isSubmitting}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[image:var(--brand-gradient)] px-5 text-sm font-semibold text-white"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Save update
            </button>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
            <div className="text-sm font-semibold text-white">Current notes</div>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              {safeText(batch.notes)}
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}

function MetricRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="text-right text-sm font-semibold text-white">{value}</span>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-300">
      {children}
    </span>
  );
}