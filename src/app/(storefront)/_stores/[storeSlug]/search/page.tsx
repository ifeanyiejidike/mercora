import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Search, ShoppingBag } from "lucide-react";
import PublicProductCard from "@/components/storefront/PublicProductCard";
import { getAllPublicProductsBySlug } from "@/lib/api/catalog-public";
import { getPublicStorefrontBySlug } from "@/lib/api/storefront-public";

type StorefrontSearchPageProps = {
  params: Promise<{
    storeSlug: string;
  }>;
  searchParams: Promise<{
    q?: string | string[];
  }>;
};

function resolveQueryValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

export async function generateMetadata({
  params,
}: StorefrontSearchPageProps): Promise<Metadata> {
  const { storeSlug } = await params;
  const storefront = await getPublicStorefrontBySlug(storeSlug);

  if (!storefront) {
    return {
      title: "Search | Storefront Not Found",
    };
  }

  return {
    title: `Search | ${storefront.store_name}`,
    description: `Search products from ${storefront.store_name}.`,
  };
}

export default async function StorefrontSearchPage({
  params,
  searchParams,
}: StorefrontSearchPageProps) {
  const { storeSlug } = await params;
  const storefront = await getPublicStorefrontBySlug(storeSlug);

  if (!storefront) {
    notFound();
  }

  const { q } = await searchParams;
  const { products } = await getAllPublicProductsBySlug(storeSlug);

  const query = resolveQueryValue(q).trim();
  const normalizedQuery = query.toLowerCase();

  const filteredProducts = normalizedQuery
    ? products.filter((product) => {
        const haystack = [
          product.name,
          product.slug,
          product.sku,
          product.short_description,
          product.description,
          product.category?.name || "",
          product.category?.description || "",
          ...product.variants.flatMap((variant) => [
            variant.name,
            variant.sku,
            JSON.stringify(variant.attributes ?? {}),
          ]),
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(normalizedQuery);
      })
    : [];

  const featuredProducts = products
    .filter((product) => product.is_featured)
    .slice(0, 6);

  const basePath = `/_stores/${storeSlug}`;

  return (
    <main className="bg-neutral-1 text-white">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.78),rgba(8,12,28,0.96))] shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
          <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
                <Search className="h-4 w-4" />
                Search catalog
              </div>

              <h1 className="mt-5 text-4xl font-bold leading-[1.03] tracking-[-0.05em] text-white sm:text-5xl">
                Search {storefront.store_name} products.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                Search by product name, SKU, description, category, or visible variant details.
              </p>
            </div>

            <form
              action={`${basePath}/search`}
              method="GET"
              className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5"
            >
              <label
                htmlFor="q"
                className="mb-3 block text-sm font-medium text-slate-200"
              >
                Search query
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="q"
                  name="q"
                  defaultValue={query}
                  placeholder="Search products, categories, SKU..."
                  className="h-12 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400/50 focus:bg-white/[0.06]"
                />

                <button
                  type="submit"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[image:var(--brand-gradient)] px-6 text-sm font-semibold text-white shadow-[0_16px_38px_rgba(79,70,229,0.34)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(79,70,229,0.42)]"
                >
                  <Search className="h-4 w-4" />
                  Search
                </button>
              </div>

              <div className="mt-3 text-xs leading-6 text-slate-500">
                Search works over the currently public catalog for this storefront.
              </div>
            </form>
          </div>
        </section>

        <section className="mt-10">
          {query ? (
            <>
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    Search results
                  </div>
                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    {filteredProducts.length} result
                    {filteredProducts.length === 1 ? "" : "s"} for “{query}”
                  </h2>
                </div>

                <Link
                  href={`${basePath}/products`}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-white/14 bg-white/[0.03] px-5 text-sm font-semibold text-white transition hover:bg-white/[0.06]"
                >
                  View all products
                </Link>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-12 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300">
                    <Search className="h-6 w-6" />
                  </div>

                  <h3 className="mt-4 text-2xl font-semibold text-white">
                    No matching products found
                  </h3>

                  <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-300">
                    Try another keyword or browse the full catalog instead.
                  </p>
                </div>
              ) : (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <PublicProductCard
                      key={product.id}
                      storeSlug={storeSlug}
                      product={product}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="mb-5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                <ShoppingBag className="h-4 w-4 text-indigo-300" />
                Featured suggestions
              </div>

              {featuredProducts.length === 0 ? (
                <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-12 text-center">
                  <h3 className="text-2xl font-semibold text-white">
                    Start with a product search
                  </h3>

                  <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-300">
                    Enter a product name, SKU, category, or keyword above to search this storefront.
                  </p>
                </div>
              ) : (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {featuredProducts.map((product) => (
                    <PublicProductCard
                      key={product.id}
                      storeSlug={storeSlug}
                      product={product}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </section>
    </main>
  );
}