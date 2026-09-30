"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { apiClient, extractApiErrorMessage } from "@/lib/api/axios";
import { useMerchant } from "@/hooks/use-merchant";

type ProductVariant = {
  id: string;
  name?: string;
  sku?: string;
  inventory_quantity?: number;
};

type ProductMedia = {
  id: string;
  file_url?: string;
  alt_text?: string;
  is_primary?: boolean;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  status: string;
  product_type: string;
  short_description?: string;
  description?: string;
  base_currency: string;
  base_price_amount: string;
  compare_at_price_amount?: string | null;
  inventory_quantity?: number;
  low_stock_threshold?: number;
  track_inventory?: boolean;
  allow_backorders?: boolean;
  variants?: ProductVariant[];
  media_items?: ProductMedia[];
  category?: {
    id: string;
    name: string;
  } | null;
};

export default function MerchantProductDetailPage() {
  const params = useParams<{ productId: string }>();
  const { activeMerchant } = useMerchant();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    if (!activeMerchant) return;

    setError("");
    setIsLoading(true);

    try {
      const { data } = await apiClient.get<{ data?: Product } | Product>(
        `/api/catalog/merchants/${activeMerchant.id}/products/${params.productId}/`,
      );

      const resolved =
        typeof data === "object" && data !== null && "data" in data ? data.data : data;

      setProduct((resolved as Product) || null);
    } catch (err) {
      setError(extractApiErrorMessage(err, "Unable to load product detail."));
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
  }, [activeMerchant, params.productId]);

  const togglePublish = async () => {
    if (!activeMerchant || !product) return;

    setError("");
    setIsPublishing(true);

    try {
      const endpoint =
        product.status === "active"
          ? `/api/catalog/merchants/${activeMerchant.id}/products/${product.id}/unpublish/`
          : `/api/catalog/merchants/${activeMerchant.id}/products/${product.id}/publish/`;

      await apiClient.post(endpoint, {});
      await load();
    } catch (err) {
      setError(extractApiErrorMessage(err, "Unable to update publish state."));
    } finally {
      setIsPublishing(false);
    }
  };

  if (!activeMerchant) {
    return (
      <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-12 text-center text-slate-300">
        Select a merchant before opening product detail.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
        <p className="mt-4 text-sm text-slate-300">Loading product detail...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-12 text-center text-slate-300">
        Product not found.
      </div>
    );
  }

  return (
    <main className="space-y-6">
      <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.78),rgba(8,12,28,0.96))] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-300">
            {product.status}
          </span>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-300">
            {product.product_type}
          </span>
        </div>

        <h1 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
          {product.name}
        </h1>

        <p className="mt-4 text-sm leading-7 text-slate-300">
          {product.description || product.short_description || "No description provided."}
        </p>

        <button
          type="button"
          onClick={() => void togglePublish()}
          disabled={isPublishing}
          className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[image:var(--brand-gradient)] px-5 text-sm font-semibold text-white"
        >
          {isPublishing ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {product.status === "active" ? "Unpublish product" : "Publish product"}
        </button>
      </section>

      {error ? (
        <div className="rounded-[18px] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.72),rgba(8,12,28,0.94))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
          <h2 className="text-xl font-semibold text-white">Product overview</h2>

          <div className="mt-5 grid gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white">
              Price: {product.base_currency} {product.base_price_amount}
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white">
              Compare at: {product.compare_at_price_amount || "—"}
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white">
              Category: {product.category?.name || "—"}
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white">
              Inventory: {product.inventory_quantity ?? 0}
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white">
              Threshold: {product.low_stock_threshold ?? 0}
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white">
              Track inventory: {product.track_inventory ? "Yes" : "No"}
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white">
              Backorders: {product.allow_backorders ? "Allowed" : "Blocked"}
            </div>
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.72),rgba(8,12,28,0.94))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
            <h2 className="text-xl font-semibold text-white">Variants</h2>

            <div className="mt-5 space-y-3">
              {(product.variants || []).length === 0 ? (
                <div className="text-sm text-slate-400">No variants.</div>
              ) : (
                product.variants?.map((variant) => (
                  <div
                    key={variant.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white"
                  >
                    {variant.name || "Variant"} — SKU: {variant.sku || "—"} — Qty:{" "}
                    {variant.inventory_quantity ?? 0}
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.72),rgba(8,12,28,0.94))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
            <h2 className="text-xl font-semibold text-white">Media</h2>

            <div className="mt-5 space-y-3">
              {(product.media_items || []).length === 0 ? (
                <div className="text-sm text-slate-400">No media items.</div>
              ) : (
                product.media_items?.map((media) => (
                  <div
                    key={media.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white"
                  >
                    {media.alt_text || media.file_url || "Media item"}{" "}
                    {media.is_primary ? "(Primary)" : ""}
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}