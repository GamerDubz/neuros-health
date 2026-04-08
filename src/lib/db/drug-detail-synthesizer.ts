// Fallback builder for a structured DrugDetail shape from a raw medicines row.

import type { DrugDetail } from "@/lib/db/drug-detail";

function firstSentences(text: string, count: number): string {
  if (!text) return "";

  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  return sentences.slice(0, count).join(" ").trim();
}

function cleanText(text: string | null | undefined): string {
  if (!text) return "";

  return text
    .replace(/\(external link\)/gi, "")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/Read more about[^.]+\./gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function hasAny(text: string, keywords: string[]): boolean {
  const lowerText = text.toLowerCase();
  return keywords.some((keyword) => lowerText.includes(keyword));
}

function sanitizeDrugClass(drugClass: string | null | undefined): string | null {
  if (!drugClass) return null;

  const cleanedDrugClass = drugClass
    .replace(/^ATC\s*code\s*/i, "")
    .replace(/[A-Z]\d{2}[A-Z]{2}\d{2}/g, "")
    .replace(/CAS\s*Number[:\s]*[\d\-()a-z\s]*/gi, "")
    .trim();

  if (!cleanedDrugClass) return null;
  if (cleanedDrugClass.length <= 60) return cleanedDrugClass;

  const commaIndex = cleanedDrugClass.indexOf(",");
  return commaIndex > 5 && commaIndex < 60
    ? cleanedDrugClass.slice(0, commaIndex).trim()
    : cleanedDrugClass.slice(0, 60).trim();
}

export function synthesizeDrugDetail(medicine: any): DrugDetail {
  const dosage = cleanText(medicine?.dosage_how_to_take || "").toLowerCase();
  const whatItIs = cleanText(medicine?.what_it_is || medicine?.meta_description || "");
  const combinedText = `${dosage} ${whatItIs.toLowerCase()}`;
  const big3: DrugDetail["big3"] = [];

  if (hasAny(combinedText, ["morning", "breakfast"])) big3.push({ icon: "sun", label: "Morning" });
  else if (hasAny(combinedText, ["night", "bedtime", "evening"])) big3.push({ icon: "moon", label: "Night-time" });
  else if (hasAny(combinedText, ["twice", "2 times", "two times"])) big3.push({ icon: "clock", label: "Twice Daily" });
  else if (hasAny(combinedText, ["once", "daily"])) big3.push({ icon: "clock", label: "Once Daily" });
  else big3.push({ icon: "clock", label: "As Directed" });

  if (hasAny(combinedText, ["empty stomach", "before meals", "before food"])) big3.push({ icon: "stomach", label: "Empty Stomach" });
  else if (hasAny(combinedText, ["with food", "with meals", "after food"])) big3.push({ icon: "food", label: "With Food" });
  else big3.push({ icon: "pill", label: "Follow Label" });

  if (hasAny(combinedText, ["glass of water", "plenty of water", "full glass"])) big3.push({ icon: "water", label: "Full Glass of Water" });
  else if (hasAny(combinedText, ["swallow whole", "do not crush"])) big3.push({ icon: "pill", label: "Swallow Whole" });
  else big3.push({ icon: "water", label: "With Water" });

  const howToTake: DrugDetail["how_to_take"] = [];
  const dosageInstructions = cleanText(medicine?.dosage_how_to_take || "");
  if (dosageInstructions) {
    howToTake.push({ icon: "pill", label: "Instructions", detail: firstSentences(dosageInstructions, 3) });
  } else {
    howToTake.push({
      icon: "pill",
      label: "Instructions",
      detail: "Take as directed by your doctor or pharmacist.",
    });
  }

  const missedDose = cleanText(medicine?.missed_dose || "");
  if (missedDose) {
    howToTake.push({ icon: "warning", label: "Missed Dose", detail: firstSentences(missedDose, 2) });
  }

  const vibeSummary = whatItIs
    ? firstSentences(whatItIs, 2)
    : "This medicine is prescribed for specific conditions. Follow your doctor's instructions.";

  const seriousEffects = cleanText(medicine?.serious_side_effects || "");
  const commonEffects = cleanText(
    medicine?.common_side_effects || medicine?.side_effects_combined || medicine?.side_effects || ""
  );

  const sideEffects: DrugDetail["side_effects"] = { green: [], yellow: [], red: [] };
  if (commonEffects) {
    sideEffects.green.push({
      effect: "Common side effects",
      note: firstSentences(commonEffects, 2) || "Usually mild and settle with time.",
    });
  }

  // Only add serious/red effects if we actually have text for them
  if (seriousEffects) {
    sideEffects.red.push({
      effect: "Serious reactions",
      note: firstSentences(seriousEffects, 2),
    });
  }
  // No generic fallback — if there's no data, leave red empty

  // Prefer structured JSONB red_zone if the editor filled it in; fall back to synthesizing from overdose text
  let redZone: DrugDetail["red_zone"] = null;
  if (medicine?.red_zone && typeof medicine.red_zone === "object") {
    const rz = medicine.red_zone;
    const hasSigns = Array.isArray(rz.overdose_signs) && rz.overdose_signs.length > 0;
    const hasAction = Boolean(rz.action?.trim());
    const hasPhone = Boolean(rz.phone_111) || Boolean(rz.phone_poisons?.trim());
    if (hasSigns || hasAction || hasPhone) {
      redZone = {
        overdose_signs: rz.overdose_signs || [],
        action: rz.action || "",
        phone_111: Boolean(rz.phone_111),
        phone_poisons: rz.phone_poisons || "",
      };
    }
  } else {
    const overdose = cleanText(medicine?.overdose || "");
    if (overdose) {
      redZone = {
        overdose_signs: [firstSentences(overdose, 1)],
        action: "Call 111 or the NZ Poisons Centre: 0800 764 766 immediately.",
        phone_111: true,
        phone_poisons: "0800 764 766",
      };
    }
  }

  const interactions: DrugDetail["interactions"] = [];
  const drugInteractions = cleanText(medicine?.drug_interactions || "");
  const foodInteractions = cleanText(medicine?.food_alcohol_interactions || "");

  if (drugInteractions) {
    interactions.push({
      interactant: "Other medicines",
      severity: "moderate",
      note: firstSentences(drugInteractions, 1),
    });
  }

  if (foodInteractions.toLowerCase().includes("alcohol")) {
    interactions.push({
      interactant: "Alcohol",
      severity: "moderate",
      note: firstSentences(foodInteractions, 1),
    });
  }

  return {
    id: `synthetic-${medicine?.slug || medicine?.id || "unknown"}`,
    medicines_id: medicine?.id || null,
    slug: medicine?.slug || "",
    drug_name: medicine?.display_name || medicine?.generic_name || "Medicine",
    brand_names: Array.isArray(medicine?.brand_names) ? medicine.brand_names.slice(0, 6) : [],
    drug_class: sanitizeDrugClass(medicine?.therapeutic_group || medicine?.category || null),
    vibe_summary: vibeSummary,
    big3,
    how_to_take: howToTake,
    side_effects: sideEffects,
    interactions,
    red_zone: redZone,
    teach_back_quiz: medicine?.teach_back_quiz ?? null,
    funded_nz: Boolean(medicine?.funded_subsidised),
    funded_note: null,
    storage_instructions: cleanText(medicine?.storage || "") || null,
    pregnancy_note: cleanText(medicine?.pregnancy_breastfeeding || "") || null,
    contraindications: cleanText(medicine?.who_should_not_take || "") || null,
    healthify_url: medicine?.healthify_url || null,
    medsafe_cmi_url: medicine?.cmi_pdf_url || null,
    last_reviewed_date: medicine?.last_reviewed || null,
    created_at: "",
    updated_at: "",
  };
}
