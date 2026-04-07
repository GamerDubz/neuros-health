"use client";

import Link from "next/link";

export function DesktopTopBar() {
  return (
    <header className="hidden md:flex fixed top-0 left-64 right-0 z-50 bg-surface/85 backdrop-blur-lg px-8 py-3 items-center justify-between h-16">
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline">
          search
        </span>
        <input
          type="text"
          placeholder="Search..."
          className="bg-surface-container-high rounded-full pl-10 pr-4 py-2 w-64 text-sm focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary transition-all text-on-surface"
        />
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <Link
          href="/profile"
          className="bg-primary-fixed text-on-primary-fixed rounded-full w-9 h-9 flex items-center justify-center font-bold text-sm hover:scale-105 transition-transform"
        >
          JD
        </Link>
      </div>
    </header>
  );
}
