"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Loader2, UploadCloud } from "lucide-react";
import {
  formatMoney,
  publicCommerceApi,
} from "@/lib/api/public-commerce";
import type {
  ManualPaymentProof,
  PublicOrder,
  PublicPayment,
} from "@/types/public-commerce";

function getInstructionText(payment: PublicPayment | null) {
  const snapshot = payment?.merchant_direct_instructions_snapshot;

  if (snapshot && typeof snapshot === "object") {
    const record = snapshot as Record<string, unknown>;
    const possible = [
      record.instructions,
      record.direct_payment_instructions,
      record.account_name,
      record.bank_name,
      record.account_number,
      record.mobile_money_number,
    ]
      .filter(Boolean)
      .map(String)
      .join(" • ");

    if (possible.trim()) {
      return possible;
    }
  }

  return "Use the merchant’s direct payment instructions, then submit your proof below.";
}

export default function ManualPaymentPage() {
  const params = useParams<{ storeSlug: string; orderRef: string }>();
  const searchParams = useSearchParams();
  const storeSlug = params.storeSlug;
  const orderRef = params.orderRef;
  const email = searchParams.get("email") || "";

  const [order, setOrder] = useState<PublicOrder | null>(null);
  const [payment, setPayment] = useState<PublicPayment | null>(null);
  const [proofs, setProofs] = useState<ManualPaymentProof[]>([]);
  const [proofFileUrl, setProofFileUrl] = useState("");
  const [submittedByName, setSubmittedByName] = useState("");
  const [submittedByEmail, setSubmittedByEmail] = useState(email);
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const currency =
    order?.charge_currency || order?.base_currency || payment?.charge_currency || "NGN";

  const loadData = async () => {
    try {
      const [nextOrder, nextPayment, nextProofs] = await Promise.all([
        publicCommerceApi.getOrder(storeSlug, orderRef, email),
        publicCommerceApi.getOrderPayment(storeSlug, orderRef, email),
        publicCommerceApi.getManualPaymentProofs(storeSlug, orderRef, email).catch(
          () => [],
        ),
      ]);

      setOrder(nextOrder);
      setPayment(nextPayment);
      setProofs(nextProofs);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load manual payment page.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [storeSlug, orderRef, email]);

  const instructionText = useMemo(() => getInstructionText(payment), [payment]);

  const handleSubmitProof = async () => {
    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      await publicCommerceApi.submitManualPaymentProof(
        storeSlug,
        orderRef,
        {
          proof_file_url: proofFileUrl,
          submitted_by_name: submittedByName,
          submitted_by_email: submittedByEmail || email,
          note,
        },
        email,
      );

      setProofFileUrl("");
      setNote("");
      setSuccessMessage("Payment proof submitted successfully.");
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to submit payment proof.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-neutral-1 text-white">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 xl:grid-cols-[1.02fr_0.98fr]">
          <section className="overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.78),rgba(8,12,28,0.96))] shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
            <div className="border-b border-white/10 px-6 py-6 sm:px-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
                <UploadCloud className="h-4 w-4" />
                Manual payment
              </div>

              <h1 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
                Submit manual payment proof
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                Complete payment using the merchant’s direct instructions, then submit your proof for review.
              </p>
            </div>

            <div className="space-y-6 p-6 sm:p-8">
              {error ? (
                <div className="rounded-[18px] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                  {error}
                </div>
              ) : null}

              {successMessage ? (
                <div className="rounded-[18px] border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                  {successMessage}
                </div>
              ) : null}

              {isLoading ? (
                <div className="flex h-[220px] items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                </div>
              ) : (
                <>
                  <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                    <h2 className="text-lg font-semibold text-white">
                      Payment instructions
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-slate-300">
                      {instructionText}
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                    <h2 className="text-lg font-semibold text-white">
                      Submit proof
                    </h2>

                    <div className="mt-5 grid gap-5 sm:grid-cols-2">
                      <InputField
                        label="Proof file URL"
                        value={proofFileUrl}
                        onChange={setProofFileUrl}
                        placeholder="https://..."
                      />
                      <InputField
                        label="Submitted by name"
                        value={submittedByName}
                        onChange={setSubmittedByName}
                        placeholder="Your name"
                      />
                      <InputField
                        label="Submitted by email"
                        value={submittedByEmail}
                        onChange={setSubmittedByEmail}
                        placeholder="you@example.com"
                        type="email"
                      />
                    </div>

                    <div className="mt-5">
                      <label className="mb-2 block text-sm font-medium text-slate-200">
                        Note
                      </label>
                      <textarea
                        rows={4}
                        value={note}
                        onChange={(event) => setNote(event.target.value)}
                        placeholder="Optional note"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400/50"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => void handleSubmitProof()}
                      disabled={isSubmitting || !proofFileUrl.trim()}
                      className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[image:var(--brand-gradient)] px-6 text-sm font-semibold text-white shadow-[0_16px_38px_rgba(79,70,229,0.34)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(79,70,229,0.42)] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit proof"
                      )}
                    </button>
                  </div>

                  <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                    <h2 className="text-lg font-semibold text-white">
                      Submitted proofs
                    </h2>

                    <div className="mt-4 space-y-3">
                      {proofs.length === 0 ? (
                        <p className="text-sm text-slate-400">
                          No proof submitted yet.
                        </p>
                      ) : (
                        proofs.map((proof, index) => (
                          <article
                            key={proof.id || index}
                            className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4"
                          >
                            <div className="text-sm font-semibold text-white">
                              {proof.submitted_by_name || proof.submitted_by_email || "Proof submission"}
                            </div>
                            <div className="mt-1 text-sm text-slate-400">
                              {proof.created_at || proof.status || "Submitted"}
                            </div>
                            {proof.note ? (
                              <p className="mt-3 text-sm leading-7 text-slate-300">
                                {proof.note}
                              </p>
                            ) : null}
                          </article>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>

          <aside className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.78),rgba(8,12,28,0.96))] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
            <h2 className="text-xl font-semibold text-white">Order summary</h2>

            <div className="mt-5 space-y-3">
              <SummaryRow label="Order" value={order?.order_number || orderRef} />
              <SummaryRow
                label="Order status"
                value={order?.status || "pending"}
              />
              <SummaryRow
                label="Payment state"
                value={order?.payment_state || payment?.status || "pending"}
              />
              <SummaryRow
                label="Total"
                value={formatMoney(order?.gross_amount, currency)}
                emphasized
              />
            </div>

            <div className="mt-6 space-y-3">
              <Link
                href={`/_stores/${storeSlug}/order/${orderRef}?email=${encodeURIComponent(
                  email,
                )}`}
                className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-white/14 bg-white/[0.03] px-4 text-sm font-semibold text-white transition hover:bg-white/[0.06]"
              >
                View order
              </Link>

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