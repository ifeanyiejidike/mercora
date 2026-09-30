"use client";

import { useEffect, useMemo, useState } from "react";
import { Bell, Loader2 } from "lucide-react";
import { notificationsApi } from "@/lib/api/notifications";
import { useMerchant } from "@/hooks/use-merchant";
import type {
  NotificationPreference,
  NotificationPreferenceUpdateItem,
  NotificationRecord,
  NotificationSummary,
} from "@/types/notification";

export default function NotificationsPageClient() {
  const { activeMerchant } = useMerchant();

  const [summary, setSummary] = useState<NotificationSummary | null>(null);
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [archivedOnly, setArchivedOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSavingPrefs, setIsSavingPrefs] = useState(false);
  const [error, setError] = useState("");

  const categories = useMemo(
    () => Object.keys(summary?.by_category || {}),
    [summary],
  );

  const load = async (refresh = false) => {
    if (!activeMerchant) return;
    setError("");
    refresh ? setIsRefreshing(true) : setIsLoading(true);

    try {
      const [summaryData, preferencesData, listData] = await Promise.all([
        notificationsApi.summary(activeMerchant.id),
        notificationsApi.preferences(activeMerchant.id),
        notificationsApi.list(activeMerchant.id, {
          category: category || undefined,
          unread: unreadOnly || undefined,
          archived: archivedOnly || undefined,
          search: search || undefined,
        }),
      ]);

      setSummary(summaryData);
      setPreferences(preferencesData);
      setNotifications(listData.results);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load notifications.",
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!activeMerchant) {
      setIsLoading(false);
      return;
    }
    void load();
  }, [activeMerchant]);

  const savePreferences = async () => {
    if (!activeMerchant) return;

    setIsSavingPrefs(true);
    setError("");

    try {
      const payload: NotificationPreferenceUpdateItem[] = preferences.map(
        (item) => ({
          category: item.category,
          is_enabled: item.is_enabled,
          channel_in_app: item.channel_in_app,
          channel_email: item.channel_email,
          frequency: item.frequency,
          metadata: item.metadata,
        }),
      );

      const updated = await notificationsApi.updatePreferences(
        activeMerchant.id,
        payload,
      );
      setPreferences(updated);
      const summaryData = await notificationsApi.summary(activeMerchant.id);
      setSummary(summaryData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save notification preferences.",
      );
    } finally {
      setIsSavingPrefs(false);
    }
  };

  const updateNotification = async (
    notificationId: string,
    payload: { mark_read?: boolean; archive?: boolean },
  ) => {
    if (!activeMerchant) return;

    try {
      await notificationsApi.update(activeMerchant.id, notificationId, payload);
      await load(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update notification.",
      );
    }
  };

  const markAllRead = async () => {
    if (!activeMerchant) return;

    try {
      await notificationsApi.markAllRead(activeMerchant.id);
      await load(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to mark notifications as read.",
      );
    }
  };

  if (!activeMerchant) {
    return (
      <EmptyState text="Select a merchant before opening notifications." />
    );
  }

  if (isLoading) {
    return <LoadingState text="Loading notifications..." />;
  }

  return (
    <main className="space-y-6">
      <section className="overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.78),rgba(8,12,28,0.96))] shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
        <div className="border-b border-white/10 px-6 py-6 sm:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
                <Bell className="h-4 w-4" />
                Notifications
              </div>
              <h1 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
                Merchant notifications
              </h1>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void load(true)}
                disabled={isRefreshing}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/14 bg-white/[0.03] px-5 text-sm font-semibold text-white"
              >
                {isRefreshing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : null}
                Refresh
              </button>

              <button
                type="button"
                onClick={() => void markAllRead()}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-[image:var(--brand-gradient)] px-5 text-sm font-semibold text-white"
              >
                Mark all read
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-3 sm:p-8">
          <StatCard label="Total" value={String(summary?.total_count || 0)} />
          <StatCard label="Unread" value={String(summary?.unread_count || 0)} />
          <StatCard
            label="Archived"
            value={String(summary?.archived_count || 0)}
          />
        </div>
      </section>

      {error ? (
        <div className="rounded-[18px] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.72),rgba(8,12,28,0.94))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
          <div className="grid gap-4 lg:grid-cols-[1fr_220px_auto_auto]">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search title, body, event type..."
              className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-slate-500"
            />
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="h-11 rounded-xl border border-white/10 bg-neutral-2 px-4 text-sm text-white outline-none"
            >
              <option value="">All categories</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setUnreadOnly((current) => !current)}
              className={`h-11 rounded-xl border px-4 text-sm font-semibold ${
                unreadOnly
                  ? "border-indigo-500/30 bg-indigo-500/12 text-indigo-100"
                  : "border-white/10 bg-white/[0.03] text-white"
              }`}
            >
              Unread
            </button>
            <button
              type="button"
              onClick={() => setArchivedOnly((current) => !current)}
              className={`h-11 rounded-xl border px-4 text-sm font-semibold ${
                archivedOnly
                  ? "border-indigo-500/30 bg-indigo-500/12 text-indigo-100"
                  : "border-white/10 bg-white/[0.03] text-white"
              }`}
            >
              Archived
            </button>
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={() => void load(true)}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-white/14 bg-white/[0.03] px-5 text-sm font-semibold text-white"
            >
              Apply filters
            </button>
          </div>

          <div className="mt-6 space-y-3">
            {notifications.length === 0 ? (
              <EmptyInline text="No notifications found." />
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Tag>{notification.category}</Tag>
                        <Tag>{notification.severity}</Tag>
                        {notification.read_at ? (
                          <Tag>read</Tag>
                        ) : (
                          <Tag>unread</Tag>
                        )}
                        {notification.archived_at ? <Tag>archived</Tag> : null}
                      </div>

                      <h3 className="mt-3 text-lg font-semibold text-white">
                        {notification.title}
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-slate-300">
                        {notification.body || "No body provided."}
                      </p>
                      <div className="mt-2 text-xs text-slate-500">
                        {notification.event_type} •{" "}
                        {notification.created_at || "—"}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {!notification.read_at ? (
                        <button
                          type="button"
                          onClick={() =>
                            void updateNotification(notification.id, {
                              mark_read: true,
                            })
                          }
                          className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white"
                        >
                          Mark read
                        </button>
                      ) : null}

                      <button
                        type="button"
                        onClick={() =>
                          void updateNotification(notification.id, {
                            archive: !notification.archived_at,
                          })
                        }
                        className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white"
                      >
                        {notification.archived_at ? "Unarchive" : "Archive"}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.72),rgba(8,12,28,0.94))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-white">Preferences</h2>
            <button
              type="button"
              onClick={() => void savePreferences()}
              disabled={isSavingPrefs}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[image:var(--brand-gradient)] px-4 text-sm font-semibold text-white"
            >
              {isSavingPrefs ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              Save
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {preferences.length === 0 ? (
              <EmptyInline text="No preference records available." />
            ) : (
              preferences.map((preference) => (
                <div
                  key={preference.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="text-sm font-semibold uppercase tracking-[0.12em] text-white">
                    {preference.category}
                  </div>

                  <div className="mt-4 grid gap-3">
                    <ToggleRow
                      label="Enabled"
                      checked={preference.is_enabled}
                      onChange={(checked) =>
                        setPreferences((current) =>
                          current.map((item) =>
                            item.id === preference.id
                              ? { ...item, is_enabled: checked }
                              : item,
                          ),
                        )
                      }
                    />
                    <ToggleRow
                      label="In-app"
                      checked={preference.channel_in_app}
                      onChange={(checked) =>
                        setPreferences((current) =>
                          current.map((item) =>
                            item.id === preference.id
                              ? { ...item, channel_in_app: checked }
                              : item,
                          ),
                        )
                      }
                    />
                    <ToggleRow
                      label="Email"
                      checked={preference.channel_email}
                      onChange={(checked) =>
                        setPreferences((current) =>
                          current.map((item) =>
                            item.id === preference.id
                              ? { ...item, channel_email: checked }
                              : item,
                          ),
                        )
                      }
                    />

                    <select
                      value={preference.frequency}
                      onChange={(event) =>
                        setPreferences((current) =>
                          current.map((item) =>
                            item.id === preference.id
                              ? { ...item, frequency: event.target.value }
                              : item,
                          ),
                        )
                      }
                      className="h-10 rounded-xl border border-white/10 bg-neutral-2 px-3 text-sm text-white outline-none"
                    >
                      <option value="immediate">Immediate</option>
                      <option value="daily_digest">Daily digest</option>
                      <option value="weekly_digest">Weekly digest</option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </section>
    </main>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3">
      <span className="text-sm text-slate-200">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4"
      />
    </label>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-4">
      <div className="text-xs uppercase tracking-[0.14em] text-slate-400">
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">
        {value}
      </div>
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
