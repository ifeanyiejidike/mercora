import type { ReactNode } from "react";
import MerchantDashboardShell from "@/components/merchant/MerchantDashboardShell";
import { MerchantProvider } from "@/contexts/MerchantContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { StorefrontProvider } from "@/contexts/StorefrontContext";

// This entire route segment is an authenticated, per-merchant dashboard —
// content depends on runtime auth/merchant state that doesn't exist at
// build time. Without this, Next.js tries to statically prerender every
// page under /dashboard/*, which both wastes build time and is fragile:
// any context/hook that depends on real auth state (like useStorefront)
// can throw during prerendering, failing the whole build (see the
// StorefrontProvider fix above — this prevents that class of bug from
// recurring on any other page in this segment).
export const dynamic = "force-dynamic";

type MerchantDashboardLayoutProps = {
  children: ReactNode;
};

export default function MerchantDashboardLayout({
  children,
}: MerchantDashboardLayoutProps) {
  return (
    <AuthProvider>
      <MerchantProvider>
        <StorefrontProvider>
          <MerchantDashboardShell>
            {children}
          </MerchantDashboardShell>
        </StorefrontProvider>
      </MerchantProvider>
    </AuthProvider>
  );
}