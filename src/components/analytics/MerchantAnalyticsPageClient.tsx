"use client";

import { useEffect, useState } from "react";
import { BarChart3, Loader2, ShoppingBag, Ticket, Wallet } from "lucide-react";
import { analyticsApi, formatDate, formatMoney } from "@/lib/api/analytics";
import { useMerchant } from "@/hooks/use-merchant";
import type {
  MerchantDashboardSummary,
  MerchantOperationsSummary,
  MerchantSalesTimeseries,
  MerchantTopProducts,
} from "@/types/analytics";

export default function MerchantAnalyticsPageClient() {
  const { activeMerchant } = useMerchant();

  const [days, setDays] = useState(30);
  const [dashboard, setDashboard] = useState<MerchantDashboardSummary | null>(null);
  const [sales, setSales] = useState<MerchantSalesTimeseries | null>(null);
  const [topProducts, setTopProducts] = useState<MerchantTopProducts | null>(null);
  const [operations, setOperations] = useState<MerchantOperationsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");

  const currency = dashboard?.currency || "NGN";

  const load = async (refresh = false) => {
    if (!activeMerchant) return;

    setError("");
    refresh ? setIsRefreshing(true) : setIsLoading(true);

    try {
      const [dashboardData, salesData, productsData, operationsData] =
        await Promise.all([
          analyticsApi.dashboardSummary(activeMerchant.id, days),
          analyticsApi.salesTimeseries(activeMerchant.id, days),
          analyticsApi.topProducts(activeMerchant.id, days, 10),
          analyticsApi.operationsSummary(activeMerchant.id, days),
        ]);

      setDashboard(dashboardData);
      setSales(salesData);
      setTopProducts(productsData);
      setOperations(operationsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load analytics.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!activeMerchant) {
      setIsLoading(false);
      return;
    }

    void load();
  }, [activeMerchant, days]);

  if (!activeMerchant) {
    return <EmptyState text="Select a merchant before opening analytics." />;
  }

  if (isLoading) {
    return <LoadingState text="Loading analytics..." />;
  }

  return (
    <main className="space-y-6">
      <section className="overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.78),rgba(8,12,28,0.96))] shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
        <div className="border-b border-white/10 px-6 py-6 sm:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
                <BarChart3 className="h-4 w-4" />
                Merchant analytics
              </div>
              <h1 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
                {activeMerchant.public_display_name} analytics
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={days}
                onChange={(event) => setDays(Number(event.target.value))}
                className="h-11 rounded-xl border border-white/10 bg-neutral-2 px-4 text-sm text-white outline-none"
              >
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
              </select>

              <button
                type="button"
                onClick={() => void load(true)}
                disabled={isRefreshing}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[image:var(--brand-gradient)] px-5 text-sm font-semibold text-white"
              >
                {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Refresh
              </button>
            </div>
          </div>
        </div>

        {error ? (
          <div className="px-6 py-4 text-sm text-red-100">{error}</div>
        ) : null}

        <div className="grid gap-4 p-6 sm:grid-cols-2 xl:grid-cols-4 sm:p-8">
          <StatCard
            label="Gross order amount"
            value={formatMoney(dashboard?.orders?.gross_order_amount, currency)}
          />
          <StatCard
            label="Successful payments"
            value={formatMoney(
              dashboard?.payments?.successful_payment_amount,
              currency,
            )}
          />
          <StatCard
            label="Paid-out settlements"
            value={formatMoney(
              dashboard?.settlements?.paid_out_net_amount,
              currency,
            )}
          />
          <StatCard
            label="Unread notifications"
            value={String(dashboard?.notifications?.unread_notifications || 0)}
          />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Orders and payments">
          <MetricGrid
            items={[
              ["Total orders", String(dashboard?.orders?.total_orders || 0)],
              ["Paid orders", String(dashboard?.orders?.paid_orders || 0)],
              ["Fulfilled orders", String(dashboard?.orders?.fulfilled_orders || 0)],
              ["Cancelled orders", String(dashboard?.orders?.cancelled_orders || 0)],
              [
                "Average order value",
                formatMoney(dashboard?.orders?.average_order_value, currency),
              ],
              [
                "Refunded amount",
                formatMoney(dashboard?.payments?.refunded_amount, currency),
              ],
            ]}
          />
        </SectionCard>

        <SectionCard title="Settlements and support">
          <MetricGrid
            items={[
              ["Eligible settlements", String(dashboard?.settlements?.eligible_count || 0)],
              [
                "Eligible net amount",
                formatMoney(dashboard?.settlements?.eligible_net_amount, currency),
              ],
              ["Open tickets", String(dashboard?.support?.open_tickets || 0)],
              ["Urgent tickets", String(dashboard?.support?.urgent_tickets || 0)],
              ["Issued receipts", String(dashboard?.receipts?.issued_receipts || 0)],
              [
                "Current plan",
                dashboard?.subscription?.current_plan_name || "No active plan",
              ],
            ]}
          />
        </SectionCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Sales timeseries">
          <div className="space-y-3">
            {(sales?.points || []).length === 0 ? (
              <EmptyInline text="No sales points available." />
            ) : (
              sales?.points?.map((point) => (
                <div
                  key={point.date}
                  className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="text-sm font-semibold text-white">{point.date}</div>
                  <div className="grid gap-2 text-sm text-slate-300 sm:grid-cols-3 sm:gap-6">
                    <span>{point.order_count} orders</span>
                    <span>{formatMoney(point.gross_amount, currency)}</span>
                    <span>{point.successful_order_count} successful</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </SectionCard>

        <SectionCard title="Top products">
          <div className="space-y-3">
            {(topProducts?.products || []).length === 0 ? (
              <EmptyInline text="No top-product data available." />
            ) : (
              topProducts?.products?.map((product) => (
                <div
                  key={product.product_id || product.product_slug || product.product_name}
                  className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4"
                >
                  <div className="flex items-center gap-2 text-white">
                    <ShoppingBag className="h-4 w-4 text-indigo-300" />
                    <span className="font-semibold">
                      {product.product_name || "Unnamed product"}
                    </span>
                  </div>
                  <div className="grid gap-2 text-sm text-slate-300 sm:grid-cols-3">
                    <span>{product.quantity_sold || 0} units sold</span>
                    <span>{product.order_count || 0} orders</span>
                    <span>{formatMoney(product.revenue_amount, currency)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </SectionCard>
      </section>

      <SectionCard title="Operations summary">
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Ticket className="h-4 w-4 text-indigo-300" />
              Recent support tickets
            </div>

            {(operations?.support?.recent_tickets || []).length === 0 ? (
              <EmptyInline text="No recent tickets." />
            ) : (
              operations?.support?.recent_tickets?.map((ticket) => (
                <div
                  key={ticket.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4"
                >
                  <div className="text-sm font-semibold text-white">
                    {ticket.ticket_number} — {ticket.subject}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-500">
                    {ticket.priority} • {ticket.status}
                  </div>
                  <div className="mt-2 text-sm text-slate-300">
                    {formatDate(ticket.last_activity_at)}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Wallet className="h-4 w-4 text-indigo-300" />
              Payout batch state
            </div>

            <MetricGrid
              items={[
                ["Scheduled batches", String(operations?.payouts?.scheduled_batches || 0)],
                ["Processing batches", String(operations?.payouts?.processing_batches || 0)],
                ["Paid-out batches", String(operations?.payouts?.paid_out_batches || 0)],
                ["Failed batches", String(operations?.payouts?.failed_batches || 0)],
                [
                  "Unread notifications",
                  String(operations?.notifications?.unread_notifications || 0),
                ],
                [
                  "Archived notifications",
                  String(operations?.notifications?.archived_notifications || 0),
                ],
              ]}
            />
          </div>
        </div>
      </SectionCard>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-4">
      <div className="text-xs uppercase tracking-[0.14em] text-slate-400">{label}</div>
      <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">{value}</div>
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.72),rgba(8,12,28,0.94))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function MetricGrid({ items }: { items: Array<[string, string]> }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map(([label, value]) => (
        <div
          key={label}
          className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4"
        >
          <div className="text-xs uppercase tracking-[0.14em] text-slate-500">{label}</div>
          <div className="mt-2 text-sm font-semibold text-white">{value}</div>
        </div>
      ))}
    </div>
  );
}

function LoadingState({ text }: { text: string }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
      <p className="mt-4 text-sm text-slate-300">{text}</p>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-12 text-center text-slate-300">
      {text}
    </div>
  );
}

function EmptyInline({ text }: { text: string }) {
  return <div className="text-sm text-slate-400">{text}</div>;
}