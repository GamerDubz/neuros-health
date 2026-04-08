"use client";

import { useState, useRef, useEffect } from "react";

export function EmergencyDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Urgent Help"
        aria-expanded={isOpen}
        className={`p-2 rounded-full transition-all duration-300 flex items-center justify-center active:scale-95 ${
          isOpen ? "bg-error-container text-on-error-container" : "text-error hover:bg-error/10"
        }`}
      >
        <span 
          className="material-symbols-outlined text-[24px]" 
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          emergency
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+12px)] right-0 md:right-auto md:left-1/2 md:-translate-x-1/2 w-72 md:w-80 bg-surface rounded-3xl shadow-[0_16px_40px_rgb(0,0,0,0.15)] border border-outline-variant/50 px-5 pt-5 pb-6 z-100 animate-slide-in origin-top md:origin-top">
          <div className="flex justify-between items-center mb-4">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-error-container/50 flex items-center justify-center">
                    <span className="material-symbols-outlined text-error text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                </div>
                <h3 className="font-extrabold text-on-surface text-lg tracking-tight">Urgent Help</h3>
             </div>
             <button onClick={() => setIsOpen(false)} className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-full p-1 transition-colors">
               <span className="material-symbols-outlined text-[20px]">close</span>
             </button>
          </div>
          
          <p className="text-[13px] text-on-surface-variant mb-6 leading-relaxed">
            If you or someone else is experiencing a severe or life-threatening emergency, please seek immediate help.
          </p>
          
          <div className="flex flex-col gap-3">
             <a
              href="tel:111"
              className="flex items-center justify-center gap-3 w-full py-3.5 bg-error text-on-error rounded-2xl font-bold shadow-md hover:bg-error/90 active:scale-[0.98] transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">emergency</span>
              Call 111
            </a>
            <a
              href="tel:0800611116"
              className="flex items-center justify-center gap-3 w-full py-3 bg-surface-container-lowest text-error border border-error/30 rounded-2xl font-bold shadow-sm hover:bg-error-container/30 active:scale-[0.98] transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">call</span>
              Healthline
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
