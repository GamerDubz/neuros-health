"use client";

import { useStore } from "@/lib/store";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { searchMedicines } from "@/lib/db/nz-health";
import { fuzzySort } from "@/lib/fuzzy";

export default function MedicationsList() {
  const { medications, user } = useStore();
  const [search, setSearch] = useState("");
  const [dbResults, setDbResults] = useState<any[]>([]);
  const [isSearchingDb, setIsSearchingDb] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [didYouMean, setDidYouMean] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Filter user's own medications by search
  const filteredMeds = medications.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

  // Search the NZ database for autocomplete suggestions
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
        const data = await searchMedicines(search, 20); // fetch more so re-sort has pool to work with

        const q = search.toLowerCase();

        // ── Tier-based prefix ranking ────────────────────────────────────────
        function prefixScore(name: string, brands: string[], generic: string): number {
          if (name.startsWith(q)) return 0;
          if (brands.some(bn => bn.startsWith(q))) return 1;
          if (name.split(/\s+/).some(w => w.startsWith(q))) return 2;
          if (brands.some(bn => bn.split(/\s+/).some(w => w.startsWith(q)))) return 3;
          if (generic.startsWith(q)) return 4;
          return 5;
        }

        const prefixSorted = (data || []).sort((a: any, b: any) => {
          const aName = (a.display_name || "").toLowerCase();
          const bName = (b.display_name || "").toLowerCase();
          const aBrands: string[] = (a.brand_names || []).map((bn: string) => bn.toLowerCase());
          const bBrands: string[] = (b.brand_names || []).map((bn: string) => bn.toLowerCase());
          const aScore = prefixScore(aName, aBrands, (a.generic_name || "").toLowerCase());
          const bScore = prefixScore(bName, bBrands, (b.generic_name || "").toLowerCase());
          if (aScore !== bScore) return aScore - bScore;
          return aName.localeCompare(bName);
        });

        const topResults = prefixSorted.slice(0, 8);

        // ── Fuzzy fallback when prefix search returns nothing ─────────────────
        // e.g. user typed "paracetmol" — prefix misses, fuzzy catches it.
        let fuzzyHint: string | null = null;
        if (topResults.length === 0 && (data || []).length === 0 && q.length >= 3) {
          // Try a broader fuzzy pass directly on the user's input against known
          // common medicine names cached from a previous successful search.
          // Since we have no cache here, we just surface the hint from fuzzy scoring
          // of whatever the DB *did* return (even partial results from ilike).
          fuzzyHint = null; // Will be set below if broader search returns candidates
        }

        // ── Apply fuzzy re-ranking on whatever came back ──────────────────────
        // This makes misspellings like "paracetmol" surface "Paracetamol" correctly
        const fuzzySorted = fuzzySort(
          q,
          data || [],
          (item: any) => [
            item.display_name || '',
            item.generic_name || '',
            ...(item.brand_names || []),
          ],
          0.25 // lower threshold so phonetic/typo matches still appear
        );

        // If prefix gave results, use them; otherwise fall back to fuzzy order
        const finalResults = topResults.length > 0 ? topResults : fuzzySorted.slice(0, 8);

        // Did-you-mean: when results came back via fuzzy but NOT via prefix
        if (topResults.length === 0 && fuzzySorted.length > 0) {
          fuzzyHint = fuzzySorted[0].display_name || null;
        } else {
          fuzzyHint = null;
        }

        setDbResults(finalResults);
        setDidYouMean(fuzzyHint);
        setShowSuggestions(finalResults.length > 0 || fuzzyHint !== null);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsSearchingDb(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [search]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="animate-fade-in relative max-w-2xl mx-auto lg:max-w-none">

      <div className="grid lg:grid-cols-[3fr_2fr] gap-8 items-start">

        {/* Left Column: List & Search */}
        <div className="space-y-6">
          <div className="flex justify-between items-end mb-10">
            <h1 className="text-4xl font-extrabold tracking-tight text-on-surface">My Medications</h1>
            <Link href="/medications/add" className="hidden lg:flex px-6 py-3 rounded-full gradient-primary font-bold text-white text-sm active:scale-95 transition-transform shadow-md">
              + Add Medication
            </Link>
          </div>

          {/* Search with Autocomplete */}
          <div className="relative" ref={searchRef}>
            <div className="relative h-14 w-full">
              <span className="material-symbols-outlined absolute left-4 top-4 text-outline">search</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => { if (dbResults.length > 0) setShowSuggestions(true); }}
                placeholder="Search medications..."
                className="w-full h-full bg-surface-container-high rounded-xl pl-12 pr-4 text-on-surface text-base placeholder:text-outline/60 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:outline-none transition-all duration-200"
              />
              {isSearchingDb && (
                <span className="material-symbols-outlined animate-spin absolute right-4 top-4 text-primary text-[20px]">progress_activity</span>
              )}
            </div>

            {/* Autocomplete Dropdown */}
            {showSuggestions && (dbResults.length > 0 || didYouMean) && (
              <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 bg-surface-container-lowest rounded-2xl shadow-[0_20px_60px_rgba(21,28,39,0.15)] border border-surface-container-high overflow-hidden max-h-[420px] overflow-y-auto">
                <div className="px-4 pt-3 pb-2 flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-widest text-outline">
                    NZ Medicine Database
                  </p>
                  {dbResults.length > 0 && (
                    <span className="text-[10px] text-outline">{dbResults.length} result{dbResults.length !== 1 ? 's' : ''}</span>
                  )}
                </div>
                {/* Did-you-mean banner */}
                {didYouMean && dbResults.length === 0 && (
                  <div className="px-4 py-3 bg-primary-fixed/10 border-b border-surface-container-high/50 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[16px]">auto_fix_high</span>
                    <p className="text-sm text-on-surface">
                      Did you mean{' '}
                      <button
                        className="font-bold text-primary underline"
                        onClick={() => setSearch(didYouMean)}
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
                    onClick={() => setShowSuggestions(false)}
                    className="flex items-center gap-4 px-4 py-3 hover:bg-primary-fixed/20 transition-colors group border-t border-surface-container-high/50"
                  >
                    <div className="w-10 h-10 bg-primary-fixed/30 rounded-full flex items-center justify-center text-primary shrink-0">
                      <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>medication</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-on-surface text-sm group-hover:text-primary transition-colors truncate">
                        {result.display_name}
                      </div>
                      <div className="text-xs text-on-surface-variant truncate mt-0.5">
                        {result.generic_name !== result.display_name?.toLowerCase() && result.generic_name}
                        {result.brand_names?.length > 0 && ` • ${result.brand_names.slice(0, 3).join(", ")}`}
                      </div>
                      {result.meta_description && (
                        <div className="text-[11px] text-outline mt-0.5 line-clamp-1">{result.meta_description}</div>
                      )}
                    </div>
                    <span className="material-symbols-outlined text-outline text-[18px] group-hover:text-primary transition-colors shrink-0">arrow_forward</span>
                  </Link>
                ))}
                <div className="px-4 py-2.5 bg-surface-container-low/50 border-t border-surface-container-high/50">
                  <Link
                    href="/medications/add"
                    onClick={() => setShowSuggestions(false)}
                    className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
                  >
                    <span className="material-symbols-outlined text-[14px]">add</span>
                    Can&apos;t find it? Add manually
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-on-surface-variant mb-4">Active Medications ({filteredMeds.length})</h2>

            {filteredMeds.length === 0 ? (
              <div className="bg-surface-container-low p-8 rounded-3xl flex flex-col items-center justify-center text-center mt-8">
                <div className="rounded-full bg-primary-fixed/20 w-24 h-24 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>vaccines</span>
                </div>
                <h3 className="font-bold text-lg text-on-surface">No medications found</h3>
                <p className="text-sm text-on-surface-variant mt-1">Try another search or add a new one.</p>
                <Link href="/medications/add" className="mt-6 px-6 py-3 rounded-full gradient-primary font-bold text-white active:scale-95 transition-transform">
                  + Add Medication
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMeds.map(med => (
                  <div key={med.id} className="bg-surface-container-lowest p-5 rounded-3xl shadow-[0_10px_40px_rgba(21,28,39,0.04)] relative overflow-hidden group">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-primary-fixed/30 rounded-full flex items-center justify-center text-primary">
                          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>pill</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-on-surface">{med.name}</h3>
                          <p className="text-xs text-on-surface-variant font-medium bg-surface-container py-1 px-3 flex items-center mt-2 rounded-full w-fit">
                            {med.dose} • {med.frequency}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-5">
                      <div className="flex gap-2">
                        {med.time.map((t, i) => (
                          <span key={i} className="bg-surface-container-low px-3 py-1 rounded-full text-xs font-semibold text-on-surface-variant">{t}</span>
                        ))}
                      </div>
                      <Link href={`/medications/${med.slug || med.id}`} className="text-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                        View Info <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Conditions (Sticky Desktop) */}
        <div className="lg:sticky lg:top-24 space-y-6 pt-10 lg:pt-0">
          <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0_10px_40px_rgba(21,28,39,0.04)]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-on-surface-variant">My Conditions</h2>
              <button className="text-primary font-bold text-sm hover:underline">+ Add</button>
            </div>

            <div className="flex flex-wrap gap-3">
              {user.conditions.length > 0 ? user.conditions.map((condition, i) => (
                <span key={i} className="inline-flex items-center px-4 py-2 bg-secondary-fixed text-on-secondary-fixed rounded-full text-sm font-bold shadow-sm">
                  {condition}
                </span>
              )) : (
                <span className="text-sm text-on-surface-variant">No conditions logged.</span>
              )}
            </div>
          </div>

          <div className="bg-primary-fixed/30 p-5 rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 bg-primary-container text-white flex items-center justify-center rounded-2xl">
              <span className="material-symbols-outlined">analytics</span>
            </div>
            <div>
              <p className="font-bold text-on-surface">{medications.length} Active Medications</p>
              <p className="text-xs text-on-surface-variant">Syncing with Health Log</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
