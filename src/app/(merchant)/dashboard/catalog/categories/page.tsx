"use client";

import { useEffect, useState } from "react";
import { FolderTree, Loader2, Plus } from "lucide-react";
import { apiClient, extractApiErrorMessage } from "@/lib/api/axios";
import { useMerchant } from "@/hooks/use-merchant";

type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sort_order?: number;
  is_active?: boolean;
  created_at?: string;
};

type CategoryListResponse = {
  results?: Category[];
};

export default function MerchantCatalogCategoriesPage() {
  const { activeMerchant } = useMerchant();

  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    if (!activeMerchant) return;

    setError("");
    setIsLoading(true);

    try {
      const { data } = await apiClient.get<CategoryListResponse>(
        `/api/catalog/merchants/${activeMerchant.id}/categories/`,
      );
      setCategories(data.results || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load categories.");
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

  const createCategory = async () => {
    if (!activeMerchant || !name.trim()) return;

    setError("");
    setIsSaving(true);

    try {
      await apiClient.post(`/api/catalog/merchants/${activeMerchant.id}/categories/`, {
        name: name.trim(),
        description: description.trim(),
      });
      setName("");
      setDescription("");
      await load();
    } catch (err) {
      setError(extractApiErrorMessage(err, "Unable to create category."));
    } finally {
      setIsSaving(false);
    }
  };

  if (!activeMerchant) {
    return (
      <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-12 text-center text-slate-300">
        Select a merchant before opening categories.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
        <p className="mt-4 text-sm text-slate-300">Loading categories...</p>
      </div>
    );
  }

  return (
    <main className="space-y-6">
      <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.78),rgba(8,12,28,0.96))] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
          <FolderTree className="h-4 w-4" />
          Catalog categories
        </div>

        <h1 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
          Product categories
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
          Organize products into clean merchant-facing and storefront-facing groups.
        </p>
      </section>

      {error ? (
        <div className="rounded-[18px] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
        <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.72),rgba(8,12,28,0.94))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
          <h2 className="text-xl font-semibold text-white">Create category</h2>

          <div className="mt-5 space-y-4">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Category name"
              className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none"
            />
            <textarea
              rows={4}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Description"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none"
            />
            <button
              type="button"
              onClick={() => void createCategory()}
              disabled={isSaving || !name.trim()}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[image:var(--brand-gradient)] px-5 text-sm font-semibold text-white"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Create category
            </button>
          </div>
        </section>

        <section className="space-y-4">
          {categories.length === 0 ? (
            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-12 text-center text-slate-300">
              No categories yet.
            </div>
          ) : (
            categories.map((category) => (
              <div
                key={category.id}
                className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.66),rgba(8,12,28,0.94))] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)]"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-300">
                    {category.slug || "category"}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-300">
                    {category.is_active ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="mt-4 text-xl font-semibold text-white">{category.name}</div>

                <p className="mt-2 text-sm leading-7 text-slate-300">
                  {category.description || "No description provided."}
                </p>
              </div>
            ))
          )}
        </section>
      </section>
    </main>
  );
}