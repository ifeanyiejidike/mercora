import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { getPublicStorefrontBySlug } from "@/lib/api/storefront-public";

type StorefrontRefundPolicyPageProps = {
  params: Promise<{
    storeSlug: string;
  }>;
};

export async function generateMetadata({
  params,
}: StorefrontRefundPolicyPageProps): Promise<Metadata> {
  const { storeSlug } = await params;
  const storefront = await getPublicStorefrontBySlug(storeSlug);

  if (!storefront) {
    return {
      title: "Return Policy | Storefront Not Found",
    };
  }

  return {
    title: `Return Policy | ${storefront.store_name}`,
    description: `Return policy for ${storefront.store_name}.`,
  };
}

export default async function StorefrontRefundPolicyPage({
  params,
}: StorefrontRefundPolicyPageProps) {
  const { storeSlug } = await params;
  const storefront = await getPublicStorefrontBySlug(storeSlug);

  if (!storefront) {
    notFound();
  }

  const basePath = `/_stores/${storeSlug}`;

  return (
    <main className="bg-neutral-1 text-white">
      <PolicyShell
        title="Return Policy"
        description={`Return and refund guidance for ${storefront.store_name}.`}
        content={storefront.return_policy}
        backHref={basePath}
      />
    </main>
  );
}

function PolicyShell({
  title,
  description,
  content,
  backHref,
}: {
  title: string;
  description: string;
  content: string;
  backHref: string;
}) {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.78),rgba(8,12,28,0.96))] shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
        <div className="border-b border-white/10 px-6 py-6 sm:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
            <ShieldCheck className="h-4 w-4" />
            Policy document
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
            {title}
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            {description}
          </p>
        </div>

        <div className="px-6 py-6 sm:px-8">
          <article className="rounded-[24px] border border-white/10 bg-white/[0.03] px-5 py-5">
            <div className="prose prose-invert max-w-none whitespace-pre-wrap text-sm leading-8 text-slate-200">
              {content?.trim() || "This policy has not been configured yet."}
            </div>
          </article>

          <div className="mt-6">
            <Link
              href={backHref}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/14 bg-white/[0.03] px-6 text-sm font-semibold text-white transition hover:bg-white/[0.06]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to storefront
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}