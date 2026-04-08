"use client";

import { useState } from "react";
import type { DrugDetail } from "@/lib/db/drug-detail";
import { DrugHeroBanner } from "@/components/drug-detail/DrugHeroBanner";
import { BigThreeRow } from "@/components/drug-detail/BigThreeRow";
import { VibeSummary } from "@/components/drug-detail/VibeSummary";
import { HowToTakeAccordion } from "@/components/drug-detail/HowToTakeAccordion";
import { SideEffectsAccordion } from "@/components/drug-detail/SideEffectsAccordion";
import { InteractionsAccordion } from "@/components/drug-detail/InteractionsAccordion";
import { DrugInfoAccordion } from "@/components/drug-detail/DrugInfoAccordion";
import { RedZoneBox } from "@/components/drug-detail/RedZoneBox";
import { TeachBackQuizModal } from "@/components/drug-detail/TeachBackQuizModal";

export default function NeurosHealthCard({ drug }: { drug: DrugDetail }) {
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizShown, setQuizShown] = useState(false);

  function handleHowToTakeCollapse() {
    if (drug.teach_back_quiz && !quizShown) {
      setShowQuiz(true);
      setQuizShown(true);
    }
  }

  return (
    <div className="space-y-4">
      <DrugHeroBanner
        name={drug.drug_name}
        brandNames={drug.brand_names || []}
        drugClass={drug.drug_class}
        fundedNz={drug.funded_nz}
        fundedNote={drug.funded_note}
      />

      {(drug.big3 || []).length > 0 && <BigThreeRow items={drug.big3} />}

      {drug.vibe_summary?.trim() && <VibeSummary text={drug.vibe_summary} />}

      <div className="space-y-3">
        <HowToTakeAccordion items={drug.how_to_take || []} onCollapse={handleHowToTakeCollapse} />
        <SideEffectsAccordion sideEffects={drug.side_effects} />
        <InteractionsAccordion interactions={drug.interactions || []} />
        <DrugInfoAccordion drug={drug} />
      </div>

      <RedZoneBox redZone={drug.red_zone} />

      {drug.last_reviewed_date && (
        <p className="text-xs text-on-surface-variant text-center pt-2 pb-4">
          Reviewed {drug.last_reviewed_date} · Information from Healthify He Puna Waiora &amp; Medsafe NZ
        </p>
      )}

      {showQuiz && drug.teach_back_quiz && (
        <TeachBackQuizModal quiz={drug.teach_back_quiz} onClose={() => setShowQuiz(false)} />
      )}
    </div>
  );
}
