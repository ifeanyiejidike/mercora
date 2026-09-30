"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Wallet } from "lucide-react";
import { formatDate, formatMoney, platformAdminApi } from "@/lib/api/platform-admin";
import {
  PlatformEmptyPanel,
  PlatformErrorBanner,
  PlatformLoadingPanel,
  PlatformMetricTile,
  PlatformTag,
} from "@/components/platform/PlatformPrimitives";
import type { PlatformSettlementRecord } from "@/types/platform-admin";

export default function PlatformSettlementsPageClient() {
  const [search, setSearch] = useState("");
  const [merchantId, setMerchantId] = useState("");
  const [status, setStatus] = useState("");
  const [provider, setProvider] = useState("");
  const [records, setRecords] = useState<PlatformSettlementRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    setIsLoading(true);

    try {
      const data = await platformAdminApi.listSettlements({
        search: search || undefined,
        merchant_id: merchantId || undefined,
        status: status || undefined,
        provider: provider || undefined,
      });
      setRecords(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load settlements.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  if (isLoading) {
    return <PlatformLoadingPanel text="Loading platform settlements..." />;
  }

  return (
    <main className="space-y-6">
      <section className="overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.82),rgba(8,12,28,0.96))] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.24)] sm:p-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
          <Wallet className="h-4 w-4" />
          Platform settlements
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr_180px_180px_auto]">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search payment ref or order..."
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
          <input
            value={provider}
            onChange={(event) => setProvider(event.target.value)}
            placeholder="Provider"
            className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none"
          />
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
        {records.length === 0 ? (
          <PlatformEmptyPanel text="No settlements found." />
        ) : (
          records.map((record) => (
            <Link
              key={record.id}
              href={`/platform-admin/settlements/${record.id}`}
              className="block rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.66),rgba(8,12,28,0.94))] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)] transition hover:border-indigo-500/20"
            >
              <div className="flex flex-wrap items-center gap-2">
                <PlatformTag>{record.status || "status"}</PlatformTag>
                {record.provider ? <PlatformTag>{record.provider}</PlatformTag> : null}
                {record.payment_reference ? <PlatformTag>{record.payment_reference}</PlatformTag> : null}
              </div>

              <div className="mt-4 text-xl font-semibold text-white">
                {formatMoney(record.net_amount, record.settlement_currency || record.base_currency || "NGN")}
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <PlatformMetricTile label="Order" value={record.order_number || "—"} />
                <PlatformMetricTile label="Gross" value={formatMoney(record.gross_amount, record.settlement_currency || record.base_currency || "NGN")} />
                <PlatformMetricTile label="Eligible at" value={formatDate(record.eligible_at)} />
                <PlatformMetricTile label="Paid out at" value={formatDate(record.paid_out_at)} />
              </div>
            </Link>
          ))
        )}
      </section>
    </main>
  );
}