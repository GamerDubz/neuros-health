@AGENTS.md

# Neuros Health — Project Context

## What this app is
A pharmacy companion app for NZ patients managing chronic conditions and long-term medications. Private by design — no ads, no data selling. Built with Next.js static export hosted on GitHub Pages, backed by Supabase.

## Tech Stack
- **Framework**: Next.js (App Router, `output: 'export'`, `trailingSlash: true`)
- **Hosting**: GitHub Pages via GitHub Actions (`.github/workflows/nextjs.yml`)
- **Backend/DB**: Supabase (PostgreSQL, Row Level Security enabled)
- **Styling**: Tailwind CSS + custom CSS variables (Material You design tokens)
- **Icons**: Google Material Symbols (`material-symbols-outlined` class) — NO emojis anywhere
- **State**: Zustand (`src/lib/store.tsx`)
- **Animation**: Framer Motion

## Icon Rule — Critical
**Never use emojis.** Always use Material Symbols:
```tsx
<span className="material-symbols-outlined text-[24px] text-primary" aria-hidden>icon_name</span>
```
For filled variant: add `style={{ fontVariationSettings: "'FILL' 1" }}`

Common icon mappings: `local_fire_department` (fire/streak), `eco` (growth/plant), `medication` (pill), `warning`, `emergency`, `call`, `check_circle`, `lock`, `schedule`, `water_drop`, `restaurant`, `bedtime`, `wb_sunny`

## Supabase
- **Project URL**: `https://cssfvuklphcwmsfekvxl.supabase.co`
- **Anon key**: in `.env.local` as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Service role key**: in `.env.local` as `SUPABASE_SERVICE_ROLE_KEY` — never expose client-side
- **Client**: `import { createClient } from '@/lib/supabase/client'`
- **Tables**: `medicines` (2,047 rows), `drug_detail` (1,600 rows), `health_conditions`, `wellbeing_topics`
- **RLS**: Enabled on all tables with public SELECT policies — anon reads work

## GitHub Deployment
- **Repo**: `https://github.com/GamerDubz/neuros-health`
- **Live site**: `https://gamerdubz.github.io/neuros-health/`
- **Trigger**: Push to `main` → Actions workflow builds + deploys to Pages
- **Required GitHub secrets**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Static export caveat**: All dynamic routes need `generateStaticParams()` — `medications/[id]/page.tsx` fetches ALL slugs from Supabase at build time to avoid 404s

## App Routes
| Route | Description |
|-------|-------------|
| `/` | Landing/marketing page |
| `/onboarding` | Onboarding carousel (3 slides, HealthTree) |
| `/home` | Dashboard with tree, meds overview |
| `/medications` | Medication list + NZ DB search |
| `/medications/[id]` | Drug detail card (NeurosHealthCard) |
| `/medications/add` | Add medication flow |
| `/tracker` | Dose tracker |
| `/badges` | Badge collection |
| `/health` | Health hub |
| `/health/check` | AI symptom checker |
| `/health/response` | Triage result |
| `/dashboard` | Analytics |

## Key Files
- `src/lib/db/drug-detail.ts` — DrugDetail type, `getDrugDetailBySlug`, `synthesizeDrugDetail`
- `src/lib/db/nz-health.ts` — `getMedicineBySlug`, `searchMedicines`, `getMedicinesBySlugs`
- `src/lib/db/search.ts` — unified search
- `src/lib/fuzzy.ts` — fuzzy search/sort for medication autocomplete
- `src/lib/store.tsx` — Zustand store (medications, user, conditions)
- `src/components/drug/NeurosHealthCard.tsx` — main drug info card component
- `src/components/HealthTree/` — animated health tree
- `src/components/FirstMedicationSetup.tsx` — onboarding wizard

## Build
```bash
npx next build   # generates 2065 static pages
```
Local `.env.local` must have both Supabase keys. Build falls back to 4 hardcoded slugs if keys missing.

## Design Tokens (CSS vars)
Primary teal: `#00685d` / `text-primary` / `bg-primary`
Surface: `bg-surface-container-lowest`, `bg-surface-container-low`, `bg-surface-container-high`
Text: `text-on-surface`, `text-on-surface-variant`, `text-outline`
Danger: `#ba1a1a` / `bg-error-container`
