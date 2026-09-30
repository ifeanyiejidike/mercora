"use client";

import type { ReactNode } from "react";
import MerchantHeader from "@/components/merchant/MerchantHeader";
import MerchantSidebar from "@/components/merchant/MerchantSidebar";

type MerchantDashboardShellProps = {
  children: ReactNode;
};

export default function MerchantDashboardShell({
  children,
}: MerchantDashboardShellProps) {
  return (
    <div className="min-h-screen bg-neutral-1 text-white">
      <div className="mx-auto flex max-w-[1800px]">
        <MerchantSidebar />

        <div className="min-w-0 flex-1">
          <MerchantHeader />

          <main className="px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}