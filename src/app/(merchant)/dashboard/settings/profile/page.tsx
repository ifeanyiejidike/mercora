"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  Globe2,
  Save,
  ShieldCheck,
} from "lucide-react";
import { env } from "@/lib/config/env";
import { useMerchant } from "@/hooks/use-merchant";
import { merchantsApi } from "@/lib/api/merchants";
import type { MerchantUpdatePayload } from "@/types/merchant";

function EmptyActiveMerchantState() {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300">
        <Building2 className="h-6 w-6" />
      </div>
      <h2 className="mt-4 text-2xl font-semibold text-white">
        No active merchant selected
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-300">
        Select or create a merchant from the merchant dashboard first, then return to profile settings.
      </p>
      <Link
        href={env.routes.merchantDashboard}
        className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[image:var(--brand-gradient)] px-6 text-sm font-semibold text-white"
      >
        Go to merchant dashboard
        <ArrowLeft className="h-4 w-4 rotate-180" />
      </Link>
    </div>
  );
}

export default function MerchantSettingsProfilePage() {
  const {
    activeMerchant,
    updateMerchantInState,
  } = useMerchant();

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState<MerchantUpdatePayload>(
    activeMerchant
      ? {
          legal_business_name: activeMerchant.legal_business_name,
          public_display_name: activeMerchant.public_display_name,
          business_type: activeMerchant.business_type,
          support_email: activeMerchant.support_email,
          support_phone_number: activeMerchant.support_phone_number,
          country_code: activeMerchant.country_code,
          base_currency: activeMerchant.base_currency,
          default_settlement_currency:
            activeMerchant.default_settlement_currency,
          description: activeMerchant.description,
          allows_direct_local_payments:
            activeMerchant.allows_direct_local_payments,
          allows_platform_managed_payments:
            activeMerchant.allows_platform_managed_payments,
          metadata: activeMerchant.metadata,
        }
      : {},
  );

  const metadataText = useMemo(
    () => JSON.stringify(form.metadata ?? {}, null, 2),
    [form.metadata],
  );
  const [metadataState, setMetadataState] = useState(metadataText);

  if (!activeMerchant) {
    return <EmptyActiveMerchantState />;
  }

  const updateField = <K extends keyof MerchantUpdatePayload>(
    field: K,
    value: MerchantUpdatePayload[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsSaving(true);

    try {
      const parsedMetadata = JSON.parse(metadataState) as Record<string, unknown>;

      const updatedMerchant = await merchantsApi.update(activeMerchant.id, {
        ...form,
        legal_business_name: form.legal_business_name?.trim(),
        public_display_name: form.public_display_name?.trim(),
        support_email: form.support_email?.trim(),
        support_phone_number: form.support_phone_number?.trim(),
        country_code: form.country_code?.trim().toUpperCase(),
        base_currency: form.base_currency?.trim().toUpperCase(),
        default_settlement_currency:
          form.default_settlement_currency?.trim().toUpperCase(),
        description: form.description?.trim(),
        metadata: parsedMetadata,
      });

      updateMerchantInState(updatedMerchant);
      setSuccessMessage("Merchant profile updated successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update merchant profile.",
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
            <Building2 className="h-4 w-4" />
            Merchant profile
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
            Manage merchant identity and operating profile.
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
            Update the merchant business identity, support channels, currencies, and payment model preferences from one place.
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
            <StatCard
              label="Status"
              value={activeMerchant.status.replaceAll("_", " ")}
              icon={<BadgeCheck className="h-4 w-4 text-indigo-300" />}
            />
            <StatCard
              label="Onboarding"
              value={activeMerchant.onboarding_status.replaceAll("_", " ")}
              icon={<ShieldCheck className="h-4 w-4 text-indigo-300" />}
            />
            <StatCard
              label="Country"
              value={activeMerchant.country_code}
              icon={<Globe2 className="h-4 w-4 text-indigo-300" />}
            />
            <StatCard
              label="Currency"
              value={activeMerchant.base_currency}
              icon={<Globe2 className="h-4 w-4 text-indigo-300" />}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Legal business name
              </label>
              <input
                value={form.legal_business_name || ""}
                onChange={(event) =>
                  updateField("legal_business_name", event.target.value)
                }
                placeholder="Zuri & Co. Limited"
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400/50 focus:bg-white/[0.06]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Public display name
              </label>
              <input
                value={form.public_display_name || ""}
                onChange={(event) =>
                  updateField("public_display_name", event.target.value)
                }
                placeholder="Zuri & Co."
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400/50 focus:bg-white/[0.06]"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Business type
              </label>
              <select
                value={form.business_type || "registered_business"}
                onChange={(event) =>
                  updateField(
                    "business_type",
                    event.target.value as MerchantUpdatePayload["business_type"],
                  )
                }
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none focus:border-indigo-400/50 focus:bg-white/[0.06]"
              >
                <option value="individual" className="bg-neutral-2 text-slate-300">
                  Individual
                </option>
                <option
                  value="registered_business"
                  className="bg-neutral-2 text-slate-300"
                >
                  Registered Business
                </option>
                <option value="non_profit" className="bg-neutral-2 text-slate-300">
                  Non Profit
                </option>
                <option value="other" className="bg-neutral-2 text-slate-300">
                  Other
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Country code
              </label>
              <input
                value={form.country_code || ""}
                onChange={(event) =>
                  updateField("country_code", event.target.value)
                }
                placeholder="NG"
                maxLength={2}
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 uppercase text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400/50 focus:bg-white/[0.06]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Base currency
              </label>
              <input
                value={form.base_currency || ""}
                onChange={(event) =>
                  updateField("base_currency", event.target.value)
                }
                placeholder="NGN"
                maxLength={3}
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 uppercase text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400/50 focus:bg-white/[0.06]"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Settlement currency
              </label>
              <input
                value={form.default_settlement_currency || ""}
                onChange={(event) =>
                  updateField("default_settlement_currency", event.target.value)
                }
                placeholder="NGN"
                maxLength={3}
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 uppercase text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400/50 focus:bg-white/[0.06]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Support email
              </label>
              <input
                type="email"
                value={form.support_email || ""}
                onChange={(event) =>
                  updateField("support_email", event.target.value)
                }
                placeholder="support@business.com"
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400/50 focus:bg-white/[0.06]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Support phone
              </label>
              <input
                value={form.support_phone_number || ""}
                onChange={(event) =>
                  updateField("support_phone_number", event.target.value)
                }
                placeholder="+234 800 000 0000"
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400/50 focus:bg-white/[0.06]"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Description
            </label>
            <textarea
              rows={5}
              value={form.description || ""}
              onChange={(event) => updateField("description", event.target.value)}
              placeholder="Describe the merchant business."
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

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
              <input
                type="checkbox"
                checked={Boolean(form.allows_direct_local_payments)}
                onChange={(event) =>
                  updateField("allows_direct_local_payments", event.target.checked)
                }
                className="mt-1 h-4 w-4"
              />
              <div>
                <div className="text-sm font-semibold text-white">
                  Allow direct local payments
                </div>
                <p className="mt-1 text-xs leading-6 text-slate-400">
                  Merchant-direct payment handling.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
              <input
                type="checkbox"
                checked={Boolean(form.allows_platform_managed_payments)}
                onChange={(event) =>
                  updateField(
                    "allows_platform_managed_payments",
                    event.target.checked,
                  )
                }
                className="mt-1 h-4 w-4"
              />
              <div>
                <div className="text-sm font-semibold text-white">
                  Allow platform managed payments
                </div>
                <p className="mt-1 text-xs leading-6 text-slate-400">
                  Platform-managed checkout flow.
                </p>
              </div>
            </label>
          </div>

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
              {isSaving ? "Saving..." : "Save profile"}
              <Save className="h-4 w-4" />
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-4">
      <div className="flex items-center gap-2 text-slate-400">
        {icon}
        <span className="text-xs uppercase tracking-[0.14em]">{label}</span>
      </div>
      <div className="mt-2 text-sm font-semibold capitalize text-white">
        {value}
      </div>
    </div>
  );
}