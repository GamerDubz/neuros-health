export function DrugHeroBanner({
  name,
  brandNames,
  drugClass,
  fundedNz,
  fundedNote,
}: {
  name: string;
  brandNames: string[];
  drugClass: string | null;
  fundedNz: boolean;
  fundedNote: string | null;
}) {
  return (
    <div className="bg-gradient-to-br from-[#00685d] to-[#008376] px-6 pt-8 pb-6 rounded-[2rem]">
      {drugClass && (
        <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
          {drugClass}
        </span>
      )}
      <h1 className="text-3xl font-extrabold text-white tracking-tight">{name}</h1>
      {brandNames.length > 0 && (
        <p className="text-white/70 text-sm mt-1">Also known as: {brandNames.join(", ")}</p>
      )}
      {fundedNz && (
        <div className="mt-3 inline-flex items-center gap-2 bg-[#ffd87c] text-[#765a05] px-4 py-1.5 rounded-full text-sm font-bold">
          <span className="material-symbols-outlined text-[18px]" aria-hidden>
            verified
          </span>
          Funded by PHARMAC in NZ
          {fundedNote && <span className="font-normal"> · {fundedNote}</span>}
        </div>
      )}
    </div>
  );
}
