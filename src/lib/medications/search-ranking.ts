import { Medicine } from "@/lib/db/nz-health";

function getPrefixScore(
  name: string,
  brands: string[],
  genericName: string,
  query: string,
): number {
  if (name.startsWith(query)) return 0;
  if (brands.some((brandName) => brandName.startsWith(query))) return 1;
  if (name.split(/\s+/).some((word) => word.startsWith(query))) return 2;
  if (brands.some((brandName) => brandName.split(/\s+/).some((word) => word.startsWith(query)))) {
    return 3;
  }
  if (genericName.startsWith(query)) return 4;
  return 5;
}

/**
 * Orders medicine search results so exact and prefix matches stay at the top.
 */
export function rankMedicineSearchResults(data: Medicine[], query: string): Medicine[] {
  return [...data].sort((medicineA, medicineB) => {
    const medicineAName = (medicineA.display_name || "").toLowerCase();
    const medicineBName = (medicineB.display_name || "").toLowerCase();
    const medicineABrands = (medicineA.brand_names || []).map((brandName) => brandName.toLowerCase());
    const medicineBBrands = (medicineB.brand_names || []).map((brandName) => brandName.toLowerCase());
    const medicineAScore = getPrefixScore(
      medicineAName,
      medicineABrands,
      (medicineA.generic_name || "").toLowerCase(),
      query,
    );
    const medicineBScore = getPrefixScore(
      medicineBName,
      medicineBBrands,
      (medicineB.generic_name || "").toLowerCase(),
      query,
    );

    if (medicineAScore !== medicineBScore) {
      return medicineAScore - medicineBScore;
    }

    return medicineAName.localeCompare(medicineBName);
  });
}
