"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Plus,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { env } from "@/lib/config/env";
import { useMerchant } from "@/hooks/use-merchant";
import { merchantsApi } from "@/lib/api/merchants";
import type {
  MerchantMembership,
  MerchantMembershipCreatePayload,
} from "@/types/merchant";

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
        Select or create a merchant from the dashboard before managing team memberships.
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

const initialForm: MerchantMembershipCreatePayload = {
  email: "",
  role: "viewer",
};

export default function MerchantTeamPage() {
  const { activeMerchant } = useMerchant();

  const [memberships, setMemberships] = useState<MerchantMembership[]>([]);
  const [form, setForm] = useState<MerchantMembershipCreatePayload>(initialForm);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const merchantId = activeMerchant?.id || null;

  const loadMemberships = async () => {
    if (!merchantId) return;
    const data = await merchantsApi.getMemberships(merchantId);
    setMemberships(data);
  };

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      if (!merchantId) {
        if (mounted) {
          setIsLoading(false);
        }
        return;
      }

      try {
        const data = await merchantsApi.getMemberships(merchantId);

        if (mounted) {
          setMemberships(data);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error ? err.message : "Unable to load memberships.",
          );
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void run();

    return () => {
      mounted = false;
    };
  }, [merchantId]);

  if (!activeMerchant) {
    return <EmptyActiveMerchantState />;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!merchantId) return;

    setError("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      await merchantsApi.addMembership(merchantId, {
        email: form.email.trim(),
        role: form.role,
      });

      await loadMemberships();
      setForm(initialForm);
      setSuccessMessage("Membership added successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to add membership.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <section className="overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.78),rgba(8,12,28,0.96))] shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
          <div className="border-b border-white/10 px-6 py-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
              <UserPlus className="h-4 w-4" />
              Add membership
            </div>

            <h1 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-white">
              Add team access to the active merchant.
            </h1>

            <p className="mt-3 text-sm leading-7 text-slate-300">
              Add an existing active user with a supported non-owner role.
            </p>
          </div>

          <form className="space-y-5 p-6" onSubmit={handleSubmit}>
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

            <div className="rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-4">
              <div className="text-xs uppercase tracking-[0.14em] text-slate-400">
                Active merchant
              </div>
              <div className="mt-2 text-lg font-semibold text-white">
                {activeMerchant.public_display_name}
              </div>
              <div className="mt-1 text-sm text-slate-400">
                {activeMerchant.legal_business_name}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                User email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                placeholder="staff@company.com"
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400/50 focus:bg-white/[0.06]"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Role
              </label>
              <select
                value={form.role}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    role: event.target.value as MerchantMembershipCreatePayload["role"],
                  }))
                }
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none focus:border-indigo-400/50 focus:bg-white/[0.06]"
              >
                <option value="admin" className="bg-neutral-2 text-slate-300">
                  Admin
                </option>
                <option value="operations" className="bg-neutral-2 text-slate-300">
                  Operations
                </option>
                <option value="finance" className="bg-neutral-2 text-slate-300">
                  Finance
                </option>
                <option value="support" className="bg-neutral-2 text-slate-300">
                  Support
                </option>
                <option value="viewer" className="bg-neutral-2 text-slate-300">
                  Viewer
                </option>
              </select>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              <Link
                href={env.routes.merchantDashboard}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/14 bg-white/[0.03] px-6 text-sm font-semibold text-white transition hover:bg-white/[0.06]"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to dashboard
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[image:var(--brand-gradient)] px-6 text-sm font-semibold text-white shadow-[0_16px_38px_rgba(79,70,229,0.34)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(79,70,229,0.42)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Adding..." : "Add membership"}
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </form>
        </section>

        <section className="overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.78),rgba(8,12,28,0.96))] shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
          <div className="border-b border-white/10 px-6 py-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
              <Users className="h-4 w-4" />
              Team members
            </div>

            <h2 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-white">
              Current memberships
            </h2>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="h-[240px] animate-pulse rounded-[24px] border border-white/10 bg-white/[0.03]" />
            ) : memberships.length === 0 ? (
              <div className="rounded-[22px] border border-white/10 bg-white/[0.03] px-5 py-5 text-sm text-slate-300">
                No memberships found.
              </div>
            ) : (
              <div className="space-y-3">
                {memberships.map((membership) => (
                  <article
                    key={membership.id}
                    className="rounded-[22px] border border-white/10 bg-white/[0.03] px-5 py-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="text-sm font-semibold text-white">
                          {membership.user.display_name ||
                            `${membership.user.first_name || ""} ${membership.user.last_name || ""}`.trim() ||
                            membership.user.email}
                        </div>
                        <div className="mt-1 text-sm text-slate-400">
                          {membership.user.email}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">
                          {membership.role}
                        </span>
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">
                          {membership.status}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                      <ShieldCheck className="h-3.5 w-3.5 text-indigo-300" />
                      Joined: {membership.joined_at || "Not recorded"}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}