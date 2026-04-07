export function MedicationWizardSuccess({ medicationName }: { medicationName: string }) {
  return (
    <div className="fixed inset-0 bg-surface z-50 flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="w-32 h-32 bg-primary-container rounded-full flex items-center justify-center mb-6 animate-[bounce_1s_ease-in-out]">
        <span
          className="material-symbols-outlined text-[64px] text-primary"
          style={{ fontVariationSettings: "'FILL' 1" }}
          aria-hidden
        >
          eco
        </span>
      </div>
      <h1 className="text-3xl font-extrabold text-on-surface tracking-tight mb-2 text-center">
        {medicationName} added!
      </h1>
      <p className="text-on-surface-variant font-medium text-lg text-center">
        Your tree is growing!
      </p>
    </div>
  );
}
