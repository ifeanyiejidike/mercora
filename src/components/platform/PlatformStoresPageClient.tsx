"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Store } from "lucide-react";
import { formatDate, platformAdminApi } from "@/lib/api/platform-admin";
import {
  PlatformEmptyPanel,
  PlatformErrorBanner,
  PlatformLoadingPanel,
  PlatformMetricTile,
  PlatformTag,
} from "@/components/platform/PlatformPrimitives";
import type { PlatformStorefront } from "@/types/platform-admin";

export default function PlatformStoresPageClient() {
  const [search, setSearch] = useState("");
  const [merchantId, setMerchantId] = useState("");
  const [status, setStatus] = useState("");
  const [visibility, setVisibility] = useState("");
  const [domainStatus, setDomainStatus] = useState("");
  const [stores, setStores] = useState<PlatformStorefront[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    setIsLoading(true);

    try {
      const data = await platformAdminApi.listStorefronts({
        search: search || undefined,
        merchant_id: merchantId || undefined,
        status: status || undefined,
        visibility: visibility || undefined,
        domain_status: domainStatus || undefined,
      });
      setStores(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load stores.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  if (isLoading) {
    return <PlatformLoadingPanel text="Loading platform stores..." />;
  }

  return (
    <main className="space-y-6">
      <section className="overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.82),rgba(8,12,28,0.96))] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.24)] sm:p-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
          <Store className="h-4 w-4" />
          Platform stores
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr_180px_180px_180px_auto]">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search store name, slug, domain..."
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
            value={visibility}
            onChange={(event) => setVisibility(event.target.value)}
            placeholder="Visibility"
            className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none"
          />
          <input
            value={domainStatus}
            onChange={(event) => setDomainStatus(event.target.value)}
            placeholder="Domain status"
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
        {stores.length === 0 ? (
          <PlatformEmptyPanel text="No stores found." />
        ) : (
          stores.map((store) => (
            <Link
              key={store.id}
              href={`/platform-admin/stores/${store.id}`}
              className="block rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.66),rgba(8,12,28,0.94))] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)] transition hover:border-indigo-500/20"
            >
              <div className="flex flex-wrap items-center gap-2">
                <PlatformTag>{store.status}</PlatformTag>
                <PlatformTag>{store.visibility}</PlatformTag>
                <PlatformTag>{store.domain_status}</PlatformTag>
                {store.is_accepting_orders ? <PlatformTag>Accepting orders</PlatformTag> : null}
              </div>

              <div className="mt-4 text-xl font-semibold text-white">
                {store.store_name}
              </div>

              <p className="mt-2 text-sm text-slate-300">
                {store.short_description || store.headline || "No storefront summary."}
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <PlatformMetricTile label="Merchant" value={store.merchant_name || "—"} />
                <PlatformMetricTile label="Slug" value={store.slug || "—"} />
                <PlatformMetricTile label="Subdomain" value={store.subdomain || "—"} />
                <PlatformMetricTile label="Custom domain" value={store.custom_domain || "—"} />
              </div>

              <div className="mt-3 text-xs text-slate-500">
                Created: {formatDate(store.created_at)}
              </div>
            </Link>
          ))
        )}
      </section>
    </main>
  );
}