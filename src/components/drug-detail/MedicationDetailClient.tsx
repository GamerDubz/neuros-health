"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getMedicineBySlug } from "@/lib/db/nz-health";
import {
  getDrugDetailBySlug,
  synthesizeDrugDetail,
  type DrugDetail,
} from "@/lib/db/drug-detail";
import NeurosHealthCard from "@/components/drug-detail/NeurosHealthCard";

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
        const detail = await getDrugDetailBySlug(initialId);
        if (!cancelled && detail) {
          setDrug(detail);
          setLoading(false);
          return;
        }

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

  useEffect(() => {
    if (serverNzData && !drug) {
      setDrug(synthesizeDrugDetail(serverNzData));
    }
  }, [serverNzData, drug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-on-surface-variant text-sm font-semibold">Loading medication info…</p>
        </div>
      </div>
    );
  }

  if (notFound || !drug) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <span className="material-symbols-outlined text-[56px] text-primary mb-4 block" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden>medication</span>
          <h1 className="text-2xl font-bold text-on-surface mb-2">Medication not found</h1>
          <p className="text-on-surface-variant mb-6">
            We couldn&apos;t find info for &ldquo;{initialId}&rdquo;.
          </p>
          <button
            onClick={() => router.push("/medications")}
            className="h-12 px-6 bg-primary text-white rounded-full font-bold text-sm"
          >
            Back to Medications
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pb-24 lg:pb-0">
      {/* Mobile back nav */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-lg pt-safe">
        <div className="flex items-center justify-between h-14 px-4">
          <button
            onClick={() => router.push("/medications")}
            className="p-2 -ml-2 rounded-full text-primary active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <h1 className="font-bold text-base text-on-surface tracking-tight flex-1 ml-2 truncate">
            {drug.drug_name}
          </h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Desktop back button */}
      <div className="hidden md:flex max-w-2xl mx-auto pt-8 px-6">
        <button
          onClick={() => router.push("/medications")}
          className="text-primary font-bold text-sm flex items-center gap-1 hover:underline"
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
