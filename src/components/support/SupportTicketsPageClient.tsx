"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, LifeBuoy, Loader2 } from "lucide-react";
import { supportApi } from "@/lib/api/support";
import { useMerchant } from "@/hooks/use-merchant";
import type { SupportTicket } from "@/types/support";

export default function SupportTicketsPageClient() {
  const { activeMerchant } = useMerchant();

  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [initialMessage, setInitialMessage] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [newCategory, setNewCategory] = useState("general");
  const [newPriority, setNewPriority] = useState("medium");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    if (!activeMerchant) return;

    setError("");
    setIsLoading(true);

    try {
      const data = await supportApi.list(activeMerchant.id, {
        status: status || undefined,
        priority: priority || undefined,
        category: category || undefined,
        search: search || undefined,
      });
      setTickets(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load tickets.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!activeMerchant) {
      setIsLoading(false);
      return;
    }
    void load();
  }, [activeMerchant]);

  const createTicket = async () => {
    if (!activeMerchant) return;

    setIsSubmitting(true);
    setError("");

    try {
      await supportApi.create(activeMerchant.id, {
        subject,
        description,
        initial_message: initialMessage,
        category: newCategory,
        priority: newPriority,
        contact_name: contactName,
        contact_email: contactEmail,
        contact_phone: contactPhone,
      });

      setSubject("");
      setDescription("");
      setInitialMessage("");
      setContactName("");
      setContactEmail("");
      setContactPhone("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create ticket.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!activeMerchant) {
    return <EmptyState text="Select a merchant before opening support." />;
  }

  if (isLoading) {
    return <LoadingState text="Loading support tickets..." />;
  }

  return (
    <main className="space-y-6">
      <section className="overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.78),rgba(8,12,28,0.96))] shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
        <div className="border-b border-white/10 px-6 py-6 sm:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
            <LifeBuoy className="h-4 w-4" />
            Support
          </div>
          <h1 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
            Merchant support tickets
          </h1>
        </div>
      </section>

      {error ? (
        <div className="rounded-[18px] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.72),rgba(8,12,28,0.94))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
          <div className="grid gap-4 lg:grid-cols-4">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search..."
              className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none"
            />
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="h-11 rounded-xl border border-white/10 bg-neutral-2 px-4 text-sm text-white outline-none"
            >
              <option value="">All status</option>
              <option value="open">Open</option>
              <option value="in_progress">In progress</option>
              <option value="waiting_on_merchant">Waiting on merchant</option>
              <option value="waiting_on_customer">Waiting on customer</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <select
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
              className="h-11 rounded-xl border border-white/10 bg-neutral-2 px-4 text-sm text-white outline-none"
            >
              <option value="">All priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
            <button
              type="button"
              onClick={() => void load()}
              className="h-11 rounded-xl bg-[image:var(--brand-gradient)] px-4 text-sm font-semibold text-white"
            >
              Apply
            </button>
          </div>

          <div className="mt-6 space-y-3">
            {tickets.length === 0 ? (
              <EmptyInline text="No support tickets found." />
            ) : (
              tickets.map((ticket) => (
                <Link
                  key={ticket.id}
                  href={`/dashboard/support/${ticket.id}`}
                  className="group block rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-indigo-500/20"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag>{ticket.ticket_number}</Tag>
                    <Tag>{ticket.category}</Tag>
                    <Tag>{ticket.priority}</Tag>
                    <Tag>{ticket.status}</Tag>
                  </div>
                  <h2 className="mt-3 text-lg font-semibold text-white">
                    {ticket.subject}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    {ticket.description || "No description."}
                  </p>
                  <div className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-white">
                    Open ticket
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>

        <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.72),rgba(8,12,28,0.94))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
          <h2 className="text-xl font-semibold text-white">Create ticket</h2>

          <div className="mt-5 space-y-4">
            <input
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="Subject"
              className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none"
            />

            <textarea
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Description"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none"
            />

            <textarea
              rows={4}
              value={initialMessage}
              onChange={(event) => setInitialMessage(event.target.value)}
              placeholder="Initial message"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <select
                value={newCategory}
                onChange={(event) => setNewCategory(event.target.value)}
                className="h-11 rounded-xl border border-white/10 bg-neutral-2 px-4 text-sm text-white outline-none"
              >
                <option value="general">General</option>
                <option value="storefront">Storefront</option>
                <option value="catalog">Catalog</option>
                <option value="order">Order</option>
                <option value="payment">Payment</option>
                <option value="settlement">Settlement</option>
                <option value="receipt">Receipt</option>
                <option value="subscription">Subscription</option>
                <option value="marketing">Marketing</option>
                <option value="technical">Technical</option>
              </select>

              <select
                value={newPriority}
                onChange={(event) => setNewPriority(event.target.value)}
                className="h-11 rounded-xl border border-white/10 bg-neutral-2 px-4 text-sm text-white outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <input
                value={contactName}
                onChange={(event) => setContactName(event.target.value)}
                placeholder="Contact name"
                className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none"
              />
              <input
                value={contactEmail}
                onChange={(event) => setContactEmail(event.target.value)}
                placeholder="Contact email"
                className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none"
              />
              <input
                value={contactPhone}
                onChange={(event) => setContactPhone(event.target.value)}
                placeholder="Contact phone"
                className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none"
              />
            </div>

            <button
              type="button"
              onClick={() => void createTicket()}
              disabled={isSubmitting || !subject.trim()}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[image:var(--brand-gradient)] px-5 text-sm font-semibold text-white disabled:opacity-70"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Create ticket
            </button>
          </div>
        </section>
      </section>
    </main>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-300">
      {children}
    </span>
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