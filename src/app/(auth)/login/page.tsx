"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { extractApiErrorMessage } from "@/lib/api/axios";
import { env } from "@/lib/config/env";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

import { LoginFormValues, loginSchema } from "@/lib/schema";


type FormErrors = Partial<Record<keyof LoginFormValues, string>>;


type FloatingInputProps = {
  id: string;
  name: string;
  type: string;
  label: string;
  value: string;
  error?: string;
  autoComplete?: string;
  onChange: (value: string) => void;
  required?: boolean;
  rightSlot?: React.ReactNode;
};

function FloatingInput({
  id,
  name,
  type,
  label,
  value,
  error,
  autoComplete,
  onChange,
  required,
  rightSlot,
}: FloatingInputProps) {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;

  return (
    <div>
      <div
        className={[
          "relative rounded-xl border transition-all duration-200",
          error
            ? "border-red-500"
            : focused
            ? "border-indigo-500 shadow-[0_0_0_3px_rgba(99,102,241,0.12)]"
            : "border-white/12 hover:border-white/25",
        ].join(" ")}
      >
        <label
          htmlFor={id}
          className={[
            "pointer-events-none absolute left-4 transition-all duration-200",
            lifted
              ? "top-2 text-[10px] font-semibold uppercase text-indigo-400"
              : "top-1/2 -translate-y-1/2 text-sm text-slate-500",
          ].join(" ")}
        >
          {label}
        </label>

        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={required}
          placeholder=""
          className={[
            "h-[58px] w-full rounded-xl bg-white/[0.03] px-4 text-sm text-white outline-none",
            rightSlot ? "pr-20" : "",
            lifted ? "pt-5 pb-1" : "",
          ].join(" ")}
        />

        {rightSlot && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {rightSlot}
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-[11px] text-red-400">{error}</p>}
    </div>
  );
}

// ==============================
// FEATURES
// ==============================

const FEATURES = [
  {
    title: "Orders & customers",
    desc: "View, manage, and action all your orders from one place.",
  },
  {
    title: "Receipts & settlements",
    desc: "Track every transaction with full financial visibility.",
  },
  {
    title: "Merchant reporting",
    desc: "Analytics and settings built for serious operators.",
  },
];

// ==============================
// PAGE
// ==============================

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, refreshUser } = useAuth();

  const [form, setForm] = useState<LoginFormValues>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const nextUrl = useMemo(
    () => searchParams.get("next"),
    [searchParams]
  );

  const updateField = (field: keyof LoginFormValues, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // ==============================
  // VALIDATION (FIXED)
  // ==============================

  const validate = (): boolean => {
    const result = loginSchema.safeParse(form);

    if (result.success) {
      setErrors({});
      return true;
    }

    const fieldErrors: FormErrors = {};

    result.error.issues.forEach((err) => {
      const field = err.path[0] as keyof LoginFormValues;
      fieldErrors[field] = err.message;
    });

    setErrors(fieldErrors);
    return false;
  };

  // ==============================
  // REDIRECT LOGIC
  // ==============================

  const resolveRedirect = (role: string) => {
    if (nextUrl) return nextUrl;

    switch (role) {
      case "merchant_owner":
      case "merchant_staff":
        return "/dashboard";

      case "platform_admin":
      case "support_agent":
        return "/platform-admin";

      default:
        return env.routes.home;
    }
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      await login({
        email: form.email.trim(),
        password: form.password,
      });

      const user = await refreshUser();

      if (!user) {
        throw new Error("Authentication failed");
      }

      router.replace(resolveRedirect(user.role));
    } catch (err) {
      setFormError(extractApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <main className="relative min-h-[calc(100vh-74px)] bg-[#06080F] text-white">
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 py-14 lg:grid-cols-2">

        {/* LEFT */}
        <div>
          <h1 className="text-4xl font-bold">
            Your commerce hub{" "}
            <span className="text-indigo-400">starts here</span>
          </h1>

          <p className="mt-4 text-slate-400">
            Storefront. Payments. Receipts. Settlements. All in one place.
          </p>

          <div className="mt-8 space-y-3">
            {FEATURES.map((f) => (
              <div key={f.title}>
                <p className="font-semibold">{f.title}</p>
                <p className="text-sm text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="rounded-2xl border border-white/10 p-8">
          <h2 className="text-2xl font-bold">Log in</h2>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">

            {formError && (
              <div className="text-red-400 text-sm">{formError}</div>
            )}

            <FloatingInput
              id="email"
              name="email"
              type="email"
              label="Email"
              value={form.email}
              error={errors.email}
              onChange={(v) => updateField("email", v)}
            />

            <FloatingInput
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              label="Password"
              value={form.password}
              error={errors.password}
              onChange={(v) => updateField("password", v)}
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="text-xs text-slate-400"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              }
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-indigo-600 rounded-xl"
            >
              {isSubmitting ? "Logging in..." : "Continue"}
            </button>

            <p className="text-sm text-center text-slate-500">
              No account?{" "}
              <Link href={env.routes.signUp} className="text-white">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}