"use client";

import { useEffect, useState } from "react";
import { searchMedicines, type Medicine } from "@/lib/db/nz-health";
import { fuzzySort } from "@/lib/fuzzy";
import {
  FUZZY_THRESHOLD,
  SEARCH_DEBOUNCE_MS,
  SEARCH_FETCH_POOL,
  SEARCH_MAX_RESULTS,
} from "@/lib/constants";
import { rankMedicineSearchResults } from "@/lib/medications/search-ranking";

interface MedicationSearchState {
  dbResults: Medicine[];
  didYouMean: string | null;
  isSearchingDb: boolean;
  showSuggestions: boolean;
  setShowSuggestions: (isVisible: boolean) => void;
}

/**
 * Searches the public medicines dataset and keeps the autocomplete state in sync.
 */
export function useMedicationSearch(search: string): MedicationSearchState {
  const [dbResults, setDbResults] = useState<Medicine[]>([]);
  const [isSearchingDb, setIsSearchingDb] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [didYouMean, setDidYouMean] = useState<string | null>(null);

  useEffect(() => {
    if (!search || search.length < 1) {
      setDbResults([]);
      setDidYouMean(null);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingDb(true);

      try {
        const data = await searchMedicines(search, SEARCH_FETCH_POOL);
        const query = search.toLowerCase();
        const prefixSortedResults = rankMedicineSearchResults(data, query).slice(0, SEARCH_MAX_RESULTS);
        const fuzzySortedResults = fuzzySort(
          query,
          data,
          (item) => [item.display_name || "", item.generic_name || "", ...(item.brand_names || [])],
          FUZZY_THRESHOLD,
        );

        const finalResults =
          prefixSortedResults.length > 0
            ? prefixSortedResults
            : fuzzySortedResults.slice(0, SEARCH_MAX_RESULTS);
        const suggestedMatch =
          prefixSortedResults.length === 0 && fuzzySortedResults.length > 0
            ? fuzzySortedResults[0].display_name || null
            : null;

        setDbResults(finalResults);
        setDidYouMean(suggestedMatch);
        setShowSuggestions(finalResults.length > 0 || suggestedMatch !== null);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearchingDb(false);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [search]);

  return { dbResults, didYouMean, isSearchingDb, showSuggestions, setShowSuggestions };
}
