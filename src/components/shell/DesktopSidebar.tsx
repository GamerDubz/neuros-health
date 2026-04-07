"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_TABS } from "@/lib/constants";

export function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-surface-container-lowest z-40">
      <div className="px-6 py-6">
        <Link href="/" className="text-primary font-extrabold text-xl tracking-tight">
          Neuros Health
        </Link>
      </div>
      <div className="h-px bg-surface-container-high mx-4" />
      <nav className="flex-1 px-2 py-6 space-y-2">
        {NAV_TABS.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(`${tab.href}/`);

          return (
            <Link
              href={tab.href}
              key={tab.name}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl mx-2 font-semibold text-sm transition-colors ${
                isActive
                  ? "bg-surface-container-low text-primary"
                  : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
              }`}
            >
              {isActive && <div className="absolute left-4 w-1 h-6 bg-primary rounded-full" />}
              <span
                className="material-symbols-outlined text-[24px]"
                style={{
                  fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                  marginLeft: isActive ? "12px" : "0",
                }}
              >
                {tab.icon}
              </span>
              {tab.name}
            </Link>
          );
        })}
      </nav>
      <div className="px-6 pb-8 space-y-3">
        <div className="text-xs font-bold uppercase tracking-widest text-outline mb-4">
          Emergency Support
        </div>
        <a
          href="tel:0800611116"
          className="flex items-center gap-3 text-sm text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">call</span>
          Healthline
        </a>
        <a
          href="tel:111"
          className="flex items-center gap-3 text-sm font-bold text-on-surface-variant hover:text-error transition-colors"
        >
          <span className="material-symbols-outlined text-[16px] text-error">emergency</span>
          Call 111
        </a>
      </div>
    </aside>
  );
}
