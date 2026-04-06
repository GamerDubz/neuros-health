/**
 * NEUROS HEALTH — Ailment Parser
 *
 * Reads all rows from public.health_conditions and writes structured
 * data into public.ailment_detail.
 *
 * Run with:
 *   npx tsx scripts/parse-ailments.ts
 *
 * Or to process a single condition:
 *   npx tsx scripts/parse-ailments.ts --slug=acute-hives
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ─────────────────────────────────────────────────────────────
// SLUG GENERATOR
// ─────────────────────────────────────────────────────────────

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s\-]/g, '')
    .replace(/[\s\-]+/g, '-')
    .trim()
    .slice(0, 100)
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

function clean(text: string | null | undefined): string {
  if (!text) return ''
  return text
    .replace(/\(external link\)/gi, '')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/\s{3,}/g, ' ')
    .replace(/Read more about[^\.]+\./gi, '')
    .trim()
}

function firstSentences(text: string, n: number): string {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]
  return sentences.slice(0, n).join(' ').trim()
}

function containsAny(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase()
  return keywords.some(k => lower.includes(k))
}

// ─────────────────────────────────────────────────────────────
// CATEGORY TAGS PARSER
// ─────────────────────────────────────────────────────────────

function parseConditionTags(condition: any): string[] {
  const name = (condition.condition_name || '').toLowerCase()
  const overview = clean(condition.overview || '').toLowerCase()
  const combined = name + ' ' + overview
  const tags: string[] = []

  if (containsAny(combined, ['skin', 'rash', 'eczema', 'hives', 'psoriasis', 'acne', 'wound', 'burn', 'dermat'])) tags.push('skin')
  if (containsAny(combined, ['cough', 'cold', 'flu', 'asthma', 'bronch', 'respiratory', 'breath', 'lung', 'sinus', 'throat'])) tags.push('respiratory')
  if (containsAny(combined, ['stomach', 'bowel', 'digest', 'nausea', 'diarrh', 'constip', 'reflux', 'gut', 'intestin', 'vomit', 'bloat'])) tags.push('digestive')
  if (containsAny(combined, ['pain', 'ache', 'headache', 'migraine', 'arthritis', 'joint', 'muscle', 'back pain', 'neck pain'])) tags.push('pain')
  if (containsAny(combined, ['fever', 'temperature', 'hot', 'chills', 'infection'])) tags.push('fever')
  if (containsAny(combined, ['allerg', 'hay fever', 'anaphyl', 'histamine', 'sensitiv'])) tags.push('allergy')
  if (containsAny(combined, ['anxiety', 'depress', 'stress', 'mental', 'mood', 'sleep', 'insomnia', 'panic'])) tags.push('mental_health')
  if (containsAny(combined, ['eye', 'vision', 'ear', 'hearing', 'conjunct', 'tinnit'])) tags.push('eye_ear')

  if (tags.length === 0) tags.push('general')
  return tags
}

// ─────────────────────────────────────────────────────────────
// TWO LINE SUMMARY PARSER
// ─────────────────────────────────────────────────────────────

function parseTwoLineSummary(condition: any): string {
  const meta = clean(condition.meta_description || '')
  const overview = clean(condition.overview || '')
  const name = condition.condition_name || 'This condition'

  if (meta.length > 40) return firstSentences(meta, 2)
  if (overview.length > 40) return firstSentences(overview, 2)
  return `${name} is a health condition that may need attention. Follow your pharmacist's or doctor's advice.`
}

// ─────────────────────────────────────────────────────────────
// TRIAGE PARSER
// ─────────────────────────────────────────────────────────────

const EMERGENCY_KEYWORDS = [
  'call 111', '111', 'emergency department', 'go to hospital', 'ambulance',
  'anaphylaxis', 'chest pain', 'difficulty breathing', 'trouble breathing',
  'cannot breathe', 'face swells', 'throat swells', 'loss of consciousness',
  'collapse', 'seizure', 'stroke', 'heart attack', 'blood in',
  'unresponsive', 'severe allergic', 'struggle to breathe', 'go to ed',
]

const SEE_GP_KEYWORDS = [
  'see your doctor', 'see a doctor', 'see your gp', 'contact your doctor',
  'visit your gp', 'make an appointment', 'consult a doctor', 'seek medical advice',
  'if it persists', 'if it continues', 'if it lasts', 'if it worsens',
  'get worse', 'does not improve', 'prescription', 'antibiotics',
]

function parseTriage(condition: any): Array<{ level: string; icon: string; label: string; detail: string }> {
  const treatment = clean(condition.treatment || '')
  const when = clean(condition.when_to_see_doctor || '')
  const selfCare = clean(condition.self_care || '')
  const overview = clean(condition.overview || '')
  const combined = treatment + ' ' + when + ' ' + overview

  // HOME CARE detail
  let homeDetail = 'Rest, fluids, and over-the-counter relief usually help.'
  if (selfCare.length > 20) {
    homeDetail = firstSentences(selfCare, 1)
  } else if (containsAny(treatment.toLowerCase(), ['antihistamine', 'paracetamol', 'ibuprofen', 'rest', 'fluids', 'compress'])) {
    homeDetail = firstSentences(treatment, 1)
  }

  // SEE GP detail
  let gpDetail = 'See a doctor if symptoms do not improve within a few days.'
  const sentences = when.match(/[^.!?]+[.!?]+/g) || []
  for (const s of sentences) {
    if (SEE_GP_KEYWORDS.some(k => s.toLowerCase().includes(k)) &&
        !EMERGENCY_KEYWORDS.some(k => s.toLowerCase().includes(k))) {
      gpDetail = s.trim()
      break
    }
  }

  // EMERGENCY detail
  let emergencyDetail = 'If symptoms are severe or you are very unwell — call 111 immediately.'
  for (const s of sentences) {
    if (EMERGENCY_KEYWORDS.some(k => s.toLowerCase().includes(k))) {
      emergencyDetail = s.trim()
      if (!emergencyDetail.toLowerCase().includes('111')) {
        emergencyDetail += ' Call 111 immediately.'
      }
      break
    }
  }

  return [
    { level: 'home_care', icon: 'home_health',    label: 'Home Care',    detail: firstSentences(homeDetail, 1) },
    { level: 'see_gp',    icon: 'local_hospital', label: 'See a Doctor', detail: firstSentences(gpDetail, 1) },
    { level: 'emergency', icon: 'emergency',       label: 'Emergency',   detail: firstSentences(emergencyDetail, 1) },
  ]
}

// ─────────────────────────────────────────────────────────────
// WHAT TO DO NOW PARSER
// ─────────────────────────────────────────────────────────────

const ACTION_PATTERNS = [
  {
    keywords: ['antihistamine', 'loratadine', 'cetirizine', 'clarityne', 'zyrtec'],
    icon: 'medication', action: 'Take antihistamine',
    detail: 'Take a non-drowsy antihistamine like Loratadine (Clarityne) or Cetirizine (Zyrtec).',
  },
  {
    keywords: ['paracetamol', 'pain relief', 'ibuprofen', 'nurofen', 'analgesic'],
    icon: 'medication', action: 'Pain relief',
    detail: 'Take Paracetamol or Ibuprofen as directed on the packet to ease pain or fever.',
  },
  {
    keywords: ['rest', 'sleep', 'lie down', 'relax'],
    icon: 'bedtime', action: 'Rest',
    detail: 'Rest as much as possible to help your body recover.',
  },
  {
    keywords: ['fluids', 'water', 'drink', 'hydrat', 'dehydrat'],
    icon: 'water_drop', action: 'Stay hydrated',
    detail: 'Drink plenty of water and clear fluids throughout the day.',
  },
  {
    keywords: ['cold compress', 'cold flannel', 'cold pack', 'ice pack', 'cool down', 'cool shower'],
    icon: 'ac_unit', action: 'Cool down',
    detail: 'Apply a cool flannel or take a cool shower to soothe the area.',
  },
  {
    keywords: ['warm compress', 'heat pack', 'warm'],
    icon: 'thermostat', action: 'Apply warmth',
    detail: 'Apply a warm compress to ease discomfort.',
  },
  {
    keywords: ['avoid trigger', 'trigger', 'allergen', 'irritant'],
    icon: 'block', action: 'Avoid triggers',
    detail: 'Try to identify and avoid what may have triggered your symptoms.',
  },
  {
    keywords: ['loose clothing', 'loose fit', 'cotton', 'comfortable clothing'],
    icon: 'checkroom', action: 'Wear loose clothing',
    detail: 'Wear light, loose-fitting clothing to reduce skin irritation.',
  },
  {
    keywords: ['sunscreen', 'sun protection', 'avoid sun', 'uv'],
    icon: 'wb_sunny', action: 'Protect from sun',
    detail: 'Avoid sun exposure and apply SPF 30+ sunscreen when outdoors.',
  },
  {
    keywords: ['wash', 'clean', 'hygiene', 'hand wash', 'sanitise'],
    icon: 'soap', action: 'Keep it clean',
    detail: 'Wash the affected area gently with mild soap and water.',
  },
  {
    keywords: ['elevat', 'raise', 'prop up'],
    icon: 'airline_seat_flat', action: 'Elevate',
    detail: 'Elevate the affected area above heart level to reduce swelling.',
  },
  {
    keywords: ['steam', 'inhale', 'humidif'],
    icon: 'air', action: 'Steam inhalation',
    detail: 'Inhale steam from a bowl of hot water (be careful not to burn yourself).',
  },
  {
    keywords: ['salt water', 'saline', 'gargle'],
    icon: 'local_drink', action: 'Salt water rinse',
    detail: 'Gargle with warm salt water (half teaspoon salt in a glass of warm water).',
  },
  {
    keywords: ['avoid alcohol', 'limit alcohol', 'no alcohol'],
    icon: 'no_drinks', action: 'Avoid alcohol',
    detail: 'Avoid alcohol while you are unwell, as it can worsen symptoms.',
  },
  {
    keywords: ['honey', 'lemon', 'ginger', 'herbal tea'],
    icon: 'emoji_food_beverage', action: 'Soothing drinks',
    detail: 'Warm honey and lemon or herbal teas can help soothe discomfort.',
  },
]

function parseWhatToDoNow(condition: any): Array<{ icon: string; action: string; detail: string }> {
  const selfCare = clean(condition.self_care || '').toLowerCase()
  const treatment = clean(condition.treatment || '').toLowerCase()
  const combined = selfCare + ' ' + treatment
  const steps: Array<{ icon: string; action: string; detail: string }> = []
  const usedIcons = new Set<string>()

  for (const pattern of ACTION_PATTERNS) {
    if (steps.length >= 5) break
    if (pattern.keywords.some(k => combined.includes(k))) {
      if (!usedIcons.has(pattern.icon)) {
        usedIcons.add(pattern.icon)
        steps.push({ icon: pattern.icon, action: pattern.action, detail: pattern.detail })
      }
    }
  }

  if (steps.length === 0) {
    steps.push(
      { icon: 'bedtime',    action: 'Rest',           detail: 'Rest and allow your body to recover.' },
      { icon: 'water_drop', action: 'Stay hydrated',  detail: 'Drink plenty of fluids throughout the day.' }
    )
  }

  return steps.slice(0, 5)
}

// ─────────────────────────────────────────────────────────────
// MAIN PROCESSOR
// ─────────────────────────────────────────────────────────────

function processCondition(condition: any): any {
  const triage = parseTriage(condition)
  const whatToDoNow = parseWhatToDoNow(condition)
  const conditionTags = parseConditionTags(condition)
  const twoLineSummary = parseTwoLineSummary(condition)

  let parseQuality = 'minimal'
  if (twoLineSummary && whatToDoNow.length >= 2) parseQuality = 'auto'
  if (whatToDoNow.length >= 3 && condition.overview) parseQuality = 'good'

  return {
    health_conditions_id: condition.id,
    slug:                 condition.slug || slugify(condition.condition_name),
    common_name:          condition.condition_name,
    condition_tags:       conditionTags,
    two_line_summary:     twoLineSummary,
    triage,
    what_to_do_now:       whatToDoNow,
    overview:             clean(condition.overview)?.slice(0, 2000) || null,
    causes:               clean(condition.causes)?.slice(0, 1000) || null,
    symptoms_detail:      clean(condition.symptoms)?.slice(0, 1000) || null,
    when_to_seek_help:    clean(condition.when_to_see_doctor)?.slice(0, 500) || null,
    related_ailments:     [],
    emergency_numbers:    { phone_111: true, healthline: '0800 611 116', poisons_centre: '0800 764 766' },
    healthify_url:        condition.healthify_url || null,
    last_reviewed_date:   condition.last_updated || null,
    parse_quality:        parseQuality,
  }
}

// ─────────────────────────────────────────────────────────────
// MAIN RUNNER
// ─────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2)
  const singleSlug = args.find(a => a.startsWith('--slug='))?.split('=')[1]

  console.log('Neuros Health — Ailment Parser')
  console.log('===================================')
  console.log('Source: public.health_conditions')
  console.log('Target: public.ailment_detail')
  console.log('Mode:   No external APIs')
  console.log()

  let query = supabase
    .from('health_conditions')
    .select('*')
    .not('overview', 'is', null)
    .order('condition_name')

  if (singleSlug) {
    // @ts-ignore — reassign for single-slug mode
    query = supabase.from('health_conditions').select('*').eq('slug', singleSlug)
  }

  const { data: conditions, error } = await query

  if (error || !conditions?.length) {
    console.error('Failed to fetch conditions:', error?.message || 'No conditions returned')
    process.exit(1)
  }

  // Check existing slugs to skip already-processed rows
  const { data: existing } = await supabase.from('ailment_detail').select('slug')
  const existingSlugs = new Set(existing?.map((e: any) => e.slug) || [])
  const toProcess = singleSlug
    ? conditions
    : conditions.filter((c: any) => {
        const s = c.slug || slugify(c.condition_name)
        return !existingSlugs.has(s)
      })

  console.log(`Found: ${conditions.length} conditions`)
  console.log(`Already processed: ${existingSlugs.size}`)
  console.log(`To process: ${toProcess.length}`)
  console.log()

  if (toProcess.length === 0) {
    console.log('All ailments already processed!')
    return
  }

  let success = 0
  let failed = 0
  const BATCH_SIZE = 50

  for (let i = 0; i < toProcess.length; i += BATCH_SIZE) {
    const batch = toProcess.slice(i, i + BATCH_SIZE)
    const records = batch.map(processCondition)

    const { error: upsertError } = await supabase
      .from('ailment_detail')
      .upsert(records, { onConflict: 'slug' })

    if (upsertError) {
      // Fall back to per-record upsert to identify which rows fail
      for (const record of records) {
        const { error: singleError } = await supabase
          .from('ailment_detail')
          .upsert([record], { onConflict: 'slug' })
        if (singleError) {
          failed++
          console.error(`\n  Failed: ${record.common_name}: ${singleError.message}`)
        } else {
          success++
        }
      }
    } else {
      success += batch.length
    }

    const pct = Math.round(((i + batch.length) / toProcess.length) * 100)
    process.stdout.write(`\r  Progress: ${i + batch.length}/${toProcess.length} (${pct}%)  ok:${success}  fail:${failed}`)
  }

  console.log('\n')
  console.log('===================================')
  console.log(`COMPLETE: ${success} succeeded  ${failed} failed`)
  console.log()
  console.log('Verify in Supabase SQL Editor:')
  console.log('  SELECT parse_quality, count(*) FROM ailment_detail GROUP BY parse_quality;')
}

main().catch(console.error)
