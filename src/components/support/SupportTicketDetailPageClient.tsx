"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { supportApi } from "@/lib/api/support";
import { useMerchant } from "@/hooks/use-merchant";
import type { SupportMessage, SupportTicket } from "@/types/support";

export default function SupportTicketDetailPageClient() {
  const { activeMerchant } = useMerchant();
  const params = useParams<{ ticketId: string }>();
  const ticketId = params.ticketId;

  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [status, setStatus] = useState("open");
  const [priority, setPriority] = useState("medium");
  const [body, setBody] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingTicket, setIsSavingTicket] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    if (!activeMerchant) return;

    setError("");
    setIsLoading(true);

    try {
      const [ticketData, messageData] = await Promise.all([
        supportApi.detail(activeMerchant.id, ticketId),
        supportApi.messages(activeMerchant.id, ticketId, true),
      ]);

      setTicket(ticketData);
      setMessages(messageData);
      setStatus(ticketData.status);
      setPriority(ticketData.priority);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load ticket.");
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
  }, [activeMerchant, ticketId]);

  const updateTicket = async () => {
    if (!activeMerchant || !ticket) return;

    setIsSavingTicket(true);
    setError("");

    try {
      await supportApi.update(activeMerchant.id, ticket.id, {
        status,
        priority,
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update ticket.");
    } finally {
      setIsSavingTicket(false);
    }
  };

  const sendMessage = async () => {
    if (!activeMerchant || !ticket || !body.trim()) return;

    setIsSending(true);
    setError("");

    try {
      await supportApi.addMessage(activeMerchant.id, ticket.id, {
        body,
        is_internal: isInternal,
      });
      setBody("");
      setIsInternal(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send message.");
    } finally {
      setIsSending(false);
    }
  };

  if (!activeMerchant) {
    return <EmptyState text="Select a merchant before opening support." />;
  }

  if (isLoading) {
    return <LoadingState text="Loading ticket..." />;
  }

  if (!ticket) {
    return <EmptyState text="Support ticket not found." />;
  }

  return (
    <main className="space-y-6">
      <section className="overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.78),rgba(8,12,28,0.96))] shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
        <div className="border-b border-white/10 px-6 py-6 sm:px-8">
          <Link
            href="/dashboard/support"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to support
          </Link>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Tag>{ticket.ticket_number}</Tag>
            <Tag>{ticket.category}</Tag>
            <Tag>{ticket.priority}</Tag>
            <Tag>{ticket.status}</Tag>
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
            {ticket.subject}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
            {ticket.description || "No description."}
          </p>
        </div>
      </section>

      {error ? (
        <div className="rounded-[18px] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.72),rgba(8,12,28,0.94))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
          <h2 className="text-xl font-semibold text-white">Ticket controls</h2>

          <div className="mt-5 space-y-4">
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="h-11 w-full rounded-xl border border-white/10 bg-neutral-2 px-4 text-sm text-white outline-none"
            >
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
              className="h-11 w-full rounded-xl border border-white/10 bg-neutral-2 px-4 text-sm text-white outline-none"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>

            <button
              type="button"
              onClick={() => void updateTicket()}
              disabled={isSavingTicket}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[image:var(--brand-gradient)] px-5 text-sm font-semibold text-white"
            >
              {isSavingTicket ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Save ticket
            </button>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-slate-300">
              <div>Contact: {ticket.contact_name || "—"}</div>
              <div>Email: {ticket.contact_email || "—"}</div>
              <div>Phone: {ticket.contact_phone || "—"}</div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.72),rgba(8,12,28,0.94))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
            <h2 className="text-xl font-semibold text-white">Conversation</h2>

            <div className="mt-5 space-y-3">
              {messages.length === 0 ? (
                <EmptyInline text="No messages yet." />
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <Tag>{message.author_type}</Tag>
                      {message.is_internal ? <Tag>internal</Tag> : null}
                    </div>
                    <div className="mt-2 text-sm font-semibold text-white">
                      {message.author_name || message.author_email || "Message"}
                    </div>
                    <p className="mt-2 text-sm leading-7 text-slate-300">
                      {message.body}
                    </p>
                    <div className="mt-2 text-xs text-slate-500">
                      {message.created_at || "—"}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.72),rgba(8,12,28,0.94))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
            <h2 className="text-xl font-semibold text-white">Add message</h2>

            <div className="mt-5 space-y-4">
              <textarea
                rows={5}
                value={body}
                onChange={(event) => setBody(event.target.value)}
                placeholder="Write your reply..."
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none"
              />

              <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <input
                  type="checkbox"
                  checked={isInternal}
                  onChange={(event) => setIsInternal(event.target.checked)}
                  className="h-4 w-4"
                />
                <span className="text-sm text-slate-200">Internal message</span>
              </label>

              <button
                type="button"
                onClick={() => void sendMessage()}
                disabled={isSending || !body.trim()}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[image:var(--brand-gradient)] px-5 text-sm font-semibold text-white"
              >
                {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Send message
              </button>
            </div>
          </section>
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