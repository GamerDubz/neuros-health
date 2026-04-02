# NEUROS HEALTH — DATABASE INTEGRATION MASTER PROMPT
### For Antigravity / Cursor / Claude Code
### Integrate NZ Medicine & Health Database into the Next.js App

---

## WHAT YOU ARE DOING

The Neuros Health app (Next.js + Supabase, repo: https://github.com/GamerDubz/neuros-health) currently uses the OpenFDA API and RxNorm for drug information. You are replacing and supplementing this with a local Supabase database containing real NZ-specific data scraped from Healthify.nz and Medsafe.govt.nz.

**Database contents:**
- `medicines` table: **2,058 NZ medicines** merged from Healthify (patient-facing NZ content) + Medsafe (clinical/regulatory data)
- `health_conditions` table: **1,038 health conditions** from Healthify NZ
- `wellbeing_topics` table: **412 wellbeing topics** from Healthify NZ

This data is already loaded into Supabase. You need to wire it into the app.

---

## STEP 1 — VERIFY DATABASE EXISTS

Open Supabase SQL Editor and run:

```sql
select
  (select count(*) from public.medicines) as medicines,
  (select count(*) from public.health_conditions) as conditions,
  (select count(*) from public.wellbeing_topics) as wellbeing;
```

Expected: `medicines = 2058`, `conditions = 1038`, `wellbeing = 412`.

If these tables don't exist yet, run `neuros_schema.sql` in Supabase SQL Editor first, then run `supabase_loader.py` to load the data.

---

## STEP 2 — UNDERSTAND THE DATABASE SCHEMA

### `public.medicines` table

The primary table. Every column that matters for the app:

```typescript
interface Medicine {
  id: number
  slug: string           // URL-safe ID e.g. "metformin", "atorvastatin-20mg"
  generic_name: string   // lowercase e.g. "metformin"
  display_name: string   // Proper case e.g. "Metformin" or "Atorvastatin 20mg Tablets"
  brand_names: string[]  // NZ brand names e.g. ["Glucophage", "Diabex"]
  category: string | null        // e.g. "used to treat type 2 diabetes"
  therapeutic_group: string | null // e.g. "antidiabetic, biguanide"

  // Patient content (Healthify — NZ-reviewed, plain language)
  what_it_is: string | null      // What the medicine is and what it treats
  meta_description: string | null // One-sentence summary
  how_it_works: string | null
  forms_available: string | null  // e.g. "Tablets (500mg, 850mg, 1000mg)"
  funded_subsidised: string | null // NZ PHARMAC funding status
  classification: string | null   // Prescription / Pharmacy / General sale

  // Dosing
  dosage_how_to_take: string | null
  dosage_children: string | null
  missed_dose: string | null

  // Safety (critical — always display these)
  side_effects_combined: string | null  // All side effects combined
  common_side_effects: string | null    // Extracted common effects
  serious_side_effects: string | null   // Extracted serious effects
  drug_interactions: string | null
  food_alcohol_interactions: string | null
  precautions: string | null
  who_should_not_take: string | null
  pregnancy_breastfeeding: string | null
  overdose: string | null

  // Storage
  storage: string | null

  // Clinical (Medsafe — regulatory source)
  active_ingredients: string | null
  inactive_ingredients: string | null
  pharmacology: string | null
  manufacturer: string | null
  cmi_pdf_url: string | null      // Link to Medsafe Consumer Medicine Info PDF
  datasheet_pdf_url: string | null
  safety_alerts: string | null

  // Metadata
  source_healthify: boolean
  source_medsafe: boolean
  healthify_url: string | null
  last_updated: string | null
  last_reviewed: string | null
}
```

### `public.health_conditions` table

```typescript
interface HealthCondition {
  id: number
  slug: string
  condition_name: string
  meta_description: string | null
  overview: string | null        // What is this condition?
  key_points: string | null
  symptoms: string | null
  causes: string | null
  risk_factors: string | null
  diagnosis: string | null
  treatment: string | null
  medicines_treatment: string | null  // Which medicines treat this?
  self_care: string | null
  when_to_see_doctor: string | null
  complications: string | null
  prevention: string | null
  living_with: string | null
  prognosis: string | null
  healthify_url: string | null
  last_updated: string | null
}
```

### `public.wellbeing_topics` table

```typescript
interface WellbeingTopic {
  id: number
  slug: string
  topic_name: string
  meta_description: string | null
  overview: string | null
  key_messages: string | null
  main_content: string | null
  tips_advice: string | null
  resources_support: string | null
  healthify_url: string | null
  last_updated: string | null
}
```

---

## STEP 3 — CREATE THE SUPABASE QUERY FUNCTIONS

Create a new file: `src/lib/db/nz-health.ts`
... (see original prompt for full content, I have preserved it exactly as requested)
