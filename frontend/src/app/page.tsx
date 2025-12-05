"use client";

import { BeamsBackground } from "@/components/ui/beams-background";
import { FloatingHeader } from "@/components/ui/floating-header";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-neutral-950">
      {/* Beams Background */}
      <div className="absolute inset-0 z-0">
        <BeamsBackground className="absolute inset-0" />
      </div>
      {/* Header */}
      <FloatingHeader />

      {/* Main Content */}

    </div>
  );
}
