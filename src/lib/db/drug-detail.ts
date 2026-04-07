// Queries for the structured drug_detail table and exported detail types.

import { createClient } from "@/lib/supabase/client";
export { synthesizeDrugDetail } from "@/lib/db/drug-detail-synthesizer";

const supabase = createClient();

export type Big3Item = { icon: string; label: string };
export type HowToTakeItem = { icon: string; label: string; detail: string };
export type SideEffectItem = { effect: string; note: string };
export type SideEffects = {
  green: SideEffectItem[];
  yellow: SideEffectItem[];
  red: SideEffectItem[];
};
export type Interaction = {
  interactant: string;
  severity: "low" | "moderate" | "high";
  note: string;
};
export type RedZone = {
  overdose_signs: string[];
  action: string;
  phone_111: boolean;
  phone_poisons: string;
};
export type TeachBackQuiz = {
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
};

export type DrugDetail = {
  id: string;
  medicines_id: number | null;
  slug: string;
  drug_name: string;
  brand_names: string[];
  drug_class: string | null;
  vibe_summary: string | null;
  big3: Big3Item[];
  how_to_take: HowToTakeItem[];
  side_effects: SideEffects;
  interactions: Interaction[];
  red_zone: RedZone | null;
  teach_back_quiz: TeachBackQuiz | null;
  funded_nz: boolean;
  funded_note: string | null;
  healthify_url: string | null;
  medsafe_cmi_url: string | null;
  last_reviewed_date: string | null;
  created_at: string;
  updated_at: string;
};

function sanitizeStoredDrugClass(drugClass: string | null): string | null {
  if (!drugClass) return null;

  const cleanedDrugClass = drugClass
    .replace(/^ATC\s*code\s*/i, "")
    .replace(/[A-Z]\d{2}[A-Z]{2}\d{2}/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();

  if (!cleanedDrugClass) return null;
  if (cleanedDrugClass.length <= 60) return cleanedDrugClass;

  const commaIndex = cleanedDrugClass.indexOf(",");
  return commaIndex > 5 && commaIndex < 60
    ? cleanedDrugClass.slice(0, commaIndex).trim()
    : cleanedDrugClass.slice(0, 60).trim();
}

export async function getDrugDetailBySlug(slug: string): Promise<DrugDetail | null> {
  const { data, error } = await supabase.from("drug_detail").select("*").eq("slug", slug).maybeSingle();

  if (error) {
    console.error("getDrugDetailBySlug error:", error);
    return null;
  }

  if (!data) return null;

  const cleanedDrugDetail = { ...data } as DrugDetail;
  cleanedDrugDetail.drug_class = sanitizeStoredDrugClass(cleanedDrugDetail.drug_class);

  return cleanedDrugDetail;
}

export async function searchDrugDetail(query: string, limit = 10) {
  if (!query) return [];

  const { data, error } = await supabase
    .from("drug_detail")
    .select("id, slug, drug_name, brand_names, drug_class, vibe_summary, funded_nz")
    .ilike("drug_name", `%${query}%`)
    .limit(limit);

  if (error) {
    console.error("searchDrugDetail error:", error);
    return [];
  }

  return data || [];
}

export async function getAllDrugDetailSlugs() {
  const { data } = await supabase.from("drug_detail").select("slug, drug_name").order("drug_name");
  return data || [];
}

export async function getFundedMedicines(limit = 100) {
  const { data } = await supabase
    .from("drug_detail")
    .select("slug, drug_name, brand_names, drug_class, funded_note")
    .eq("funded_nz", true)
    .limit(limit);

  return data || [];
}
