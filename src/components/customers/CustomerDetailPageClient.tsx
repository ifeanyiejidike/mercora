"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Home,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Users,
} from "lucide-react";
import { customersApi } from "@/lib/api/customers";
import { env } from "@/lib/config/env";
import { useMerchant } from "@/hooks/use-merchant";
import type { Customer, CustomerAddress } from "@/types/customer";
import { getCustomerDisplayName } from "@/types/customer";

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
        Select or create a merchant from the dashboard before opening customer details.
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

export default function CustomerDetailPageClient() {
  const params = useParams<{ customerId: string }>();
  const customerId = params.customerId;

  const { activeMerchant } = useMerchant();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const currency = activeMerchant?.base_currency || "NGN";

  const defaultShippingAddress = useMemo(
    () =>
      addresses.find(
        (address) =>
          address.id === customer?.default_shipping_address_id ||
          address.is_default_shipping,
      ) || null,
    [addresses, customer?.default_shipping_address_id],
  );

  const defaultBillingAddress = useMemo(
    () =>
      addresses.find(
        (address) =>
          address.id === customer?.default_billing_address_id ||
          address.is_default_billing,
      ) || null,
    [addresses, customer?.default_billing_address_id],
  );

  useEffect(() => {
    const run = async () => {
      if (!activeMerchant) {
        setIsLoading(false);
        return;
      }

      setError("");
      setIsLoading(true);

      try {
        const [customerPayload, addressesPayload] = await Promise.all([
          customersApi.detail(activeMerchant.id, customerId),
          customersApi.addresses(activeMerchant.id, customerId),
        ]);

        setCustomer(customerPayload);
        setAddresses(addressesPayload);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load customer details.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void run();
  }, [activeMerchant, customerId]);

  if (!activeMerchant) {
    return <EmptyActiveMerchantState />;
  }

  if (isLoading) {
    return (
      <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
        <p className="mt-4 text-sm text-slate-300">Loading customer details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[28px] border border-red-500/20 bg-red-500/10 px-6 py-8 text-red-100">
        {error}
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-12 text-center">
        <h2 className="text-2xl font-semibold text-white">Customer not found</h2>
      </div>
    );
  }

  return (
    <main className="space-y-6">
      <section className="overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.78),rgba(8,12,28,0.96))] shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
        <div className="border-b border-white/10 px-6 py-6 sm:px-8">
          <Link
            href={env.routes.merchantCustomers}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to customers
          </Link>

          <div className="mt-5 flex flex-wrap items-center gap-3">
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

          <h1 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
            {getCustomerDisplayName(customer)}
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
            Review customer identity, contact data, order-value signals, notes, and saved addresses.
          </p>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-2 xl:grid-cols-4 sm:p-8">
          <StatCard
            label="Orders"
            value={String(customer.total_orders_count || 0)}
          />
          <StatCard
            label="Total spent"
            value={formatMoney(customer.total_spent_amount, currency)}
          />
          <StatCard
            label="Average order"
            value={formatMoney(customer.average_order_value_amount, currency)}
          />
          <StatCard
            label="Last order"
            value={formatDate(customer.last_order_at)}
          />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
        <div className="space-y-6">
          <SectionCard title="Customer information">
            <InfoRow
              icon={<Mail className="h-4 w-4 text-indigo-300" />}
              label="Email"
              value={customer.email || "—"}
            />
            <InfoRow
              icon={<Phone className="h-4 w-4 text-indigo-300" />}
              label="Phone"
              value={customer.phone_number || "—"}
            />
            <InfoRow
              icon={<Users className="h-4 w-4 text-indigo-300" />}
              label="Marketing opt in"
              value={customer.marketing_opt_in ? "Yes" : "No"}
            />
            <InfoRow
              icon={<Users className="h-4 w-4 text-indigo-300" />}
              label="Created at"
              value={formatDate(customer.created_at)}
            />
          </SectionCard>

          <SectionCard title="Notes">
            <p className="text-sm leading-7 text-slate-300">
              {customer.notes?.trim() || "No customer notes available."}
            </p>
          </SectionCard>

          <SectionCard title="Metadata">
            <pre className="whitespace-pre-wrap break-words rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-xs leading-6 text-slate-300">
              {JSON.stringify(customer.metadata || {}, null, 2)}
            </pre>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title="Default shipping address">
            {defaultShippingAddress ? (
              <AddressBlock address={defaultShippingAddress} />
            ) : (
              <p className="text-sm text-slate-400">No default shipping address.</p>
            )}
          </SectionCard>

          <SectionCard title="Default billing address">
            {defaultBillingAddress ? (
              <AddressBlock address={defaultBillingAddress} />
            ) : (
              <p className="text-sm text-slate-400">No default billing address.</p>
            )}
          </SectionCard>

          <SectionCard title={`Saved addresses (${addresses.length})`}>
            {addresses.length === 0 ? (
              <p className="text-sm text-slate-400">No saved addresses.</p>
            ) : (
              <div className="space-y-4">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-white">
                        {address.label || address.address_type || "Address"}
                      </span>

                      {address.is_default_shipping ? (
                        <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-indigo-100">
                          Default shipping
                        </span>
                      ) : null}

                      {address.is_default_billing ? (
                        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-100">
                          Default billing
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-3">
                      <AddressBlock address={address} compact />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>
      </section>
    </main>
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
      <div className="mt-2 break-words text-sm font-semibold text-white">
        {value}
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-4">
      <div className="mt-0.5">{icon}</div>
      <div>
        <div className="text-xs uppercase tracking-[0.14em] text-slate-500">
          {label}
        </div>
        <div className="mt-2 text-sm font-semibold text-white">{value}</div>
      </div>
    </div>
  );
}

function AddressBlock({
  address,
  compact = false,
}: {
  address: CustomerAddress;
  compact?: boolean;
}) {
  const lines = [
    address.recipient_name,
    address.phone_number,
    address.address_line_1,
    address.address_line_2,
    [address.city, address.state_region].filter(Boolean).join(", "),
    [address.postal_code, address.country_code].filter(Boolean).join(" "),
  ].filter(Boolean);

  return (
    <div className={`rounded-[22px] border border-white/10 bg-white/[0.03] ${compact ? "px-4 py-4" : "px-5 py-5"}`}>
      <div className="flex items-start gap-3">
        <MapPin className="mt-0.5 h-4 w-4 text-indigo-300" />
        <div className="space-y-1">
          {lines.length === 0 ? (
            <p className="text-sm text-slate-400">Address data unavailable.</p>
          ) : (
            lines.map((line, index) => (
              <p key={index} className="text-sm leading-7 text-slate-300">
                {line}
              </p>
            ))
          )}
        </div>
      </div>
    </div>
  );
}