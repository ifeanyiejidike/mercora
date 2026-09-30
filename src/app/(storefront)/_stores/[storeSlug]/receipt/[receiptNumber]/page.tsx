"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Loader2, ReceiptText } from "lucide-react";
import { publicCommerceApi } from "@/lib/api/public-commerce";
import type { PublicReceiptPayload } from "@/types/public-commerce";

export default function StorefrontReceiptPage() {
  const params = useParams<{ storeSlug: string; receiptNumber: string }>();
  const searchParams = useSearchParams();
  const storeSlug = params.storeSlug;
  const receiptNumber = params.receiptNumber;

  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [receipt, setReceipt] = useState<PublicReceiptPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReloading, setIsReloading] = useState(false);
  const [error, setError] = useState("");

  const loadReceipt = async (currentEmail?: string, silent = false) => {
    if (silent) {
      setIsReloading(true);
    } else {
      setIsLoading(true);
    }

    setError("");

    try {
      const payload = await publicCommerceApi.getReceiptByNumber(
        storeSlug,
        receiptNumber,
        currentEmail || email,
      );
      setReceipt(payload);
    } catch (err) {
      setReceipt(null);
      setError(err instanceof Error ? err.message : "Unable to load receipt.");
    } finally {
      setIsLoading(false);
      setIsReloading(false);
    }
  };

  useEffect(() => {
    void loadReceipt(searchParams.get("email") || "");
  }, [storeSlug, receiptNumber]);

  return (
    <main className="bg-neutral-1 text-white">
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.78),rgba(8,12,28,0.96))] shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
          <div className="border-b border-white/10 px-6 py-6 sm:px-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
              <ReceiptText className="h-4 w-4" />
              Receipt
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
              Receipt {receiptNumber}
            </h1>
          </div>

          <div className="space-y-6 p-6 sm:p-8">
            {error ? (
              <div className="rounded-[18px] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                {error}
              </div>
            ) : null}

            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Buyer email
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="h-12 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400/50"
                />
                <button
                  type="button"
                  onClick={() => void loadReceipt(email, true)}
                  disabled={isReloading}
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-[image:var(--brand-gradient)] px-6 text-sm font-semibold text-white"
                >
                  {isReloading ? "Loading..." : "Reload"}
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex h-[220px] items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              </div>
            ) : receipt ? (
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <InfoCard
                    label="Receipt number"
                    value={receipt.receipt_number || receiptNumber}
                  />
                  <InfoCard label="Issued at" value={receipt.issued_at || "—"} />
                  <InfoCard
                    label="Merchant"
                    value={
                      String(
                        receipt.merchant_snapshot?.legal_business_name ||
                          receipt.merchant_snapshot?.public_display_name ||
                          "—",
                      )
                    }
                  />
                  <InfoCard
                    label="Buyer"
                    value={
                      String(
                        receipt.customer_snapshot?.email ||
                          receipt.customer_snapshot?.name ||
                          "—",
                      )
                    }
                  />
                </div>

                <SnapshotSection
                  title="Merchant snapshot"
                  snapshot={receipt.merchant_snapshot}
                />
                <SnapshotSection
                  title="Storefront snapshot"
                  snapshot={receipt.storefront_snapshot}
                />
                <SnapshotSection
                  title="Customer snapshot"
                  snapshot={receipt.customer_snapshot}
                />
                <SnapshotSection
                  title="Payment snapshot"
                  snapshot={receipt.payment_snapshot}
                />
                <SnapshotSection
                  title="Billing address"
                  snapshot={receipt.billing_address_snapshot}
                />
                <SnapshotSection
                  title="Shipping address"
                  snapshot={receipt.shipping_address_snapshot}
                />

                <section className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                  <h2 className="text-lg font-semibold text-white">Items</h2>

                  <div className="mt-4 space-y-3">
                    {Array.isArray(receipt.items_snapshot) &&
                    receipt.items_snapshot.length > 0 ? (
                      receipt.items_snapshot.map((item, index) => (
                        <div
                          key={index}
                          className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4"
                        >
                          <pre className="whitespace-pre-wrap break-words text-xs leading-6 text-slate-300">
                            {JSON.stringify(item, null, 2)}
                          </pre>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400">No items snapshot available.</p>
                    )}
                  </div>
                </section>

                <SnapshotSection
                  title="Totals snapshot"
                  snapshot={receipt.totals_snapshot}
                />
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoCard({
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

function SnapshotSection({
  title,
  snapshot,
}: {
  title: string;
  snapshot?: Record<string, unknown>;
}) {
  return (
    <section className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
      <h2 className="text-lg font-semibold text-white">{title}</h2>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
        <pre className="whitespace-pre-wrap break-words text-xs leading-6 text-slate-300">
          {JSON.stringify(snapshot || {}, null, 2)}
        </pre>
      </div>
    </section>
  );
}