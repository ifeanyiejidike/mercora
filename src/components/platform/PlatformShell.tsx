"use client";

import type { ReactNode } from "react";
import PlatformHeader from "@/components/platform/PlatformHeader";
import PlatformSidebar from "@/components/platform/PlatformSidebar";

type PlatformShellProps = {
  children: ReactNode;
};

export default function PlatformShell({ children }: PlatformShellProps) {
  return (
    <div className="min-h-screen bg-neutral-1 text-white">
      <div className="mx-auto flex max-w-[1800px]">
        <PlatformSidebar />

        <div className="min-w-0 flex-1">
          <PlatformHeader />

          <main className="px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}