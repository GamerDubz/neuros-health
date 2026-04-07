// NZ medicine queries used across medication search and detail flows.

import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export interface Medicine {
  id: string;
  slug: string;
  display_name: string;
  generic_name: string;
  brand_names: string[];
  category?: string;
  meta_description?: string;
  forms_available?: string[];
  funded_subsidised?: boolean;
  source_healthify?: string;
  source_medsafe?: string;
}

export async function searchMedicines(query: string, limit = 10): Promise<Medicine[]> {
  if (!query || query.length < 1) return [];

  const { data, error } = await supabase.rpc("search_medicines", { query, max_results: limit });

  if (error) {
    console.error("Medicine search error:", error);

    const { data: fallback } = await supabase
      .from("medicines")
      .select("id, slug, display_name, generic_name, brand_names, category, meta_description")
      .or(`display_name.ilike.%${query}%,generic_name.ilike.%${query}%`)
      .limit(limit);

    return fallback || [];
  }

  return data || [];
}

export async function getMedicineBySlug(slug: string): Promise<Medicine | null> {
  const { data, error } = await supabase.from("medicines").select("*").eq("slug", slug).single();

  if (error) {
    console.error("Get medicine error:", error);
    return null;
  }

  return data;
}

export async function getMedicineByName(name: string) {
  const { data, error } = await supabase
    .from("medicines")
    .select("*")
    .eq("generic_name", name.toLowerCase().trim())
    .single();

  if (error) {
    const { data: fallback } = await supabase
      .from("medicines")
      .select("*")
      .ilike("display_name", name.trim())
      .single();

    return fallback || null;
  }

  return data;
}

export async function getMedicinesBySlugs(slugs: string[]): Promise<Medicine[]> {
  if (!slugs.length) return [];

  const { data, error } = await supabase
    .from("medicines")
    .select("id, slug, display_name, generic_name, brand_names, category, meta_description, forms_available, funded_subsidised, source_healthify, source_medsafe")
    .in("slug", slugs);

  if (error) {
    console.error("Get medicines error:", error);
    return [];
  }

  return data || [];
}

export async function getMedicinesByCategory(category: string, limit = 20) {
  const { data } = await supabase
    .from("medicines")
    .select("id, slug, display_name, generic_name, brand_names, category, meta_description")
    .ilike("category", `%${category}%`)
    .limit(limit);

  return data || [];
}

export async function getMedicineSafety(slug: string) {
  const { data } = await supabase
    .from("medicines_safety")
    .select("*")
    .eq("slug", slug)
    .single();

  return data || null;
}

export async function getAllMedicineSlugs() {
  const { data } = await supabase.from("medicines").select("slug");
  return data || [];
}
