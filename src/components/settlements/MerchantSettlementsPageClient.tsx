"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, Wallet } from "lucide-react";
import { merchantOperationsApi, formatDate, formatMoney } from "@/lib/api/merchant-operations";
import { useMerchant } from "@/hooks/use-merchant";
import type {
  MerchantPayoutBatch,
  MerchantSettlementRecord,
  MerchantSettlementSummary,
} from "@/types/merchant-operations";
import {
  EmptyState,
  ErrorBanner,
  LoadingState,
  StatCard,
  Tag,
} from "@/components/merchant/MerchantOpsPrimitives";

export default function MerchantSettlementsPageClient() {
  const { activeMerchant } = useMerchant();

  const [summary, setSummary] = useState<MerchantSettlementSummary | null>(null);
  const [records, setRecords] = useState<MerchantSettlementRecord[]>([]);
  const [batches, setBatches] = useState<MerchantPayoutBatch[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [provider, setProvider] = useState("");
  const [selectedSettlementIds, setSelectedSettlementIds] = useState<string[]>([]);
  const [scheduledFor, setScheduledFor] = useState("");
  const [batchNotes, setBatchNotes] = useState("");
  const [updatingBatchId, setUpdatingBatchId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState("");

  const currency = activeMerchant?.base_currency || "NGN";

  const load = async () => {
    if (!activeMerchant) return;

    setError("");
    setIsLoading(true);

    try {
      const [summaryData, recordsData, batchesData] = await Promise.all([
        merchantOperationsApi.settlementSummary(activeMerchant.id),
        merchantOperationsApi.listSettlementRecords(activeMerchant.id, {
          search: search || undefined,
          status: status || undefined,
          provider: provider || undefined,
        }),
        merchantOperationsApi.listPayoutBatches(activeMerchant.id),
      ]);

      setSummary(summaryData);
      setRecords(recordsData.results);
      setBatches(batchesData.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load settlements.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!activeMerchant) {
      setIsLoading(false);
      return;
    }
    void load();
  }, [activeMerchant]);

  const toggleSettlementSelection = (settlementId: string) => {
    setSelectedSettlementIds((current) =>
      current.includes(settlementId)
        ? current.filter((item) => item !== settlementId)
        : [...current, settlementId],
    );
  };

  const createBatch = async () => {
    if (!activeMerchant) return;

    setIsMutating(true);
    setError("");

    try {
      await merchantOperationsApi.createPayoutBatch(activeMerchant.id, {
        settlement_ids: selectedSettlementIds,
        scheduled_for: scheduledFor ? new Date(scheduledFor).toISOString() : null,
        notes: batchNotes,
      });

      setSelectedSettlementIds([]);
      setScheduledFor("");
      setBatchNotes("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create payout batch.");
    } finally {
      setIsMutating(false);
    }
  };

  const updateBatchStatus = async (batchId: string, nextStatus: string) => {
    if (!activeMerchant) return;

    setUpdatingBatchId(batchId);
    setError("");

    try {
      await merchantOperationsApi.updatePayoutBatch(activeMerchant.id, batchId, {
        status: nextStatus,
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update payout batch.");
    } finally {
      setUpdatingBatchId("");
    }
  };

  if (!activeMerchant) {
    return <EmptyState text="Select a merchant before opening settlements." />;
  }

  if (isLoading) {
    return <LoadingState text="Loading settlements..." />;
  }

  return (
    <main className="space-y-6">
      <section className="overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.78),rgba(8,12,28,0.96))] shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
        <div className="border-b border-white/10 px-6 py-6 sm:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
            <Wallet className="h-4 w-4" />
            Settlements
          </div>
          <h1 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
            Merchant settlements
          </h1>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-4 sm:p-8">
          <StatCard label="Overall records" value={String(summary?.overall?.count || 0)} />
          <StatCard
            label="Overall net"
            value={formatMoney(summary?.overall?.net_amount, currency)}
          />
          <StatCard
            label="Eligible count"
            value={String(summary?.eligible_for_payout?.count || 0)}
          />
          <StatCard
            label="Eligible net"
            value={formatMoney(summary?.eligible_for_payout?.net_amount, currency)}
          />
        </div>
      </section>

      {error ? <ErrorBanner text={error} /> : null}

      <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <section className="space-y-6">
          <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.72),rgba(8,12,28,0.94))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
            <div className="grid gap-4 lg:grid-cols-[1fr_220px_220px_auto]">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search payment/order reference..."
                className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none"
              />
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="h-11 rounded-xl border border-white/10 bg-neutral-2 px-4 text-sm text-white outline-none"
              >
                <option value="">All status</option>
                <option value="on_hold">On hold</option>
                <option value="eligible">Eligible</option>
                <option value="scheduled">Scheduled</option>
                <option value="paid_out">Paid out</option>
                <option value="adjusted">Adjusted</option>
                <option value="blocked">Blocked</option>
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
                onClick={() => void load()}
                className="h-11 rounded-xl border border-white/14 bg-white/[0.03] px-5 text-sm font-semibold text-white"
              >
                Apply
              </button>
            </div>

            <div className="mt-6 space-y-3">
              {records.length === 0 ? (
                <div className="text-sm text-slate-400">No settlement records found.</div>
              ) : (
                records.map((record) => (
                  <div
                    key={record.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Tag>{record.payment_reference || "payment"}</Tag>
                          <Tag>{record.status || "status"}</Tag>
                          {record.provider ? <Tag>{record.provider}</Tag> : null}
                        </div>
                        <div className="mt-3 text-sm font-semibold text-white">
                          {record.order_number || "Settlement record"}
                        </div>
                        <div className="mt-1 text-sm text-slate-400">
                          Eligible: {formatDate(record.eligible_at)}
                        </div>
                        <div className="mt-2 text-sm text-slate-300">
                          Net:{" "}
                          {formatMoney(
                            record.net_amount,
                            record.settlement_currency || currency,
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row">
                        <label className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white">
                          <input
                            type="checkbox"
                            checked={selectedSettlementIds.includes(record.id)}
                            onChange={() => toggleSettlementSelection(record.id)}
                            className="h-4 w-4"
                          />
                          Select
                        </label>

                        <Link
                          href={`/dashboard/settlements/${record.id}`}
                          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white"
                        >
                          Open
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.72),rgba(8,12,28,0.94))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
            <h2 className="text-xl font-semibold text-white">Create payout batch</h2>

            <div className="mt-5 space-y-4">
              <input
                type="datetime-local"
                value={scheduledFor}
                onChange={(event) => setScheduledFor(event.target.value)}
                className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none"
              />
              <textarea
                rows={4}
                value={batchNotes}
                onChange={(event) => setBatchNotes(event.target.value)}
                placeholder="Batch notes"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none"
              />
              <div className="text-sm text-slate-400">
                Selected settlements: {selectedSettlementIds.length}
              </div>
              <button
                type="button"
                onClick={() => void createBatch()}
                disabled={isMutating}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[image:var(--brand-gradient)] px-5 text-sm font-semibold text-white"
              >
                {isMutating ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Create payout batch
              </button>
            </div>
          </section>
        </section>

        <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.72),rgba(8,12,28,0.94))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
          <h2 className="text-xl font-semibold text-white">Payout batches</h2>

          <div className="mt-5 space-y-4">
            {batches.length === 0 ? (
              <div className="text-sm text-slate-400">No payout batches found.</div>
            ) : (
              batches.map((batch) => (
                <div
                  key={batch.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag>{batch.batch_reference}</Tag>
                    <Tag>{batch.status || "status"}</Tag>
                    {batch.settlement_currency ? <Tag>{batch.settlement_currency}</Tag> : null}
                  </div>

                  <div className="mt-3 grid gap-2 text-sm text-slate-300">
                    <div>Records: {String(batch.total_records_count || 0)}</div>
                    <div>
                      Net amount:{" "}
                      {formatMoney(batch.total_net_amount, batch.settlement_currency || currency)}
                    </div>
                    <div>Scheduled: {formatDate(batch.scheduled_for)}</div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => void updateBatchStatus(batch.id, "processing")}
                      disabled={updatingBatchId === batch.id}
                      className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white"
                    >
                      Move to processing
                    </button>
                    <button
                      type="button"
                      onClick={() => void updateBatchStatus(batch.id, "paid_out")}
                      disabled={updatingBatchId === batch.id}
                      className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-100"
                    >
                      Mark paid out
                    </button>
                    <button
                      type="button"
                      onClick={() => void updateBatchStatus(batch.id, "failed")}
                      disabled={updatingBatchId === batch.id}
                      className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-100"
                    >
                      Mark failed
                    </button>
                    <button
                      type="button"
                      onClick={() => void updateBatchStatus(batch.id, "cancelled")}
                      disabled={updatingBatchId === batch.id}
                      className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white"
                    >
                      Cancel batch
                    </button>
                  </div>

                  <Link
                    href={`/dashboard/settlements/payout-batches/${batch.id}`}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white underline underline-offset-4"
                  >
                    Open payout batch
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ))
            )}
          </div>
        </section>
      </section>
    </main>
  );
}