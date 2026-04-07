// NZ condition queries used by health search and symptom guidance flows.

import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export interface HealthCondition {
  id: string;
  slug: string;
  condition_name: string;
  meta_description?: string;
  overview?: string;
  self_care?: string;
  emergency?: string;
  search_vector?: string;
}

export async function searchConditions(query: string, limit = 10): Promise<HealthCondition[]> {
  if (!query || query.length < 1) return [];

  const { data } = await supabase
    .from("health_conditions")
    .select("*")
    .textSearch("search_vector", query, { type: "plain", config: "english" })
    .limit(limit);

  if (!data || data.length === 0) {
    const { data: fallback } = await supabase
      .from("health_conditions")
      .select("*")
      .ilike("condition_name", `%${query}%`)
      .limit(limit);

    return fallback || [];
  }

  return data;
}

export async function getConditionBySlug(slug: string) {
  const { data } = await supabase.from("health_conditions").select("*").eq("slug", slug).single();
  return data || null;
}

export async function getConditionsList(limit = 200) {
  const { data } = await supabase
    .from("health_conditions")
    .select("id, slug, condition_name, meta_description")
    .not("overview", "is", null)
    .order("condition_name")
    .limit(limit);

  return data || [];
}
