"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowRight, BadgeCheck, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { env } from "@/lib/config/env";
import type { RegisterPayload } from "@/types/auth";

const initialState: RegisterPayload = {
  email: "",
  password: "",
  password_confirm: "",
  first_name: "",
  last_name: "",
  display_name: "",
  phone_number: "",
  role: "merchant_owner",
  preferred_timezone: "UTC",
  preferred_locale: "en",
};

export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [form, setForm] = useState<RegisterPayload>(initialState);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roleOptions = useMemo(
    () => [
      { value: "merchant_owner", label: "Merchant Owner" },
      { value: "customer", label: "Customer" },
    ],
    [],
  );

  const updateField = <K extends keyof RegisterPayload>(
    field: K,
    value: RegisterPayload[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const result = await signUp({
        ...form,
        email: form.email.trim(),
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        display_name: form.display_name?.trim() || "",
        phone_number: form.phone_number?.trim() || "",
      });

      router.replace(result.user ? env.routes.home : env.routes.login);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create your account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-neutral-1 text-white">
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute left-0 top-0 h-[360px] w-[360px] rounded-full bg-indigo-600/10 blur-3xl" />
          <div className="absolute right-0 top-[120px] h-[320px] w-[320px] rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_32%)]" />
        </div>

        <div className="relative mx-auto flex min-h-[calc(100vh-120px)] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid w-full items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
                <Sparkles className="h-4 w-4" />
                Create account
              </div>

              <h1 className="mt-6 text-4xl font-bold leading-[1.03] tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
                Start with a cleaner commerce foundation.
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
                Create your account and begin setting up the business identity and operational structure your workflow needs.
              </p>

              <div className="mt-8 space-y-3">
                {[
                  "Merchant Owner and Customer are the only self-registration roles",
                  "Account cookies are issued by the backend securely",
                  "You can continue into the app immediately after signup",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3"
                  >
                    <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-300">
                      <BadgeCheck className="h-3.5 w-3.5" />
                    </div>
                    <p className="text-sm leading-7 text-slate-300">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mx-auto w-full max-w-[620px] overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.74),rgba(8,12,28,0.96))] shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
              <div className="border-b border-white/10 px-6 py-5">
                <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white">
                  Create account
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  Set up your Mercora access with the fields your backend expects.
                </p>
              </div>

              <form className="space-y-5 p-6 sm:p-7" onSubmit={handleSubmit}>
                {error ? (
                  <div className="rounded-[18px] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                    {error}
                  </div>
                ) : null}

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="first_name" className="mb-2 block text-sm font-medium text-slate-200">
                      First name
                    </label>
                    <input
                      id="first_name"
                      name="first_name"
                      type="text"
                      value={form.first_name}
                      onChange={(event) => updateField("first_name", event.target.value)}
                      placeholder="John"
                      className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-400/50 focus:bg-white/[0.06]"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="last_name" className="mb-2 block text-sm font-medium text-slate-200">
                      Last name
                    </label>
                    <input
                      id="last_name"
                      name="last_name"
                      type="text"
                      value={form.last_name}
                      onChange={(event) => updateField("last_name", event.target.value)}
                      placeholder="Doe"
                      className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-400/50 focus:bg-white/[0.06]"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-200">
                      Email address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(event) => updateField("email", event.target.value)}
                      placeholder="you@company.com"
                      className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-400/50 focus:bg-white/[0.06]"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phone_number" className="mb-2 block text-sm font-medium text-slate-200">
                      Phone number
                    </label>
                    <input
                      id="phone_number"
                      name="phone_number"
                      type="tel"
                      value={form.phone_number}
                      onChange={(event) => updateField("phone_number", event.target.value)}
                      placeholder="+234 800 000 0000"
                      className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-400/50 focus:bg-white/[0.06]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="display_name" className="mb-2 block text-sm font-medium text-slate-200">
                    Display name
                  </label>
                  <input
                    id="display_name"
                    name="display_name"
                    type="text"
                    value={form.display_name}
                    onChange={(event) => updateField("display_name", event.target.value)}
                    placeholder="Optional public-facing name"
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-400/50 focus:bg-white/[0.06]"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-200">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      value={form.password}
                      onChange={(event) => updateField("password", event.target.value)}
                      placeholder="Create password"
                      className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-400/50 focus:bg-white/[0.06]"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="password_confirm" className="mb-2 block text-sm font-medium text-slate-200">
                      Confirm password
                    </label>
                    <input
                      id="password_confirm"
                      name="password_confirm"
                      type="password"
                      autoComplete="new-password"
                      value={form.password_confirm}
                      onChange={(event) =>
                        updateField("password_confirm", event.target.value)
                      }
                      placeholder="Confirm password"
                      className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-400/50 focus:bg-white/[0.06]"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-3">
                  <div>
                    <label htmlFor="role" className="mb-2 block text-sm font-medium text-slate-200">
                      Account type
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={form.role}
                      onChange={(event) =>
                        updateField(
                          "role",
                          event.target.value as RegisterPayload["role"],
                        )
                      }
                      className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-indigo-400/50 focus:bg-white/[0.06]"
                    >
                      {roleOptions.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                          className="bg-neutral-2 text-slate-300"
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="preferred_timezone" className="mb-2 block text-sm font-medium text-slate-200">
                      Timezone
                    </label>
                    <input
                      id="preferred_timezone"
                      name="preferred_timezone"
                      type="text"
                      value={form.preferred_timezone}
                      onChange={(event) =>
                        updateField("preferred_timezone", event.target.value)
                      }
                      className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-indigo-400/50 focus:bg-white/[0.06]"
                    />
                  </div>

                  <div>
                    <label htmlFor="preferred_locale" className="mb-2 block text-sm font-medium text-slate-200">
                      Locale
                    </label>
                    <input
                      id="preferred_locale"
                      name="preferred_locale"
                      type="text"
                      value={form.preferred_locale}
                      onChange={(event) =>
                        updateField("preferred_locale", event.target.value)
                      }
                      className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-indigo-400/50 focus:bg-white/[0.06]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[image:var(--brand-gradient)] px-6 text-sm font-semibold text-white shadow-[0_16px_38px_rgba(79,70,229,0.34)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(79,70,229,0.42)] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Creating account..." : "Create Account"}
                  {!isSubmitting ? <ArrowRight className="h-4 w-4" /> : null}
                </button>

                <div className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4 text-center">
                  <p className="text-sm text-slate-300">
                    Already have an account?{" "}
                    <Link
                      href={env.routes.login}
                      className="font-semibold text-white transition hover:text-indigo-200"
                    >
                      Log in
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}