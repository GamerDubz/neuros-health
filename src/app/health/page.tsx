"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CommonAilmentsLibrary() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedAilment, setSelectedAilment] = useState<any>(null);

  const categories = ["All", "Respiratory", "Digestive", "Pain", "Skin", "Fever", "Allergy", "Mental Health", "Eye & Ear"];

  const ailments = [
    {
      id: "flu",
      name: "Influenza (The Flu)",
      category: "Respiratory",
      shortDesc: "Viral infection of the respiratory system.",
      symptoms: ["Fever or chills", "Cough and sore throat", "Runny or stuffy nose", "Muscle or body aches", "Headaches and fatigue"],
      selfCare: [
        "Rest extensively in a quiet room.",
        "Drink plenty of clear fluids to prevent dehydration.",
        "Use a humidifier to help ease breathing.",
      ],
      otc: ["Paracetamol 500mg", "Ibuprofen 400mg", "Oral decongestants"],
      pharmacist: ["Symptoms persist beyond 7 days.", "Fever doesn't reduce with medication.", "You have a chronic medical condition."],
      emergency: ["Difficulty breathing or shortness of breath.", "Pain or heavy pressure in chest.", "Sudden dizziness or confusion."],
      color: "primary"
    },
    {
      id: "migraine",
      name: "Migraine",
      category: "Pain",
      shortDesc: "Severe, throbbing recurring headache.",
      symptoms: ["Throbbing pain normally on one side", "Sensitivity to light and sound", "Nausea or vomiting", "Visual aura (flashing lights)"],
      selfCare: [
        "Rest in a quiet, dark room.",
        "Apply a cold pack to the forehead or back of the neck.",
        "Maintain regular sleep patterns and hydration to avoid triggers.",
      ],
      otc: ["Ibuprofen 400mg", "Aspirin 300mg", "Specific OTC migraine formulations"],
      pharmacist: ["Migraines are becoming more frequent.", "OTC painkillers are no longer effective.", "You are needing painkillers more than 2 days a week."],
      emergency: ["A sudden 'thunderclap' headache.", "Headache with fever, stiff neck, or rash.", "Neurological symptoms like weakness or numbness."],
      color: "tertiary"
    },
    {
      id: "reflux",
      name: "Acid Reflux (GERD)",
      category: "Digestive",
      shortDesc: "Stomach acid flowing back into the esophagus.",
      symptoms: ["Heartburn (burning sensation in chest)", "Regurgitation of food or sour liquid", "Difficulty swallowing", "Sensation of a lump in your throat"],
      selfCare: [
        "Eat smaller, more frequent meals.",
        "Avoid trigger foods like spicy, fatty, or highly acidic foods.",
        "Elevate the head of your bed if symptoms occur at night.",
        "Avoid lying down immediately after eating."
      ],
      otc: ["Antacids (e.g., calcium carbonate)", "H2 blockers (e.g., famotidine)", "Proton pump inhibitors (e.g., omeprazole)"],
      pharmacist: ["Heartburn occurs more than twice a week.", "Symptoms persist despite OTC medications.", "Difficulty swallowing."],
      emergency: ["Severe chest pain or pressure (often mistaken for heartburn).", "Vomiting blood or material that looks like coffee grounds.", "Black, tarry stools."],
      color: "secondary"
    }
  ];

  const filteredAilments = ailments.filter(a => {
    const matchesQuery = a.name.toLowerCase().includes(query.toLowerCase()) || a.shortDesc.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = selectedCategory === "All" || a.category === selectedCategory;
    return matchesQuery && matchesCategory;
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
              <span className="material-symbols-outlined text-primary text-[20px]">symptoms</span> Symptoms
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedAilment.symptoms.map((s: string, idx: number) => (
                <span key={idx} className="bg-surface-container-high px-4 py-2 rounded-full text-sm font-semibold text-on-surface">{s}</span>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-[0_10px_40px_rgba(21,28,39,0.04)]">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-on-surface-variant mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary text-[20px]">spa</span> Self-Care Steps
            </h3>
            <div className="space-y-3">
              {selectedAilment.selfCare.map((step: string, idx: number) => (
                <div key={idx} className="flex gap-4 p-4 bg-surface-container-low rounded-2xl">
                  <div className="bg-tertiary text-white rounded-full w-8 h-8 flex-shrink-0 flex items-center justify-center font-bold text-sm">
                    {idx + 1}
                  </div>
                  <p className="text-on-surface text-sm font-medium leading-relaxed pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-[0_10px_40px_rgba(21,28,39,0.04)]">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-on-surface-variant mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">medication</span> OTC Suggestions
            </h3>
            <div className="flex flex-wrap gap-3">
              {selectedAilment.otc.map((drug: string, idx: number) => (
                <span key={idx} className="bg-secondary-fixed text-on-secondary-fixed rounded-full px-5 py-2.5 text-sm font-bold shadow-sm inline-flex flex-col">
                  {drug}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-secondary-container p-6 rounded-3xl">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-on-secondary-container mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">warning</span> When to See Your Pharmacist
            </h3>
            <ul className="space-y-3">
              {selectedAilment.pharmacist.map((warning: string, idx: number) => (
                <li key={idx} className="flex gap-3 items-start">
                  <span className="material-symbols-outlined text-secondary text-[20px] mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
                  <span className="text-sm text-on-secondary-container font-medium leading-relaxed">{warning}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-error-container p-6 rounded-3xl border border-error/20">
            <h3 className="text-sm font-bold uppercase tracking-widest text-error mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-error text-[20px]">emergency</span> When to Call 111
            </h3>
            <ul className="space-y-3 mb-6">
              {selectedAilment.emergency.map((warning: string, idx: number) => (
                <li key={idx} className="flex gap-3 items-start">
                  <span className="material-symbols-outlined text-error text-[20px] mt-0.5">radio_button_unchecked</span>
                  <span className="text-sm text-on-error-container font-medium leading-relaxed">{warning}</span>
                </li>
              ))}
            </ul>
            <a href="tel:111" className="w-full flex items-center justify-center gap-2 bg-error text-white h-14 rounded-full font-bold text-lg active:scale-95 transition-transform">
              Call 111
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in relative max-w-2xl mx-auto lg:max-w-5xl">
      <div className="grid lg:grid-cols-[240px_1fr] gap-8 items-start">
        
        {/* Desktop Sidebar (Categories) */}
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
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-outline mb-4 pl-4">Categories</h2>
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`w-full text-left px-4 py-3 rounded-2xl font-semibold text-sm transition-colors ${selectedCategory === cat ? 'bg-surface-container-low text-primary' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-20 lg:pt-0 pb-36 px-6 lg:px-0">
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2">Common Ailments</h1>
            <p className="text-on-surface-variant text-base">General guidance for everyday health concerns.</p>
          </div>

          {/* Mobile Categories Row */}
          <div className="flex overflow-x-auto gap-3 pb-4 -mx-6 px-6 lg:hidden no-scrollbar">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap active:scale-95 transition-transform ${selectedCategory === cat ? 'bg-primary text-white' : 'bg-surface-container-low text-on-surface-variant'}`}
              >
                {cat}
              </button>
            ))}
          </div>

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
            {filteredAilments.map(ailment => (
              <button 
                key={ailment.id}
                onClick={() => setSelectedAilment(ailment)}
                className="bg-surface-container-lowest p-5 rounded-3xl shadow-[0_10px_40px_rgba(21,28,39,0.04)] active:bg-surface-container-low text-left active:scale-95 transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div className={`w-12 h-12 rounded-full mb-4 flex items-center justify-center bg-${ailment.color}-fixed/30 text-${ailment.color}`}>
                   <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>health_and_safety</span>
                </div>
                <h3 className="font-bold text-on-surface text-base lg:text-lg leading-tight group-hover:text-primary transition-colors">{ailment.name}</h3>
                <p className="text-xs text-on-surface-variant mt-2 font-medium leading-relaxed">{ailment.shortDesc}</p>
              </button>
            ))}
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
