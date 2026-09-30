"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { formatDate, platformAdminApi } from "@/lib/api/platform-admin";
import {
  PlatformEmptyPanel,
  PlatformErrorBanner,
  PlatformLoadingPanel,
  PlatformMetricTile,
  PlatformTag,
} from "@/components/platform/PlatformPrimitives";
import type { PlatformNotification } from "@/types/platform-admin";

export default function PlatformNotificationsPageClient() {
  const [days, setDays] = useState(30);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [severity, setSeverity] = useState("");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [archivedOnly, setArchivedOnly] = useState(false);
  const [notifications, setNotifications] = useState<PlatformNotification[]>([]);
  const [summary, setSummary] = useState<{
    total_notifications: number;
    unread_notifications: number;
    archived_notifications: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    setIsLoading(true);

    try {
      const data = await platformAdminApi.listNotifications({
        days,
        search: search || undefined,
        category: category || undefined,
        severity: severity || undefined,
        unread: unreadOnly ? true : undefined,
        archived: archivedOnly ? true : undefined,
      });

      setNotifications(data.results);
      setSummary(data.summary);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load notifications.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [days]);

  if (isLoading) {
    return <PlatformLoadingPanel text="Loading platform notifications..." />;
  }

  return (
    <main className="space-y-6">
      <section className="overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.82),rgba(8,12,28,0.96))] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.24)] sm:p-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
          <Bell className="h-4 w-4" />
          Platform notifications
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[180px_1fr_180px_180px_auto]">
          <select
            value={days}
            onChange={(event) => setDays(Number(event.target.value))}
            className="h-11 rounded-xl border border-white/10 bg-neutral-2 px-4 text-sm text-white outline-none"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search title, body, event..."
            className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none"
          />

          <input
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            placeholder="Category"
            className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none"
          />

          <input
            value={severity}
            onChange={(event) => setSeverity(event.target.value)}
            placeholder="Severity"
            className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none"
          />

          <button
            type="button"
            onClick={() => void load()}
            className="h-11 rounded-xl bg-[image:var(--brand-gradient)] px-5 text-sm font-semibold text-white"
          >
            Apply
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-300">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={unreadOnly}
              onChange={(event) => setUnreadOnly(event.target.checked)}
            />
            Unread only
          </label>

          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={archivedOnly}
              onChange={(event) => setArchivedOnly(event.target.checked)}
            />
            Archived only
          </label>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <PlatformMetricTile
            label="Total notifications"
            value={String(summary?.total_notifications || 0)}
          />
          <PlatformMetricTile
            label="Unread notifications"
            value={String(summary?.unread_notifications || 0)}
          />
          <PlatformMetricTile
            label="Archived notifications"
            value={String(summary?.archived_notifications || 0)}
          />
        </div>
      </section>

      {error ? <PlatformErrorBanner text={error} /> : null}

      <section className="space-y-4">
        {notifications.length === 0 ? (
          <PlatformEmptyPanel text="No notifications found." />
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.66),rgba(8,12,28,0.94))] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)]"
            >
              <div className="flex flex-wrap items-center gap-2">
                <PlatformTag>{notification.category}</PlatformTag>
                <PlatformTag>{notification.severity}</PlatformTag>
                <PlatformTag>{notification.event_type}</PlatformTag>
                {notification.read_at ? <PlatformTag>Read</PlatformTag> : <PlatformTag>Unread</PlatformTag>}
                {notification.archived_at ? <PlatformTag>Archived</PlatformTag> : null}
              </div>

              <div className="mt-4 text-xl font-semibold text-white">
                {notification.title}
              </div>

              <p className="mt-2 text-sm leading-7 text-slate-300">
                {notification.body || "No body provided."}
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <PlatformMetricTile label="Merchant" value={notification.merchant || "—"} />
                <PlatformMetricTile label="Payment" value={notification.payment || "—"} />
                <PlatformMetricTile label="Support ticket" value={notification.support_ticket || "—"} />
                <PlatformMetricTile label="Created" value={formatDate(notification.created_at)} />
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
}