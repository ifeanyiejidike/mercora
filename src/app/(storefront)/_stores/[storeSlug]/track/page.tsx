"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { publicCommerceApi } from "@/lib/api/public-commerce";
import type { PublicOrder } from "@/types/public-commerce";

export default function StorefrontTrackPage() {
  const params = useParams<{ storeSlug: string }>();
  const searchParams = useSearchParams();
  const storeSlug = params.storeSlug;

  const [orderRef, setOrderRef] = useState(searchParams.get("orderRef") || "");
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [order, setOrder] = useState<PublicOrder | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const runLookup = async () => {
    if (!orderRef.trim()) {
      setError("Order reference is required.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const nextOrder = await publicCommerceApi.getOrder(
        storeSlug,
        orderRef.trim(),
        email.trim(),
      );
      setOrder(nextOrder);
    } catch (err) {
      setOrder(null);
      setError(err instanceof Error ? err.message : "Unable to track order.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchParams.get("orderRef")) {
      void runLookup();
    }
  }, []);

  return (
    <main className="bg-neutral-1 text-white">
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.78),rgba(8,12,28,0.96))] shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
          <div className="border-b border-white/10 px-6 py-6 sm:px-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
              <Search className="h-4 w-4" />
              Order tracking
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
              Track your order
            </h1>
          </div>

          <div className="space-y-6 p-6 sm:p-8">
            {error ? (
              <div className="rounded-[18px] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                {error}
              </div>
            ) : null}

            <div className="grid gap-5 sm:grid-cols-2">
              <InputField
                label="Order reference"
                value={orderRef}
                onChange={setOrderRef}
                placeholder="ORD-..."
              />
              <InputField
                label="Buyer email"
                value={email}
                onChange={setEmail}
                placeholder="you@example.com"
                type="email"
              />
            </div>

            <button
              type="button"
              onClick={() => void runLookup()}
              disabled={isLoading}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[image:var(--brand-gradient)] px-6 text-sm font-semibold text-white"
            >
              {isLoading ? "Checking..." : "Track order"}
            </button>

            {order ? (
              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <StatCard label="Order" value={order.order_number} />
                  <StatCard label="Status" value={order.status || "pending"} />
                  <StatCard
                    label="Payment"
                    value={order.payment_state || "pending"}
                  />
                  <StatCard
                    label="Fulfillment"
                    value={order.fulfillment_status || "pending"}
                  />
                </div>

                <div className="mt-5 rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-4">
                  <div className="text-xs uppercase tracking-[0.14em] text-slate-400">
                    Shipping tracking reference
                  </div>
                  <div className="mt-2 text-sm font-semibold text-white">
                    {order.shipping_tracking_reference || "Not available yet"}
                  </div>
                </div>

                <div className="mt-5">
                  <Link
                    href={`/_stores/${storeSlug}/order/${encodeURIComponent(
                      order.order_number,
                    )}?email=${encodeURIComponent(email)}`}
                    className="inline-flex h-12 items-center justify-center rounded-xl border border-white/14 bg-white/[0.03] px-6 text-sm font-semibold text-white transition hover:bg-white/[0.06]"
                  >
                    Open order page
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-200">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400/50"
      />
    </div>
  );
}

function StatCard({
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
      <div className="mt-2 text-sm font-semibold capitalize text-white">
        {value}
      </div>
    </div>
  );
}