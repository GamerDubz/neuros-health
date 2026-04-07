export function AilmentLoadingState() {
  return (
    <div className="py-20 flex flex-col items-center justify-center gap-4">
      <span
        className="material-symbols-outlined animate-spin text-primary text-4xl"
        aria-hidden
      >
        progress_activity
      </span>
      <p className="text-on-surface-variant font-bold">
        Accessing NZ Health Database...
      </p>
    </div>
  );
}
