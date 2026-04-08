"use client";

import Link from "next/link";
import { EmergencyDropdown } from "@/components/shell/EmergencyDropdown";

export function MobileHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/85 backdrop-blur-lg px-6 py-4 flex justify-between items-center h-16 md:hidden">
      <Link href="/" className="font-bold text-lg text-primary tracking-tight">
        Neuros Health
      </Link>
      <div className="flex items-center gap-2">
        <EmergencyDropdown />
        <button aria-label="Notifications" className="p-2 rounded-full text-primary active:scale-95 transition-transform">
          <span className="material-symbols-outlined text-[24px]">notifications</span>
        </button>
      </div>
    </header>
  );
}
