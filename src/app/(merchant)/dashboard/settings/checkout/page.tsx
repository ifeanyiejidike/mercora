"use client";

import { useEffect, useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { apiClient, extractApiErrorMessage } from "@/lib/api/axios";
import { useMerchant } from "@/hooks/use-merchant";

type MerchantProfile = {
  id: string;
  allows_direct_local_payments: boolean;
  allows_platform_managed_payments: boolean;
  base_currency: string;
};

type ProviderSetting = {
  id: string;
  provider: string;
  is_enabled: boolean;
  is_visible_at_checkout: boolean;
  is_eligible: boolean;
  supported_charge_currencies: string[];
  notes?: string;
};

type MerchantResponse = {
  data?: MerchantProfile;
};

type ProviderSettingsResponse = {
  data?: ProviderSetting[];
} | ProviderSetting[];

export default function MerchantCheckoutSettingsPage() {
  const { activeMerchant } = useMerchant();

  const [profile, setProfile] = useState<MerchantProfile | null>(null);
  const [providers, setProviders] = useState<ProviderSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    if (!activeMerchant) return;

    setError("");
    setIsLoading(true);

    try {
      const [merchantRes, providerRes] = await Promise.all([
        apiClient.get<MerchantResponse>(`/api/merchants/${activeMerchant.id}/`),
        apiClient.get<ProviderSettingsResponse>(
          `/api/merchants/${activeMerchant.id}/provider-settings/`,
        ),
      ]);

      setProfile(merchantRes.data.data || null);

      const rawProviders = Array.isArray(providerRes.data)
        ? providerRes.data
        : providerRes.data.data || [];

      setProviders(rawProviders);
    } catch (err) {
      setError(extractApiErrorMessage(err, "Unable to load checkout settings."));
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

  const save = async () => {
    if (!activeMerchant || !profile) return;

    setError("");
    setIsSaving(true);

    try {
      await apiClient.patch(`/api/merchants/${activeMerchant.id}/`, {
        allows_direct_local_payments: profile.allows_direct_local_payments,
        allows_platform_managed_payments: profile.allows_platform_managed_payments,
      });

      await apiClient.patch(`/api/merchants/${activeMerchant.id}/provider-settings/`, {
        settings: providers.map((item) => ({
          provider: item.provider,
          is_enabled: item.is_enabled,
          is_visible_at_checkout: item.is_visible_at_checkout,
          supported_charge_currencies:
            item.supported_charge_currencies?.length > 0
              ? item.supported_charge_currencies
              : [profile.base_currency],
          notes: item.notes || "",
        })),
      });

      await load();
    } catch (err) {
      setError(extractApiErrorMessage(err, "Unable to save checkout settings."));
    } finally {
      setIsSaving(false);
    }
  };

  if (!activeMerchant) {
    return (
      <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-12 text-center text-slate-300">
        Select a merchant before opening checkout settings.
      </div>
    );
  }

  if (isLoading || !profile) {
    return (
      <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
        <p className="mt-4 text-sm text-slate-300">Loading checkout settings...</p>
      </div>
    );
  }

  return (
    <main className="space-y-6">
      <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.78),rgba(8,12,28,0.96))] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
          <CreditCard className="h-4 w-4" />
          Checkout settings
        </div>

        <h1 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
          Checkout and payment controls
        </h1>
      </section>

      {error ? (
        <div className="rounded-[18px] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[0.86fr_1.14fr]">
        <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.72),rgba(8,12,28,0.94))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
          <h2 className="text-xl font-semibold text-white">Checkout modes</h2>

          <div className="mt-5 space-y-4">
            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-white">
              <input
                type="checkbox"
                checked={profile.allows_direct_local_payments}
                onChange={(event) =>
                  setProfile((current) =>
                    current
                      ? {
                          ...current,
                          allows_direct_local_payments: event.target.checked,
                        }
                      : current,
                  )
                }
              />
              Merchant-direct local payments
            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-white">
              <input
                type="checkbox"
                checked={profile.allows_platform_managed_payments}
                onChange={(event) =>
                  setProfile((current) =>
                    current
                      ? {
                          ...current,
                          allows_platform_managed_payments: event.target.checked,
                        }
                      : current,
                  )
                }
              />
              Platform-managed payments
            </label>
          </div>
        </section>

        <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.72),rgba(8,12,28,0.94))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
          <h2 className="text-xl font-semibold text-white">Provider settings</h2>

          <div className="mt-5 space-y-4">
            {providers.map((provider, index) => (
              <div
                key={provider.id || provider.provider}
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4"
              >
                <div className="text-sm font-semibold uppercase tracking-[0.12em] text-white">
                  {provider.provider}
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <label className="flex items-center gap-3 text-sm text-white">
                    <input
                      type="checkbox"
                      checked={provider.is_enabled}
                      onChange={(event) =>
                        setProviders((current) =>
                          current.map((item, itemIndex) =>
                            itemIndex === index
                              ? { ...item, is_enabled: event.target.checked }
                              : item,
                          ),
                        )
                      }
                    />
                    Enabled
                  </label>

                  <label className="flex items-center gap-3 text-sm text-white">
                    <input
                      type="checkbox"
                      checked={provider.is_visible_at_checkout}
                      onChange={(event) =>
                        setProviders((current) =>
                          current.map((item, itemIndex) =>
                            itemIndex === index
                              ? {
                                  ...item,
                                  is_visible_at_checkout: event.target.checked,
                                }
                              : item,
                          ),
                        )
                      }
                    />
                    Visible at checkout
                  </label>
                </div>

                <textarea
                  rows={3}
                  value={provider.notes || ""}
                  onChange={(event) =>
                    setProviders((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index
                          ? { ...item, notes: event.target.value }
                          : item,
                      ),
                    )
                  }
                  placeholder="Provider notes"
                  className="mt-4 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none"
                />
              </div>
            ))}

            <button
              type="button"
              onClick={() => void save()}
              disabled={isSaving}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[image:var(--brand-gradient)] px-5 text-sm font-semibold text-white"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Save checkout settings
            </button>
          </div>
        </section>
      </section>
    </main>
  );
}