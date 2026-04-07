"use client";

import { useState } from "react";

export function EmergencyStrip() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="md:hidden fixed bottom-24 left-6 right-6 z-40 transition-all duration-300">
      <div className="bg-error-container text-on-error-container p-4 rounded-2xl flex items-center justify-between shadow-xl">
        {!expanded ? (
          <>
            <div className="flex items-center gap-2">
              <span
                className="material-symbols-outlined text-error"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                warning
              </span>
              <span className="font-bold text-sm">Need urgent help?</span>
            </div>
            <button
              onClick={() => setExpanded(true)}
              className="bg-white/50 backdrop-blur-md text-error px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest active:scale-95 transition-transform"
            >
              Tap to Expand
            </button>
          </>
        ) : (
          <div className="flex-1 flex justify-between gap-3 animate-slide-in">
            <a
              href="tel:0800611116"
              className="flex-1 bg-white/50 text-error rounded-full px-4 py-3 font-bold text-sm text-center active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">call</span>
              Healthline
            </a>
            <a
              href="tel:111"
              className="flex-1 bg-error text-white rounded-full px-4 py-3 font-bold text-sm text-center active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">emergency</span>
              Call 111
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
