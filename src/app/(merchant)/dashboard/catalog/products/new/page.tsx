"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiClient, extractApiErrorMessage } from "@/lib/api/axios";
import { useMerchant } from "@/hooks/use-merchant";

type Category = {
  id: string;
  name: string;
};

type CategoryListResponse = {
  results?: Category[];
};

type CreateProductResponse = {
  data?: {
    id: string;
  };
  id?: string;
};

export default function MerchantNewProductPage() {
  const router = useRouter();
  const { activeMerchant } = useMerchant();

  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState("draft");
  const [productType, setProductType] = useState("physical");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [inventoryQuantity, setInventoryQuantity] = useState("0");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      if (!activeMerchant) return;

      try {
        const { data } = await apiClient.get<CategoryListResponse>(
          `/api/catalog/merchants/${activeMerchant.id}/categories/`,
        );
        setCategories(data.results || []);
      } catch {
        setCategories([]);
      }
    };

    void loadCategories();
  }, [activeMerchant]);

  const createProduct = async () => {
    if (!activeMerchant || !name.trim() || !price.trim()) return;

    setError("");
    setIsSaving(true);

    try {
      const payload = {
        name: name.trim(),
        category_id: categoryId || null,
        status,
        product_type: productType,
        short_description: description.trim(),
        description: description.trim(),
        base_currency: activeMerchant.base_currency,
        base_price_amount: price,
        inventory_quantity: Number(inventoryQuantity || 0),
        track_inventory: true,
      };

      const { data } = await apiClient.post<CreateProductResponse>(
        `/api/catalog/merchants/${activeMerchant.id}/products/`,
        payload,
      );

      const createdId = data?.data?.id || data?.id;
      if (createdId) {
        router.push(`/dashboard/catalog/products/${createdId}`);
        return;
      }

      router.push("/dashboard/catalog/products");
    } catch (err) {
      setError(extractApiErrorMessage(err, "Unable to create product."));
    } finally {
      setIsSaving(false);
    }
  };

  if (!activeMerchant) {
    return (
      <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-12 text-center text-slate-300">
        Select a merchant before creating products.
      </div>
    );
  }

  return (
    <main className="space-y-6">
      <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.78),rgba(8,12,28,0.96))] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
          <Plus className="h-4 w-4" />
          New product
        </div>

        <h1 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
          Create product
        </h1>
      </section>

      {error ? (
        <div className="rounded-[18px] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.72),rgba(8,12,28,0.94))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
        <div className="grid gap-4 lg:grid-cols-2">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Product name"
            className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none"
          />

          <select
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            className="h-11 rounded-xl border border-white/10 bg-neutral-2 px-4 text-sm text-white outline-none"
          >
            <option value="">No category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="h-11 rounded-xl border border-white/10 bg-neutral-2 px-4 text-sm text-white outline-none"
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>

          <select
            value={productType}
            onChange={(event) => setProductType(event.target.value)}
            className="h-11 rounded-xl border border-white/10 bg-neutral-2 px-4 text-sm text-white outline-none"
          >
            <option value="physical">Physical</option>
            <option value="digital">Digital</option>
            <option value="service">Service</option>
          </select>

          <input
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            placeholder={`Base price (${activeMerchant.base_currency})`}
            className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none"
          />

          <input
            value={inventoryQuantity}
            onChange={(event) => setInventoryQuantity(event.target.value)}
            placeholder="Inventory quantity"
            className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none"
          />
        </div>

        <textarea
          rows={6}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Product description"
          className="mt-4 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none"
        />

        <button
          type="button"
          onClick={() => void createProduct()}
          disabled={isSaving || !name.trim() || !price.trim()}
          className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[image:var(--brand-gradient)] px-5 text-sm font-semibold text-white"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Create product
        </button>
      </section>
    </main>
  );
}