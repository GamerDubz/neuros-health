interface MedicationSearchStepProps {
  searchQuery: string;
  results: any[];
  isSearching: boolean;
  onSearchQueryChange: (value: string) => void;
  onSelectDrug: (result: any) => void;
  onManualAdd: () => void;
}

export function MedicationSearchStep({
  searchQuery,
  results,
  isSearching,
  onSearchQueryChange,
  onSelectDrug,
  onManualAdd,
}: MedicationSearchStepProps) {
  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-extrabold tracking-tight text-on-surface mb-6 md:block hidden">
        Find Your Medication
      </h2>
      <div className="relative mb-6">
        <span className="material-symbols-outlined absolute left-4 top-4 text-outline/80 text-[28px]">
          search
        </span>
        <input
          type="text"
          autoFocus
          placeholder="Type a medication name..."
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          className="w-full h-16 bg-surface-container-high rounded-2xl pl-14 pr-4 text-lg font-medium text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary transition-all placeholder:text-outline/60"
        />
      </div>

      {searchQuery && (
        <div className="space-y-2 mb-6">
          {isSearching ? (
            <div className="p-8 flex justify-center">
              <span className="material-symbols-outlined animate-spin text-primary">
                progress_activity
              </span>
            </div>
          ) : (
            <>
              {results.map((result) => (
                <button
                  key={result.id || result.slug}
                  onClick={() => onSelectDrug(result)}
                  className="w-full bg-surface-container-lowest p-4 rounded-2xl border border-transparent flex items-center justify-between active:bg-surface-container hover:border-primary/20 transition-all text-left group"
                >
                  <div>
                    <div className="font-semibold text-on-surface group-hover:text-primary transition-colors">
                      {result.display_name}
                    </div>
                    <div className="text-sm text-on-surface-variant font-medium mt-0.5">
                      {result.generic_name}{" "}
                      {result.brand_names?.length > 0 && `• ${result.brand_names.join(", ")}`}
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">
                    arrow_forward_ios
                  </span>
                </button>
              ))}
              {results.length === 0 && searchQuery.length >= 1 && (
                <div className="p-4 text-center text-on-surface-variant text-sm font-medium">
                  No matches found. Try a different spelling or add manually below.
                </div>
              )}
            </>
          )}
        </div>
      )}

      <div className="mt-4">
        <p className="text-sm text-on-surface-variant">
          Can't find it?{" "}
          <button onClick={onManualAdd} className="text-primary font-bold hover:underline">
            Add manually
          </button>
        </p>
      </div>
    </div>
  );
}
