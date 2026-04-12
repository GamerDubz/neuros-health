"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getWellbeingBySlug, type WellbeingTopic } from "@/lib/db/wellbeing";

// Strip Healthify promotional text injected at the top of some content fields.
// Pattern: "You can now add Healthify as a preferred source on Google. Click here
// to see us when you search Google. × " and similar variations.
function cleanContent(text: string): string {
  return text
    .replace(/You can now add Healthify[^×]*×\s*/gi, "")
    .replace(/Click here to see us when you search Google\.?\s*/gi, "")
    .trim();
}

// Split a block of text into readable paragraphs.
// Respects existing double-newlines; otherwise groups every 3 sentences.
function toParagraphs(text: string): string[] {
  const cleaned = cleanContent(text);

  // If the text already has paragraph breaks, use them
  const byDoubleNewline = cleaned.split(/\n{2,}/);
  if (byDoubleNewline.length > 1) {
    return byDoubleNewline.map((p) => p.replace(/\n/g, " ").trim()).filter(Boolean);
  }

  // Single newlines → treat each line as its own paragraph
  const byNewline = cleaned.split(/\n/);
  if (byNewline.length > 1) {
    return byNewline.map((p) => p.trim()).filter(Boolean);
  }

  // One big block — split into sentences and group every 3
  const sentences = cleaned.match(/[^.!?]+[.!?]+/g) || [cleaned];
  const paragraphs: string[] = [];
  for (let i = 0; i < sentences.length; i += 3) {
    paragraphs.push(sentences.slice(i, i + 3).join(" ").trim());
  }
  return paragraphs.filter(Boolean);
}

function ContentBlock({ text }: { text: string }) {
  const paragraphs = toParagraphs(text);
  return (
    <div className="space-y-3">
      {paragraphs.map((p, i) => (
        <p key={i} className="text-sm text-on-surface-variant leading-relaxed">
          {p}
        </p>
      ))}
    </div>
  );
}

export default function WellbeingDetailPage({ slug }: { slug: string }) {
  const [topic, setTopic] = useState<WellbeingTopic | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWellbeingBySlug(slug).then((t) => {
      setTopic(t);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-surface-container-high rounded-2xl w-3/4" />
          <div className="h-4 bg-surface-container rounded-xl w-full" />
          <div className="h-4 bg-surface-container rounded-xl w-5/6" />
        </div>
      </main>
    );
  }

  if (!topic) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-on-surface-variant text-lg">Topic not found.</p>
        <Link href="/home" className="mt-4 inline-block text-primary font-bold hover:underline">
          Back to home
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      {/* Back link */}
      <Link
        href="/home"
        className="inline-flex items-center gap-1 text-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Back
      </Link>

      {/* Header */}
      <header className="space-y-3">
        <h1 className="text-3xl font-extrabold leading-tight text-on-surface">
          {topic.topic_name}
        </h1>
        {topic.meta_description && (
          <p className="text-base text-on-surface-variant leading-relaxed">
            {cleanContent(topic.meta_description)}
          </p>
        )}
      </header>

      {/* Overview */}
      {topic.overview && (
        <section className="space-y-3">
          <h2 className="text-lg font-extrabold text-on-surface">Overview</h2>
          <ContentBlock text={topic.overview} />
        </section>
      )}

      {/* Key Messages */}
      {topic.key_messages && (
        <section className="bg-primary/8 rounded-3xl p-6 space-y-3">
          <h2 className="text-lg font-extrabold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              lightbulb
            </span>
            Key Takeaways
          </h2>
          <ContentBlock text={topic.key_messages} />
        </section>
      )}

      {/* Main Content */}
      {topic.main_content && (
        <section className="space-y-3">
          <h2 className="text-lg font-extrabold text-on-surface">More Information</h2>
          <ContentBlock text={topic.main_content} />
        </section>
      )}

      {/* Tips & Advice */}
      {topic.tips_advice && (
        <section className="bg-surface-container rounded-3xl p-6 space-y-3">
          <h2 className="text-lg font-extrabold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              tips_and_updates
            </span>
            Tips &amp; Advice
          </h2>
          <ContentBlock text={topic.tips_advice} />
        </section>
      )}

      {/* Resources */}
      {topic.resources_support && (
        <section className="space-y-3">
          <h2 className="text-lg font-extrabold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">support</span>
            Resources &amp; Support
          </h2>
          <ContentBlock text={topic.resources_support} />
        </section>
      )}

      {/* Healthify link */}
      {topic.healthify_url && (
        <section className="pt-2">
          <a
            href={topic.healthify_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
          >
            <span className="material-symbols-outlined text-[18px]">open_in_new</span>
            Read more on Healthify He Puna Waiora
          </a>
        </section>
      )}

      {topic.last_updated && (
        <p className="text-xs text-on-surface-variant/60 pt-2">
          Last updated: {new Date(topic.last_updated).toLocaleDateString("en-NZ", { year: "numeric", month: "long", day: "numeric" })}
        </p>
      )}
    </main>
  );
}
