"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDailyWellbeingTip, type WellbeingTopic } from "@/lib/db/wellbeing";

// Maps topic keywords → visual style for the card
const STYLES: {
  keywords: string[];
  icon: string;
  from: string;
  to: string;
}[] = [
  { keywords: ["mindful", "meditat", "breath", "stress", "anxiety", "mental", "wellbeing", "calm", "mood"], icon: "self_improvement", from: "#0d7377", to: "#14a085" },
  { keywords: ["exercise", "active", "fitness", "walk", "run", "sport", "physical", "movement"], icon: "fitness_center", from: "#1a6b3c", to: "#27a85f" },
  { keywords: ["sleep", "rest", "fatigue", "tired", "insomnia"], icon: "bedtime", from: "#1a237e", to: "#3949ab" },
  { keywords: ["eat", "food", "diet", "nutrit", "fruit", "vegetable", "weight", "sugar"], icon: "restaurant", from: "#e65100", to: "#f57c00" },
  { keywords: ["alcohol", "drink", "hydrat", "water"], icon: "local_bar", from: "#1565c0", to: "#1976d2" },
  { keywords: ["family", "children", "parent", "baby", "kids", "child", "whanau", "whānau"], icon: "family_restroom", from: "#880e4f", to: "#c2185b" },
  { keywords: ["heart", "blood", "pressure", "cholesterol", "cardiovascular"], icon: "favorite", from: "#b71c1c", to: "#e53935" },
  { keywords: ["cancer", "screen", "check", "skin", "uv", "sun"], icon: "health_and_safety", from: "#4a148c", to: "#7b1fa2" },
  { keywords: ["christmas", "holiday", "festive", "budget", "finance"], icon: "celebration", from: "#b71c1c", to: "#2e7d32" },
  { keywords: ["summer", "sun", "heat", "outdoor", "beach"], icon: "wb_sunny", from: "#e65100", to: "#fbc02d" },
  { keywords: ["winter", "flu", "cold", "immune", "infection"], icon: "ac_unit", from: "#01579b", to: "#0277bd" },
  { keywords: ["anger", "emotion", "grief", "loss", "depression"], icon: "psychology", from: "#311b92", to: "#512da8" },
  { keywords: ["addiction", "smoking", "quit", "tobacco"], icon: "smoke_free", from: "#37474f", to: "#546e7a" },
  { keywords: ["age", "elder", "older", "senior"], icon: "elderly", from: "#4e342e", to: "#6d4c41" },
  { keywords: ["allerg", "hay fever", "asthma"], icon: "air", from: "#00695c", to: "#00897b" },
];

function getStyle(topic: WellbeingTopic) {
  const haystack = `${topic.slug} ${topic.topic_name}`.toLowerCase();
  for (const s of STYLES) {
    if (s.keywords.some((kw) => haystack.includes(kw))) return s;
  }
  return { icon: "spa", from: "#00695c", to: "#00897b" };
}

// Trim meta_description to a single clean sentence
function oneSentence(text?: string): string {
  if (!text) return "A daily tip for your health and wellbeing.";
  const sentence = text.split(/[.!?]/)[0].trim();
  return sentence.length > 120 ? sentence.slice(0, 117) + "…" : sentence + ".";
}

export default function DailyWellbeingCard() {
  const [topic, setTopic] = useState<WellbeingTopic | null>(null);

  useEffect(() => {
    getDailyWellbeingTip().then(setTopic);
  }, []);

  const style = topic ? getStyle(topic) : { icon: "spa", from: "#00695c", to: "#00897b" };
  const tip = topic ? oneSentence(topic.meta_description) : "Loading today's wellbeing tip…";
  const title = topic?.topic_name ?? "Daily Wellbeing";
  const href = topic ? `/wellbeing/${topic.slug}` : "#";

  return (
    <Link
      href={href}
      className="rounded-3xl overflow-hidden h-40 relative group shadow-md active:scale-95 transition-transform block"
      style={{ background: `linear-gradient(135deg, ${style.from}, ${style.to})` }}
    >
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: "radial-gradient(circle at 80% 20%, white 0%, transparent 60%)" }}
      />

      <div className="absolute bottom-4 left-5 right-5 z-10">
        <h3 className="text-white font-extrabold text-base flex items-center gap-2 leading-snug">
          <span
            className="material-symbols-outlined text-xl flex-shrink-0"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {style.icon}
          </span>
          <span className="truncate">{title}</span>
        </h3>
        <p className="text-white/80 text-xs mt-1 font-medium line-clamp-2 leading-relaxed">
          {tip}
        </p>
      </div>

      {/* "Read more" indicator */}
      <div className="absolute top-4 right-4 z-10 opacity-60 group-hover:opacity-100 transition-opacity">
        <span className="material-symbols-outlined text-white text-lg">arrow_forward</span>
      </div>
    </Link>
  );
}
