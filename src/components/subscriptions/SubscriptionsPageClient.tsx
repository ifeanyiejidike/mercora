"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CreditCard, Loader2 } from "lucide-react";
import { subscriptionsApi, formatMoney } from "@/lib/api/subscriptions";
import { useMerchant } from "@/hooks/use-merchant";
import type {
  MerchantSubscription,
  Plan,
  SubscriptionInvoice,
} from "@/types/subscription";

export default function SubscriptionsPageClient() {
  const { activeMerchant } = useMerchant();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentSubscription, setCurrentSubscription] =
    useState<MerchantSubscription | null>(null);
  const [subscriptions, setSubscriptions] = useState<MerchantSubscription[]>([]);
  const [invoices, setInvoices] = useState<SubscriptionInvoice[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState("");

  const activePlan = useMemo(
    () => plans.find((item) => item.id === selectedPlanId) || null,
    [plans, selectedPlanId],
  );

  const load = async () => {
    if (!activeMerchant) return;

    setError("");
    setIsLoading(true);

    try {
      const [plansData, currentData, subscriptionsData, invoicesData] =
        await Promise.all([
          subscriptionsApi.publicPlans(),
          subscriptionsApi.current(activeMerchant.id),
          subscriptionsApi.list(activeMerchant.id),
          subscriptionsApi.invoices(activeMerchant.id),
        ]);

      setPlans(plansData.results);
      setCurrentSubscription(currentData || null);
      setSubscriptions(subscriptionsData.results);
      setInvoices(invoicesData.results);

      if (!selectedPlanId && plansData.results[0]) {
        setSelectedPlanId(plansData.results[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load subscriptions.");
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

  const createSubscription = async () => {
    if (!activeMerchant || !selectedPlanId) return;

    setIsMutating(true);
    setError("");

    try {
      await subscriptionsApi.create(activeMerchant.id, {
        plan_id: selectedPlanId,
        start_trial_if_eligible: true,
        auto_renew: true,
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create subscription.");
    } finally {
      setIsMutating(false);
    }
  };

  const toggleAutoRenew = async (subscription: MerchantSubscription) => {
    if (!activeMerchant) return;

    setIsMutating(true);
    setError("");

    try {
      await subscriptionsApi.update(activeMerchant.id, subscription.id, {
        auto_renew: !subscription.auto_renew,
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update subscription.");
    } finally {
      setIsMutating(false);
    }
  };

  const scheduleCancel = async (subscription: MerchantSubscription) => {
    if (!activeMerchant) return;

    setIsMutating(true);
    setError("");

    try {
      await subscriptionsApi.cancel(activeMerchant.id, subscription.id, false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to cancel subscription.");
    } finally {
      setIsMutating(false);
    }
  };

  const reactivate = async (subscription: MerchantSubscription) => {
    if (!activeMerchant) return;

    setIsMutating(true);
    setError("");

    try {
      await subscriptionsApi.reactivate(activeMerchant.id, subscription.id);
      await load();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to reactivate subscription.",
      );
    } finally {
      setIsMutating(false);
    }
  };

  if (!activeMerchant) {
    return <EmptyState text="Select a merchant before opening subscriptions." />;
  }

  if (isLoading) {
    return <LoadingState text="Loading subscriptions..." />;
  }

  return (
    <main className="space-y-6">
      <section className="overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.78),rgba(8,12,28,0.96))] shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
        <div className="border-b border-white/10 px-6 py-6 sm:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
            <CreditCard className="h-4 w-4" />
            Subscriptions
          </div>
          <h1 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
            Merchant subscriptions
          </h1>
        </div>

        {error ? (
          <div className="px-6 py-4 text-sm text-red-100">{error}</div>
        ) : null}

        <div className="grid gap-4 p-6 sm:grid-cols-3 sm:p-8">
          <StatCard
            label="Current plan"
            value={currentSubscription?.plan_name_snapshot || "No active plan"}
          />
          <StatCard
            label="Subscription status"
            value={currentSubscription?.status || "none"}
          />
          <StatCard
            label="Invoices"
            value={String(invoices.length)}
          />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.04fr_0.96fr]">
        <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.72),rgba(8,12,28,0.94))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-white">Available plans</h2>
            <button
              type="button"
              onClick={() => void createSubscription()}
              disabled={isMutating || !selectedPlanId}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[image:var(--brand-gradient)] px-5 text-sm font-semibold text-white"
            >
              {isMutating ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Start selected plan
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {plans.length === 0 ? (
              <EmptyInline text="No public plans available." />
            ) : (
              plans.map((plan) => (
                <label
                  key={plan.id}
                  className={`block cursor-pointer rounded-2xl border p-4 ${
                    selectedPlanId === plan.id
                      ? "border-indigo-500/30 bg-indigo-500/10"
                      : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      checked={selectedPlanId === plan.id}
                      onChange={() => setSelectedPlanId(plan.id)}
                      className="mt-1 h-4 w-4"
                    />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-lg font-semibold text-white">
                          {plan.name}
                        </span>
                        <Tag>{plan.tier || "tier"}</Tag>
                        <Tag>{plan.billing_interval || "interval"}</Tag>
                      </div>
                      <div className="mt-2 text-sm text-slate-300">
                        {plan.description || "No description."}
                      </div>
                      <div className="mt-3 text-sm font-semibold text-white">
                        {formatMoney(plan.price_amount, plan.currency || "NGN")}
                      </div>
                      {plan.trial_days ? (
                        <div className="mt-1 text-xs text-slate-400">
                          Trial: {plan.trial_days} days
                        </div>
                      ) : null}

                      {activePlan?.id === plan.id && plan.entitlements?.length ? (
                        <div className="mt-4 grid gap-2 sm:grid-cols-2">
                          {plan.entitlements.slice(0, 6).map((entitlement) => (
                            <div
                              key={entitlement.id}
                              className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-xs text-slate-300"
                            >
                              <div className="font-semibold text-white">
                                {entitlement.feature_name}
                              </div>
                              <div className="mt-1">{entitlement.description || "—"}</div>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </label>
              ))
            )}
          </div>
        </section>

        <section className="space-y-6">
          <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.72),rgba(8,12,28,0.94))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
            <h2 className="text-xl font-semibold text-white">Current subscription</h2>

            {!currentSubscription ? (
              <div className="mt-5 text-sm text-slate-400">
                No current subscription found.
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                <MetricRow
                  label="Plan"
                  value={currentSubscription.plan_name_snapshot || "—"}
                />
                <MetricRow
                  label="Status"
                  value={currentSubscription.status}
                />
                <MetricRow
                  label="Period end"
                  value={currentSubscription.current_period_end_at || "—"}
                />
                <MetricRow
                  label="Auto renew"
                  value={currentSubscription.auto_renew ? "Yes" : "No"}
                />
                <MetricRow
                  label="Cancel at period end"
                  value={currentSubscription.cancel_at_period_end ? "Yes" : "No"}
                />

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => void toggleAutoRenew(currentSubscription)}
                    className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white"
                  >
                    Toggle auto renew
                  </button>

                  {!currentSubscription.cancel_at_period_end &&
                  currentSubscription.status !== "cancelled" ? (
                    <button
                      type="button"
                      onClick={() => void scheduleCancel(currentSubscription)}
                      className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-100"
                    >
                      Schedule cancellation
                    </button>
                  ) : null}

                  {["cancelled", "suspended", "past_due"].includes(
                    currentSubscription.status,
                  ) ? (
                    <button
                      type="button"
                      onClick={() => void reactivate(currentSubscription)}
                      className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-100"
                    >
                      Reactivate
                    </button>
                  ) : null}
                </div>
              </div>
            )}
          </section>

          <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.72),rgba(8,12,28,0.94))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
            <h2 className="text-xl font-semibold text-white">Recent invoices</h2>

            <div className="mt-5 space-y-3">
              {invoices.length === 0 ? (
                <EmptyInline text="No invoices available." />
              ) : (
                invoices.slice(0, 8).map((invoice) => (
                  <Link
                    key={invoice.id}
                    href={`/dashboard/subscriptions/invoices/${invoice.id}`}
                    className="group block rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 transition hover:border-indigo-500/20"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-white">
                        {invoice.invoice_number}
                      </span>
                      <Tag>{invoice.status}</Tag>
                    </div>
                    <div className="mt-2 text-sm text-slate-300">
                      {invoice.plan_name_snapshot || "Plan invoice"}
                    </div>
                    <div className="mt-2 text-sm font-semibold text-white">
                      {formatMoney(invoice.amount_due, invoice.currency || "NGN")}
                    </div>
                    <div className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-white">
                      Open invoice
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                ))
              )}
            </div>
          </section>

          <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.72),rgba(8,12,28,0.94))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
            <h2 className="text-xl font-semibold text-white">Subscription history</h2>

            <div className="mt-5 space-y-3">
              {subscriptions.length === 0 ? (
                <EmptyInline text="No subscriptions recorded." />
              ) : (
                subscriptions.map((subscription) => (
                  <div
                    key={subscription.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-white">
                        {subscription.plan_name_snapshot || "Subscription"}
                      </span>
                      <Tag>{subscription.status}</Tag>
                      {subscription.is_current ? <Tag>current</Tag> : null}
                    </div>
                    <div className="mt-2 text-sm text-slate-300">
                      {subscription.plan_code_snapshot || "—"}
                    </div>
                    <div className="mt-2 text-xs text-slate-500">
                      Started: {subscription.started_at || "—"}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </section>
      </section>
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

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
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