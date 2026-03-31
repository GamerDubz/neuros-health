"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

// --- GLOBAL MOBILE HEADER ---
export function GlassHeader() {
  const pathname = usePathname();
  // Hide on auth, onboarding
  if (['/login', '/signup', '/onboarding', '/'].includes(pathname)) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/85 backdrop-blur-lg px-6 py-4 flex justify-between items-center h-16 md:hidden">
      <Link href="/" className="font-bold text-lg text-teal-800 tracking-tight">Neuros Health</Link>
      <button aria-label="Notifications" className="p-2 rounded-full text-primary active:scale-95 transition-transform">
        <span className="material-symbols-outlined text-[24px]">notifications</span>
      </button>
    </header>
  );
}

// --- MOBILE BOTTOM NAV ---
export function BottomNav() {
  const pathname = usePathname();
  if (['/login', '/signup', '/onboarding', '/'].includes(pathname)) return null;

  const tabs = [
    { name: "Home", href: "/home", icon: "home" },
    { name: "Meds", href: "/medications", icon: "medical_services" },
    { name: "Health", href: "/health", icon: "medical_information" },
    { name: "Tracker", href: "/tracker", icon: "leaderboard" },
    { name: "Profile", href: "/profile", icon: "person" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface/85 backdrop-blur-xl pt-3 pb-safe rounded-t-3xl md:hidden pb-safe flex px-2" style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 1.5rem)' }}>
      {tabs.map((tab) => {
        const isActive = pathname === tab.href || pathname.startsWith(tab.href + "/");
        return (
          <Link
            href={tab.href}
            key={tab.name}
            className={`flex-1 flex flex-col items-center justify-center gap-1 active:scale-90 transition-transform duration-200 ${
              isActive ? "text-primary border-b-2 border-primary" : "text-outline hover:text-primary"
            }`}
            style={{ height: '56px' }}
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

// --- DESKTOP SIDEBAR ---
export function Sidebar() {
  const pathname = usePathname();
  if (['/login', '/signup', '/onboarding', '/'].includes(pathname)) return null;

  const tabs = [
    { name: "Home", href: "/home", icon: "home" },
    { name: "Meds", href: "/medications", icon: "medical_services" },
    { name: "Health", href: "/health", icon: "medical_information" },
    { name: "Tracker", href: "/tracker", icon: "leaderboard" },
    { name: "Profile", href: "/profile", icon: "person" },
  ];

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-surface-container-lowest z-40">
      <div className="px-6 py-6">
        <Link href="/" className="text-primary font-extrabold text-xl tracking-tight">Neuros Health</Link>
      </div>
      <div className="h-px bg-surface-container-high mx-4" />
      <nav className="flex-1 px-2 py-6 space-y-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + "/");
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
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0", marginLeft: isActive ? '12px' : '0' }}
              >
                {tab.icon}
              </span>
              {tab.name}
            </Link>
          );
        })}
      </nav>
      {/* Emergency footer */}
      <div className="px-6 pb-8 space-y-3">
        <div className="text-xs font-bold uppercase tracking-widest text-outline mb-4">Emergency Support</div>
        <a href="tel:0800611116" className="flex items-center gap-3 text-sm text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-[16px]">call</span>
          Healthline
        </a>
        <a href="tel:111" className="flex items-center gap-3 text-sm font-bold text-on-surface-variant hover:text-error transition-colors">
          <span className="material-symbols-outlined text-[16px] text-error">emergency</span>
          Call 111
        </a>
      </div>
    </aside>
  );
}

// --- DESKTOP TOP BAR ---
export function TopBar() {
  const pathname = usePathname();
  if (['/login', '/signup', '/onboarding', '/'].includes(pathname)) return null;

  return (
    <header className="hidden md:flex fixed top-0 left-64 right-0 z-50 bg-surface/85 backdrop-blur-lg px-8 py-3 items-center justify-between h-16">
      {/* Search */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline">search</span>
        <input 
          type="text" 
          placeholder="Search..." 
          className="bg-surface-container-high rounded-full pl-10 pr-4 py-2 w-64 text-sm focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary transition-all text-on-surface"
        />
      </div>
      {/* Actions */}
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <Link href="/profile" className="bg-primary-fixed text-on-primary-fixed rounded-full w-9 h-9 flex items-center justify-center font-bold text-sm hover:scale-105 transition-transform">
          JD
        </Link>
      </div>
    </header>
  );
}

// --- EMERGENCY STRIP ---
export function EmergencyStrip() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  
  if (['/login', '/signup', '/onboarding', '/'].includes(pathname)) return null;

  return (
    <div className="md:hidden fixed bottom-24 left-6 right-6 z-40 transition-all duration-300">
      <div className="bg-error-container text-on-error-container p-4 rounded-2xl flex items-center justify-between shadow-xl">
        {!expanded ? (
          <>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
              <span className="font-bold text-sm">Need urgent help?</span>
            </div>
            <button onClick={() => setExpanded(true)} className="bg-white/50 backdrop-blur-md text-error px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest active:scale-95 transition-transform transition-all">
              Tap to Expand
            </button>
          </>
        ) : (
          <div className="flex-1 flex justify-between gap-3 animate-slide-in">
            <a href="tel:0800611116" className="flex-1 bg-white/50 text-error rounded-full px-4 py-3 font-bold text-sm text-center active:scale-95 transition-transform flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[18px]">call</span> Healthline
            </a>
            <a href="tel:111" className="flex-1 bg-error text-white rounded-full px-4 py-3 font-bold text-sm text-center active:scale-95 transition-transform flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[18px]">emergency</span> Call 111
            </a>
            <button aria-label="collapse" onClick={() => setExpanded(false)} className="px-2">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
