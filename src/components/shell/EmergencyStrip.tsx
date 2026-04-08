"use client";

import { useState } from "react";

export function EmergencyStrip() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 transition-all duration-300 flex flex-col items-end gap-2">
      {expanded && (
        <div className="bg-surface/95 backdrop-blur-md p-2 rounded-2xl shadow-xl flex flex-col gap-2 animate-slide-in min-w-[200px] border border-outline-variant">
          <a
            href="tel:0800611116"
            className="flex items-center gap-3 px-4 py-3 bg-error-container/50 text-on-error-container rounded-xl font-semibold hover:bg-error-container active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">call</span>
            Healthline
          </a>
          <a
            href="tel:111"
            className="flex items-center gap-3 px-4 py-3 bg-error text-on-error rounded-xl font-semibold shadow-sm hover:opacity-90 active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">emergency</span>
            Call 111
          </a>
        </div>
      )}

      <button
        aria-label={expanded ? "Close urgent help" : "Open urgent help"}
        onClick={() => setExpanded(!expanded)}
        className={`flex items-center gap-2 px-4 py-3 rounded-full shadow-lg font-semibold transition-all duration-300 active:scale-95 ${
          expanded
            ? "bg-surface text-on-surface border border-outline-variant"
            : "bg-error-container text-on-error-container hover:bg-error-container/80 border border-error/20"
        }`}
      >
        <span
          className="material-symbols-outlined text-[20px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {expanded ? "close" : "warning"}
        </span>
        {!expanded && <span className="text-sm">Urgent Help</span>}
      </button>
    </div>
  );
}
