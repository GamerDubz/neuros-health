export function VibeSummary({ text }: { text: string | null }) {
  if (!text) return null;

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-[0_10px_40px_rgba(21,28,39,0.04)]">
      <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
        What this medication does
      </p>
      <p className="text-on-surface text-base leading-relaxed">{text}</p>
    </div>
  );
}
