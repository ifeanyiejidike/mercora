"use client";

import { useEffect, useState } from "react";
import { Route } from "lucide-react";
import { platformAdminApi } from "@/lib/api/platform-admin";
import {
  PlatformEmptyPanel,
  PlatformErrorBanner,
  PlatformLoadingPanel,
  PlatformMetricTile,
  PlatformTag,
} from "@/components/platform/PlatformPrimitives";
import type {
  PlatformProviderRoutingSetting,
  PlatformProviderRoutingSummaryItem,
} from "@/types/platform-admin";

export default function PlatformProviderRoutingPageClient() {
  const [search, setSearch] = useState("");
  const [provider, setProvider] = useState("");
  const [settings, setSettings] = useState<PlatformProviderRoutingSetting[]>([]);
  const [summary, setSummary] = useState<PlatformProviderRoutingSummaryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    setIsLoading(true);

    try {
      const data = await platformAdminApi.listProviderRouting({
        search: search || undefined,
        provider: provider || undefined,
      });
      setSettings(data.results);
      setSummary(data.summary);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load provider routing.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  if (isLoading) {
    return <PlatformLoadingPanel text="Loading provider routing..." />;
  }

  return (
    <main className="space-y-6">
      <section className="overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.82),rgba(8,12,28,0.96))] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.24)] sm:p-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
          <Route className="h-4 w-4" />
          Provider routing
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_220px_auto]">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search merchant, provider, notes..."
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

      <section className="grid gap-4 xl:grid-cols-3">
        {summary.map((item) => (
          <div
            key={item.provider}
            className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.66),rgba(8,12,28,0.94))] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)]"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="text-lg font-semibold text-white">{item.label}</div>
              <PlatformTag>{item.provider}</PlatformTag>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <PlatformMetricTile label="Total" value={String(item.total_settings)} />
              <PlatformMetricTile label="Enabled" value={String(item.enabled_settings)} />
              <PlatformMetricTile label="Visible" value={String(item.visible_at_checkout_settings)} />
              <PlatformMetricTile label="Eligible" value={String(item.eligible_settings)} />
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        {settings.length === 0 ? (
          <PlatformEmptyPanel text="No provider routing settings found." />
        ) : (
          settings.map((item) => (
            <div
              key={item.id}
              className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.66),rgba(8,12,28,0.94))] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)]"
            >
              <div className="flex flex-wrap items-center gap-2">
                <PlatformTag>{item.provider}</PlatformTag>
                {item.is_enabled ? <PlatformTag>Enabled</PlatformTag> : <PlatformTag>Disabled</PlatformTag>}
                {item.is_visible_at_checkout ? <PlatformTag>Visible</PlatformTag> : null}
                {item.is_eligible ? <PlatformTag>Eligible</PlatformTag> : <PlatformTag>Ineligible</PlatformTag>}
              </div>

              <div className="mt-4 text-xl font-semibold text-white">
                {item.merchant_name || item.merchant_id}
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <PlatformMetricTile label="Country" value={item.merchant_country_code || "—"} />
                <PlatformMetricTile label="Base currency" value={item.merchant_base_currency || "—"} />
                <PlatformMetricTile
                  label="Supported charge currencies"
                  value={(item.supported_charge_currencies || []).join(", ") || "—"}
                />
                <PlatformMetricTile label="Override reason" value={item.admin_override_reason || "—"} />
              </div>

              {item.notes ? (
                <p className="mt-4 text-sm leading-7 text-slate-300">{item.notes}</p>
              ) : null}
            </div>
          ))
        )}
      </section>
    </main>
  );
}