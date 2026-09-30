import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Globe2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import { getPublicStorefrontBySlug } from "@/lib/api/storefront-public";

type StorefrontHomePageProps = {
  params: Promise<{
    storeSlug: string;
  }>;
};

function createBasePath(storeSlug: string) {
  return `/_stores/${storeSlug}`;
}

export async function generateMetadata({
  params,
}: StorefrontHomePageProps): Promise<Metadata> {
  const { storeSlug } = await params;
  const storefront = await getPublicStorefrontBySlug(storeSlug);

  if (!storefront) {
    return {
      title: "Storefront Not Found",
      description: "The requested storefront could not be found.",
    };
  }

  return {
    title: storefront.seo_title || storefront.store_name,
    description:
      storefront.seo_description ||
      storefront.short_description ||
      storefront.about_text ||
      `${storefront.store_name} storefront`,
    alternates: {
      canonical: createBasePath(storeSlug),
    },
    openGraph: {
      title: storefront.seo_title || storefront.store_name,
      description:
        storefront.seo_description ||
        storefront.short_description ||
        storefront.about_text ||
        `${storefront.store_name} storefront`,
      url: createBasePath(storeSlug),
      type: "website",
      images: storefront.banner_image_url
        ? [
            {
              url: storefront.banner_image_url,
              alt: storefront.store_name,
            },
          ]
        : undefined,
    },
    twitter: {
      card: storefront.banner_image_url ? "summary_large_image" : "summary",
      title: storefront.seo_title || storefront.store_name,
      description:
        storefront.seo_description ||
        storefront.short_description ||
        storefront.about_text ||
        `${storefront.store_name} storefront`,
      images: storefront.banner_image_url
        ? [storefront.banner_image_url]
        : undefined,
    },
  };
}

