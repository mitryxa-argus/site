'use client';

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { useLostVisitorDetection } from "@/hooks/useLostVisitorDetection";
import { X, ChevronRight } from "lucide-react";

const LostVisitorCTA = () => {
  const { isLost, dismiss } = useLostVisitorDetection();
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  // Animate in when detected
  useEffect(() => {
    if (isLost) {
      requestAnimationFrame(() => setVisible(true));

      // Auto-hide after 30 seconds
      const timer = setTimeout(() => handleDismiss(), 30000);
      return () => clearTimeout(timer);
    }
  }, [isLost]);

  const handleDismiss = () => {
    setExiting(true);
    setTimeout(() => {
      setVisible(false);
      dismiss();
    }, 400);
  };

  const handleClick = () => {
    router.push("/quote");
    handleDismiss();
  };

  if (!isLost && !visible) return null;

  return (
    <div
      className={`fixed right-0 top-1/2 -translate-y-1/2 z-50 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
        visible && !exiting ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Dismiss button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDismiss();
        }}
        className="absolute -left-8 top-1 w-7 h-7 rounded-full bg-background/80 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors z-10"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>

      {/* Main CTA button */}
      <button
        onClick={handleClick}
        className="group relative flex flex-col items-start gap-0.5 px-5 py-4 pr-6 rounded-l-xl cursor-pointer overflow-hidden alarm-cta-glow"
        style={{
          background:
            "linear-gradient(135deg, hsl(0 84% 40%), hsl(320 70% 35%), hsl(263 70% 40%))",
        }}
      >
        {/* Scanline overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(0 0% 0% / 0.3) 2px, hsl(0 0% 0% / 0.3) 4px)",
          }}
        />

        {/* Pulsing beacon dot */}
        <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-red-400 alarm-beacon" />

        {/* Text content */}
        <span className="relative text-sm font-bold font-mono tracking-wide text-white/95">
          Lost?
        </span>
        <span className="relative flex items-center gap-1 text-xs font-mono text-white/70 group-hover:text-white/90 transition-colors">
          Start here
          <ChevronRight
            size={14}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </span>
      </button>
    </div>
  );
};

export default LostVisitorCTA;
