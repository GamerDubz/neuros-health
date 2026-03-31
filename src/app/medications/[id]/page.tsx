import { MedicationDetailClient } from "./MedicationDetailClient";

export async function generateStaticParams() {
  return [
    { id: "m1" },
    { id: "m2" },
    { id: "m4" }
  ];
}

export default function MedicationDetailPage({ params }: { params: { id: string } }) {
  return <MedicationDetailClient initialId={params.id} />;
}
