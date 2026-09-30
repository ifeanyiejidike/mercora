import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Search,
  ShoppingBag,
  Sparkles,
  Tag,
} from "lucide-react";
import PublicProductCard from "@/components/storefront/PublicProductCard";
import { getPublicStorefrontBySlug } from "@/lib/api/storefront-public";
import { getAllPublicProductsBySlug } from "@/lib/api/catalog-public";

type StorefrontProductsPageProps = {
  params: Promise<{
    storeSlug: string;
  }>;
};

export async function generateMetadata({
  params,
}: StorefrontProductsPageProps): Promise<Metadata> {
  const { storeSlug } = await params;
  const storefront = await getPublicStorefrontBySlug(storeSlug);

  if (!storefront) {
    return {
      title: "Products | Storefront Not Found",
    };
  }

  return {
    title: `Products | ${storefront.store_name}`,
    description:
      storefront.seo_description ||
      storefront.short_description ||
      `Browse products from ${storefront.store_name}.`,
  };
}

export default async function StorefrontProductsPage({
  params,
}: StorefrontProductsPageProps) {
  const { storeSlug } = await params;
  const storefront = await getPublicStorefrontBySlug(storeSlug);

  if (!storefront) {
    notFound();
  }

  const { products } = await getAllPublicProductsBySlug(storeSlug);

  const categories = Array.from(
    new Map(
      products
        .filter((product) => product.category)
        .map((product) => [product.category!.slug, product.category!]),
    ).values(),
  );

  const featuredProducts = products.filter((product) => product.is_featured);
  const basePath = `/_stores/${storeSlug}`;

  return (
    <main className="bg-neutral-1 text-white">
      <section className="relative isolate overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_30%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,10,24,0.16)_0%,rgba(4,10,24,0.96)_100%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
                <ShoppingBag className="h-4 w-4" />
                Product catalog
              </div>

              <h1 className="mt-6 text-4xl font-bold leading-[1.03] tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
                Browse products from {storefront.store_name}.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                Explore the published product catalog for this storefront. Only
                publicly available products are shown here.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href={`${basePath}/search`}
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-[image:var(--brand-gradient)] px-7 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(79,70,229,0.38)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_rgba(79,70,229,0.42)]"
                >
                  Search catalog
                  <Search className="h-4 w-4" />
                </Link>

                <Link
                  href={basePath}
                  className="inline-flex h-14 items-center justify-center rounded-2xl border border-white/14 bg-white/[0.03] px-6 text-sm font-semibold text-white transition hover:bg-white/[0.06]"
                >
                  Back to storefront
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <QuickStat label="Products" value={String(products.length)} />
              <QuickStat label="Featured" value={String(featuredProducts.length)} />
              <QuickStat label="Categories" value={String(categories.length)} />
              <QuickStat
                label="Orders"
                value={storefront.is_accepting_orders ? "accepting" : "paused"}
              />
            </div>
          </div>

          {categories.length > 0 ? (
            <div className="mt-10 flex flex-wrap gap-3">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`${basePath}/categories/${category.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.08] hover:text-white"
                >
                  <Tag className="h-4 w-4 text-indigo-300" />
                  {category.name}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {products.length === 0 ? (
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300">
              <Sparkles className="h-6 w-6" />
            </div>

            <h2 className="mt-4 text-2xl font-semibold text-white">
              No public products yet
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-300">
              This storefront is live, but no active public products are currently available.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <PublicProductCard
                key={product.id}
                storeSlug={storeSlug}
                product={product}
              />
            ))}
          </div>
        )}

        {featuredProducts.length > 0 ? (
          <section className="mt-12">
            <div className="mb-5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              <Sparkles className="h-4 w-4 text-indigo-300" />
              Featured products
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {featuredProducts.slice(0, 3).map((product) => (
                <PublicProductCard
                  key={product.id}
                  storeSlug={storeSlug}
                  product={product}
                />
              ))}
            </div>
          </section>
        ) : null}
      </section>
    </main>
  );
}

function QuickStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-[rgba(8,12,28,0.5)] p-5 backdrop-blur-md">
      <div className="text-xs uppercase tracking-[0.14em] text-slate-400">
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">
        {value}
      </div>
    </div>
  );
}