"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getMedicineBySlug } from "@/lib/db/nz-health";
import {
  getDrugDetailBySlug,
  synthesizeDrugDetail,
  type DrugDetail,
} from "@/lib/db/drug-detail";
import NeurosHealthCard from "@/components/drug/NeurosHealthCard";

export function MedicationDetailClient({
  initialId,
  nzData: serverNzData,
}: {
  initialId: string;
  nzData?: unknown;
}) {
  const router = useRouter();
  const [drug, setDrug] = useState<DrugDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // 1. Prefer structured drug_detail
        const detail = await getDrugDetailBySlug(initialId);
        if (!cancelled && detail) {
          setDrug(detail);
          setLoading(false);
          return;
        }

        // 2. Fall back to synthesizing from raw medicines row
        const raw = await getMedicineBySlug(initialId);
        if (!cancelled) {
          if (raw) {
            setDrug(synthesizeDrugDetail(raw));
          } else {
            setNotFound(true);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to load drug:", err);
        if (!cancelled) {
          setNotFound(true);
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [initialId]);

  // Use server-provided data as initial hint if present
  useEffect(() => {
    if (serverNzData && !drug) {
      setDrug(synthesizeDrugDetail(serverNzData));
    }
  }, [serverNzData, drug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f9f9ff] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#00685d]/20 border-t-[#00685d] rounded-full animate-spin" />
          <p className="text-[#6d7a77] text-sm font-semibold">Loading medicine info…</p>
        </div>
      </div>
    );
  }

  if (notFound || !drug) {
    return (
      <div className="min-h-screen bg-[#f9f9ff] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">💊</div>
          <h1 className="text-2xl font-bold text-[#151c27] mb-2">Medicine not found</h1>
          <p className="text-[#6d7a77] mb-6">
            We couldn&apos;t find info for &ldquo;{initialId}&rdquo;.
          </p>
          <button
            onClick={() => router.push("/medications")}
            className="h-12 px-6 bg-[#00685d] text-white rounded-full font-bold text-sm"
          >
            Back to Medications
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f9ff] pb-24 lg:pb-0">
      {/* Mobile back nav */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#f9f9ff]/90 backdrop-blur-lg pt-safe">
        <div className="flex items-center justify-between h-14 px-4">
          <button
            onClick={() => router.push("/medications")}
            className="p-2 -ml-2 rounded-full text-[#00685d] active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <h1 className="font-bold text-base text-[#151c27] tracking-tight flex-1 ml-2 truncate">
            {drug.drug_name}
          </h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Desktop back button */}
      <div className="hidden md:flex max-w-2xl mx-auto pt-8 px-6">
        <button
          onClick={() => router.push("/medications")}
          className="text-[#00685d] font-bold text-sm flex items-center gap-1 hover:underline"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back to Medications
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-4 md:px-6 pt-16 md:pt-4 pb-16">
        <NeurosHealthCard drug={drug} />
      </div>
    </div>
  );
}
