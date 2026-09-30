"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { formatDate, formatMoney, platformAdminApi } from "@/lib/api/platform-admin";
import type {
  PlatformMerchant,
  PlatformMerchantModerationCase,
} from "@/types/platform-admin";

export default function PlatformMerchantDetailPageClient() {
  const params = useParams<{ merchantId: string }>();
  const merchantId = params.merchantId;

  const [merchant, setMerchant] = useState<PlatformMerchant | null>(null);
  const [moderationResult, setModerationResult] =
    useState<PlatformMerchantModerationCase | null>(null);
  const [title, setTitle] = useState("");
  const [reason, setReason] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [decision, setDecision] = useState("approved");
  const [status, setStatus] = useState("resolved");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    void load();
  }, [merchantId]);

  async function load() {
    setError("");
    setIsLoading(true);

    try {
      const data = await platformAdminApi.merchantDetail(merchantId);
      setMerchant(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load merchant detail.");
    } finally {
      setIsLoading(false);
    }
  }

  async function submitModeration() {
    if (!title.trim()) return;

    setIsSubmitting(true);
    setError("");

    try {
      const result = await platformAdminApi.moderateMerchant(merchantId, {
        title,
        reason,
        internal_notes: internalNotes,
        decision,
        status,
      });

      setModerationResult(result);
      setTitle("");
      setReason("");
      setInternalNotes("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to apply moderation.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <LoadingPanel text="Loading merchant detail..." />;
  }

  if (!merchant) {
    return <EmptyPanel text="Merchant not found." />;
  }

  const currency = merchant.base_currency || "NGN";
  const settlementCurrency = merchant.default_settlement_currency || currency;

  return (
    <main className="space-y-6">
      <section className="overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.82),rgba(8,12,28,0.96))] shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
        <div className="border-b border-white/10 px-6 py-6 sm:px-8">
          <Link
            href="/platform-admin/merchants"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to merchants
          </Link>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Tag>{merchant.country_code || "country"}</Tag>
            <Tag>{merchant.activation_state || "activation"}</Tag>
            <Tag>{merchant.onboarding_state || "onboarding"}</Tag>
            {merchant.is_suspended ? <Tag>Suspended</Tag> : null}
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
            {merchant.public_display_name || merchant.legal_business_name || "Merchant"}
          </h1>

          <p className="mt-3 text-sm text-slate-400">
            {merchant.legal_business_name || "No legal business name"}
          </p>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-2 xl:grid-cols-4 sm:p-8">
          <StatCard label="Storefronts" value={String(merchant.storefront_count)} />
          <StatCard label="Orders" value={String(merchant.orders_count)} />
          <StatCard label="Successful payments" value={String(merchant.successful_payments_count)} />
          <StatCard label="Current plan" value={merchant.current_plan_name || "No active plan"} />
        </div>
      </section>

      {error ? (
        <div className="rounded-[18px] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="space-y-6">
          <SectionCard title="Merchant overview">
            <MetricRow label="Support email" value={merchant.support_email || "—"} />
            <MetricRow label="Support phone" value={merchant.support_phone_number || "—"} />
            <MetricRow label="Base currency" value={merchant.base_currency || "—"} />
            <MetricRow label="Settlement currency" value={merchant.default_settlement_currency || "—"} />
            <MetricRow label="Gross order amount" value={formatMoney(merchant.gross_order_amount, currency)} />
            <MetricRow
              label="Eligible settlement net"
              value={formatMoney(merchant.eligible_net_settlement_amount, settlementCurrency)}
            />
            <MetricRow label="Subscription status" value={merchant.current_subscription_status || "—"} />
            <MetricRow label="Created" value={formatDate(merchant.created_at)} />
          </SectionCard>

          <SectionCard title="Latest moderation case">
            {merchant.latest_moderation_case ? (
              <div className="space-y-3">
                <MetricRow label="Title" value={merchant.latest_moderation_case.title} />
                <MetricRow label="Status" value={merchant.latest_moderation_case.status} />
                <MetricRow label="Decision" value={merchant.latest_moderation_case.decision} />
                <MetricRow label="Reviewed at" value={formatDate(merchant.latest_moderation_case.reviewed_at)} />
              </div>
            ) : (
              <div className="text-sm text-slate-400">No moderation case yet.</div>
            )}
          </SectionCard>

          {moderationResult ? (
            <SectionCard title="Latest action submitted">
              <div className="space-y-3">
                <MetricRow label="Title" value={moderationResult.title} />
                <MetricRow label="Status" value={moderationResult.status} />
                <MetricRow label="Decision" value={moderationResult.decision} />
                <MetricRow label="Reviewed at" value={formatDate(moderationResult.reviewed_at)} />
              </div>
            </SectionCard>
          ) : null}
        </section>

        <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.72),rgba(8,12,28,0.94))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
          <h2 className="text-xl font-semibold text-white">Apply moderation</h2>

          <div className="mt-5 space-y-4">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Action title"
              className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none"
            />

            <select
              value={decision}
              onChange={(event) => setDecision(event.target.value)}
              className="h-11 w-full rounded-xl border border-white/10 bg-neutral-2 px-4 text-sm text-white outline-none"
            >
              <option value="none">None</option>
              <option value="approved">Approved</option>
              <option value="restricted">Restricted</option>
              <option value="suspended">Suspended</option>
              <option value="reinstated">Reinstated</option>
            </select>

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="h-11 w-full rounded-xl border border-white/10 bg-neutral-2 px-4 text-sm text-white outline-none"
            >
              <option value="open">Open</option>
              <option value="in_review">In review</option>
              <option value="resolved">Resolved</option>
            </select>

            <textarea
              rows={4}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="External / action reason"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none"
            />

            <textarea
              rows={5}
              value={internalNotes}
              onChange={(event) => setInternalNotes(event.target.value)}
              placeholder="Internal notes"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none"
            />

            <button
              type="button"
              onClick={() => void submitModeration()}
              disabled={isSubmitting || !title.trim()}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[image:var(--brand-gradient)] px-5 text-sm font-semibold text-white"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Apply moderation
            </button>
          </div>
        </section>
      </section>
    </main>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.72),rgba(8,12,28,0.94))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="text-right text-sm font-semibold text-white">{value}</span>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-4">
      <div className="text-xs uppercase tracking-[0.14em] text-slate-400">{label}</div>
      <div className="mt-2 text-base font-semibold text-white">{value}</div>
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