import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShoppingBag,
} from "lucide-react";
import { getPublicStorefrontBySlug } from "@/lib/api/storefront-public";

type StorefrontContactPageProps = {
  params: Promise<{
    storeSlug: string;
  }>;
};

function toWhatsAppHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "#";
}

export async function generateMetadata({
  params,
}: StorefrontContactPageProps): Promise<Metadata> {
  const { storeSlug } = await params;
  const storefront = await getPublicStorefrontBySlug(storeSlug);

  if (!storefront) {
    return {
      title: "Contact | Storefront Not Found",
    };
  }

  return {
    title: `Contact | ${storefront.store_name}`,
    description:
      storefront.seo_description ||
      storefront.short_description ||
      `Contact ${storefront.store_name}.`,
  };
}

export default async function StorefrontContactPage({
  params,
}: StorefrontContactPageProps) {
  const { storeSlug } = await params;
  const storefront = await getPublicStorefrontBySlug(storeSlug);

  if (!storefront) {
    notFound();
  }

  const basePath = `/_stores/${storeSlug}`;

  const address = [
    storefront.address_line_1,
    storefront.address_line_2,
    storefront.city,
    storefront.state_region,
    storefront.postal_code,
    storefront.country_code,
  ]
    .filter(Boolean)
    .join(", ");

  const socialEntries = Object.entries(storefront.social_links ?? {}).filter(
    ([, value]) => typeof value === "string" && value.trim(),
  ) as Array<[string, string]>;

  const hasAnyContact =
    storefront.contact_email ||
    storefront.contact_phone ||
    storefront.whatsapp_number ||
    address;

  return (
    <main className="bg-neutral-1 text-white">
      <section className="relative isolate overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_30%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,10,24,0.18)_0%,rgba(4,10,24,0.96)_100%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr]">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
                <ShoppingBag className="h-4 w-4" />
                Contact storefront
              </div>

              <h1 className="mt-6 text-4xl font-bold leading-[1.03] tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
                Get in touch with {storefront.store_name}.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                Use the channels below to reach the store directly for product
                questions, support, order enquiries, or general assistance.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href={`${basePath}/products`}
                  className="inline-flex h-14 items-center justify-center rounded-2xl bg-[image:var(--brand-gradient)] px-7 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(79,70,229,0.38)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_rgba(79,70,229,0.42)]"
                >
                  Browse products
                </Link>

                <Link
                  href={basePath}
                  className="inline-flex h-14 items-center justify-center rounded-2xl border border-white/14 bg-white/[0.03] px-6 text-sm font-semibold text-white transition hover:bg-white/[0.06]"
                >
                  Back to store
                </Link>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-[rgba(8,12,28,0.56)] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.3)] backdrop-blur-md">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">
                Store summary
              </p>

              <h2 className="mt-4 text-2xl font-semibold text-white">
                {storefront.store_name}
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-300">
                {storefront.short_description?.trim() ||
                  storefront.about_text?.trim() ||
                  `${storefront.store_name} by ${storefront.merchant_name}.`}
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <QuickStat label="Merchant" value={storefront.merchant_name} />
                <QuickStat
                  label="Currency"
                  value={storefront.merchant_base_currency}
                />
                <QuickStat
                  label="Country"
                  value={storefront.merchant_country_code}
                />
                <QuickStat
                  label="Orders"
                  value={storefront.is_accepting_orders ? "accepting" : "paused"}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {!hasAnyContact ? (
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300">
              <Mail className="h-6 w-6" />
            </div>

            <h2 className="mt-4 text-2xl font-semibold text-white">
              Contact details are not yet configured
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-300">
              The storefront exists, but public contact fields have not been filled in yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {storefront.contact_email ? (
              <ContactCard
                icon={<Mail className="h-5 w-5 text-indigo-300" />}
                label="Email"
                value={storefront.contact_email}
                href={`mailto:${storefront.contact_email}`}
              />
            ) : null}

            {storefront.contact_phone ? (
              <ContactCard
                icon={<Phone className="h-5 w-5 text-indigo-300" />}
                label="Phone"
                value={storefront.contact_phone}
                href={`tel:${storefront.contact_phone}`}
              />
            ) : null}

            {storefront.whatsapp_number ? (
              <ContactCard
                icon={<MessageCircle className="h-5 w-5 text-indigo-300" />}
                label="WhatsApp"
                value={storefront.whatsapp_number}
                href={toWhatsAppHref(storefront.whatsapp_number)}
                external
              />
            ) : null}

            {address ? (
              <ContactCard
                icon={<MapPin className="h-5 w-5 text-indigo-300" />}
                label="Address"
                value={address}
              />
            ) : null}
          </div>
        )}

        {socialEntries.length > 0 ? (
          <div className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-6">
            <h2 className="text-lg font-semibold text-white">Social links</h2>

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
      </section>
    </main>
  );
}

function ContactCard({
  icon,
  label,
  value,
  href,
  external = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  const content = (
    <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.72),rgba(8,12,28,0.94))] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.2)]">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/10">
        {icon}
      </div>

      <div className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
        {label}
      </div>

      <div className="mt-2 text-sm font-semibold leading-7 text-white">
        {value}
      </div>
    </div>
  );

  if (!href) {
    return content;
  }

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="block transition hover:-translate-y-0.5"
    >
      {content}
    </a>
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
    <div className="rounded-[20px] border border-white/10 bg-white/[0.03] px-4 py-4">
      <div className="text-xs uppercase tracking-[0.14em] text-slate-400">
        {label}
      </div>
      <div className="mt-2 text-sm font-semibold capitalize text-white">
        {value}
      </div>
    </div>
  );
}