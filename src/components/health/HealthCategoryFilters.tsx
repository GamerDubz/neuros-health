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
    <div className="flex gap-2 overflow-x-auto pb-4 -mx-6 px-6 mb-6 no-scrollbar md:mx-0 md:px-0 md:overflow-visible md:flex-wrap">
      {CATEGORY_OPTIONS.map((category) => (
        <button
          key={category.key}
          onClick={() => onSelectCategory(category.key)}
          className={`flex min-h-[48px] items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap active:scale-95 transition-all flex-shrink-0 ${
            selectedCategory === category.key
              ? "bg-primary text-on-primary shadow-md"
              : "bg-surface-container-lowest text-on-surface shadow-sm"
          }`}
        >
          <span className="material-symbols-outlined text-base" aria-hidden>
            {category.icon}
          </span>
          {category.label}
        </button>
      ))}
    </div>
  );
}
