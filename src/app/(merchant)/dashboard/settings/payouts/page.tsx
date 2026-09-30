"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CreditCard,
  Landmark,
  Save,
  ShieldCheck,
} from "lucide-react";
import { env } from "@/lib/config/env";
import { useMerchant } from "@/hooks/use-merchant";
import { merchantsApi } from "@/lib/api/merchants";
import type {
  MerchantPayoutPayload,
  MerchantPayoutSettings,
} from "@/types/merchant";

function EmptyActiveMerchantState() {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300">
        <Landmark className="h-6 w-6" />
      </div>
      <h2 className="mt-4 text-2xl font-semibold text-white">
        No active merchant selected
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-300">
        Select or create a merchant from the dashboard before configuring payout settings.
      </p>
      <Link
        href={env.routes.merchantDashboard}
        className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[image:var(--brand-gradient)] px-6 text-sm font-semibold text-white"
      >
        Go to merchant dashboard
      </Link>
    </div>
  );
}

const initialState: MerchantPayoutPayload = {
  payout_method: "bank_transfer",
  account_name: "",
  bank_name: "",
  bank_code: "",
  account_number: "",
  mobile_money_provider: "",
  mobile_money_number: "",
  payout_country_code: "",
  payout_currency: "",
  direct_payment_instructions: "",
  settlement_delay_days: 7,
  reserve_percent: "0.00",
  minimum_payout_amount: "0.00",
  metadata: {},
  submit_for_review: false,
};

