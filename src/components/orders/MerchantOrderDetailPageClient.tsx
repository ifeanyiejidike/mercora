"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { formatDate, formatMoney, merchantOperationsApi } from "@/lib/api/merchant-operations";
import { useMerchant } from "@/hooks/use-merchant";
import type { MerchantOrder } from "@/types/merchant-operations";
import {
  EmptyState,
  ErrorBanner,
  JsonCard,
  LoadingState,
  MetricRow,
  SectionCard,
  Tag,
  safeText,
} from "@/components/merchant/MerchantOpsPrimitives";

export default function MerchantOrderDetailPageClient() {
  const params = useParams<{ orderId: string }>();
  const { activeMerchant } = useMerchant();

  const [order, setOrder] = useState<MerchantOrder | null>(null);
  const [status, setStatus] = useState("");
  const [paymentState, setPaymentState] = useState("");
  const [fulfillmentStatus, setFulfillmentStatus] = useState("");
  const [merchantNote, setMerchantNote] = useState("");
  const [shippingMethodName, setShippingMethodName] = useState("");
  const [shippingTrackingReference, setShippingTrackingReference] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const currency = activeMerchant?.base_currency || "NGN";

  async function load() {
    if (!activeMerchant) return;

    setError("");
    setIsLoading(true);

    try {
      const data = await merchantOperationsApi.orderDetail(activeMerchant.id, params.orderId);
      setOrder(data);
      setStatus(data.status || "");
      setPaymentState(data.payment_state || "");
      setFulfillmentStatus(data.fulfillment_status || "");
      setMerchantNote(data.merchant_note || "");
      setShippingMethodName(data.shipping_method_name || "");
      setShippingTrackingReference(data.shipping_tracking_reference || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load order detail.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!activeMerchant) {
      setIsLoading(false);
      return;
    }
    void load();
  }, [activeMerchant, params.orderId]);

  async function save() {
    if (!activeMerchant || !order) return;

    setError("");
    setIsSaving(true);

    try {
      const updated = await merchantOperationsApi.updateOrder(activeMerchant.id, order.id, {
        status,
        payment_state: paymentState,
        fulfillment_status: fulfillmentStatus,
        merchant_note: merchantNote,
        shipping_method_name: shippingMethodName,
        shipping_tracking_reference: shippingTrackingReference,
      });
      setOrder(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update order.");
    } finally {
      setIsSaving(false);
    }
  }

  if (!activeMerchant) {
    return <EmptyState text="Select a merchant before opening order detail." />;
  }

  if (isLoading) {
    return <LoadingState text="Loading order detail..." />;
  }

  if (!order) {
    return <EmptyState text="Order not found." />;
  }

  return (
    <main className="space-y-6">
      <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.82),rgba(8,12,28,0.96))] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
        <Link
          href="/dashboard/orders"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to orders
        </Link>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Tag>{order.order_number}</Tag>
          <Tag>{safeText(order.status)}</Tag>
          <Tag>{safeText(order.payment_state)}</Tag>
          <Tag>{safeText(order.fulfillment_status)}</Tag>
        </div>

        <h1 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
          {order.order_number}
        </h1>
      </section>

      {error ? <ErrorBanner text={error} /> : null}

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionCard title="Order overview">
          <div className="space-y-3">
            <MetricRow label="Email" value={safeText(order.email)} />
            <MetricRow label="Phone" value={safeText(order.phone_number)} />
            <MetricRow
              label="Gross amount"
              value={formatMoney(order.gross_amount, order.base_currency || currency)}
            />
            <MetricRow
              label="Subtotal"
              value={formatMoney(order.subtotal_amount, order.base_currency || currency)}
            />
            <MetricRow
              label="Discount"
              value={formatMoney(order.discount_amount, order.base_currency || currency)}
            />
            <MetricRow
              label="Shipping"
              value={formatMoney(order.shipping_amount, order.base_currency || currency)}
            />
            <MetricRow
              label="Tax"
              value={formatMoney(order.tax_amount, order.base_currency || currency)}
            />
            <MetricRow label="Selected provider" value={safeText(order.selected_provider)} />
            <MetricRow label="Payment mode" value={safeText(order.payment_mode)} />
            <MetricRow label="Created at" value={formatDate(order.created_at)} />
            <MetricRow label="Shipped at" value={formatDate(order.shipped_at)} />
            <MetricRow label="Delivered at" value={formatDate(order.delivered_at)} />
          </div>
        </SectionCard>

        <div className="space-y-6">
          <SectionCard title="Update order">
            <div className="space-y-4">
              <input
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                placeholder="Status"
                className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none"
              />
              <input
                value={paymentState}
                onChange={(event) => setPaymentState(event.target.value)}
                placeholder="Payment state"
                className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none"
              />
              <input
                value={fulfillmentStatus}
                onChange={(event) => setFulfillmentStatus(event.target.value)}
                placeholder="Fulfillment status"
                className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none"
              />
              <input
                value={shippingMethodName}
                onChange={(event) => setShippingMethodName(event.target.value)}
                placeholder="Shipping method"
                className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none"
              />
              <input
                value={shippingTrackingReference}
                onChange={(event) => setShippingTrackingReference(event.target.value)}
                placeholder="Tracking reference"
                className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none"
              />
              <textarea
                rows={4}
                value={merchantNote}
                onChange={(event) => setMerchantNote(event.target.value)}
                placeholder="Merchant note"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none"
              />

              <button
                type="button"
                onClick={() => void save()}
                disabled={isSaving}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[image:var(--brand-gradient)] px-5 text-sm font-semibold text-white"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Save order update
              </button>
            </div>
          </SectionCard>

          <SectionCard title="Items">
            <div className="space-y-3">
              {(order.items || []).length === 0 ? (
                <div className="text-sm text-slate-400">No items.</div>
              ) : (
                order.items?.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4"
                  >
                    <div className="text-sm font-semibold text-white">
                      {safeText(item.product_name_snapshot)}
                    </div>
                    <div className="mt-3 grid gap-3 sm:grid-cols-3">
                      <MetricRow label="Variant" value={safeText(item.variant_name_snapshot)} />
                      <MetricRow label="Quantity" value={String(item.quantity || 0)} />
                      <MetricRow
                        label="Line total"
                        value={formatMoney(item.line_total_amount, item.currency || currency)}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </SectionCard>

          <SectionCard title="Timeline">
            <div className="space-y-3">
              {(order.timeline_events || []).length === 0 ? (
                <div className="text-sm text-slate-400">No timeline events.</div>
              ) : (
                order.timeline_events?.map((event) => (
                  <div
                    key={event.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <Tag>{safeText(event.event_type)}</Tag>
                    </div>
                    <div className="mt-3 text-sm font-semibold text-white">
                      {safeText(event.title)}
                    </div>
                    <p className="mt-2 text-sm text-slate-300">
                      {safeText(event.description)}
                    </p>
                    <div className="mt-2 text-xs text-slate-500">
                      {formatDate(event.created_at)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </SectionCard>

          <JsonCard title="Metadata" value={order.metadata || {}} />
        </div>
      </section>
    </main>
  );
}