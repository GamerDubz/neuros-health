import { CATEGORY_COLOURS } from "@/lib/db/ailments";

interface CategoryOption {
  key: string;
  label: string;
  icon: string;
}

const CATEGORY_OPTIONS: CategoryOption[] = [
  { key: "all", label: "All", icon: "grid_view" },
  { key: "respiratory", label: "Respiratory", icon: "air" },
  { key: "digestive", label: "Digestive", icon: "restaurant" },
  { key: "pain", label: "Pain", icon: "accessibility" },
  { key: "skin", label: "Skin", icon: "face" },
  { key: "fever", label: "Fever", icon: "thermostat" },
  { key: "allergy", label: "Allergy", icon: "allergy" },
  { key: "mental_health", label: "Mental Health", icon: "psychology" },
  { key: "eye_ear", label: "Eye & Ear", icon: "hearing" },
];

interface HealthCategoryFiltersProps {
  selectedCategory: string;
  onSelectCategory: (categoryKey: string) => void;
}

export function HealthCategoryFilters({
  selectedCategory,
  onSelectCategory,
}: HealthCategoryFiltersProps) {
  return (
    <div className="flex gap-2 flex-wrap pb-4 mb-4">
      {CATEGORY_OPTIONS.map((category) => {
        const colours =
          CATEGORY_COLOURS[category.key] || CATEGORY_COLOURS.general;
        const isSelected = selectedCategory === category.key;

        return (
          <button
            key={category.key}
            onClick={() => onSelectCategory(category.key)}
            style={{
              backgroundColor: isSelected ? colours.from : `${colours.from}15`,
              color: isSelected ? colours.text : undefined,
              borderColor: isSelected ? colours.from : `${colours.from}30`,
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold active:scale-95 transition-all border shadow-sm ${
              isSelected ? "" : "text-on-surface"
            }`}
          >
            <span
              className="material-symbols-outlined text-base"
              style={{ color: isSelected ? colours.text : colours.to }}
              aria-hidden
            >
              {category.icon}
            </span>
            {category.label}
          </button>
        );
      })}
    </div>
  );
}
