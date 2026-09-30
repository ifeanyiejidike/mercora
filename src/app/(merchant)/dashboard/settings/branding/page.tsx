"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ImageIcon,
  Link2,
  Palette,
  Save,
  Store,
} from "lucide-react";
import { env } from "@/lib/config/env";
import { useMerchant } from "@/hooks/use-merchant";
import { useStorefront } from "@/hooks/use-storefront";
import type { StorefrontUpdatePayload } from "@/types/storefront";

function EmptyActiveMerchantState() {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300">
        <Palette className="h-6 w-6" />
      </div>
      <h2 className="mt-4 text-2xl font-semibold text-white">
        No active merchant selected
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-300">
        Select or create a merchant from the dashboard before configuring storefront branding.
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
        Branding is applied to the storefront record, so the storefront needs to exist first.
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
  logo_url: string;
  banner_image_url: string;
  favicon_url: string;
  primary_cta_text: string;
  primary_cta_url: string;
};

const emptyForm: FormState = {
  logo_url: "",
  banner_image_url: "",
  favicon_url: "",
  primary_cta_text: "",
  primary_cta_url: "",
};

export default function MerchantSettingsBrandingPage() {
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
      logo_url: activeStorefront.logo_url || "",
      banner_image_url: activeStorefront.banner_image_url || "",
      favicon_url: activeStorefront.favicon_url || "",
      primary_cta_text: activeStorefront.primary_cta_text || "",
      primary_cta_url: activeStorefront.primary_cta_url || "",
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
        logo_url: form.logo_url.trim(),
        banner_image_url: form.banner_image_url.trim(),
        favicon_url: form.favicon_url.trim(),
        primary_cta_text: form.primary_cta_text.trim(),
        primary_cta_url: form.primary_cta_url.trim(),
      };

      await updateStorefront(activeStorefront.id, payload);
      setSuccessMessage("Storefront branding updated successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update storefront branding.",
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
            <Palette className="h-4 w-4" />
            Storefront branding
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
            Manage storefront branding assets and primary CTA.
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
            Control the public-facing media surfaces for the active storefront:
            logo, banner, favicon, and the primary CTA shown to buyers.
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
              label="Public identifier"
              value={activeStorefront.public_identifier}
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Logo URL
                </label>
                <input
                  value={form.logo_url}
                  onChange={(event) => updateField("logo_url", event.target.value)}
                  placeholder="https://..."
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400/50 focus:bg-white/[0.06]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Banner image URL
                </label>
                <input
                  value={form.banner_image_url}
                  onChange={(event) =>
                    updateField("banner_image_url", event.target.value)
                  }
                  placeholder="https://..."
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400/50 focus:bg-white/[0.06]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Favicon URL
                </label>
                <input
                  value={form.favicon_url}
                  onChange={(event) =>
                    updateField("favicon_url", event.target.value)
                  }
                  placeholder="https://..."
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400/50 focus:bg-white/[0.06]"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Primary CTA text
                  </label>
                  <input
                    value={form.primary_cta_text}
                    onChange={(event) =>
                      updateField("primary_cta_text", event.target.value)
                    }
                    placeholder="Shop now"
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400/50 focus:bg-white/[0.06]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Primary CTA URL
                  </label>
                  <input
                    value={form.primary_cta_url}
                    onChange={(event) =>
                      updateField("primary_cta_url", event.target.value)
                    }
                    placeholder="https://... or /products"
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400/50 focus:bg-white/[0.06]"
                  />
                </div>
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
                  {isSaving ? "Saving..." : "Save branding"}
                  <Save className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-5">
              <div className="overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03]">
                <div
                  className="min-h-[220px] border-b border-white/10 bg-cover bg-center"
                  style={
                    form.banner_image_url
                      ? { backgroundImage: `url(${form.banner_image_url})` }
                      : undefined
                  }
                >
                  {!form.banner_image_url ? (
                    <div className="flex min-h-[220px] items-center justify-center text-slate-500">
                      <div className="flex items-center gap-2 text-sm">
                        <ImageIcon className="h-4 w-4" />
                        No banner preview
                      </div>
                    </div>
                  ) : (
                    <div className="min-h-[220px] bg-[linear-gradient(180deg,rgba(4,10,24,0.18),rgba(4,10,24,0.72))]" />
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
                      {form.logo_url ? (
                        <img
                          src={form.logo_url}
                          alt={`${activeStorefront.store_name} logo`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="h-5 w-5 text-slate-500" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-lg font-semibold text-white">
                        {activeStorefront.store_name}
                      </p>
                      <p className="truncate text-sm text-slate-400">
                        {form.primary_cta_text || "No CTA text yet"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-slate-400">
                      <Link2 className="h-3.5 w-3.5 text-indigo-300" />
                      Primary CTA URL
                    </div>
                    <p className="mt-2 break-all text-sm font-semibold text-white">
                      {form.primary_cta_url || "Not configured"}
                    </p>
                  </div>

                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    <div className="text-xs uppercase tracking-[0.14em] text-slate-400">
                      Favicon URL
                    </div>
                    <p className="mt-2 break-all text-sm font-semibold text-white">
                      {form.favicon_url || "Not configured"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
      <div className="mt-2 break-all text-sm font-semibold capitalize text-white">
        {value}
      </div>
    </div>
  );
}