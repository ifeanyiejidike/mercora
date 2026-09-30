import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CircleDollarSign,
  Layers3,
  ShieldCheck,
  Truck,
} from "lucide-react";
import AddToCartButton from "@/components/storefront/AddToCartButton";
import { getPublicProductDetailBySlug } from "@/lib/api/catalog-public";
import type { PublicProduct, PublicProductVariant } from "@/types/catalog";

type StorefrontProductDetailPageProps = {
  params: Promise<{
    storeSlug: string;
    productSlug: string;
  }>;
};

function formatMoney(amount: string, currency: string) {
  const numeric = Number(amount);

  if (!Number.isFinite(numeric)) {
    return `${currency} ${amount}`;
  }

  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(numeric);
  } catch {
    return `${currency} ${numeric.toFixed(2)}`;
  }
}

function pickDefaultVariant(product: PublicProduct): PublicProductVariant | null {
  return (
    product.variants.find((variant) => variant.is_default) ??
    product.variants[0] ??
    null
  );
}

export async function generateMetadata({
  params,
}: StorefrontProductDetailPageProps): Promise<Metadata> {
  const { storeSlug, productSlug } = await params;
  const payload = await getPublicProductDetailBySlug(storeSlug, productSlug);

  if (!payload) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${payload.product.name} | ${payload.storefront.store_name}`,
    description:
      payload.product.short_description ||
      payload.product.description ||
      `${payload.product.name} from ${payload.storefront.store_name}.`,
    openGraph: {
      title: `${payload.product.name} | ${payload.storefront.store_name}`,
      description:
        payload.product.short_description ||
        payload.product.description ||
        `${payload.product.name} from ${payload.storefront.store_name}.`,
      images: payload.product.media_items[0]
        ? [
            {
              url: payload.product.media_items[0].file_url,
              alt:
                payload.product.media_items[0].alt_text || payload.product.name,
            },
          ]
        : undefined,
    },
  };
}

export default async function StorefrontProductDetailPage({
  params,
}: StorefrontProductDetailPageProps) {
  const { storeSlug, productSlug } = await params;
  const payload = await getPublicProductDetailBySlug(storeSlug, productSlug);

  if (!payload) {
    notFound();
  }

  const { product } = payload;
  const basePath = `/_stores/${storeSlug}`;

  const gallery = [...product.media_items].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    return a.sort_order - b.sort_order;
  });

  const defaultVariant = pickDefaultVariant(product);
  const displayPrice =
    defaultVariant?.effective_price_amount || product.base_price_amount;
  const displayCompareAt =
    defaultVariant?.effective_compare_at_price_amount ||
    product.compare_at_price_amount;

  const stockSummary = (() => {
    if (defaultVariant) {
      if (!defaultVariant.track_inventory) return "Available";
      if (defaultVariant.allow_backorders && defaultVariant.inventory_quantity <= 0) {
        return "Backorder available";
      }
      if (defaultVariant.inventory_quantity <= 0) return "Out of stock";
      if (defaultVariant.inventory_quantity <= product.low_stock_threshold) {
        return "Low stock";
      }
      return "In stock";
    }

    if (!product.track_inventory) return "Available";
    if (product.allow_backorders && product.inventory_quantity <= 0) {
      return "Backorder available";
    }
    if (product.inventory_quantity <= 0) return "Out of stock";
    if (product.inventory_quantity <= product.low_stock_threshold) {
      return "Low stock";
    }
    return "In stock";
  })();

  return (
    <main className="bg-neutral-1 text-white">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-slate-400">
          <Link href={basePath} className="transition hover:text-white">
            Storefront
          </Link>
          <span>/</span>
          <Link
            href={`${basePath}/products`}
            className="transition hover:text-white"
          >
            Products
          </Link>
          <span>/</span>
          <span className="text-white">{product.name}</span>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="space-y-4">
            <div className="overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.03]">
              <div className="aspect-[4/3] overflow-hidden bg-white/[0.02]">
                {gallery[0] ? (
                  <img
                    src={gallery[0].file_url}
                    alt={gallery[0].alt_text || product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-slate-500">
                    No product image
                  </div>
                )}
              </div>
            </div>

            {gallery.length > 1 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {gallery.slice(1, 5).map((item) => (
                  <div
                    key={item.id}
                    className="overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.03]"
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={item.file_url}
                        alt={item.alt_text || product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="space-y-6">
            <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.78),rgba(8,12,28,0.96))] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
              <div className="flex flex-wrap items-center gap-3">
                {product.category ? (
                  <Link
                    href={`${basePath}/categories/${product.category.slug}`}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-200 transition hover:bg-white/[0.08]"
                  >
                    {product.category.name}
                  </Link>
                ) : null}

                {product.is_featured ? (
                  <span className="rounded-full border border-indigo-500/20 bg-indigo-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-indigo-100">
                    Featured
                  </span>
                ) : null}

                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-300">
                  {product.product_type}
                </span>
              </div>

              <h1 className="mt-5 text-4xl font-bold leading-[1.03] tracking-[-0.05em] text-white sm:text-5xl">
                {product.name}
              </h1>

              <p className="mt-5 text-base leading-8 text-slate-300 sm:text-lg">
                {product.short_description?.trim() ||
                  product.description?.trim() ||
                  "Product details available below."}
              </p>

              <div className="mt-6 flex flex-wrap items-end gap-4">
                <div className="text-3xl font-bold text-white">
                  {formatMoney(displayPrice, product.base_currency)}
                </div>

                {displayCompareAt ? (
                  <div className="pb-1 text-lg text-slate-500 line-through">
                    {formatMoney(displayCompareAt, product.base_currency)}
                  </div>
                ) : null}
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <DetailStat label="Stock" value={stockSummary} />
                <DetailStat
                  label="SKU"
                  value={defaultVariant?.sku || product.sku || "Not set"}
                />
                <DetailStat
                  label="Shipping"
                  value={product.requires_shipping ? "Required" : "Not required"}
                />
                <DetailStat
                  label="Tax"
                  value={product.is_taxable ? "Taxable" : "Not taxable"}
                />
              </div>

              <div className="mt-6 space-y-4">
                <AddToCartButton
                  storeSlug={storeSlug}
                  productId={product.id}
                  defaultVariantId={defaultVariant?.id || null}
                />

                <div className="flex flex-col gap-4 sm:flex-row">
                  <Link
                    href={`${basePath}/contact`}
                    className="inline-flex h-14 flex-1 items-center justify-center rounded-2xl border border-white/14 bg-white/[0.03] px-6 text-sm font-semibold text-white transition hover:bg-white/[0.06]"
                  >
                    Contact store
                  </Link>

                  <Link
                    href={`${basePath}/products`}
                    className="inline-flex h-14 flex-1 items-center justify-center rounded-2xl border border-white/14 bg-white/[0.03] px-6 text-sm font-semibold text-white transition hover:bg-white/[0.06]"
                  >
                    Continue browsing
                  </Link>
                </div>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-6">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                <Layers3 className="h-4 w-4 text-indigo-300" />
                Product details
              </div>

              <div className="mt-5 space-y-5">
                <InfoPanel
                  icon={<CircleDollarSign className="h-4 w-4 text-indigo-300" />}
                  title="Pricing"
                  body={`Base currency: ${product.base_currency}.`}
                />

                <InfoPanel
                  icon={<Truck className="h-4 w-4 text-indigo-300" />}
                  title="Fulfillment"
                  body={
                    product.requires_shipping
                      ? "This product requires fulfillment or shipping."
                      : "This product does not require shipping."
                  }
                />

                <InfoPanel
                  icon={<ShieldCheck className="h-4 w-4 text-indigo-300" />}
                  title="Cart readiness"
                  body="This product page now connects directly to the public buyer cart flow."
                />
              </div>
            </div>
          </div>
        </div>

        {product.description?.trim() ? (
          <section className="mt-10 rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.72),rgba(8,12,28,0.94))] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
            <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              Description
            </div>

            <div className="prose prose-invert max-w-none whitespace-pre-wrap text-sm leading-8 text-slate-200">
              {product.description}
            </div>
          </section>
        ) : null}

        {product.variants.length > 0 ? (
          <section className="mt-10 rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.72),rgba(8,12,28,0.94))] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
            <div className="mb-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              Variants
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {product.variants.map((variant) => (
                <article
                  key={variant.id}
                  className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-white">
                        {variant.name}
                      </h2>
                      <p className="mt-1 text-sm text-slate-400">
                        {variant.sku || "No SKU"}
                      </p>
                    </div>

                    {variant.is_default ? (
                      <span className="rounded-full border border-indigo-500/20 bg-indigo-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-indigo-100">
                        Default
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-4 text-lg font-bold text-white">
                    {formatMoney(
                      variant.effective_price_amount,
                      product.base_currency,
                    )}
                  </div>

                  {variant.effective_compare_at_price_amount ? (
                    <div className="mt-1 text-sm text-slate-500 line-through">
                      {formatMoney(
                        variant.effective_compare_at_price_amount,
                        product.base_currency,
                      )}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        ) : null}

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

function DetailStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
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

function InfoPanel({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-white">
        {icon}
        {title}
      </div>
      <p className="mt-3 text-sm leading-7 text-slate-300">{body}</p>
    </div>
  );
}