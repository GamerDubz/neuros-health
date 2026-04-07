import { HealthCondition } from "@/lib/db/conditions";

export type HealthGuidanceTriage =
  | "SELF_CARE"
  | "SEE_PHARMACIST"
  | "CALL_HEALTHLINE"
  | "CALL_111_IMMEDIATELY";

export interface HealthGuidanceData {
  symptomsText: string;
  triage: HealthGuidanceTriage;
  topMatch: {
    name: string;
    overview?: string;
    emergency?: string;
  } | null;
  whatItMayBe: string;
  actions: string[];
  watchOut: string[];
}

interface HealthGuidanceInput {
  symptoms: string;
  duration: string;
  severity: string;
  topMatch?: HealthCondition;
}

function getTriageLevel({
  symptoms,
  duration,
  severity,
}: Omit<HealthGuidanceInput, "topMatch">): HealthGuidanceTriage {
  const normalisedSymptoms = symptoms.toLowerCase();
  const redFlags = [
    "chest",
    "breath",
    "crushing",
    "severe pain",
    "unconscious",
    "stroke",
    "bleeding",
  ];
  const hasRedFlag =
    redFlags.some((flag) => normalisedSymptoms.includes(flag)) ||
    severity === "Severe";

  if (hasRedFlag) return "CALL_111_IMMEDIATELY";
  if (duration === "1 week+" || duration === "2 weeks+") return "SEE_PHARMACIST";
  if (
    normalisedSymptoms.includes("dizzy") ||
    normalisedSymptoms.includes("vomit") ||
    normalisedSymptoms.includes("fever")
  ) {
    return "CALL_HEALTHLINE";
  }

  return "SELF_CARE";
}

/**
 * Builds the UI-ready response payload for the symptom guidance screen.
 */
export function buildHealthGuidance({
  symptoms,
  duration,
  severity,
  topMatch,
}: HealthGuidanceInput): HealthGuidanceData {
  const triage = getTriageLevel({ symptoms, duration, severity });

  return {
    symptomsText: `${symptoms}, ${severity.toLowerCase()} severity for ${duration.toLowerCase()}.`,
    triage,
    topMatch: topMatch
      ? {
          name: topMatch.condition_name,
          overview: topMatch.overview,
          emergency: topMatch.emergency,
        }
      : null,
    whatItMayBe: topMatch
      ? `Based on your symptoms, this matches information on ${topMatch.condition_name}.`
      : triage === "CALL_111_IMMEDIATELY"
        ? "The symptoms you have described could indicate a serious or life-threatening medical emergency."
        : "We couldn't find a direct match in our database, but here is general advice for your triage level.",
    actions: topMatch?.self_care
      ? [`${topMatch.self_care.split(".")[0]}.`]
      : triage === "CALL_111_IMMEDIATELY"
        ? ["Call 111 immediately for an ambulance.", "Unlock your front door if possible."]
        : ["Rest and stay hydrated.", "Monitor your temperature."],
    watchOut: topMatch?.emergency
      ? [`${topMatch.emergency.split(".")[0]}.`]
      : ["Symptoms suddenly worsen.", "Difficulty breathing."],
  };
}
