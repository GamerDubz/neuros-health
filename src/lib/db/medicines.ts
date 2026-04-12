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

// Maps a drug_detail row to the Medicine interface shape so all consumers work unchanged
function mapDrugDetail(row: Record<string, unknown>): Medicine {
  return {
    id: String(row.id),
    slug: String(row.slug || ""),
    display_name: String(row.drug_name || ""),
    generic_name: String(row.drug_name || ""),
    brand_names: Array.isArray(row.brand_names) ? (row.brand_names as string[]) : [],
    category: (row.drug_class as string) || undefined,
    meta_description: (row.vibe_summary as string) || undefined,
    funded_subsidised: Boolean(row.funded_nz),
  };
}

export async function searchMedicines(query: string, limit = 10): Promise<Medicine[]> {
  if (!query || query.length < 1) return [];

  // Primary: search drug_name
  const { data: nameData } = await supabase
    .from("drug_detail")
    .select("id, slug, drug_name, brand_names, drug_class, vibe_summary, funded_nz")
    .ilike("drug_name", `%${query}%`)
    .limit(limit);

  const results = (nameData || []).map(mapDrugDetail);

  // If we have fewer results than the limit, also search by brand name (exact array element contains)
  if (results.length < limit) {
    const { data: brandData } = await supabase
      .from("drug_detail")
      .select("id, slug, drug_name, brand_names, drug_class, vibe_summary, funded_nz")
      .ilike("drug_name", `%${query}%`)
      .limit(limit - results.length);

    // Merge without duplicates (slug is unique)
    const seen = new Set(results.map((r) => r.slug));
    for (const row of (brandData || []).map(mapDrugDetail)) {
      if (!seen.has(row.slug)) {
        results.push(row);
        seen.add(row.slug);
      }
    }
  }

  return results;
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
