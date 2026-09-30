"use client";

import { useEffect, useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { apiClient, extractApiErrorMessage } from "@/lib/api/axios";
import { useMerchant } from "@/hooks/use-merchant";

type MerchantKycProfile = {
  id: string;
  status: string;
  business_registration_number?: string;
  tax_identification_number?: string;
  contact_person_name?: string;
  contact_person_role?: string;
  submitted_at?: string | null;
  reviewed_at?: string | null;
  rejection_reason?: string;
  document_metadata?: Record<string, unknown>;
};

type KycResponse = {
  data?: MerchantKycProfile;
};

export default function MerchantKycSettingsPage() {
  const { activeMerchant } = useMerchant();

  const [profile, setProfile] = useState<MerchantKycProfile | null>(null);
  const [businessRegistrationNumber, setBusinessRegistrationNumber] = useState("");
  const [taxIdentificationNumber, setTaxIdentificationNumber] = useState("");
  const [contactPersonName, setContactPersonName] = useState("");
  const [contactPersonRole, setContactPersonRole] = useState("");
  const [documentMetadataText, setDocumentMetadataText] = useState("{}");
  const [submitForReview, setSubmitForReview] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    if (!activeMerchant) return;

    setError("");
    setIsLoading(true);

    try {
      const { data } = await apiClient.get<KycResponse>(
        `/api/merchants/${activeMerchant.id}/kyc/`,
      );

      const resolved = data.data || null;
      setProfile(resolved);
      setBusinessRegistrationNumber(resolved?.business_registration_number || "");
      setTaxIdentificationNumber(resolved?.tax_identification_number || "");
      setContactPersonName(resolved?.contact_person_name || "");
      setContactPersonRole(resolved?.contact_person_role || "");
      setDocumentMetadataText(
        JSON.stringify(resolved?.document_metadata || {}, null, 2),
      );
    } catch (err) {
      setError(extractApiErrorMessage(err, "Unable to load KYC settings."));
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

  const save = async () => {
    if (!activeMerchant) return;

    setError("");
    setIsSaving(true);

    try {
      let parsedDocumentMetadata: Record<string, unknown> = {};
      try {
        parsedDocumentMetadata = JSON.parse(documentMetadataText || "{}");
      } catch {
        throw new Error("Document metadata must be valid JSON.");
      }

      await apiClient.patch(`/api/merchants/${activeMerchant.id}/kyc/`, {
        business_registration_number: businessRegistrationNumber,
        tax_identification_number: taxIdentificationNumber,
        contact_person_name: contactPersonName,
        contact_person_role: contactPersonRole,
        document_metadata: parsedDocumentMetadata,
        submit_for_review: submitForReview,
      });

      setSubmitForReview(false);
      await load();
    } catch (err) {
      setError(extractApiErrorMessage(err, "Unable to save KYC settings."));
    } finally {
      setIsSaving(false);
    }
  };

  if (!activeMerchant) {
    return (
      <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-12 text-center text-slate-300">
        Select a merchant before opening KYC settings.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
        <p className="mt-4 text-sm text-slate-300">Loading KYC settings...</p>
      </div>
    );
  }

  return (
    <main className="space-y-6">
      <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.78),rgba(8,12,28,0.96))] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
          <ShieldCheck className="h-4 w-4" />
          Merchant KYC
        </div>

        <h1 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
          KYC and verification
        </h1>

        <div className="mt-5 inline-flex rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white">
          Status: {profile?.status || "unknown"}
        </div>
      </section>

      {error ? (
        <div className="rounded-[18px] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.72),rgba(8,12,28,0.94))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
        <div className="grid gap-4 lg:grid-cols-2">
          <input
            value={businessRegistrationNumber}
            onChange={(event) => setBusinessRegistrationNumber(event.target.value)}
            placeholder="Business registration number"
            className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none"
          />
          <input
            value={taxIdentificationNumber}
            onChange={(event) => setTaxIdentificationNumber(event.target.value)}
            placeholder="Tax identification number"
            className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none"
          />
          <input
            value={contactPersonName}
            onChange={(event) => setContactPersonName(event.target.value)}
            placeholder="Contact person name"
            className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none"
          />
          <input
            value={contactPersonRole}
            onChange={(event) => setContactPersonRole(event.target.value)}
            placeholder="Contact person role"
            className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none"
          />
        </div>

        <textarea
          rows={8}
          value={documentMetadataText}
          onChange={(event) => setDocumentMetadataText(event.target.value)}
          placeholder='Document metadata JSON, e.g. {"certificate_url":"..."}'
          className="mt-4 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 font-mono text-sm text-white outline-none"
        />

        <label className="mt-4 flex items-center gap-3 text-sm text-white">
          <input
            type="checkbox"
            checked={submitForReview}
            onChange={(event) => setSubmitForReview(event.target.checked)}
          />
          Submit for review
        </label>

        <button
          type="button"
          onClick={() => void save()}
          disabled={isSaving}
          className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[image:var(--brand-gradient)] px-5 text-sm font-semibold text-white"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Save KYC profile
        </button>
      </section>
    </main>
  );
}