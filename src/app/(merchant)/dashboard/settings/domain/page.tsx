"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Globe2,
  Save,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";
import { env } from "@/lib/config/env";
import { storefrontsApi } from "@/lib/api/storefronts";
import { useMerchant } from "@/hooks/use-merchant";
import { useStorefront } from "@/hooks/use-storefront";
import type { StorefrontDomainResponse } from "@/types/storefront";

function EmptyActiveMerchantState() {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300">
        <Globe2 className="h-6 w-6" />
      </div>
      <h2 className="mt-4 text-2xl font-semibold text-white">
        No active merchant selected
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-300">
        Select or create a merchant before configuring storefront domain settings.
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
        <UploadCloud className="h-6 w-6" />
      </div>
      <h2 className="mt-4 text-2xl font-semibold text-white">
        Create the storefront first
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-300">
        Domain configuration and publish controls become available after the storefront record exists.
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

export default function MerchantSettingsDomainPage() {
  const { activeMerchant } = useMerchant();
  const {
    activeStorefront,
    updateStorefrontDomain,
    publishStorefront,
    unpublishStorefront,
  } = useStorefront();

  const [domainData, setDomainData] = useState<StorefrontDomainResponse | null>(null);
  const [customDomain, setCustomDomain] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingDomain, setIsSavingDomain] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      if (!activeStorefront) {
        if (mounted) {
          setIsLoading(false);
          setDomainData(null);
          setCustomDomain("");
        }
        return;
      }

      try {
        const data = await storefrontsApi.getDomain(activeStorefront.id);

        if (!mounted) return;

        setDomainData(data);
        setCustomDomain(data.custom_domain || "");
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load domain settings.",
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
  }, [activeStorefront]);

  if (!activeMerchant) {
    return <EmptyActiveMerchantState />;
  }

  if (!activeStorefront) {
    return <NoStorefrontState />;
  }

  const refreshDomain = async () => {
    const data = await storefrontsApi.getDomain(activeStorefront.id);
    setDomainData(data);
    setCustomDomain(data.custom_domain || "");
  };

  const handleSaveDomain = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsSavingDomain(true);

    try {
      const data = await updateStorefrontDomain(activeStorefront.id, {
        custom_domain: customDomain.trim() || "",
      });

      setDomainData(data);
      setSuccessMessage("Storefront domain settings updated successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update storefront domain settings.",
      );
    } finally {
      setIsSavingDomain(false);
    }
  };

  const handlePublishToggle = async (mode: "publish" | "unpublish") => {
    setError("");
    setSuccessMessage("");
    setIsPublishing(true);

    try {
      if (mode === "publish") {
        await publishStorefront(activeStorefront.id);
        setSuccessMessage("Storefront published successfully.");
      } else {
        await unpublishStorefront(activeStorefront.id);
        setSuccessMessage("Storefront unpublished successfully.");
      }

      await refreshDomain();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Unable to ${mode} storefront.`,
      );
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <main className="space-y-6">
      <section className="overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.78),rgba(8,12,28,0.96))] shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
        <div className="border-b border-white/10 px-6 py-6 sm:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
            <Globe2 className="h-4 w-4" />
            Domain and publishing
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
            Configure domain settings and public storefront state.
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
            Manage custom domain configuration, verification token visibility, and publish or unpublish the active storefront.
          </p>
        </div>

        <form className="space-y-6 p-6 sm:p-8" onSubmit={handleSaveDomain}>
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
            <StatCard label="Storefront status" value={activeStorefront.status} />
            <StatCard label="Domain status" value={domainData?.domain_status || "unconfigured"} />
            <StatCard label="Slug" value={domainData?.slug || activeStorefront.slug} />
            <StatCard label="Subdomain" value={domainData?.subdomain || activeStorefront.subdomain || "not set"} />
          </div>

          {isLoading ? (
            <div className="h-[240px] animate-pulse rounded-[24px] border border-white/10 bg-white/[0.03]" />
          ) : (
            <>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Custom domain
                </label>
                <input
                  value={customDomain}
                  onChange={(event) => setCustomDomain(event.target.value)}
                  placeholder="store.yourdomain.com"
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400/50 focus:bg-white/[0.06]"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <InfoBlock
                  label="Verification token"
                  value={domainData?.domain_verification_token || "Not generated"}
                />
                <InfoBlock
                  label="Verified at"
                  value={domainData?.domain_verified_at || "Not verified"}
                />
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300">
                    <ShieldCheck className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      Publish requirements
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-300">
                      The backend only publishes when the merchant is active and the storefront has the required publishable fields in place. If your merchant is still draft or missing required public contact data, publish will fail until that is corrected.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 lg:flex-row lg:justify-between">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={env.routes.merchantDashboard}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/14 bg-white/[0.03] px-6 text-sm font-semibold text-white transition hover:bg-white/[0.06]"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to dashboard
                  </Link>

                  <button
                    type="submit"
                    disabled={isSavingDomain}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[image:var(--brand-gradient)] px-6 text-sm font-semibold text-white shadow-[0_16px_38px_rgba(79,70,229,0.34)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(79,70,229,0.42)] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSavingDomain ? "Saving..." : "Save domain settings"}
                    <Save className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    disabled={isPublishing || activeStorefront.status === "published"}
                    onClick={() => void handlePublishToggle("publish")}
                    className="inline-flex h-12 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-6 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/15 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isPublishing ? "Working..." : "Publish storefront"}
                  </button>

                  <button
                    type="button"
                    disabled={isPublishing || activeStorefront.status !== "published"}
                    onClick={() => void handlePublishToggle("unpublish")}
                    className="inline-flex h-12 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 px-6 text-sm font-semibold text-amber-100 transition hover:bg-amber-500/15 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isPublishing ? "Working..." : "Unpublish storefront"}
                  </button>
                </div>
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
        {value.replaceAll("_", " ")}
      </div>
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-4">
      <div className="text-xs uppercase tracking-[0.14em] text-slate-400">
        {label}
      </div>
      <div className="mt-2 break-all text-sm font-semibold text-white">
        {value}
      </div>
    </div>
  );
}