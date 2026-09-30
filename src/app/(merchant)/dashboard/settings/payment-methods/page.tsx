"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  CreditCard,
  Save,
  Settings2,
} from "lucide-react";
import { env } from "@/lib/config/env";
import { useMerchant } from "@/hooks/use-merchant";
import { merchantsApi } from "@/lib/api/merchants";
import type { MerchantProviderSetting } from "@/types/merchant";

function EmptyActiveMerchantState() {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300">
        <CreditCard className="h-6 w-6" />
      </div>
      <h2 className="mt-4 text-2xl font-semibold text-white">
        No active merchant selected
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-300">
        Select or create a merchant from the dashboard before configuring payment methods.
      </p>
      <Link
        href={env.routes.merchantDashboard}
        className="mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-[image:var(--brand-gradient)] px-6 text-sm font-semibold text-white"
      >
        Go to merchant dashboard
      </Link>
    </div>
  );
}

export default function MerchantSettingsPaymentMethodsPage() {
  const { activeMerchant, refreshMerchants } = useMerchant();

  const [settings, setSettings] = useState<MerchantProviderSetting[]>([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const merchantId = activeMerchant?.id || null;

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      if (!merchantId) {
        if (mounted) {
          setIsLoading(false);
        }
        return;
      }

      try {
        const data = await merchantsApi.getProviderSettings(merchantId);

        if (mounted) {
          setSettings(data);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load payment method settings.",
          );
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void run();

    return () => {
      mounted = false;
    };
  }, [merchantId]);

  if (!activeMerchant) {
    return <EmptyActiveMerchantState />;
  }

  const updateProvider = (
    provider: MerchantProviderSetting["provider"],
    field: keyof MerchantProviderSetting,
    value: unknown,
  ) => {
    setSettings((current) =>
      current.map((item) =>
        item.provider === provider ? { ...item, [field]: value } : item,
      ),
    );
  };

  const handleSave = async () => {
    if (!merchantId) return;

    setError("");
    setSuccessMessage("");
    setIsSaving(true);

    try {
      const payload = {
        settings: settings.map((item) => ({
          provider: item.provider,
          is_enabled: item.is_enabled,
          is_visible_at_checkout: item.is_visible_at_checkout,
          supported_charge_currencies: item.supported_charge_currencies,
          notes: item.notes,
        })),
      };

      const updated = await merchantsApi.updateProviderSettings(
        merchantId,
        payload,
      );

      setSettings(updated);
      setSuccessMessage("Payment method settings updated successfully.");
      await refreshMerchants();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update payment method settings.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="space-y-6">
      <section className="overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.78),rgba(8,12,28,0.96))] shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
        <div className="border-b border-white/10 px-6 py-6 sm:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
            <Settings2 className="h-4 w-4" />
            Payment methods
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
            Configure provider availability and checkout visibility.
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
            Manage Flutterwave, Paystack, and other provider settings for the currently active merchant.
          </p>
        </div>

        <div className="space-y-6 p-6 sm:p-8">
          {error ? (
            <div className="rounded-[18px] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {error}
            </div>
          ) : null}

          {successMessage ? (
            <div className="rounded-[18px] border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
              {successMessage}
            </div>
          ) : null}

          {isLoading ? (
            <div className="h-[280px] animate-pulse rounded-[24px] border border-white/10 bg-white/[0.03]" />
          ) : (
            <div className="space-y-4">
              {settings.map((provider) => (
                <article
                  key={provider.id}
                  className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-2xl">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                        Provider
                      </div>

                      <h2 className="mt-2 text-2xl font-semibold capitalize text-white">
                        {provider.provider}
                      </h2>

                      <p className="mt-3 text-sm leading-7 text-slate-300">
                        {provider.admin_override_reason
                          ? provider.admin_override_reason
                          : "Control whether this provider is enabled and visible at checkout for the active merchant."}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">
                        {provider.is_eligible ? "Eligible" : "Not eligible"}
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">
                        {provider.is_enabled ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 lg:grid-cols-2">
                    <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                      <input
                        type="checkbox"
                        checked={provider.is_enabled}
                        disabled={!provider.is_eligible}
                        onChange={(event) =>
                          updateProvider(
                            provider.provider,
                            "is_enabled",
                            event.target.checked,
                          )
                        }
                        className="mt-1 h-4 w-4"
                      />
                      <div>
                        <div className="text-sm font-semibold text-white">
                          Enabled
                        </div>
                        <p className="mt-1 text-xs leading-6 text-slate-400">
                          Ineligible providers cannot be enabled.
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                      <input
                        type="checkbox"
                        checked={provider.is_visible_at_checkout}
                        onChange={(event) =>
                          updateProvider(
                            provider.provider,
                            "is_visible_at_checkout",
                            event.target.checked,
                          )
                        }
                        className="mt-1 h-4 w-4"
                      />
                      <div>
                        <div className="text-sm font-semibold text-white">
                          Visible at checkout
                        </div>
                        <p className="mt-1 text-xs leading-6 text-slate-400">
                          Controls whether buyers can see this option.
                        </p>
                      </div>
                    </label>
                  </div>

                  <div className="mt-4 grid gap-5 lg:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-200">
                        Supported charge currencies
                      </label>
                      <input
                        value={provider.supported_charge_currencies.join(", ")}
                        onChange={(event) =>
                          updateProvider(
                            provider.provider,
                            "supported_charge_currencies",
                            event.target.value
                              .split(",")
                              .map((item) => item.trim().toUpperCase())
                              .filter(Boolean),
                          )
                        }
                        placeholder="NGN, USD"
                        className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 uppercase text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400/50 focus:bg-white/[0.06]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-200">
                        Notes
                      </label>
                      <input
                        value={provider.notes}
                        onChange={(event) =>
                          updateProvider(provider.provider, "notes", event.target.value)
                        }
                        placeholder="Provider notes"
                        className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400/50 focus:bg-white/[0.06]"
                      />
                    </div>
                  </div>
                </article>
              ))}

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                <Link
                  href={env.routes.merchantDashboard}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/14 bg-white/[0.03] px-6 text-sm font-semibold text-white transition hover:bg-white/[0.06]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to dashboard
                </Link>

                <button
                  type="button"
                  onClick={() => void handleSave()}
                  disabled={isSaving || settings.length === 0}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[image:var(--brand-gradient)] px-6 text-sm font-semibold text-white shadow-[0_16px_38px_rgba(79,70,229,0.34)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(79,70,229,0.42)] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSaving ? "Saving..." : "Save payment methods"}
                  <Save className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}