export default async function StorefrontHomePage({
  params,
}: StorefrontHomePageProps) {
  const { storeSlug } = await params;
  const storefront = await getPublicStorefrontBySlug(storeSlug);

  if (!storefront) {
    notFound();
  }

  const basePath = createBasePath(storeSlug);
  const heroCtaHref =
    storefront.primary_cta_url?.trim() || `${basePath}/products`;
  const heroCtaText =
    storefront.primary_cta_text?.trim() || "Browse Products";

  const hasContactBlock =
    storefront.contact_email ||
    storefront.contact_phone ||
    storefront.whatsapp_number ||
    storefront.address_line_1 ||
    storefront.city;

  const socialEntries = Object.entries(storefront.social_links ?? {}).filter(
    ([, value]) => typeof value === "string" && value.trim(),
  ) as Array<[string, string]>;

  return (
    <main className="min-h-screen bg-neutral-1 text-white">
      <section className="relative isolate overflow-hidden border-b border-white/10">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_32%)]"
          aria-hidden="true"
        />

        {storefront.banner_image_url ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${storefront.banner_image_url})` }}
            aria-hidden="true"
          />
        ) : null}

        <div
          className={`absolute inset-0 ${
            storefront.banner_image_url
              ? "bg-[linear-gradient(180deg,rgba(4,10,24,0.42)_0%,rgba(4,10,24,0.92)_100%)]"
              : "bg-[linear-gradient(180deg,rgba(4,10,24,0.16)_0%,rgba(4,10,24,0.96)_100%)]"
          }`}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 rounded-[24px] border border-white/10 bg-[rgba(8,12,28,0.38)] p-4 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
                {storefront.logo_url ? (
                  <img
                    src={storefront.logo_url}
                    alt={`${storefront.store_name} logo`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ShoppingBag className="h-6 w-6 text-indigo-300" />
                )}
              </div>

              <div className="min-w-0">
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-300">
                  {storefront.merchant_name}
                </div>
                <h1 className="truncate text-2xl font-bold tracking-[-0.04em] text-white sm:text-3xl">
                  {storefront.store_name}
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`${basePath}/products`}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-white/14 bg-white/[0.03] px-5 text-sm font-semibold text-white transition hover:bg-white/[0.06]"
              >
                Products
              </Link>

              <Link
                href={`${basePath}/contact`}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-white/14 bg-white/[0.03] px-5 text-sm font-semibold text-white transition hover:bg-white/[0.06]"
              >
                Contact
              </Link>
            </div>
          </div>

          {storefront.is_announcement_active && storefront.announcement_text ? (
            <div className="mt-5 rounded-[20px] border border-indigo-500/20 bg-indigo-500/10 px-4 py-3 text-sm text-indigo-100">
              {storefront.announcement_text}
            </div>
          ) : null}

          <div className="grid gap-10 pb-8 pt-12 lg:grid-cols-[1.04fr_0.96fr] lg:pt-16">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
                <ShieldCheck className="h-4 w-4" />
                Public storefront
              </div>

              <h2 className="mt-6 text-4xl font-bold leading-[1.02] tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
                {storefront.headline?.trim() || storefront.store_name}
              </h2>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
                {storefront.short_description?.trim() ||
                  storefront.about_text?.trim() ||
                  `${storefront.store_name} by ${storefront.merchant_name}.`}
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href={heroCtaHref}
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-[image:var(--brand-gradient)] px-7 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(79,70,229,0.38)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_rgba(79,70,229,0.42)]"
                >
                  {heroCtaText}
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href={`${basePath}/products`}
                  className="inline-flex h-14 items-center justify-center rounded-2xl border border-white/14 bg-white/[0.03] px-6 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white/[0.06]"
                >
                  Explore catalog
                </Link>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <HighlightCard
                  label="Merchant"
                  value={storefront.merchant_name}
                />
                <HighlightCard
                  label="Currency"
                  value={storefront.merchant_base_currency}
                />
                <HighlightCard
                  label="Country"
                  value={storefront.merchant_country_code}
                />
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-[rgba(8,12,28,0.56)] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.3)] backdrop-blur-md">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                <Globe2 className="h-4 w-4 text-indigo-300" />
                Storefront summary
              </div>

              <div className="mt-5 rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                <p className="text-sm font-semibold text-white">About this store</p>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {storefront.about_text?.trim() ||
                    storefront.short_description?.trim() ||
                    `${storefront.store_name} is operated by ${storefront.merchant_name}.`}
                </p>
              </div>

              {hasContactBlock ? (
                <div className="mt-5 rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-sm font-semibold text-white">Contact</p>

                  <div className="mt-4 space-y-3">
                    {storefront.contact_email ? (
                      <InfoRow
                        icon={<Mail className="h-4 w-4 text-indigo-300" />}
                        value={storefront.contact_email}
                      />
                    ) : null}

                    {storefront.contact_phone ? (
                      <InfoRow
                        icon={<Phone className="h-4 w-4 text-indigo-300" />}
                        value={storefront.contact_phone}
                      />
                    ) : null}

                    {[
                      storefront.address_line_1,
                      storefront.address_line_2,
                      storefront.city,
                      storefront.state_region,
                      storefront.postal_code,
                      storefront.country_code,
                    ]
                      .filter(Boolean)
                      .length > 0 ? (
                      <InfoRow
                        icon={<MapPin className="h-4 w-4 text-indigo-300" />}
                        value={[
                          storefront.address_line_1,
                          storefront.address_line_2,
                          storefront.city,
                          storefront.state_region,
                          storefront.postal_code,
                          storefront.country_code,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      />
                    ) : null}
                  </div>
                </div>
              ) : null}

              {socialEntries.length > 0 ? (
                <div className="mt-5 rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-sm font-semibold text-white">Social links</p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    {socialEntries.map(([key, value]) => (
                      <a
                        key={key}
                        href={value}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
                      >
                        {key}
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.72),rgba(8,12,28,0.94))] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              <CheckCircle2 className="h-4 w-4 text-indigo-300" />
              Next action
            </div>

            <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-white">
              Start browsing the storefront.
            </h3>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              The storefront identity is now wired to the backend public-by-slug
              endpoint. Product, category, checkout, and order flows can build on
              this same public store surface next.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`${basePath}/products`}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[image:var(--brand-gradient)] px-6 text-sm font-semibold text-white shadow-[0_16px_38px_rgba(79,70,229,0.34)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(79,70,229,0.42)]"
              >
                Browse products
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href={`${basePath}/search`}
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/14 bg-white/[0.03] px-6 text-sm font-semibold text-white transition hover:bg-white/[0.06]"
              >
                Search store
              </Link>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.72),rgba(8,12,28,0.94))] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              <ShieldCheck className="h-4 w-4 text-indigo-300" />
              Policies
            </div>

            <div className="mt-5 grid gap-3">
              <PolicyLink
                href={`${basePath}/policies/terms`}
                title="Terms of service"
                value={storefront.terms_of_service}
              />
              <PolicyLink
                href={`${basePath}/policies/privacy`}
                title="Privacy policy"
                value={storefront.privacy_policy}
              />
              <PolicyLink
                href={`${basePath}/policies/refund`}
                title="Return policy"
                value={storefront.return_policy}
              />
              <PolicyLink
                href={`${basePath}/policies/shipping`}
                title="Fulfillment policy"
                value={storefront.fulfillment_policy}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function HighlightCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-4 backdrop-blur-md">
      <div className="text-xs uppercase tracking-[0.14em] text-slate-400">
        {label}
      </div>
      <div className="mt-2 text-sm font-semibold text-white">{value}</div>
    </div>
  );
}

function InfoRow({
  icon,
  value,
}: {
  icon: React.ReactNode;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
      <div className="mt-0.5">{icon}</div>
      <p className="text-sm leading-6 text-slate-300">{value}</p>
    </div>
  );
}

function PolicyLink({
  href,
  title,
  value,
}: {
  href: string;
  title: string;
  value: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-4 transition hover:bg-white/[0.06]"
    >
      <div className="text-sm font-semibold text-white">{title}</div>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-300">
        {value?.trim() || "Not yet configured."}
      </p>
    </Link>
  );
}