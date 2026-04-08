import type { DrugDetail } from "@/lib/db/drug-detail";
import { Accordion } from "@/components/drug-detail/Accordion";

// Premium inline SVG icons for each info row
function IconPregnancy() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0 text-primary">
      <circle cx="12" cy="4.5" r="2.5" fill="currentColor" opacity="0.8"/>
      <path d="M10 9c0-1.1.9-2 2-2s2 .9 2 2v4.5c1.5.5 2.5 2 2.5 3.5 0 2.2-1.8 4-4 4H12c-2.2 0-4-1.8-4-4 0-1.5 1-3 2.5-3.5V9z" fill="currentColor"/>
    </svg>
  );
}

function IconStorage() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0 text-primary">
      <rect x="3" y="6" width="18" height="4" rx="1.5" fill="currentColor" opacity="0.9"/>
      <rect x="3" y="12" width="18" height="4" rx="1.5" fill="currentColor" opacity="0.6"/>
      <rect x="3" y="18" width="18" height="2.5" rx="1.25" fill="currentColor" opacity="0.3"/>
      <circle cx="6" cy="8" r="1" fill="white"/>
      <circle cx="6" cy="14" r="1" fill="white"/>
    </svg>
  );
}

function IconContraindications() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0 text-primary">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
      <line x1="7" y1="7" x2="17" y2="17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

function IconLink() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0 text-primary">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

type Props = { drug: DrugDetail };

export function DrugInfoAccordion({ drug }: Props) {
  const hasPregnancy = Boolean(drug.pregnancy_note?.trim());
  const hasStorage = Boolean(drug.storage_instructions?.trim());
  const hasContra = Boolean(drug.contraindications?.trim());
  const hasMedsafe = Boolean(drug.medsafe_cmi_url?.trim());
  const hasHealthify = Boolean(drug.healthify_url?.trim());
  const hasFundedNote = drug.funded_nz && Boolean(drug.funded_note?.trim());

  // Don't render accordion if none of these fields have content
  if (!hasPregnancy && !hasStorage && !hasContra && !hasMedsafe && !hasHealthify && !hasFundedNote) {
    return null;
  }

  return (
    <Accordion icon="info" title="More Information">
      <div className="px-5 pb-5 space-y-5 pt-2">

        {hasFundedNote && (
          <InfoRow icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0 text-primary">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="currentColor" opacity="0.2"/>
              <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
            </svg>
          } label="PHARMAC Funding" text={drug.funded_note!} />
        )}

        {hasPregnancy && (
          <InfoRow icon={<IconPregnancy />} label="Pregnancy & Breastfeeding" text={drug.pregnancy_note!} />
        )}

        {hasStorage && (
          <InfoRow icon={<IconStorage />} label="Storage" text={drug.storage_instructions!} />
        )}

        {hasContra && (
          <InfoRow icon={<IconContraindications />} label="Who Should Not Take This" text={drug.contraindications!} />
        )}

        {(hasMedsafe || hasHealthify) && (
          <div className="pt-1 border-t border-surface-container-low">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
              Official Sources
            </p>
            <div className="flex flex-col gap-2">
              {hasMedsafe && (
                <a
                  href={drug.medsafe_cmi_url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary font-semibold hover:underline"
                >
                  <IconLink />
                  Download Medsafe CMI PDF
                </a>
              )}
              {hasHealthify && (
                <a
                  href={drug.healthify_url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary font-semibold hover:underline"
                >
                  <IconLink />
                  View on Healthify He Puna Waiora
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </Accordion>
  );
}

function InfoRow({
  icon,
  label,
  text,
}: {
  icon: React.ReactNode;
  label: string;
  text: string;
}) {
  return (
    <div className="flex items-start gap-3">
      {icon}
      <div className="min-w-0">
        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">{label}</p>
        <p className="text-sm text-on-surface leading-relaxed whitespace-pre-line">{text}</p>
      </div>
    </div>
  );
}
