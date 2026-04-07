"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Medicine } from "@/lib/db/nz-health";

interface MedicationSearchAutocompleteProps {
  search: string;
  dbResults: Medicine[];
  didYouMean: string | null;
  isSearchingDb: boolean;
  showSuggestions: boolean;
  onSearchChange: (value: string) => void;
  onShowSuggestionsChange: (isVisible: boolean) => void;
}

export function MedicationSearchAutocomplete({
  search,
  dbResults,
  didYouMean,
  isSearchingDb,
  showSuggestions,
  onSearchChange,
  onShowSuggestionsChange,
}: MedicationSearchAutocompleteProps) {
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        onShowSuggestionsChange(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [onShowSuggestionsChange]);

  return (
    <div className="relative" ref={searchContainerRef}>
      <div className="relative h-14 w-full">
        <span className="material-symbols-outlined absolute left-4 top-4 text-outline">
          search
        </span>
        <input
          type="text"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          onFocus={() => {
            if (dbResults.length > 0 || didYouMean) {
              onShowSuggestionsChange(true);
            }
          }}
          placeholder="Search medications..."
          className="w-full h-full bg-surface-container-high rounded-xl pl-12 pr-4 text-on-surface text-base placeholder:text-outline/60 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:outline-none transition-all duration-200"
        />
        {isSearchingDb && (
          <span className="material-symbols-outlined animate-spin absolute right-4 top-4 text-primary text-[20px]">
            progress_activity
          </span>
        )}
      </div>

      {showSuggestions && (dbResults.length > 0 || didYouMean) && (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 bg-surface-container-lowest rounded-2xl shadow-[0_20px_60px_rgba(21,28,39,0.15)] border border-surface-container-high overflow-hidden max-h-[420px] overflow-y-auto">
          <div className="px-4 pt-3 pb-2 flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-widest text-outline">
              NZ Medicine Database
            </p>
            {dbResults.length > 0 && (
              <span className="text-[10px] text-outline">
                {dbResults.length} result{dbResults.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {didYouMean && dbResults.length === 0 && (
            <div className="px-4 py-3 bg-primary-fixed/10 border-b border-surface-container-high/50 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[16px]">
                auto_fix_high
              </span>
              <p className="text-sm text-on-surface">
                Did you mean{" "}
                <button
                  className="font-bold text-primary underline"
                  onClick={() => onSearchChange(didYouMean)}
                >
                  {didYouMean}
                </button>
                ?
              </p>
            </div>
          )}

          {dbResults.map((result) => (
            <Link
              key={result.slug || result.id}
              href={`/medications/${result.slug}`}
              onClick={() => onShowSuggestionsChange(false)}
              className="flex items-center gap-4 px-4 py-3 hover:bg-primary-fixed/20 transition-colors group border-t border-surface-container-high/50"
            >
              <div className="w-10 h-10 bg-primary-fixed/30 rounded-full flex items-center justify-center text-primary shrink-0">
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  medication
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-on-surface text-sm group-hover:text-primary transition-colors truncate">
                  {result.display_name}
                </div>
                <div className="text-xs text-on-surface-variant truncate mt-0.5">
                  {result.generic_name !== result.display_name?.toLowerCase() &&
                    result.generic_name}
                  {result.brand_names?.length > 0 &&
                    ` • ${result.brand_names.slice(0, 3).join(", ")}`}
                </div>
                {result.meta_description && (
                  <div className="text-[11px] text-outline mt-0.5 line-clamp-1">
                    {result.meta_description}
                  </div>
                )}
              </div>
              <span className="material-symbols-outlined text-outline text-[18px] group-hover:text-primary transition-colors shrink-0">
                arrow_forward
              </span>
            </Link>
          ))}

          <div className="px-4 py-2.5 bg-surface-container-low/50 border-t border-surface-container-high/50">
            <Link
              href="/medications/add"
              onClick={() => onShowSuggestionsChange(false)}
              className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
            >
              <span className="material-symbols-outlined text-[14px]">add</span>
              Can&apos;t find it? Add manually
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
