"use client";

import { BeamsBackground } from "@/components/ui/beams-background";
import { FloatingHeader } from "@/components/ui/floating-header";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-neutral-950">
      {/* Beams Background */}
      <div className="absolute inset-0 z-0">
        <BeamsBackground className="absolute inset-0" />
      </div>
      
      {/* Header */}
      <div className="relative z-50">
        <FloatingHeader />
      </div>

      {/* Hero Content */}
      <div className="relative z-10">
        <HeroGeometric 
          badge=""
          title1="Bet on Your"
          title2="Favorite Teams"
        />
      </div>
    </div>
  );
}
