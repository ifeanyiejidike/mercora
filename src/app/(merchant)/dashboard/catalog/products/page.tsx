"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Boxes, Loader2, Plus } from "lucide-react";
import { apiClient, extractApiErrorMessage } from "@/lib/api/axios";
import { useMerchant } from "@/hooks/use-merchant";

type Product = {
  id: string;
  name: string;
  slug: string;
  status: string;
  product_type: string;
  base_currency: string;
  base_price_amount: string;
  inventory_quantity?: number;
  low_stock_threshold?: number;
  is_featured?: boolean;
  category?: {
    id: string;
    name: string;
  } | null;
  created_at?: string;
};

type ProductListResponse = {
  results?: Product[];
};

export default function MerchantCatalogProductsPage() {
  const { activeMerchant } = useMerchant();

  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    if (!activeMerchant) return;

    setError("");
    setIsLoading(true);

    try {
      const { data } = await apiClient.get<ProductListResponse>(
        `/api/catalog/merchants/${activeMerchant.id}/products/`,
        {
          params: {
            search: search || undefined,
            status: status || undefined,
          },
        },
      );
      setProducts(data.results || []);
    } catch (err) {
      setError(extractApiErrorMessage(err, "Unable to load products."));
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

  if (!activeMerchant) {
    return (
      <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-12 text-center text-slate-300">
        Select a merchant before opening products.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
        <p className="mt-4 text-sm text-slate-300">Loading products...</p>
      </div>
    );
  }

  return (
    <main className="space-y-6">
      <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.78),rgba(8,12,28,0.96))] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
              <Boxes className="h-4 w-4" />
              Catalog products
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
              Products
            </h1>
          </div>

          <Link
            href="/dashboard/catalog/products/new"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[image:var(--brand-gradient)] px-5 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" />
            New product
          </Link>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_180px_auto]">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search product name..."
            className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none"
          />
          <input
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            placeholder="Status"
            className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none"
          />
          <button
            type="button"
            onClick={() => void load()}
            className="h-11 rounded-xl border border-white/14 bg-white/[0.03] px-5 text-sm font-semibold text-white"
          >
            Apply
          </button>
        </div>
      </section>

      {error ? (
        <div className="rounded-[18px] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      <section className="space-y-4">
        {products.length === 0 ? (
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-12 text-center text-slate-300">
            No products found.
          </div>
        ) : (
          products.map((product) => (
            <Link
              key={product.id}
              href={`/dashboard/catalog/products/${product.id}`}
              className="block rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.66),rgba(8,12,28,0.94))] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)] transition hover:border-indigo-500/20"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-300">
                  {product.status}
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-300">
                  {product.product_type}
                </span>
                {product.is_featured ? (
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-300">
                    Featured
                  </span>
                ) : null}
              </div>

              <div className="mt-4 text-xl font-semibold text-white">{product.name}</div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white">
                  Price: {product.base_currency} {product.base_price_amount}
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white">
                  Category: {product.category?.name || "—"}
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white">
                  Inventory: {product.inventory_quantity ?? 0}
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white">
                  Low stock threshold: {product.low_stock_threshold ?? 0}
                </div>
              </div>
            </Link>
          ))
        )}
      </section>
    </main>
  );
}