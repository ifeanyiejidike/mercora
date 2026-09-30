import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Tag } from "lucide-react";
import PublicProductCard from "@/components/storefront/PublicProductCard";
import { getAllPublicProductsBySlug } from "@/lib/api/catalog-public";
import { getPublicStorefrontBySlug } from "@/lib/api/storefront-public";

type StorefrontCategoryPageProps = {
  params: Promise<{
    storeSlug: string;
    categorySlug: string;
  }>;
};

export async function generateMetadata({
  params,
}: StorefrontCategoryPageProps): Promise<Metadata> {
  const { storeSlug, categorySlug } = await params;
  const storefront = await getPublicStorefrontBySlug(storeSlug);

  if (!storefront) {
    return {
      title: "Category | Storefront Not Found",
    };
  }

  return {
    title: `Category | ${storefront.store_name}`,
    description: `Browse category products from ${storefront.store_name}.`,
  };
}

export default async function StorefrontCategoryPage({
  params,
}: StorefrontCategoryPageProps) {
  const { storeSlug, categorySlug } = await params;
  const storefront = await getPublicStorefrontBySlug(storeSlug);

  if (!storefront) {
    notFound();
  }

  const { products } = await getAllPublicProductsBySlug(storeSlug);

  const category = products
    .map((product) => product.category)
    .filter(Boolean)
    .find((item) => item!.slug === categorySlug);

  if (!category) {
    notFound();
  }

  const filteredProducts = products.filter(
    (product) => product.category?.slug === categorySlug,
  );

  const basePath = `/_stores/${storeSlug}`;

  return (
    <main className="bg-neutral-1 text-white">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-slate-400">
          <Link href={basePath} className="transition hover:text-white">
            Storefront
          </Link>
          <span>/</span>
          <Link href={`${basePath}/products`} className="transition hover:text-white">
            Products
          </Link>
          <span>/</span>
          <span className="text-white">{category.name}</span>
        </div>

        <section className="overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.78),rgba(8,12,28,0.96))] shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
          <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1.04fr_0.96fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
                <Tag className="h-4 w-4" />
                Category
              </div>

              <h1 className="mt-5 text-4xl font-bold leading-[1.03] tracking-[-0.05em] text-white sm:text-5xl">
                {category.name}
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                {category.description?.trim() ||
                  `Browse products inside the ${category.name} category.`}
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href={`${basePath}/products`}
                  className="inline-flex h-14 items-center justify-center rounded-2xl border border-white/14 bg-white/[0.03] px-6 text-sm font-semibold text-white transition hover:bg-white/[0.06]"
                >
                  All products
                </Link>

                <Link
                  href={`${basePath}/search?q=${encodeURIComponent(category.name)}`}
                  className="inline-flex h-14 items-center justify-center rounded-2xl bg-[image:var(--brand-gradient)] px-7 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(79,70,229,0.38)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_rgba(79,70,229,0.42)]"
                >
                  Search related items
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <QuickStat label="Products" value={String(filteredProducts.length)} />
              <QuickStat
                label="Featured"
                value={String(filteredProducts.filter((item) => item.is_featured).length)}
              />
              <QuickStat label="Store" value={storefront.store_name} />
              <QuickStat label="Merchant" value={storefront.merchant_name} />
            </div>
          </div>
        </section>

        <section className="mt-10">
          {filteredProducts.length === 0 ? (
            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-12 text-center">
              <h2 className="text-2xl font-semibold text-white">
                No products found in this category
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-300">
                The category exists, but there are no active public products inside it right now.
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
        </section>

        <div className="mt-8">
          <Link
            href={`${basePath}/products`}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/14 bg-white/[0.03] px-6 text-sm font-semibold text-white transition hover:bg-white/[0.06]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to products
          </Link>
        </div>
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