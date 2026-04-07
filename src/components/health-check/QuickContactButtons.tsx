interface QuickContactButtonsProps {
  mode: "health-check" | "health-response";
  layout: "mobile" | "desktop";
}

export function QuickContactButtons({
  mode,
  layout,
}: QuickContactButtonsProps) {
  if (mode === "health-check" && layout === "mobile") {
    return (
      <div className="grid grid-cols-2 gap-3">
        <a
          href="tel:0800611116"
          className="h-14 rounded-full flex items-center justify-center gap-2 font-bold text-sm bg-primary text-white active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-[18px]">call</span>
          Healthline
        </a>
        <a
          href="tel:111"
          className="h-14 rounded-full flex items-center justify-center gap-2 font-bold text-sm bg-error-container text-error active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-[18px]">emergency</span>
          Call 111
        </a>
      </div>
    );
  }

  if (mode === "health-check" && layout === "desktop") {
    return (
      <div className="space-y-3">
        <a
          href="tel:0800611116"
          className="w-full h-14 rounded-full flex items-center justify-center gap-2 font-bold text-sm bg-primary text-white active:scale-95 transition-transform hover:bg-primary-container"
        >
          <span className="material-symbols-outlined text-[18px]">call</span>
          Call Healthline
        </a>
        <div className="h-px bg-surface-container-high my-2" />
        <a
          href="tel:111"
          className="w-full bg-error text-white h-14 rounded-full font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform hover:opacity-90"
        >
          <span className="material-symbols-outlined text-[20px]">emergency</span>
          Call 111
        </a>
      </div>
    );
  }

  if (layout === "mobile") {
    return (
      <div className="space-y-3 pt-6">
        <a
          href="tel:0800611116"
          className="w-full flex justify-center items-center gap-2 bg-primary text-white h-14 rounded-full font-bold text-base active:scale-95 transition-transform shadow-lg shadow-primary/20"
        >
          <span className="material-symbols-outlined text-[20px]">call</span>
          Call Healthline
        </a>
        <a
          href="tel:111"
          className="w-full flex justify-center items-center gap-2 bg-error text-white h-14 rounded-full font-bold text-base active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-[20px]">emergency</span>
          Call 111
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-3 mb-6">
      <a
        href="tel:0800611116"
        className="w-full h-14 rounded-full flex items-center justify-center gap-2 font-bold text-sm bg-primary text-white active:scale-95 transition-transform hover:bg-primary-container shadow-lg shadow-primary/20"
      >
        <span className="material-symbols-outlined text-[18px]">call</span>
        Call Healthline
      </a>
      <a
        href="tel:111"
        className="w-full bg-error text-white h-14 rounded-full font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform hover:opacity-90 mt-4"
      >
        <span className="material-symbols-outlined text-[20px]">emergency</span>
        Call 111
      </a>
    </div>
  );
}
