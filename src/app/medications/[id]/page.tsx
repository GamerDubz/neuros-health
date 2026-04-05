import { MedicationDetailClient } from "./MedicationDetailClient";

// With output: 'export', we can't pre-render all 2,047 medicines.
// Instead, the client component fetches data on mount.
// Only pre-render a few common ones for speed.
export async function generateStaticParams() {
  return [
    { id: "levothyroxine" },
    { id: "lisinopril" },
    { id: "metformin" },
    { id: "paracetamol" },
  ];
}

export default async function MedicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Pass just the ID — the client component will fetch NZ data itself
  return <MedicationDetailClient initialId={id} />;
}
