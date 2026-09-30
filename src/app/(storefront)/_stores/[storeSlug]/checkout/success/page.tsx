import Link from "next/link";

type CheckoutSuccessPageProps = {
  params: Promise<{
    storeSlug: string;
  }>;
  searchParams: Promise<{
    orderRef?: string | string[];
    email?: string | string[];
    receiptNumber?: string | string[];
  }>;
};

function resolveValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

export default async function CheckoutSuccessPage({
  params,
  searchParams,
}: CheckoutSuccessPageProps) {
  const { storeSlug } = await params;
  const query = await searchParams;

  const orderRef = resolveValue(query.orderRef);
  const email = resolveValue(query.email);
  const receiptNumber = resolveValue(query.receiptNumber);
  const basePath = `/_stores/${storeSlug}`;

  return (
    <main className="bg-neutral-1 text-white">
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.78),rgba(8,12,28,0.96))] px-6 py-10 text-center shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
          <h1 className="text-3xl font-bold tracking-[-0.04em] text-white">
            Payment successful
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-300">
            Your payment has been completed successfully.
          </p>

          {(orderRef || receiptNumber) ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {orderRef ? (
                <div className="rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-4">
                  <div className="text-xs uppercase tracking-[0.14em] text-slate-400">
                    Order reference
                  </div>
                  <div className="mt-2 text-sm font-semibold text-white">
                    {orderRef}
                  </div>
                </div>
              ) : null}

              {receiptNumber ? (
                <div className="rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-4">
                  <div className="text-xs uppercase tracking-[0.14em] text-slate-400">
                    Receipt number
                  </div>
                  <div className="mt-2 text-sm font-semibold text-white">
                    {receiptNumber}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {orderRef ? (
              <Link
                href={`${basePath}/order/${encodeURIComponent(orderRef)}${
                  email ? `?email=${encodeURIComponent(email)}` : ""
                }`}
                className="inline-flex h-12 items-center justify-center rounded-xl bg-[image:var(--brand-gradient)] px-6 text-sm font-semibold text-white"
              >
                View order
              </Link>
            ) : null}

            {receiptNumber ? (
              <Link
                href={`${basePath}/receipt/${encodeURIComponent(receiptNumber)}${
                  email ? `?email=${encodeURIComponent(email)}` : ""
                }`}
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/14 bg-white/[0.03] px-6 text-sm font-semibold text-white transition hover:bg-white/[0.06]"
              >
                View receipt
              </Link>
            ) : null}

            <Link
              href={basePath}
              className="inline-flex h-12 items-center justify-center rounded-xl border border-white/14 bg-white/[0.03] px-6 text-sm font-semibold text-white transition hover:bg-white/[0.06]"
            >
              Return to storefront
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}