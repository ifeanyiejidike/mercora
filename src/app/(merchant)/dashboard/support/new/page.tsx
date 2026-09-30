"use client";

import { useState } from "react";
import { Loader2, MessageSquarePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiClient, extractApiErrorMessage } from "@/lib/api/axios";
import { useMerchant } from "@/hooks/use-merchant";

type CreateTicketResponse = {
  data?: {
    id: string;
  };
  id?: string;
};

export default function MerchantNewSupportTicketPage() {
  const router = useRouter();
  const { activeMerchant } = useMerchant();

  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [initialMessage, setInitialMessage] = useState("");
  const [category, setCategory] = useState("general");
  const [priority, setPriority] = useState("medium");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [orderId, setOrderId] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [settlementRecordId, setSettlementRecordId] = useState("");
  const [receiptId, setReceiptId] = useState("");
  const [subscriptionId, setSubscriptionId] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!activeMerchant || !subject.trim()) return;

    setError("");
    setIsSaving(true);

    try {
      const payload = {
        subject: subject.trim(),
        description: description.trim(),
        initial_message: initialMessage.trim(),
        category,
        priority,
        contact_name: contactName.trim(),
        contact_email: contactEmail.trim(),
        contact_phone: contactPhone.trim(),
        order_id: orderId || null,
        payment_id: paymentId || null,
        settlement_record_id: settlementRecordId || null,
        receipt_id: receiptId || null,
        subscription_id: subscriptionId || null,
      };

      const { data } = await apiClient.post<CreateTicketResponse>(
        `/api/support/merchants/${activeMerchant.id}/tickets/`,
        payload,
      );

      const createdId = data?.data?.id || data?.id;
      if (createdId) {
        router.push(`/dashboard/support/${createdId}`);
        return;
      }

      router.push("/dashboard/support");
    } catch (err) {
      setError(extractApiErrorMessage(err, "Unable to create support ticket."));
    } finally {
      setIsSaving(false);
    }
  };

  if (!activeMerchant) {
    return (
      <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-12 text-center text-slate-300">
        Select a merchant before creating support tickets.
      </div>
    );
  }

  return (
    <main className="space-y-6">
      <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.78),rgba(8,12,28,0.96))] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
          <MessageSquarePlus className="h-4 w-4" />
          New support ticket
        </div>

        <h1 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
          Create support ticket
        </h1>
      </section>

      {error ? (
        <div className="rounded-[18px] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.72),rgba(8,12,28,0.94))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
        <div className="grid gap-4 lg:grid-cols-2">
          <input
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="Subject"
            className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none"
          />
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="h-11 rounded-xl border border-white/10 bg-neutral-2 px-4 text-sm text-white outline-none"
          >
            <option value="general">General</option>
            <option value="orders">Orders</option>
            <option value="payments">Payments</option>
            <option value="settlements">Settlements</option>
            <option value="receipts">Receipts</option>
            <option value="subscriptions">Subscriptions</option>
            <option value="technical">Technical</option>
          </select>

          <select
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
            className="h-11 rounded-xl border border-white/10 bg-neutral-2 px-4 text-sm text-white outline-none"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>

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

          <input
            value={orderId}
            onChange={(event) => setOrderId(event.target.value)}
            placeholder="Optional order ID"
            className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none"
          />

          <input
            value={paymentId}
            onChange={(event) => setPaymentId(event.target.value)}
            placeholder="Optional payment ID"
            className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none"
          />

          <input
            value={settlementRecordId}
            onChange={(event) => setSettlementRecordId(event.target.value)}
            placeholder="Optional settlement record ID"
            className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none"
          />

          <input
            value={receiptId}
            onChange={(event) => setReceiptId(event.target.value)}
            placeholder="Optional receipt ID"
            className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none"
          />

          <input
            value={subscriptionId}
            onChange={(event) => setSubscriptionId(event.target.value)}
            placeholder="Optional subscription ID"
            className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none"
          />
        </div>

        <textarea
          rows={5}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Description"
          className="mt-4 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none"
        />

        <textarea
          rows={6}
          value={initialMessage}
          onChange={(event) => setInitialMessage(event.target.value)}
          placeholder="Initial message"
          className="mt-4 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none"
        />

        <button
          type="button"
          onClick={() => void submit()}
          disabled={isSaving || !subject.trim()}
          className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[image:var(--brand-gradient)] px-5 text-sm font-semibold text-white"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Create support ticket
        </button>
      </section>
    </main>
  );
}