"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Loader2,
  Search,
  ShoppingBag,
  Users,
} from "lucide-react";
import { customersApi } from "@/lib/api/customers";
import { env } from "@/lib/config/env";
import { useMerchant } from "@/hooks/use-merchant";
import {
  type Customer,
  getCustomerDisplayName,
} from "@/types/customer";

function formatMoney(amount?: string, currency = "NGN") {
  if (!amount) return "—";

  const numeric = Number(amount);

  if (!Number.isFinite(numeric)) {
    return `${currency} ${amount}`;
  }

  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(numeric);
  } catch {
    return `${currency} ${numeric.toFixed(2)}`;
  }
}

function formatDate(value?: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function EmptyActiveMerchantState() {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300">
        <Users className="h-6 w-6" />
      </div>
      <h2 className="mt-4 text-2xl font-semibold text-white">
        No active merchant selected
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-300">
        Select or create a merchant from the dashboard before opening the customers area.
      </p>
      <Link
        href={env.routes.merchantDashboard}
        className="mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-[image:var(--brand-gradient)] px-6 text-sm font-semibold text-white"
      >
        Go to merchant dashboard
      </Link>
    </div>
  );
}

export default function CustomersPageClient() {
  const { activeMerchant } = useMerchant();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [guestOnly, setGuestOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");

  const currency = activeMerchant?.base_currency || "NGN";

  const loadCustomers = async (refresh = false) => {
    if (!activeMerchant) return;

    if (refresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    setError("");

    try {
      const payload = await customersApi.list(activeMerchant.id, {
        q: searchValue,
        status: statusFilter,
        source: sourceFilter,
        is_guest: guestOnly || undefined,
      });

      setCustomers(payload.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load customers.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!activeMerchant) {
      setCustomers([]);
      setIsLoading(false);
      return;
    }

    void loadCustomers();
  }, [activeMerchant]);

  const stats = useMemo(() => {
    const guests = customers.filter((customer) => customer.is_guest).length;
    const active = customers.filter((customer) => customer.status === "active").length;
    const withOrders = customers.filter(
      (customer) => (customer.total_orders_count || 0) > 0,
    ).length;

    return {
      total: customers.length,
      guests,
      active,
      withOrders,
    };
  }, [customers]);

  if (!activeMerchant) {
    return <EmptyActiveMerchantState />;
  }

  return (
    <main className="space-y-6">
      <section className="overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.78),rgba(8,12,28,0.96))] shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
        <div className="border-b border-white/10 px-6 py-6 sm:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
            <Users className="h-4 w-4" />
            Merchant customers
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
            Customers for {activeMerchant.public_display_name}
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
            Review buyer records, guest conversions, order history indicators, spend signals, and customer identity data.
          </p>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-2 xl:grid-cols-4 sm:p-8">
          <StatCard label="Total customers" value={String(stats.total)} />
          <StatCard label="Guest customers" value={String(stats.guests)} />
          <StatCard label="Active customers" value={String(stats.active)} />
          <StatCard label="With orders" value={String(stats.withOrders)} />
        </div>
      </section>

      <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.72),rgba(8,12,28,0.94))] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.22)] sm:p-8">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr_auto]">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Search
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search by name, email, phone..."
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400/50"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-12 w-full rounded-xl border border-white/10 bg-neutral-2 px-4 text-sm text-white outline-none focus:border-indigo-400/50"
            >
              <option value="">All statuses</option>
              <option value="lead">Lead</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Source
            </label>
            <select
              value={sourceFilter}
              onChange={(event) => setSourceFilter(event.target.value)}
              className="h-12 w-full rounded-xl border border-white/10 bg-neutral-2 px-4 text-sm text-white outline-none focus:border-indigo-400/50"
            >
              <option value="">All sources</option>
              <option value="storefront">Storefront</option>
              <option value="manual">Manual</option>
              <option value="import">Import</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex flex-col justify-end">
            <button
              type="button"
              onClick={() => {
                setGuestOnly((current) => !current);
              }}
              className={`inline-flex h-12 items-center justify-center rounded-xl border px-4 text-sm font-semibold transition ${
                guestOnly
                  ? "border-indigo-500/30 bg-indigo-500/12 text-indigo-100"
                  : "border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]"
              }`}
            >
              {guestOnly ? "Guests only" : "All buyers"}
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => void loadCustomers(true)}
            disabled={isRefreshing}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[image:var(--brand-gradient)] px-6 text-sm font-semibold text-white shadow-[0_16px_38px_rgba(79,70,229,0.34)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isRefreshing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              "Apply filters"
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setSearchValue("");
              setStatusFilter("");
              setSourceFilter("");
              setGuestOnly(false);
            }}
            className="inline-flex h-12 items-center justify-center rounded-xl border border-white/14 bg-white/[0.03] px-6 text-sm font-semibold text-white transition hover:bg-white/[0.06]"
          >
            Reset filters
          </button>
        </div>

        {error ? (
          <div className="mt-5 rounded-[18px] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        ) : null}
      </section>

      <section className="space-y-4">
        {isLoading ? (
          <LoadingPanel />
        ) : customers.length === 0 ? (
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-white">
              No customers found
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-300">
              No customer records matched the current merchant and filter selection.
            </p>
          </div>
        ) : (
          customers.map((customer) => (
            <Link
              key={customer.id}
              href={`/dashboard/customers/${customer.id}`}
              className="group block rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.66),rgba(8,12,28,0.94))] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1 hover:border-indigo-500/20"
            >
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-300">
                      {customer.source || "source"}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${
                        customer.status === "active"
                          ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-200"
                          : "border border-white/10 bg-white/[0.04] text-slate-300"
                      }`}
                    >
                      {customer.status || "unknown"}
                    </span>

                    {customer.is_guest ? (
                      <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-100">
                        Guest
                      </span>
                    ) : null}
                  </div>

                  <h2 className="mt-4 truncate text-2xl font-semibold tracking-[-0.03em] text-white">
                    {getCustomerDisplayName(customer)}
                  </h2>

                  <div className="mt-3 grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
                    <div>{customer.email || "No email"}</div>
                    <div>{customer.phone_number || "No phone number"}</div>
                  </div>

                  {customer.notes ? (
                    <p className="mt-4 line-clamp-2 max-w-3xl text-sm leading-7 text-slate-400">
                      {customer.notes}
                    </p>
                  ) : null}
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:min-w-[340px] xl:grid-cols-2">
                  <MiniMetric
                    label="Orders"
                    value={String(customer.total_orders_count || 0)}
                  />
                  <MiniMetric
                    label="Total spent"
                    value={formatMoney(customer.total_spent_amount, currency)}
                  />
                  <MiniMetric
                    label="Average order"
                    value={formatMoney(customer.average_order_value_amount, currency)}
                  />
                  <MiniMetric
                    label="Last order"
                    value={formatDate(customer.last_order_at)}
                  />
                </div>
              </div>

              <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white">
                Open customer
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))
        )}
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
      <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">
        {value}
      </div>
    </div>
  );
}

function MiniMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[20px] border border-white/10 bg-white/[0.03] px-4 py-4">
      <div className="text-xs uppercase tracking-[0.14em] text-slate-500">
        {label}
      </div>
      <div className="mt-2 text-sm font-semibold text-white">{value}</div>
    </div>
  );
}

function LoadingPanel() {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
      <p className="mt-4 text-sm text-slate-300">Loading customers...</p>
    </div>
  );
}