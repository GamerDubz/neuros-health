"use client";

import Link from "next/link";

export function MobileHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/85 backdrop-blur-lg px-6 py-4 flex justify-between items-center h-16 md:hidden">
      <Link href="/" className="font-bold text-lg text-teal-800 tracking-tight">
        Neuros Health
      </Link>
      <button aria-label="Notifications" className="p-2 rounded-full text-primary active:scale-95 transition-transform">
        <span className="material-symbols-outlined text-[24px]">notifications</span>
      </button>
    </header>
  );
}
