import Galaxy from "@/components/ui/Galaxy";
import Link from "next/link";
import { memo } from "react";

// Memoized Galaxy background to prevent re-renders
const MemoizedGalaxy = memo(function MemoizedGalaxy() {
  return (
    <Galaxy
      density={0.8}
      speed={0.3}
      starSpeed={0.3}
      hueShift={200}
      glowIntensity={0.4}
      saturation={0.3}
      twinkleIntensity={0.5}
      rotationSpeed={0.02}
      mouseRepulsion={true}
      repulsionStrength={1.5}
      transparent={false}
    />
  );
});

export default function NotFound() {
  return (
    <div
      style={{
        backgroundColor: "#060606",
      }}
      className="min-h-screen flex items-center justify-center"
    >
      {/* Galaxy Background */}
      <div className="fixed inset-0 z-0">
        <MemoizedGalaxy />
      </div>
      <div className="text-center z-10">
        <h1 className="text-5xl font-bold text-white mb-4">404</h1>
        <p className="mb-6 text-white">Page not found</p>
        <Link href="/" className="text-[#7FB3EA] hover:underline">
          Return Home
        </Link>
      </div>
    </div>
  );
}
