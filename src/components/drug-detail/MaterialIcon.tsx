const ICON_MAP: Record<string, string> = {
  clock: "schedule",
  sun: "wb_sunny",
  moon: "bedtime",
  food: "restaurant",
  stomach: "no_food",
  water: "water_drop",
  repeat: "repeat",
  pill: "medication",
  no_alcohol: "no_drinks",
  warning: "warning",
  doctor: "medical_services",
  emergency: "emergency",
};

export function MaterialIcon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-outlined ${className}`} aria-hidden>
      {ICON_MAP[name] || "medication"}
    </span>
  );
}
