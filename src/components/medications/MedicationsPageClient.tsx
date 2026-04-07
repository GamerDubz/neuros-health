"use client";

import Link from "next/link";
import { useState } from "react";
import { useAppStore } from "@/hooks/useAppStore";
import { useMedicationSearch } from "@/hooks/useMedicationSearch";
import { MedicationListSection } from "@/components/medications/MedicationListSection";
import { MedicationSearchAutocomplete } from "@/components/medications/MedicationSearchAutocomplete";
import { MedicationSidebar } from "@/components/medications/MedicationSidebar";

export default function MedicationsPageClient() {
  const { medications, user } = useAppStore();
  const [search, setSearch] = useState("");
  const {
    dbResults,
    didYouMean,
    isSearchingDb,
    showSuggestions,
    setShowSuggestions,
  } = useMedicationSearch(search);

  const filteredMedications = medications.filter((medication) =>
    medication.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="animate-fade-in relative max-w-2xl mx-auto lg:max-w-none">
      <div className="grid lg:grid-cols-[3fr_2fr] gap-8 items-start">
        <div className="space-y-6">
          <div className="flex justify-between items-end mb-10">
            <h1 className="text-4xl font-extrabold tracking-tight text-on-surface">
              My Medications
            </h1>
            <Link
              href="/medications/add"
              className="hidden lg:flex px-6 py-3 rounded-full gradient-primary font-bold text-white text-sm active:scale-95 transition-transform shadow-md"
            >
              + Add Medication
            </Link>
          </div>

          <MedicationSearchAutocomplete
            search={search}
            dbResults={dbResults}
            didYouMean={didYouMean}
            isSearchingDb={isSearchingDb}
            showSuggestions={showSuggestions}
            onSearchChange={setSearch}
            onShowSuggestionsChange={setShowSuggestions}
          />

          <MedicationListSection filteredMedications={filteredMedications} />
        </div>

        <MedicationSidebar medicationCount={medications.length} user={user} />
      </div>
    </div>
  );
}
