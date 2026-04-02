import { MedicationDetailClient } from "./MedicationDetailClient";
import { getMedicineBySlug } from '@/lib/db/nz-health';

export default async function MedicationDetailPage({ params }: { params: { id: string } }) {
  // Try finding in NZ DB first
  const nzMed = await getMedicineBySlug(params.id);
  
  return <MedicationDetailClient initialId={params.id} nzData={nzMed} />;
}
