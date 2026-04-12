import { createClient } from "@supabase/supabase-js";
import WellbeingDetailPage from "@/components/wellbeing/WellbeingDetailPage";

export async function generateStaticParams() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return [{ slug: "mindfulness" }, { slug: "sleep" }, { slug: "exercise" }];
  }

  const supabase = createClient(url, anonKey);
  const slugs: string[] = [];

  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase
      .from("wellbeing_topics")
      .select("slug")
      .range(from, from + 999);
    if (error || !data || data.length === 0) break;
    for (const row of data) {
      if (row.slug) slugs.push(row.slug);
    }
    if (data.length < 1000) break;
  }

  return slugs.map((slug) => ({ slug }));
}

export default async function WellbeingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <WellbeingDetailPage slug={slug} />;
}
