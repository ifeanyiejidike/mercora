"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Save,
  ShoppingBag,
  Store,
  Globe2,
  Megaphone,
} from "lucide-react";
import { env } from "@/lib/config/env";
import { useMerchant } from "@/hooks/use-merchant";
import { useStorefront } from "@/hooks/use-storefront";
import type {
  StorefrontCreatePayload,
  StorefrontUpdatePayload,
} from "@/types/storefront";

function EmptyActiveMerchantState() {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300">
        <Store className="h-6 w-6" />
      </div>
      <h2 className="mt-4 text-2xl font-semibold text-white">
        No active merchant selected
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-300">
        Select or create a merchant from the dashboard before configuring store settings.
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

type FormState = {
  store_name: string;
  slug: string;
  subdomain: string;
  visibility: "public" | "unlisted" | "private";
  headline: string;
  short_description: string;
  about_text: string;
  contact_email: string;
  contact_phone: string;
  whatsapp_number: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state_region: string;
  postal_code: string;
  country_code: string;
  social_links_text: string;
  announcement_text: string;
  is_announcement_active: boolean;
  seo_title: string;
  seo_description: string;
  is_accepting_orders: boolean;
  metadata_text: string;
};

const emptyForm: FormState = {
  store_name: "",
  slug: "",
  subdomain: "",
  visibility: "public",
  headline: "",
  short_description: "",
  about_text: "",
  contact_email: "",
  contact_phone: "",
  whatsapp_number: "",
  address_line_1: "",
  address_line_2: "",
  city: "",
  state_region: "",
  postal_code: "",
  country_code: "",
  social_links_text: "{}",
  announcement_text: "",
  is_announcement_active: false,
  seo_title: "",
  seo_description: "",
  is_accepting_orders: true,
  metadata_text: "{}",
};

export default function MerchantSettingsStorePage() {
  const { activeMerchant } = useMerchant();
  const {
    activeStorefront,
    createStorefront,
    updateStorefront,
  } = useStorefront();

  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!activeMerchant) {
      setForm(emptyForm);
      return;
    }

    if (!activeStorefront) {
      setForm({
        ...emptyForm,
        store_name: activeMerchant.public_display_name,
        slug: "",
        subdomain: "",
        contact_email: activeMerchant.support_email || "",
        contact_phone: activeMerchant.support_phone_number || "",
        country_code: activeMerchant.country_code || "",
      });
      return;
    }

    setForm({
      store_name: activeStorefront.store_name || "",
      slug: activeStorefront.slug || "",
      subdomain: activeStorefront.subdomain || "",
      visibility: activeStorefront.visibility,
      headline: activeStorefront.headline || "",
      short_description: activeStorefront.short_description || "",
      about_text: activeStorefront.about_text || "",
      contact_email: activeStorefront.contact_email || "",
      contact_phone: activeStorefront.contact_phone || "",
      whatsapp_number: activeStorefront.whatsapp_number || "",
      address_line_1: activeStorefront.address_line_1 || "",
      address_line_2: activeStorefront.address_line_2 || "",
      city: activeStorefront.city || "",
      state_region: activeStorefront.state_region || "",
      postal_code: activeStorefront.postal_code || "",
      country_code: activeStorefront.country_code || "",
      social_links_text: JSON.stringify(
        activeStorefront.social_links ?? {},
        null,
        2,
      ),
      announcement_text: activeStorefront.announcement_text || "",
      is_announcement_active: activeStorefront.is_announcement_active,
      seo_title: activeStorefront.seo_title || "",
      seo_description: activeStorefront.seo_description || "",
      is_accepting_orders: activeStorefront.is_accepting_orders,
      metadata_text: JSON.stringify(activeStorefront.metadata ?? {}, null, 2),
    });
  }, [activeMerchant, activeStorefront]);

  if (!activeMerchant) {
    return <EmptyActiveMerchantState />;
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
      const social_links = JSON.parse(form.social_links_text) as Record<
        string,
        unknown
      >;
      const metadata = JSON.parse(form.metadata_text) as Record<string, unknown>;

      if (!activeStorefront) {
        const payload: StorefrontCreatePayload = {
          merchant_id: activeMerchant.id,
          store_name: form.store_name.trim(),
          slug: form.slug.trim(),
          subdomain: form.subdomain.trim() || undefined,
          visibility: form.visibility,
          headline: form.headline.trim(),
          short_description: form.short_description.trim(),
          about_text: form.about_text.trim(),
          contact_email: form.contact_email.trim(),
          contact_phone: form.contact_phone.trim(),
          whatsapp_number: form.whatsapp_number.trim(),
          address_line_1: form.address_line_1.trim(),
          address_line_2: form.address_line_2.trim(),
          city: form.city.trim(),
          state_region: form.state_region.trim(),
          postal_code: form.postal_code.trim(),
          country_code: form.country_code.trim().toUpperCase(),
          social_links,
          announcement_text: form.announcement_text.trim(),
          is_announcement_active: form.is_announcement_active,
          seo_title: form.seo_title.trim(),
          seo_description: form.seo_description.trim(),
          is_accepting_orders: form.is_accepting_orders,
          metadata,
        };

        await createStorefront(payload);
        setSuccessMessage("Storefront created successfully.");
      } else {
        const payload: StorefrontUpdatePayload = {
          store_name: form.store_name.trim(),
          slug: form.slug.trim(),
          subdomain: form.subdomain.trim(),
          visibility: form.visibility,
          headline: form.headline.trim(),
          short_description: form.short_description.trim(),
          about_text: form.about_text.trim(),
          contact_email: form.contact_email.trim(),
          contact_phone: form.contact_phone.trim(),
          whatsapp_number: form.whatsapp_number.trim(),
          address_line_1: form.address_line_1.trim(),
          address_line_2: form.address_line_2.trim(),
          city: form.city.trim(),
          state_region: form.state_region.trim(),
          postal_code: form.postal_code.trim(),
          country_code: form.country_code.trim().toUpperCase(),
          social_links,
          announcement_text: form.announcement_text.trim(),
          is_announcement_active: form.is_announcement_active,
          seo_title: form.seo_title.trim(),
          seo_description: form.seo_description.trim(),
          is_accepting_orders: form.is_accepting_orders,
          metadata,
        };

        await updateStorefront(activeStorefront.id, payload);
        setSuccessMessage("Storefront updated successfully.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save storefront.",
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
            <ShoppingBag className="h-4 w-4" />
            Store settings
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
            Configure the storefront profile for {activeMerchant.public_display_name}.
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
            Manage core store identity, contact channels, announcement behavior, SEO, and public-facing structure.
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
            <StatCard label="Merchant" value={activeMerchant.public_display_name} />
            <StatCard label="Storefront status" value={activeStorefront?.status || "not created"} />
            <StatCard label="Visibility" value={activeStorefront?.visibility || form.visibility} />
            <StatCard label="Orders" value={form.is_accepting_orders ? "accepting" : "paused"} />
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Store name
              </label>
              <input
                value={form.store_name}
                onChange={(event) => updateField("store_name", event.target.value)}
                placeholder="Zuri & Co."
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400/50 focus:bg-white/[0.06]"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Slug
              </label>
              <input
                value={form.slug}
                onChange={(event) => updateField("slug", event.target.value)}
                placeholder="zuri-and-co"
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400/50 focus:bg-white/[0.06]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Subdomain
              </label>
              <input
                value={form.subdomain}
                onChange={(event) => updateField("subdomain", event.target.value)}
                placeholder="zuri"
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400/50 focus:bg-white/[0.06]"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Visibility
              </label>
              <select
                value={form.visibility}
                onChange={(event) =>
                  updateField("visibility", event.target.value as FormState["visibility"])
                }
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none focus:border-indigo-400/50 focus:bg-white/[0.06]"
              >
                <option value="public" className="bg-neutral-2 text-slate-300">
                  Public
                </option>
                <option value="unlisted" className="bg-neutral-2 text-slate-300">
                  Unlisted
                </option>
                <option value="private" className="bg-neutral-2 text-slate-300">
                  Private
                </option>
              </select>
            </div>

            <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
              <input
                type="checkbox"
                checked={form.is_accepting_orders}
                onChange={(event) =>
                  updateField("is_accepting_orders", event.target.checked)
                }
                className="mt-1 h-4 w-4"
              />
              <div>
                <div className="text-sm font-semibold text-white">
                  Accept orders
                </div>
                <p className="mt-1 text-xs leading-6 text-slate-400">
                  Controls whether the storefront is currently accepting orders.
                </p>
              </div>
            </label>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Headline
              </label>
              <input
                value={form.headline}
                onChange={(event) => updateField("headline", event.target.value)}
                placeholder="Handcrafted for modern living"
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400/50 focus:bg-white/[0.06]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Short description
              </label>
              <input
                value={form.short_description}
                onChange={(event) =>
                  updateField("short_description", event.target.value)
                }
                placeholder="Short public summary"
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400/50 focus:bg-white/[0.06]"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              About text
            </label>
            <textarea
              rows={5}
              value={form.about_text}
              onChange={(event) => updateField("about_text", event.target.value)}
              placeholder="Longer public-facing store description"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400/50 focus:bg-white/[0.06]"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Contact email
              </label>
              <input
                type="email"
                value={form.contact_email}
                onChange={(event) => updateField("contact_email", event.target.value)}
                placeholder="support@store.com"
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400/50 focus:bg-white/[0.06]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Contact phone
              </label>
              <input
                value={form.contact_phone}
                onChange={(event) => updateField("contact_phone", event.target.value)}
                placeholder="+234 800 000 0000"
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400/50 focus:bg-white/[0.06]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                WhatsApp number
              </label>
              <input
                value={form.whatsapp_number}
                onChange={(event) =>
                  updateField("whatsapp_number", event.target.value)
                }
                placeholder="+234 800 000 0000"
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400/50 focus:bg-white/[0.06]"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Address line 1
              </label>
              <input
                value={form.address_line_1}
                onChange={(event) =>
                  updateField("address_line_1", event.target.value)
                }
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none focus:border-indigo-400/50 focus:bg-white/[0.06]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Address line 2
              </label>
              <input
                value={form.address_line_2}
                onChange={(event) =>
                  updateField("address_line_2", event.target.value)
                }
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none focus:border-indigo-400/50 focus:bg-white/[0.06]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Country code
              </label>
              <input
                value={form.country_code}
                onChange={(event) => updateField("country_code", event.target.value)}
                placeholder="NG"
                maxLength={2}
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 uppercase text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400/50 focus:bg-white/[0.06]"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                City
              </label>
              <input
                value={form.city}
                onChange={(event) => updateField("city", event.target.value)}
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none focus:border-indigo-400/50 focus:bg-white/[0.06]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                State / Region
              </label>
              <input
                value={form.state_region}
                onChange={(event) =>
                  updateField("state_region", event.target.value)
                }
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none focus:border-indigo-400/50 focus:bg-white/[0.06]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Postal code
              </label>
              <input
                value={form.postal_code}
                onChange={(event) =>
                  updateField("postal_code", event.target.value)
                }
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none focus:border-indigo-400/50 focus:bg-white/[0.06]"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-200">
                <Megaphone className="h-4 w-4 text-indigo-300" />
                Announcement text
              </label>
              <input
                value={form.announcement_text}
                onChange={(event) =>
                  updateField("announcement_text", event.target.value)
                }
                placeholder="Free delivery this weekend"
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400/50 focus:bg-white/[0.06]"
              />
            </div>

            <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
              <input
                type="checkbox"
                checked={form.is_announcement_active}
                onChange={(event) =>
                  updateField("is_announcement_active", event.target.checked)
                }
                className="mt-1 h-4 w-4"
              />
              <div>
                <div className="text-sm font-semibold text-white">
                  Announcement active
                </div>
                <p className="mt-1 text-xs leading-6 text-slate-400">
                  Controls whether the storefront announcement is shown publicly.
                </p>
              </div>
            </label>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-200">
                <Globe2 className="h-4 w-4 text-indigo-300" />
                SEO title
              </label>
              <input
                value={form.seo_title}
                onChange={(event) => updateField("seo_title", event.target.value)}
                placeholder="SEO title"
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400/50 focus:bg-white/[0.06]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                SEO description
              </label>
              <input
                value={form.seo_description}
                onChange={(event) =>
                  updateField("seo_description", event.target.value)
                }
                placeholder="SEO description"
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400/50 focus:bg-white/[0.06]"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Social links (JSON)
            </label>
            <textarea
              rows={6}
              value={form.social_links_text}
              onChange={(event) =>
                updateField("social_links_text", event.target.value)
              }
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 font-mono text-sm text-white outline-none focus:border-indigo-400/50 focus:bg-white/[0.06]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Metadata (JSON)
            </label>
            <textarea
              rows={6}
              value={form.metadata_text}
              onChange={(event) => updateField("metadata_text", event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 font-mono text-sm text-white outline-none focus:border-indigo-400/50 focus:bg-white/[0.06]"
            />
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
              {isSaving
                ? "Saving..."
                : activeStorefront
                ? "Save storefront"
                : "Create storefront"}
              <Save className="h-4 w-4" />
            </button>
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
      <div className="mt-2 text-sm font-semibold capitalize text-white">
        {value}
      </div>
    </div>
  );
}