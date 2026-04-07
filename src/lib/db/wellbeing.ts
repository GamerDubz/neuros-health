// NZ wellbeing queries used by search and educational content flows.

import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export interface WellbeingTopic {
  id: string;
  slug: string;
  topic_name: string;
  meta_description?: string;
  overview?: string;
}

export async function searchWellbeing(query: string, limit = 10): Promise<WellbeingTopic[]> {
  if (!query || query.length < 1) return [];

  const { data } = await supabase
    .from("wellbeing_topics")
    .select("id, slug, topic_name, meta_description, overview")
    .ilike("topic_name", `%${query}%`)
    .limit(limit);

  return data || [];
}

export async function getWellbeingBySlug(slug: string) {
  const { data } = await supabase.from("wellbeing_topics").select("*").eq("slug", slug).single();
  return data || null;
}

export async function getWellbeingByKeyword(keyword: string, limit = 10) {
  const { data } = await supabase
    .from("wellbeing_topics")
    .select("id, slug, topic_name, meta_description, overview")
    .or(`topic_name.ilike.%${keyword}%,main_content.ilike.%${keyword}%`)
    .limit(limit);

  return data || [];
}
