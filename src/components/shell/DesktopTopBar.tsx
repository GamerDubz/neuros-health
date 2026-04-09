"use client";

import Link from "next/link";
import { EmergencyDropdown } from "@/components/shell/EmergencyDropdown";

export function DesktopTopBar() {
  return (
    <header className="hidden md:flex fixed top-0 left-64 right-0 z-50 bg-surface/85 backdrop-blur-lg px-8 py-3 items-center justify-between h-16">
      <div className="flex-1"></div>
      <div className="flex items-center gap-4">
        <EmergencyDropdown />
        <button className="p-2 rounded-full text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <Link
          href="/profile"
          aria-label="View profile"
          className="bg-primary-fixed text-on-primary-fixed rounded-full w-9 h-9 flex items-center justify-center hover:scale-105 transition-transform"
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</span>
        </Link>
      </div>
    </header>
  );
}