export default function MerchantSettingsPayoutsPage() {
  const { activeMerchant, refreshMerchants } = useMerchant();

  const [settings, setSettings] = useState<MerchantPayoutSettings | null>(null);
  const [form, setForm] = useState<MerchantPayoutPayload>(initialState);
  const [metadataState, setMetadataState] = useState("{}");
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
        const data = await merchantsApi.getPayoutSettings(merchantId);

        if (!mounted) return;

        setSettings(data);
        setForm({
          payout_method: data.payout_method,
          account_name: data.account_name,
          bank_name: data.bank_name,
          bank_code: data.bank_code,
          account_number: data.account_number,
          mobile_money_provider: data.mobile_money_provider,
          mobile_money_number: data.mobile_money_number,
          payout_country_code: data.payout_country_code,
          payout_currency: data.payout_currency,
          direct_payment_instructions: data.direct_payment_instructions,
          settlement_delay_days: data.settlement_delay_days,
          reserve_percent: data.reserve_percent,
          minimum_payout_amount: data.minimum_payout_amount,
          metadata: data.metadata,
          submit_for_review: false,
        });
        setMetadataState(JSON.stringify(data.metadata ?? {}, null, 2));
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load payout settings.",
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

  const payoutStatus = useMemo(
    () => settings?.status?.replaceAll("_", " ") || "unconfigured",
    [settings],
  );

  if (!activeMerchant) {
    return <EmptyActiveMerchantState />;
  }

  const updateField = <K extends keyof MerchantPayoutPayload>(
    field: K,
    value: MerchantPayoutPayload[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!merchantId) return;

    setError("");
    setSuccessMessage("");
    setIsSaving(true);

    try {
      const data = await merchantsApi.updatePayoutSettings(merchantId, {
        ...form,
        payout_country_code: form.payout_country_code?.trim().toUpperCase(),
        payout_currency: form.payout_currency?.trim().toUpperCase(),
        metadata: JSON.parse(metadataState) as Record<string, unknown>,
      });

      setSettings(data);
      setSuccessMessage("Payout settings updated successfully.");
      setForm((current) => ({
        ...current,
        submit_for_review: false,
      }));
      await refreshMerchants();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update payout settings.",
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
            <CreditCard className="h-4 w-4" />
            Payout settings
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
            Configure payout handling for the active merchant.
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
            Control account details, payout method, operational thresholds, and review submission from one page.
          </p>
        </div>

        <form className="space-y-6 p-6 sm:p-8" onSubmit={handleSave}>
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

          <div className="grid gap-4 md:grid-cols-4">
            <StatCard label="Merchant" value={activeMerchant.public_display_name} />
            <StatCard label="Payout status" value={payoutStatus} />
            <StatCard
              label="Method"
              value={(settings?.payout_method || "bank_transfer").replaceAll("_", " ")}
            />
            <StatCard
              label="Reviewed at"
              value={settings?.reviewed_at || "Not reviewed"}
            />
          </div>

          {isLoading ? (
            <div className="h-[280px] animate-pulse rounded-[24px] border border-white/10 bg-white/[0.03]" />
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Payout method
                  </label>
                  <select
                    value={form.payout_method || "bank_transfer"}
                    onChange={(event) =>
                      updateField(
                        "payout_method",
                        event.target.value as MerchantPayoutPayload["payout_method"],
                      )
                    }
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none focus:border-indigo-400/50 focus:bg-white/[0.06]"
                  >
                    <option value="bank_transfer" className="bg-neutral-2 text-slate-300">
                      Bank Transfer
                    </option>
                    <option value="mobile_money" className="bg-neutral-2 text-slate-300">
                      Mobile Money
                    </option>
                    <option value="manual" className="bg-neutral-2 text-slate-300">
                      Manual
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Payout currency
                  </label>
                  <input
                    value={form.payout_currency || ""}
                    onChange={(event) =>
                      updateField("payout_currency", event.target.value)
                    }
                    placeholder="NGN"
                    maxLength={3}
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 uppercase text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400/50 focus:bg-white/[0.06]"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Account name
                  </label>
                  <input
                    value={form.account_name || ""}
                    onChange={(event) =>
                      updateField("account_name", event.target.value)
                    }
                    placeholder="Business account name"
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400/50 focus:bg-white/[0.06]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Bank name
                  </label>
                  <input
                    value={form.bank_name || ""}
                    onChange={(event) =>
                      updateField("bank_name", event.target.value)
                    }
                    placeholder="Bank name"
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400/50 focus:bg-white/[0.06]"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Bank code
                  </label>
                  <input
                    value={form.bank_code || ""}
                    onChange={(event) =>
                      updateField("bank_code", event.target.value)
                    }
                    placeholder="Bank code"
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400/50 focus:bg-white/[0.06]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Account number
                  </label>
                  <input
                    value={form.account_number || ""}
                    onChange={(event) =>
                      updateField("account_number", event.target.value)
                    }
                    placeholder="Account number"
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400/50 focus:bg-white/[0.06]"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Mobile money provider
                  </label>
                  <input
                    value={form.mobile_money_provider || ""}
                    onChange={(event) =>
                      updateField("mobile_money_provider", event.target.value)
                    }
                    placeholder="Provider name"
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400/50 focus:bg-white/[0.06]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Mobile money number
                  </label>
                  <input
                    value={form.mobile_money_number || ""}
                    onChange={(event) =>
                      updateField("mobile_money_number", event.target.value)
                    }
                    placeholder="Number"
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400/50 focus:bg-white/[0.06]"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Payout country
                  </label>
                  <input
                    value={form.payout_country_code || ""}
                    onChange={(event) =>
                      updateField("payout_country_code", event.target.value)
                    }
                    placeholder="NG"
                    maxLength={2}
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 uppercase text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400/50 focus:bg-white/[0.06]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Delay days
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.settlement_delay_days ?? 0}
                    onChange={(event) =>
                      updateField(
                        "settlement_delay_days",
                        Number(event.target.value),
                      )
                    }
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none focus:border-indigo-400/50 focus:bg-white/[0.06]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Reserve %
                  </label>
                  <input
                    value={form.reserve_percent || ""}
                    onChange={(event) =>
                      updateField("reserve_percent", event.target.value)
                    }
                    placeholder="0.00"
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400/50 focus:bg-white/[0.06]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Minimum payout
                  </label>
                  <input
                    value={form.minimum_payout_amount || ""}
                    onChange={(event) =>
                      updateField("minimum_payout_amount", event.target.value)
                    }
                    placeholder="0.00"
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400/50 focus:bg-white/[0.06]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Direct payment instructions
                </label>
                <textarea
                  rows={4}
                  value={form.direct_payment_instructions || ""}
                  onChange={(event) =>
                    updateField("direct_payment_instructions", event.target.value)
                  }
                  placeholder="Instructions for direct payment handling"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400/50 focus:bg-white/[0.06]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Metadata (JSON)
                </label>
                <textarea
                  rows={7}
                  value={metadataState}
                  onChange={(event) => setMetadataState(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 font-mono text-sm text-white outline-none focus:border-indigo-400/50 focus:bg-white/[0.06]"
                />
              </div>

              <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                <input
                  type="checkbox"
                  checked={Boolean(form.submit_for_review)}
                  onChange={(event) =>
                    updateField("submit_for_review", event.target.checked)
                  }
                  className="mt-1 h-4 w-4"
                />
                <div>
                  <div className="text-sm font-semibold text-white">
                    Submit payout settings for review
                  </div>
                  <p className="mt-1 text-xs leading-6 text-slate-400">
                    Use this when the payout profile is ready for backend review.
                  </p>
                </div>
              </label>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                <Link
                  href={env.routes.merchantDashboard}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/14 bg-white/[0.03] px-6 text-sm font-semibold text-white transition hover:bg-white/[0.06]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to dashboard
                </Link>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[image:var(--brand-gradient)] px-6 text-sm font-semibold text-white shadow-[0_16px_38px_rgba(79,70,229,0.34)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(79,70,229,0.42)] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSaving ? "Saving..." : "Save payout settings"}
                  <Save className="h-4 w-4" />
                </button>
              </div>
            </>
          )}
        </form>
      </section>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-4">
      <div className="text-xs uppercase tracking-[0.14em] text-slate-400">
        {label}
      </div>
      <div className="mt-2 text-sm font-semibold capitalize text-white">
        {value}
      </div>
    </div>
  );
}