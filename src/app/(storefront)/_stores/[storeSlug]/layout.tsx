import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Globe2,
  Home,
  Mail,
  Search,
  ShoppingBag,
} from "lucide-react";
import { getPublicStorefrontBySlug } from "@/lib/api/storefront-public";

type StorefrontLayoutProps = {
  children: ReactNode;
  params: Promise<{
    storeSlug: string;
  }>;
};

export default async function StorefrontLayout({
  children,
  params,
}: StorefrontLayoutProps) {
  const { storeSlug } = await params;
  const storefront = await getPublicStorefrontBySlug(storeSlug);

  if (!storefront) {
    notFound();
  }

  const basePath = `/_stores/${storeSlug}`;

  const socialEntries = Object.entries(storefront.social_links ?? {}).filter(
    ([, value]) => typeof value === "string" && value.trim(),
  ) as Array<[string, string]>;

  return (
    <div className="min-h-screen bg-neutral-1 text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[rgba(4,10,24,0.86)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href={basePath}
            className="flex min-w-0 items-center gap-3 rounded-2xl transition hover:bg-white/[0.04] hover:px-2 hover:py-1"
          >
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
              {storefront.logo_url ? (
                <img
                  src={storefront.logo_url}
                  alt={`${storefront.store_name} logo`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <ShoppingBag className="h-5 w-5 text-indigo-300" />
              )}
            </div>

            <div className="min-w-0">
              <div className="truncate text-lg font-bold tracking-[-0.04em] text-white">
                {storefront.store_name}
              </div>
              <div className="truncate text-xs text-slate-400">
                {storefront.merchant_name}
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            <StorefrontNavLink href={basePath} label="Home" icon={<Home className="h-4 w-4" />} />
            <StorefrontNavLink
              href={`${basePath}/products`}
              label="Products"
              icon={<ShoppingBag className="h-4 w-4" />}
            />
            <StorefrontNavLink
              href={`${basePath}/search`}
              label="Search"
              icon={<Search className="h-4 w-4" />}
            />
            <StorefrontNavLink
              href={`${basePath}/contact`}
              label="Contact"
              icon={<Mail className="h-4 w-4" />}
            />
          </nav>
        </div>
      </header>

      <div>{children}</div>

      <footer className="border-t border-white/10 bg-[rgba(4,10,24,0.78)]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr_0.9fr] lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
                {storefront.logo_url ? (
                  <img
                    src={storefront.logo_url}
                    alt={`${storefront.store_name} logo`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ShoppingBag className="h-5 w-5 text-indigo-300" />
                )}
              </div>

              <div>
                <div className="text-base font-semibold text-white">
                  {storefront.store_name}
                </div>
                <div className="text-xs text-slate-400">
                  {storefront.merchant_name}
                </div>
              </div>
            </div>

            <p className="mt-4 max-w-md text-sm leading-7 text-slate-300">
              {storefront.short_description?.trim() ||
                storefront.about_text?.trim() ||
                `${storefront.store_name} storefront.`}
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">
                {storefront.merchant_base_currency}
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">
                {storefront.merchant_country_code}
              </span>
              {storefront.custom_domain ? (
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">
                  <span className="mr-1 inline-block align-middle">
                    <Globe2 className="h-3.5 w-3.5" />
                  </span>
                  Custom Domain
                </span>
              ) : null}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">
              Explore
            </h2>

            <div className="mt-4 grid gap-3">
              <FooterLink href={basePath} label="Store home" />
              <FooterLink href={`${basePath}/products`} label="Products" />
              <FooterLink href={`${basePath}/search`} label="Search store" />
              <FooterLink href={`${basePath}/contact`} label="Contact" />
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">
              Policies & socials
            </h2>

            <div className="mt-4 grid gap-3">
              <FooterLink href={`${basePath}/policies/terms`} label="Terms of service" />
              <FooterLink href={`${basePath}/policies/privacy`} label="Privacy policy" />
              <FooterLink href={`${basePath}/policies/refund`} label="Return policy" />
              <FooterLink href={`${basePath}/policies/shipping`} label="Fulfillment policy" />
            </div>

            {socialEntries.length > 0 ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {socialEntries.map(([key, value]) => (
                  <a
                    key={key}
                    href={value}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-200 transition hover:bg-white/[0.08]"
                  >
                    {key}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </footer>
    </div>
  );
}

function StorefrontNavLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-full border border-transparent px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-white/10 hover:bg-white/[0.05] hover:text-white"
    >
      {icon}
      {label}
    </Link>
  );
}

function FooterLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="text-sm text-slate-300 transition hover:text-white"
    >
      {label}
    </Link>
  );
}