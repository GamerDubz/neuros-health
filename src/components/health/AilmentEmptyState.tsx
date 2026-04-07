export function AilmentEmptyState() {
  return (
    <div className="bg-surface-container-low p-8 rounded-3xl text-center mt-4">
      <span
        className="material-symbols-outlined text-[48px] text-outline/50 mb-4"
        aria-hidden
      >
        search_off
      </span>
      <h3 className="font-bold text-lg text-on-surface">No ailments found</h3>
      <p className="text-sm text-on-surface-variant mt-1">
        Try searching for a different symptom or condition.
      </p>
    </div>
  );
}
