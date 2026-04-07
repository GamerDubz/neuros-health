"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_TABS } from "@/lib/constants";

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-surface/85 backdrop-blur-xl pt-3 rounded-t-3xl md:hidden flex px-2"
      style={{ paddingBottom: "max(env(safe-area-inset-bottom), 1.5rem)" }}
    >
      {NAV_TABS.map((tab) => {
        const isActive = pathname === tab.href || pathname.startsWith(`${tab.href}/`);

        return (
          <Link
            href={tab.href}
            key={tab.name}
            className={`flex-1 flex flex-col items-center justify-center gap-1 active:scale-90 transition-transform duration-200 ${
              isActive ? "text-primary border-b-2 border-primary" : "text-outline hover:text-primary"
            }`}
            style={{ height: "56px" }}
          >
            <span
              className="material-symbols-outlined text-[28px]"
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {tab.icon}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider">{tab.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
