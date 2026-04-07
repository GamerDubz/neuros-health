interface HealthLibrarySearchFieldProps {
  query: string;
  placeholder: string;
  onQueryChange: (value: string) => void;
  className?: string;
  inputClassName?: string;
}

export function HealthLibrarySearchField({
  query,
  placeholder,
  onQueryChange,
  className = "",
  inputClassName = "",
}: HealthLibrarySearchFieldProps) {
  return (
    <div className={`relative ${className}`}>
      <span
        className="material-symbols-outlined absolute left-4 top-4 text-outline"
        aria-hidden
      >
        search
      </span>
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        className={`w-full h-14 bg-surface-container-high pl-12 pr-4 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all ${inputClassName}`}
      />
    </div>
  );
}
