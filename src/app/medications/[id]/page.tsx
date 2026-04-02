import { MedicationDetailClient } from "./MedicationDetailClient";
import { getMedicineBySlug, getAllMedicineSlugs } from '@/lib/db/nz-health';

export async function generateStaticParams() {
  const medicines = await getAllMedicineSlugs();
  return medicines.map((med) => ({
    id: med.slug,
  }));
}

export default async function MedicationDetailPage({ params }: { params: { id: string } }) {
  // Try finding in NZ DB first
  const nzMed = await getMedicineBySlug(params.id);
  
  return <MedicationDetailClient initialId={params.id} nzData={nzMed} />;
}
