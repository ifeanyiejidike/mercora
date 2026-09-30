"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { formatDate, formatMoney, merchantOperationsApi } from "@/lib/api/merchant-operations";
import { useMerchant } from "@/hooks/use-merchant";
import type { MerchantPayment } from "@/types/merchant-operations";
import {
  EmptyState,
  ErrorBanner,
  JsonCard,
  LoadingState,
  MetricRow,
  SectionCard,
  Tag,
  safeText,
} from "@/components/merchant/MerchantOpsPrimitives";

export default function MerchantPaymentDetailPageClient() {
  const params = useParams<{ paymentId: string }>();
  const { activeMerchant } = useMerchant();

  const [payment, setPayment] = useState<MerchantPayment | null>(null);
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [verifyProviderReference, setVerifyProviderReference] = useState("");
  const [verifyProviderTransactionId, setVerifyProviderTransactionId] = useState("");
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRefunding, setIsRefunding] = useState(false);
  const [reviewingProofId, setReviewingProofId] = useState("");
  const [error, setError] = useState("");

  const currency = activeMerchant?.base_currency || "NGN";

  async function load() {
    if (!activeMerchant) return;

    setError("");
    setIsLoading(true);

    try {
      const data = await merchantOperationsApi.paymentDetail(activeMerchant.id, params.paymentId);
      setPayment(data);
      setVerifyProviderReference(data.provider_reference || "");
      setVerifyProviderTransactionId(data.provider_transaction_id || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load payment detail.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!activeMerchant) {
      setIsLoading(false);
      return;
    }
    void load();
  }, [activeMerchant, params.paymentId]);

  const moneyCurrency = useMemo(
    () =>
      payment?.settlement_currency ||
      payment?.charge_currency ||
      payment?.base_currency ||
      currency,
    [payment, currency],
  );

  async function verifyPayment() {
    if (!activeMerchant || !payment) return;

    setError("");
    setIsVerifying(true);

    try {
      const updated = await merchantOperationsApi.verifyPayment(activeMerchant.id, payment.id, {
        provider_reference: verifyProviderReference || undefined,
        provider_transaction_id: verifyProviderTransactionId || undefined,
      });
      setPayment(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to verify payment.");
    } finally {
      setIsVerifying(false);
    }
  }

  async function createRefund() {
    if (!activeMerchant || !payment || !refundAmount.trim()) return;

    setError("");
    setIsRefunding(true);

    try {
      await merchantOperationsApi.createRefund(activeMerchant.id, payment.id, {
        amount: refundAmount,
        reason: refundReason || undefined,
      });
      setRefundAmount("");
      setRefundReason("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create refund.");
    } finally {
      setIsRefunding(false);
    }
  }

  async function reviewProof(proofId: string, approve: boolean) {
    if (!activeMerchant || !payment) return;

    setError("");
    setReviewingProofId(proofId);

    try {
      const updated = await merchantOperationsApi.reviewManualProof(
        activeMerchant.id,
        payment.id,
        proofId,
        {
          approve,
          rejection_reason: approve ? undefined : reviewNotes[proofId] || "",
        },
      );
      setPayment(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to review payment proof.");
    } finally {
      setReviewingProofId("");
    }
  }

  if (!activeMerchant) {
    return <EmptyState text="Select a merchant before opening payment detail." />;
  }

  if (isLoading) {
    return <LoadingState text="Loading payment detail..." />;
  }

  if (!payment) {
    return <EmptyState text="Payment not found." />;
  }

  return (
    <main className="space-y-6">
      <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.82),rgba(8,12,28,0.96))] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
        <Link
          href="/dashboard/payments"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to payments
        </Link>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Tag>{payment.payment_reference}</Tag>
          <Tag>{safeText(payment.status)}</Tag>
          <Tag>{safeText(payment.verification_status)}</Tag>
          {payment.provider ? <Tag>{payment.provider}</Tag> : null}
          {payment.mode ? <Tag>{payment.mode}</Tag> : null}
        </div>

        <h1 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
          {payment.payment_reference}
        </h1>
      </section>

      {error ? <ErrorBanner text={error} /> : null}

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionCard title="Payment overview">
          <div className="space-y-3">
            <MetricRow label="Provider reference" value={safeText(payment.provider_reference)} />
            <MetricRow
              label="Provider transaction"
              value={safeText(payment.provider_transaction_id)}
            />
            <MetricRow
              label="Gross amount"
              value={formatMoney(payment.gross_amount, payment.charge_currency || moneyCurrency)}
            />
            <MetricRow
              label="Net amount"
              value={formatMoney(payment.net_amount, moneyCurrency)}
            />
            <MetricRow
              label="Processor fee"
              value={formatMoney(payment.processor_fee_amount, moneyCurrency)}
            />
            <MetricRow
              label="Platform fee"
              value={formatMoney(payment.platform_fee_amount, moneyCurrency)}
            />
            <MetricRow
              label="Reserve amount"
              value={formatMoney(payment.reserve_amount, moneyCurrency)}
            />
            <MetricRow
              label="Refund amount"
              value={formatMoney(payment.refund_amount, moneyCurrency)}
            />
            <MetricRow
              label="Dispute amount"
              value={formatMoney(payment.dispute_amount, moneyCurrency)}
            />
            <MetricRow label="Initialized at" value={formatDate(payment.initialized_at)} />
            <MetricRow label="Successful at" value={formatDate(payment.successful_at)} />
            <MetricRow label="Failed at" value={formatDate(payment.failed_at)} />
          </div>
        </SectionCard>

        <div className="space-y-6">
          <SectionCard title="Verify payment">
            <div className="space-y-4">
              <input
                value={verifyProviderReference}
                onChange={(event) => setVerifyProviderReference(event.target.value)}
                placeholder="Provider reference"
                className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none"
              />
              <input
                value={verifyProviderTransactionId}
                onChange={(event) => setVerifyProviderTransactionId(event.target.value)}
                placeholder="Provider transaction ID"
                className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none"
              />
              <button
                type="button"
                onClick={() => void verifyPayment()}
                disabled={isVerifying}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[image:var(--brand-gradient)] px-5 text-sm font-semibold text-white"
              >
                {isVerifying ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Verify payment
              </button>
            </div>
          </SectionCard>

          <SectionCard title="Manual proofs">
            <div className="space-y-3">
              {(payment.proof_submissions || []).length === 0 ? (
                <div className="text-sm text-slate-400">No manual proofs.</div>
              ) : (
                payment.proof_submissions?.map((proof) => (
                  <div
                    key={proof.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <Tag>{safeText(proof.status)}</Tag>
                      <Tag>{safeText(proof.submitted_by_name)}</Tag>
                    </div>
                    <div className="mt-3 grid gap-3">
                      <MetricRow label="Proof file" value={safeText(proof.proof_file_url)} />
                      <MetricRow label="Submitted at" value={formatDate(proof.created_at)} />
                      <MetricRow label="Note" value={safeText(proof.note)} />
                    </div>

                    <textarea
                      rows={3}
                      value={reviewNotes[proof.id] || ""}
                      onChange={(event) =>
                        setReviewNotes((current) => ({
                          ...current,
                          [proof.id]: event.target.value,
                        }))
                      }
                      placeholder="Rejection reason"
                      className="mt-4 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none"
                    />

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => void reviewProof(proof.id, true)}
                        disabled={reviewingProofId === proof.id}
                        className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-100"
                      >
                        Approve proof
                      </button>
                      <button
                        type="button"
                        onClick={() => void reviewProof(proof.id, false)}
                        disabled={reviewingProofId === proof.id}
                        className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-100"
                      >
                        Reject proof
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </SectionCard>

          <SectionCard title="Refunds and disputes">
            <div className="space-y-4">
              <div className="grid gap-3 lg:grid-cols-[1fr_1fr_auto]">
                <input
                  value={refundAmount}
                  onChange={(event) => setRefundAmount(event.target.value)}
                  placeholder="Refund amount"
                  className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none"
                />
                <input
                  value={refundReason}
                  onChange={(event) => setRefundReason(event.target.value)}
                  placeholder="Refund reason"
                  className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none"
                />
                <button
                  type="button"
                  onClick={() => void createRefund()}
                  disabled={isRefunding || !refundAmount.trim()}
                  className="h-11 rounded-xl bg-[image:var(--brand-gradient)] px-5 text-sm font-semibold text-white"
                >
                  {isRefunding ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Refund
                </button>
              </div>

              {(payment.refunds || []).map((refund) => (
                <div
                  key={refund.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag>Refund</Tag>
                    <Tag>{safeText(refund.status)}</Tag>
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <MetricRow
                      label="Amount"
                      value={formatMoney(refund.amount, refund.currency || moneyCurrency)}
                    />
                    <MetricRow label="Reason" value={safeText(refund.reason)} />
                  </div>
                </div>
              ))}

              {(payment.disputes || []).map((dispute) => (
                <div
                  key={dispute.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag>Dispute</Tag>
                    <Tag>{safeText(dispute.status)}</Tag>
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <MetricRow
                      label="Amount"
                      value={formatMoney(dispute.amount, dispute.currency || moneyCurrency)}
                    />
                    <MetricRow label="Reason" value={safeText(dispute.reason)} />
                  </div>
                </div>
              ))}

              {(payment.refunds || []).length === 0 && (payment.disputes || []).length === 0 ? (
                <div className="text-sm text-slate-400">No refunds or disputes.</div>
              ) : null}
            </div>
          </SectionCard>

          <SectionCard title="Attempts">
            <div className="space-y-3">
              {(payment.attempts || []).length === 0 ? (
                <div className="text-sm text-slate-400">No attempts.</div>
              ) : (
                payment.attempts?.map((attempt) => (
                  <div
                    key={attempt.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <Tag>{safeText(attempt.status)}</Tag>
                      {attempt.provider ? <Tag>{attempt.provider}</Tag> : null}
                    </div>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <MetricRow label="Reference" value={safeText(attempt.provider_reference)} />
                      <MetricRow label="Failure" value={safeText(attempt.failure_message)} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </SectionCard>

          <JsonCard title="Provider metadata" value={payment.provider_metadata_snapshot || {}} />
          <JsonCard title="Last verification payload" value={payment.last_verification_payload || {}} />
          <JsonCard title="Metadata" value={payment.metadata || {}} />
        </div>
      </section>
    </main>
  );
}