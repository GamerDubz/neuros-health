"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LandingBackground } from "@/components/marketing/LandingBackground";
import { LandingFeatureStrip } from "@/components/marketing/LandingFeatureStrip";
import { LandingFinalCtaSection } from "@/components/marketing/LandingFinalCtaSection";
import { LandingFooter } from "@/components/marketing/LandingFooter";
import { LandingHeroSection } from "@/components/marketing/LandingHeroSection";
import { LandingHowItWorksSection } from "@/components/marketing/LandingHowItWorksSection";
import { LandingNavbar } from "@/components/marketing/LandingNavbar";
import { LandingPrivacySection } from "@/components/marketing/LandingPrivacySection";

export default function LandingPageClient() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 768) {
      router.replace("/onboarding");
      return;
    }

    setMounted(true);
  }, [router]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-linear-to-br from-surface to-primary-container/10 font-sans text-on-surface relative overflow-hidden">
      <LandingBackground />
      <LandingNavbar />
      <LandingHeroSection />
      <LandingFeatureStrip />
      <LandingHowItWorksSection />
      <LandingPrivacySection />
      <LandingFinalCtaSection />
      <LandingFooter />
    </div>
  );
}
