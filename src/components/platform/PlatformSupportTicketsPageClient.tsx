"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, LifeBuoy } from "lucide-react";
import { formatDate, platformAdminApi } from "@/lib/api/platform-admin";
import {
  PlatformEmptyPanel,
  PlatformErrorBanner,
  PlatformLoadingPanel,
  PlatformMetricTile,
  PlatformTag,
} from "@/components/platform/PlatformPrimitives";
import type {
  PlatformSupportMessageAuthorCustomer,
  PlatformSupportMessageAuthorUser,
  PlatformSupportTicket,
} from "@/types/platform-admin";

function safeText(value?: string | null) {
  return value && value.trim() ? value : "—";
}

function formatUser(user?: PlatformSupportMessageAuthorUser | null) {
  if (!user) return "—";

  const fullName =
    [user.first_name, user.last_name].filter(Boolean).join(" ").trim() ||
    user.display_name ||
    user.email;

  return fullName || "—";
}

function formatCustomer(customer?: PlatformSupportMessageAuthorCustomer | null) {
  if (!customer) return "—";

  const fullName =
    [customer.first_name, customer.last_name].filter(Boolean).join(" ").trim() ||
    customer.full_name ||
    customer.email;

  return fullName || "—";
}

export default function PlatformSupportTicketsPageClient() {
  const [days, setDays] = useState(30);
  const [tickets, setTickets] = useState<PlatformSupportTicket[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    void load();
  }, [days]);

  async function load(refresh = false) {
    setError("");
    refresh ? setIsRefreshing(true) : setIsLoading(true);

    try {
      const data = await platformAdminApi.listSupportTickets({
        days,
        search: search || undefined,
        status: status || undefined,
        priority: priority || undefined,
        category: category || undefined,
      });
      setTickets(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load support tickets.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  if (isLoading) {
    return <PlatformLoadingPanel text="Loading platform support tickets..." />;
  }

  return (
    <main className="space-y-6">
      <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.82),rgba(8,12,28,0.96))] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
              <LifeBuoy className="h-4 w-4" />
              Platform support tickets
            </div>
            <h1 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
              Support oversight
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
              Refresh
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_220px_220px_220px_auto]">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search ticket number, subject, email..."
            className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none"
          />

          <input
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            placeholder="Status"
            className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none"
          />

          <input
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
            placeholder="Priority"
            className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none"
          />

          <input
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            placeholder="Category"
            className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none"
          />

          <button
            type="button"
            onClick={() => void load(true)}
            className="h-11 rounded-xl border border-white/14 bg-white/[0.03] px-5 text-sm font-semibold text-white"
          >
            Apply
          </button>
        </div>
      </section>

      {error ? <PlatformErrorBanner text={error} /> : null}

      <section className="space-y-4">
        {tickets.length === 0 ? (
          <PlatformEmptyPanel text="No support tickets found." />
        ) : (
          tickets.map((ticket) => (
            <Link
              key={ticket.id}
              href={`/platform-admin/support/tickets/${ticket.id}`}
              className="group block rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.66),rgba(8,12,28,0.94))] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1 hover:border-indigo-500/20"
            >
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <PlatformTag>{safeText(ticket.ticket_number)}</PlatformTag>
                    <PlatformTag>{safeText(ticket.category)}</PlatformTag>
                    <PlatformTag>{safeText(ticket.priority)}</PlatformTag>
                    <PlatformTag>{safeText(ticket.status)}</PlatformTag>
                  </div>

                  <h2 className="mt-4 text-xl font-semibold text-white">
                    {safeText(ticket.subject)}
                  </h2>

                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    {safeText(ticket.description)}
                  </p>

                  <div className="mt-3 grid gap-2 text-sm text-slate-400 sm:grid-cols-2">
                    <div>
                      Contact:{" "}
                      {safeText(ticket.contact_email) !== "—"
                        ? safeText(ticket.contact_email)
                        : safeText(ticket.contact_name)}
                    </div>
                    <div>
                      Customer: {formatCustomer(ticket.customer)}
                    </div>
                    <div>
                      Last activity: {formatDate(ticket.last_activity_at || ticket.created_at)}
                    </div>
                    <div>
                      Created by: {formatUser(ticket.created_by_user)}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:min-w-[320px] xl:grid-cols-2">
                  <PlatformMetricTile label="Merchant ID" value={safeText(ticket.merchant)} />
                  <PlatformMetricTile label="Assigned to" value={formatUser(ticket.assigned_to)} />
                  <PlatformMetricTile label="Order ID" value={safeText(ticket.order)} />
                  <PlatformMetricTile label="Payment ID" value={safeText(ticket.payment)} />
                </div>
              </div>

              <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white">
                Open support ticket
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))
        )}
      </section>
    </main>
  );
}