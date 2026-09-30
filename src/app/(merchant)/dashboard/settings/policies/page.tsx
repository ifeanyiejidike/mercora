"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  FileText,
  Save,
  ScrollText,
  ShieldCheck,
  Store,
  Truck,
} from "lucide-react";
import { env } from "@/lib/config/env";
import { useMerchant } from "@/hooks/use-merchant";
import { useStorefront } from "@/hooks/use-storefront";
import type { StorefrontUpdatePayload } from "@/types/storefront";

function EmptyActiveMerchantState() {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300">
        <ScrollText className="h-6 w-6" />
      </div>
      <h2 className="mt-4 text-2xl font-semibold text-white">
        No active merchant selected
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-300">
        Select or create a merchant from the dashboard before managing storefront policies.
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

function NoStorefrontState() {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300">
        <Store className="h-6 w-6" />
      </div>
      <h2 className="mt-4 text-2xl font-semibold text-white">
        Create the storefront first
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-300">
        Policy content is attached to the storefront record, so the storefront needs to exist first.
      </p>
      <Link
        href={env.routes.merchantSettingsStore}
        className="mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-[image:var(--brand-gradient)] px-6 text-sm font-semibold text-white"
      >
        Go to store settings
      </Link>
    </div>
  );
}

type FormState = {
  return_policy: string;
  privacy_policy: string;
  terms_of_service: string;
  fulfillment_policy: string;
};

const emptyForm: FormState = {
  return_policy: "",
  privacy_policy: "",
  terms_of_service: "",
  fulfillment_policy: "",
};

export default function MerchantSettingsPoliciesPage() {
  const { activeMerchant } = useMerchant();
  const { activeStorefront, updateStorefront } = useStorefront();

  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!activeStorefront) {
      setForm(emptyForm);
      return;
    }

    setForm({
      return_policy: activeStorefront.return_policy || "",
      privacy_policy: activeStorefront.privacy_policy || "",
      terms_of_service: activeStorefront.terms_of_service || "",
      fulfillment_policy: activeStorefront.fulfillment_policy || "",
    });
  }, [activeStorefront]);

  if (!activeMerchant) {
    return <EmptyActiveMerchantState />;
  }

  if (!activeStorefront) {
    return <NoStorefrontState />;
  }

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsSaving(true);

    try {
      const payload: StorefrontUpdatePayload = {
        return_policy: form.return_policy.trim(),
        privacy_policy: form.privacy_policy.trim(),
        terms_of_service: form.terms_of_service.trim(),
        fulfillment_policy: form.fulfillment_policy.trim(),
      };

      await updateStorefront(activeStorefront.id, payload);
      setSuccessMessage("Storefront policies updated successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update storefront policies.",
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
            <ScrollText className="h-4 w-4" />
            Storefront policies
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
            Manage public-facing policy content.
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
            Update refund, privacy, terms, and fulfillment policy content for the active storefront.
          </p>
        </div>

        <form className="space-y-6 p-6 sm:p-8" onSubmit={handleSubmit}>
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
            <StatCard label="Storefront" value={activeStorefront.store_name} />
            <StatCard label="Status" value={activeStorefront.status} />
            <StatCard label="Visibility" value={activeStorefront.visibility} />
            <StatCard
              label="Public path"
              value={`/_stores/${activeStorefront.slug}`}
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <PolicyEditor
              title="Return policy"
              icon={<ShieldCheck className="h-4 w-4 text-indigo-300" />}
              value={form.return_policy}
              onChange={(value) => updateField("return_policy", value)}
              placeholder="Explain return conditions, timelines, exclusions, and refund process."
            />

            <PolicyEditor
              title="Privacy policy"
              icon={<FileText className="h-4 w-4 text-indigo-300" />}
              value={form.privacy_policy}
              onChange={(value) => updateField("privacy_policy", value)}
              placeholder="Explain what customer data is collected, how it is used, and privacy rights."
            />

            <PolicyEditor
              title="Terms of service"
              icon={<ScrollText className="h-4 w-4 text-indigo-300" />}
              value={form.terms_of_service}
              onChange={(value) => updateField("terms_of_service", value)}
              placeholder="Explain storefront usage terms, restrictions, and transaction conditions."
            />

            <PolicyEditor
              title="Fulfillment policy"
              icon={<Truck className="h-4 w-4 text-indigo-300" />}
              value={form.fulfillment_policy}
              onChange={(value) => updateField("fulfillment_policy", value)}
              placeholder="Explain delivery, pickup, processing, and fulfillment timelines."
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Link
              href={env.routes.merchantSettingsStore}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/14 bg-white/[0.03] px-6 text-sm font-semibold text-white transition hover:bg-white/[0.06]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to store settings
            </Link>

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[image:var(--brand-gradient)] px-6 text-sm font-semibold text-white shadow-[0_16px_38px_rgba(79,70,229,0.34)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(79,70,229,0.42)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSaving ? "Saving..." : "Save policies"}
              <Save className="h-4 w-4" />
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

function PolicyEditor({
  title,
  icon,
  value,
  onChange,
  placeholder,
}: {
  title: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center gap-2 text-sm font-semibold text-white">
        {icon}
        {title}
      </div>

      <textarea
        rows={10}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-4 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400/50 focus:bg-white/[0.06]"
      />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-4">
      <div className="text-xs uppercase tracking-[0.14em] text-slate-400">
        {label}
      </div>
      <div className="mt-2 break-all text-sm font-semibold capitalize text-white">
        {value}
      </div>
    </div>
  );
}