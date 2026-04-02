"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getConditionsList, getConditionBySlug, searchConditions } from '@/lib/db/nz-health';

export default function CommonAilmentsLibrary() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedAilment, setSelectedAilment] = useState<any>(null);
  const [ailments, setAilments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load all conditions
  useEffect(() => {
    const loadConditions = async () => {
      setLoading(true);
      const data = await getConditionsList(500);
      setAilments(data.map((c: any) => ({
        ...c,
        id: c.slug,
        name: c.condition_name,
        shortDesc: c.meta_description || "Information from Healthify NZ.",
        color: "primary" // Default color
      })));
      setLoading(false);
    };
    loadConditions();
  }, []);

  // Update selected ailment with full details when clicked
  const handleSelectAilment = async (ailment: any) => {
    setSelectedAilment(ailment); // Show partial immediately
    try {
      const fullData = await getConditionBySlug(ailment.slug);
      if (fullData) {
        setSelectedAilment({
          ...ailment,
          ...fullData,
          name: fullData.condition_name,
          shortDesc: fullData.meta_description,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredAilments = ailments.filter(a => {
    const matchesQuery = a.name.toLowerCase().includes(query.toLowerCase()) || 
                         a.shortDesc?.toLowerCase().includes(query.toLowerCase());
    return matchesQuery;
  });

  if (selectedAilment) {
    return (
      <div className="animate-fade-in relative min-h-screen pb-36">
        {/* Detail Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-surface/85 backdrop-blur-lg px-6 py-4 flex items-center gap-4 h-16 md:hidden">
          <button onClick={() => setSelectedAilment(null)} className="p-2 -ml-2 rounded-full text-primary active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <h1 className="font-bold text-lg text-on-surface tracking-tight truncate">{selectedAilment.name}</h1>
        </header>

        {/* Desktop Detail Header (matches TopBar spacing roughly) */}
        <div className="hidden md:flex items-center gap-4 pt-10 px-8 pb-4">
          <button onClick={() => setSelectedAilment(null)} className="p-2 rounded-full text-primary hover:bg-surface-container-low transition-colors flex items-center gap-2 font-bold text-sm">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span> Back
          </button>
        </div>

        <div className="max-w-4xl mx-auto px-6 pt-24 md:pt-4 space-y-6">
          {/* Banner Card */}
          <div className={`bg-${selectedAilment.color}-container p-6 rounded-3xl`}>
             <div className="w-16 h-16 rounded-full bg-white/50 flex items-center justify-center mb-4 text-2xl" 
                  style={{ color: `var(--${selectedAilment.color})` }}>
               <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>medical_information</span>
             </div>
             <h2 className={`text-3xl font-extrabold text-on-${selectedAilment.color}-container tracking-tight`}>{selectedAilment.name}</h2>
             <p className={`text-sm mt-2 text-on-${selectedAilment.color}-container/80 font-medium`}>{selectedAilment.shortDesc}</p>
          </div>

          {/* Sections */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-[0_10px_40px_rgba(21,28,39,0.04)]">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-on-surface-variant mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">info</span> Overview
            </h3>
            <p className="text-on-surface-variant text-sm md:text-base leading-relaxed whitespace-pre-line">
              {selectedAilment.overview || "Loading overview..."}
            </p>
          </div>

          {selectedAilment.symptoms && (
            <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-[0_10px_40px_rgba(21,28,39,0.04)]">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-on-surface-variant mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">symptoms</span> Symptoms
              </h3>
              <div className="text-sm font-medium text-on-surface leading-loose whitespace-pre-line bg-surface-container-low/30 p-4 rounded-2xl">
                {selectedAilment.symptoms}
              </div>
            </div>
          )}

          {selectedAilment.self_care && (
            <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-[0_10px_40px_rgba(21,28,39,0.04)]">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-on-surface-variant mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary text-[20px]">spa</span> Self-Care Steps
              </h3>
              <div className="text-sm font-medium text-on-surface leading-relaxed whitespace-pre-line px-2">
                {selectedAilment.self_care}
              </div>
            </div>
          )}

          {selectedAilment.medicines_treatment && (
            <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-[0_10px_40px_rgba(21,28,39,0.04)]">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-on-surface-variant mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">medication</span> Treatment & Medicines
              </h3>
              <div className="text-sm font-medium text-secondary-900 leading-relaxed whitespace-pre-line px-2">
                {selectedAilment.medicines_treatment}
              </div>
            </div>
          )}

          {(selectedAilment.when_to_see_doctor || selectedAilment.emergency) && (
            <div className="bg-error-container p-6 rounded-3xl border border-error/20">
              <h3 className="text-sm font-bold uppercase tracking-widest text-error mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-error text-[20px]">emergency</span> When to Seek Help
              </h3>
              <div className="space-y-4">
                {selectedAilment.when_to_see_doctor && (
                  <div className="bg-white/40 p-4 rounded-xl">
                    <h4 className="text-xs font-black text-error/70 uppercase mb-2">See your Doctor if:</h4>
                    <p className="text-sm text-on-error-container font-medium leading-relaxed whitespace-pre-line">{selectedAilment.when_to_see_doctor}</p>
                  </div>
                )}
                {selectedAilment.emergency && (
                  <div className="bg-error shadow-sm p-4 rounded-xl text-white">
                    <h4 className="text-xs font-black uppercase mb-2">Call 111 immediately if:</h4>
                    <p className="text-sm font-bold leading-relaxed whitespace-pre-line">{selectedAilment.emergency}</p>
                  </div>
                )}
              </div>
              <a href="tel:111" className="w-full mt-6 flex items-center justify-center gap-2 bg-error text-white h-14 rounded-full font-bold text-lg active:scale-95 transition-transform shadow-lg shadow-error/20">
                Call 111
              </a>
            </div>
          )}
          
          <div className="flex flex-col items-center gap-4 py-8 px-4 opacity-70">
            <p className="text-xs text-outline italic text-center">
              Source: Healthify He Puna Waiora NZ. NZ-reviewed health information.
            </p>
            <img src="https://healthify.nz/themes/health-navigator/images/logo.png" alt="Healthify NZ" className="h-8 grayscale" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in relative max-w-2xl mx-auto lg:max-w-5xl">
      <div className="grid lg:grid-cols-[240px_1fr] gap-8 items-start">
        
        {/* Desktop Sidebar (Search) */}
        <div className="hidden lg:block sticky top-24">
          <div className="relative mb-6">
            <span className="material-symbols-outlined absolute left-4 top-4 text-outline">search</span>
            <input 
              type="text" 
              placeholder="Search library..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-14 bg-surface-container-high rounded-full pl-12 pr-4 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all"
            />
          </div>
          <div className="p-6 bg-primary-container/30 rounded-3xl">
            <h3 className="text-xs font-black uppercase tracking-tighter text-primary mb-2">NZ Health Library</h3>
            <p className="text-xs text-on-primary-container/70 leading-relaxed font-medium">
              Browse over 400 conditions reviewed by New Zealand clinical experts.
            </p>
          </div>
        </div>

        <div className="pt-20 lg:pt-0 pb-36 px-6 lg:px-0">
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2">Common Ailments</h1>
            <p className="text-on-surface-variant text-base">General guidance for everyday health concerns.</p>
          </div>

          {/* Categories removed for now */}

          {/* Mobile Search */}
          <div className="relative h-14 w-full mb-6 lg:hidden">
            <span className="material-symbols-outlined absolute left-4 top-4 text-outline">search</span>
            <input 
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search conditions..." 
              className="w-full h-full bg-surface-container-high rounded-xl pl-12 pr-4 text-on-surface text-base placeholder:text-outline/60 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:outline-none transition-all duration-200"
            />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <div className="col-span-full py-20 flex flex-col items-center justify-center gap-4">
                <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
                <p className="text-on-surface-variant font-bold">Accessing NZ Health Database...</p>
              </div>
            ) : (
              filteredAilments.map(ailment => (
                <button 
                  key={ailment.id}
                  onClick={() => handleSelectAilment(ailment)}
                  className="bg-surface-container-lowest p-5 rounded-3xl shadow-[0_10px_40px_rgba(21,28,39,0.04)] active:bg-surface-container-low text-left active:scale-95 transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary group"
                >
                  <div className={`w-12 h-12 rounded-full mb-4 flex items-center justify-center bg-primary-fixed/30 text-primary`}>
                     <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>health_and_safety</span>
                  </div>
                  <h3 className="font-bold text-on-surface text-base lg:text-lg leading-tight group-hover:text-primary transition-colors">{ailment.name}</h3>
                  <p className="text-xs text-on-surface-variant mt-2 font-medium leading-relaxed line-clamp-2">{ailment.shortDesc}</p>
                </button>
              ))
            )}
          </div>

          {filteredAilments.length === 0 && (
            <div className="col-span-full bg-surface-container-low p-8 rounded-3xl text-center mt-4">
              <span className="material-symbols-outlined text-[48px] text-outline/50 mb-4">search_off</span>
              <h3 className="font-bold text-lg text-on-surface">No ailments found</h3>
              <p className="text-sm text-on-surface-variant mt-1">Try searching for a different symptom or condition.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
