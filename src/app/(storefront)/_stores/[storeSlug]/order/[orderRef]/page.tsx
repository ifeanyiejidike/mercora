"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { formatMoney, publicCommerceApi } from "@/lib/api/public-commerce";
import type { PublicOrder, PublicPayment } from "@/types/public-commerce";

export default function StorefrontOrderPage() {
  const params = useParams<{ storeSlug: string; orderRef: string }>();
  const searchParams = useSearchParams();
  const storeSlug = params.storeSlug;
  const orderRef = params.orderRef;
  const email = searchParams.get("email") || "";

  const [order, setOrder] = useState<PublicOrder | null>(null);
  const [payment, setPayment] = useState<PublicPayment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReinitializing, setIsReinitializing] = useState(false);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const [nextOrder, nextPayment] = await Promise.all([
        publicCommerceApi.getOrder(storeSlug, orderRef, email),
        publicCommerceApi.getOrderPayment(storeSlug, orderRef, email).catch(
          () => null,
        ),
      ]);

      setOrder(nextOrder);
      setPayment(nextPayment);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load order.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [storeSlug, orderRef, email]);

  const handleRetryPlatformPayment = async () => {
    setIsReinitializing(true);
    setError("");

    try {
      const paymentResponse = await publicCommerceApi.initializePayment(
        storeSlug,
        orderRef,
        {},
        email,
      );

      const checkoutUrl =
        paymentResponse.checkout_url ||
        paymentResponse.provider_checkout_url ||
        paymentResponse.hosted_checkout_url;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
        return;
      }

      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to reinitialize payment.",
      );
    } finally {
      setIsReinitializing(false);
    }
  };

  const currency =
    order?.charge_currency || order?.base_currency || payment?.charge_currency || "NGN";

  return (
    <main className="bg-neutral-1 text-white">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 xl:grid-cols-[1.06fr_0.94fr]">
          <section className="overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.78),rgba(8,12,28,0.96))] shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
            <div className="border-b border-white/10 px-6 py-6 sm:px-8">
              <h1 className="text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
                Order details
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                Review order state, payment progress, and fulfillment visibility.
              </p>
            </div>

            <div className="space-y-6 p-6 sm:p-8">
              {error ? (
                <div className="rounded-[18px] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                  {error}
                </div>
              ) : null}

              {isLoading ? (
                <div className="flex h-[220px] items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                </div>
              ) : (
                <>
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard label="Order number" value={order?.order_number || orderRef} />
                    <StatCard label="Status" value={order?.status || "pending"} />
                    <StatCard
                      label="Payment"
                      value={order?.payment_state || payment?.status || "pending"}
                    />
                    <StatCard
                      label="Fulfillment"
                      value={order?.fulfillment_status || "pending"}
                    />
                  </div>

                  <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                    <h2 className="text-lg font-semibold text-white">Summary</h2>

                    <div className="mt-4 space-y-3">
                      <SummaryRow
                        label="Buyer email"
                        value={order?.email || email || "—"}
                      />
                      <SummaryRow
                        label="Phone"
                        value={order?.phone_number || "—"}
                      />
                      <SummaryRow
                        label="Payment mode"
                        value={order?.payment_mode || payment?.payment_mode || "—"}
                      />
                      <SummaryRow
                        label="Total"
                        value={formatMoney(order?.gross_amount, currency)}
                        emphasized
                      />
                    </div>
                  </div>

                  {order?.buyer_note ? (
                    <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                      <h2 className="text-lg font-semibold text-white">Buyer note</h2>
                      <p className="mt-3 text-sm leading-7 text-slate-300">
                        {order.buyer_note}
                      </p>
                    </div>
                  ) : null}

                  {Array.isArray(order?.timeline_events) && order.timeline_events.length > 0 ? (
                    <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                      <h2 className="text-lg font-semibold text-white">Timeline</h2>

                      <div className="mt-4 space-y-3">
                        {order.timeline_events.map((event, index) => (
                          <article
                            key={event.id || index}
                            className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4"
                          >
                            <div className="text-sm font-semibold text-white">
                              {event.title || event.event_type || "Event"}
                            </div>
                            <div className="mt-1 text-xs text-slate-500">
                              {event.created_at || "—"}
                            </div>
                            {event.message ? (
                              <p className="mt-2 text-sm leading-7 text-slate-300">
                                {event.message}
                              </p>
                            ) : null}
                          </article>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </>
              )}
            </div>
          </section>

          <aside className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.78),rgba(8,12,28,0.96))] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
            <h2 className="text-xl font-semibold text-white">Actions</h2>

            <div className="mt-5 space-y-3">
              {(order?.payment_mode || payment?.payment_mode) === "merchant_direct" ? (
                <Link
                  href={`/_stores/${storeSlug}/payment/manual/${orderRef}?email=${encodeURIComponent(
                    email,
                  )}`}
                  className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-[image:var(--brand-gradient)] px-4 text-sm font-semibold text-white"
                >
                  Open manual payment
                </Link>
              ) : null}

              {(order?.payment_mode || payment?.payment_mode) ===
                "platform_managed" && (order?.payment_state || "") !== "paid" ? (
                <button
                  type="button"
                  onClick={() => void handleRetryPlatformPayment()}
                  disabled={isReinitializing}
                  className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-[image:var(--brand-gradient)] px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isReinitializing ? "Preparing..." : "Retry payment"}
                </button>
              ) : null}

              <Link
                href={`/_stores/${storeSlug}/track?orderRef=${encodeURIComponent(
                  orderRef,
                )}&email=${encodeURIComponent(email)}`}
                className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-white/14 bg-white/[0.03] px-4 text-sm font-semibold text-white transition hover:bg-white/[0.06]"
              >
                Track order
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
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
      <div className="mt-2 break-all text-sm font-semibold capitalize text-white">
        {value}
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  emphasized = false,
}: {
  label: string;
  value: string;
  emphasized?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-slate-400">{label}</span>
      <span
        className={`text-sm font-semibold ${
          emphasized ? "text-white" : "text-slate-200"
        }`}
      >
        {value}
      </span>
    </div>
  );
}