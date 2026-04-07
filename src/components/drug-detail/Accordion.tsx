"use client";

import { ReactNode, useState } from "react";

export function Accordion({
  icon,
  title,
  count,
  children,
  onCollapse,
}: {
  icon: string;
  title: string;
  count?: number;
  children: ReactNode;
  onCollapse?: () => void;
}) {
  const [open, setOpen] = useState(false);

  function toggle() {
    if (open && onCollapse) onCollapse();
    setOpen(!open);
  }

  return (
    <div className="bg-white rounded-2xl shadow-[0_10px_40px_rgba(21,28,39,0.04)] overflow-hidden">
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between px-5 py-4 min-h-[56px] text-left active:bg-[#f0f3ff] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[22px] text-[#00685d]" aria-hidden>
            {icon}
          </span>
          <span className="font-bold text-[#151c27]">
            {title}
            {count !== undefined && count > 0 && (
              <span className="ml-2 text-xs font-normal text-[#6d7a77]">({count})</span>
            )}
          </span>
        </div>
        <span
          className={`material-symbols-outlined text-[#6d7a77] transition-transform duration-200 text-[20px] ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden
        >
          expand_more
        </span>
      </button>
      {open && <div className="border-t border-[#f0f3ff]">{children}</div>}
    </div>
  );
}
