import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { AuthProvider } from "@/contexts/AuthContext";

type AuthLayoutProps = {
  children: ReactNode;
};


export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <AuthProvider>
      <div className="relative min-h-screen overflow-hidden bg-neutral-1 text-white">
        <div className="absolute inset-0">
          <div className="absolute left-0 top-0 h-[340px] w-[340px] rounded-full bg-indigo-600/10 blur-3xl" />
          <div className="absolute right-0 top-[120px] h-[300px] w-[300px] rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_32%)]" />
        </div>

        <div className="relative border-b border-white/8 bg-[rgba(4,10,24,0.66)] backdrop-blur-xl">
          <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/8 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to site
            </Link>

            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
              <ShieldCheck className="h-4 w-4" />
              Secure auth flow
            </div>
          </div>
        </div>

        <div className="relative">{children}</div>
      </div>
    </AuthProvider>
  );
}