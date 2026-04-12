// NZ wellbeing queries used by search and educational content flows.

import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

// ---------- Session-level cache ----------
// Avoids re-fetching Supabase on every page navigation within a session.
// Each value is tiny (~1 KB), so RAM impact is negligible.

let _dailyTipCache: WellbeingTopic | null = null;
let _dailyTipDate = "";
const _slugCache = new Map<string, WellbeingTopic | null>();

export interface WellbeingTopic {
  id: number;
  slug: string;
  topic_name: string;
  meta_description?: string;
  overview?: string;
  key_messages?: string;
  main_content?: string;
  tips_advice?: string;
  resources_support?: string;
  healthify_url?: string;
  last_updated?: string;
}

// Slugs/keywords to exclude from daily tips (inappropriate or admin content)
const EXCLUDED_KEYWORDS = [
  "sex", "sexual", "sexually", "contraception", "condom", "sti", "std",
  "genital", "erectile", "penis", "vagina", "vulva", "pornograph",
  "radiology", "allevia", "locations", "overview", "topics",
];

function isExcluded(topic: { slug: string; topic_name: string }): boolean {
  const haystack = `${topic.slug} ${topic.topic_name}`.toLowerCase();
  return EXCLUDED_KEYWORDS.some((kw) => haystack.includes(kw));
}

// Seasonal keywords to boost by month (NZ seasons — summer = Dec/Jan/Feb)
const SEASONAL_BOOSTS: Record<number, string[]> = {
  1:  ["summer", "heat", "sun", "outdoor", "holiday", "alcohol", "water"],
  2:  ["summer", "sun", "skin", "uv", "cancer", "screen", "heat"],
  3:  ["autumn", "flu", "immune", "allerg", "hay fever"],
  4:  ["flu", "immune", "cold", "winter", "mental", "mood"],
  5:  ["winter", "flu", "cold", "immune", "mental", "depression", "mood"],
  6:  ["winter", "flu", "cold", "mental", "sleep", "warm"],
  7:  ["winter", "flu", "cold", "mental", "sleep", "wellbeing"],
  8:  ["spring", "exercise", "active", "outdoor", "allerg", "hay fever"],
  9:  ["spring", "active", "outdoor", "exercise", "screen", "walk"],
  10: ["active", "exercise", "mental", "stress", "walk"],
  11: ["stress", "mental", "budget", "finance", "family", "christmas"],
  12: ["christmas", "holiday", "festive", "budget", "alcohol", "family", "stress"],
};

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date.getTime() - start.getTime()) / 86_400_000);
}

export async function getDailyWellbeingTip(): Promise<WellbeingTopic | null> {
  const today = new Date().toISOString().split("T")[0];
  if (_dailyTipCache && _dailyTipDate === today) return _dailyTipCache;

  const { data } = await supabase
    .from("wellbeing_topics")
    .select("id, slug, topic_name, meta_description")
    .not("meta_description", "is", null)
    .order("id");

  if (!data?.length) return null;

  // Remove excluded / irrelevant topics
  const clean = data.filter((t) => !isExcluded(t));
  if (!clean.length) return null;

  const month = new Date().getMonth() + 1;
  const boostKeywords = SEASONAL_BOOSTS[month] || [];

  // Seasonal topics appear 4× more in the pool → shown ~4× as often in their season
  const pool: typeof clean = [];
  for (const topic of clean) {
    const haystack = `${topic.slug} ${topic.topic_name}`.toLowerCase();
    const isSeasonal = boostKeywords.some((kw) => haystack.includes(kw));
    pool.push(topic);
    if (isSeasonal) pool.push(topic, topic, topic);
  }

  const result = pool[getDayOfYear(new Date()) % pool.length] as WellbeingTopic;
  _dailyTipCache = result;
  _dailyTipDate = today;
  return result;
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

export async function getWellbeingBySlug(slug: string): Promise<WellbeingTopic | null> {
  if (_slugCache.has(slug)) return _slugCache.get(slug)!;
  const { data } = await supabase.from("wellbeing_topics").select("*").eq("slug", slug).single();
  const result = (data as WellbeingTopic) || null;
  _slugCache.set(slug, result);
  return result;
}

export async function getWellbeingByKeyword(keyword: string, limit = 10) {
  const { data } = await supabase
    .from("wellbeing_topics")
    .select("id, slug, topic_name, meta_description, overview")
    .or(`topic_name.ilike.%${keyword}%,main_content.ilike.%${keyword}%`)
    .limit(limit);

  return data || [];
}
