import { MedicationDetailClient } from "@/components/drug-detail/MedicationDetailClient";
import { createClient } from "@supabase/supabase-js";

// With output: 'export', every slug must be pre-rendered at build time,
// otherwise GitHub Pages returns 404 for any slug that wasn't generated.
// We fetch every medicine + drug_detail slug from Supabase here so every
// medicine has a static HTML file.
export async function generateStaticParams() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If env vars aren't available at build time, fall back to a few common
  // slugs so the build doesn't break locally. CI has the secrets configured.
  if (!url || !anonKey) {
    return [
      { id: "levothyroxine" },
      { id: "lisinopril" },
      { id: "metformin" },
      { id: "paracetamol" },
    ];
  }

  const supabase = createClient(url, anonKey);
  const slugs = new Set<string>();

  // Paginate medicines table (Supabase default limit is 1000)
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase
      .from("medicines")
      .select("slug")
      .range(from, from + 999);
    if (error || !data || data.length === 0) break;
    for (const row of data) {
      if (row.slug) slugs.add(row.slug);
    }
    if (data.length < 1000) break;
  }

  // Also include any drug_detail slugs (in case they differ)
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase
      .from("drug_detail")
      .select("slug")
      .range(from, from + 999);
    if (error || !data || data.length === 0) break;
    for (const row of data) {
      if (row.slug) slugs.add(row.slug);
    }
    if (data.length < 1000) break;
  }

  return Array.from(slugs).map((id) => ({ id }));
}

export default async function MedicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Pass just the ID — the client component will fetch NZ data itself
  return <MedicationDetailClient initialId={id} />;
}
