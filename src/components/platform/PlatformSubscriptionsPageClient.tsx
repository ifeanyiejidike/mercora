"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Layers3 } from "lucide-react";
import { formatDate, formatMoney, platformAdminApi } from "@/lib/api/platform-admin";
import {
  PlatformEmptyPanel,
  PlatformErrorBanner,
  PlatformLoadingPanel,
  PlatformMetricTile,
  PlatformTag,
} from "@/components/platform/PlatformPrimitives";
import type { PlatformSubscription } from "@/types/platform-admin";

export default function PlatformSubscriptionsPageClient() {
  const [search, setSearch] = useState("");
  const [merchantId, setMerchantId] = useState("");
  const [status, setStatus] = useState("");
  const [isCurrent, setIsCurrent] = useState(false);
  const [subscriptions, setSubscriptions] = useState<PlatformSubscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    setIsLoading(true);

    try {
      const data = await platformAdminApi.listSubscriptions({
        search: search || undefined,
        merchant_id: merchantId || undefined,
        status: status || undefined,
        is_current: isCurrent ? true : undefined,
      });
      setSubscriptions(data.results);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load subscriptions.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  if (isLoading) {
    return <PlatformLoadingPanel text="Loading platform subscriptions..." />;
  }

  return (
    <main className="space-y-6">
      <section className="overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.82),rgba(8,12,28,0.96))] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.24)] sm:p-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
          <Layers3 className="h-4 w-4" />
          Platform subscriptions
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr_180px_auto_auto]">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search plan name or code..."
            className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none"
          />
          <input
            value={merchantId}
            onChange={(event) => setMerchantId(event.target.value)}
            placeholder="Merchant ID"
            className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none"
          />
          <input
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            placeholder="Status"
            className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none"
          />
          <label className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white">
            <input
              type="checkbox"
              checked={isCurrent}
              onChange={(event) => setIsCurrent(event.target.checked)}
            />
            Current only
          </label>
          <button
            type="button"
            onClick={() => void load()}
            className="h-11 rounded-xl bg-[image:var(--brand-gradient)] px-5 text-sm font-semibold text-white"
          >
            Apply
          </button>
        </div>
      </section>

      {error ? <PlatformErrorBanner text={error} /> : null}

      <section className="space-y-4">
        {subscriptions.length === 0 ? (
          <PlatformEmptyPanel text="No subscriptions found." />
        ) : (
          subscriptions.map((subscription) => (
            <Link
              key={subscription.id}
              href={`/platform-admin/subscriptions/${subscription.id}`}
              className="block rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.66),rgba(8,12,28,0.94))] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)] transition hover:border-indigo-500/20"
            >
              <div className="flex flex-wrap items-center gap-2">
                <PlatformTag>{subscription.status}</PlatformTag>
                <PlatformTag>{subscription.source}</PlatformTag>
                {subscription.is_current ? <PlatformTag>Current</PlatformTag> : null}
              </div>

              <div className="mt-4 text-xl font-semibold text-white">
                {subscription.plan_name_snapshot || "Subscription"}
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <PlatformMetricTile label="Plan code" value={subscription.plan_code_snapshot || "—"} />
                <PlatformMetricTile label="Price" value={formatMoney(subscription.price_amount_snapshot, subscription.currency_snapshot || "NGN")} />
                <PlatformMetricTile label="Period end" value={formatDate(subscription.current_period_end_at)} />
                <PlatformMetricTile label="Created" value={formatDate(subscription.created_at)} />
              </div>
            </Link>
          ))
        )}
      </section>
    </main>
  );
}