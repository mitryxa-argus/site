'use client';

import { useState } from "react";
import Link from 'next/link';
import { ArrowRight, Circle } from "lucide-react";
import { platforms } from "@/data/platforms";
import { caseStudies } from "@/data/caseStudies";
import { useIsMobile } from "@/hooks/use-mobile";

const shortLabels: Record<string, string> = {
  legal: "Legal",
  medical: "Medical",
  realestate: "Real Estate",
  wealth: "Wealth",
  mortgage: "Mortgage",
  cosmetic: "Cosmetic",
  homehealth: "Home Health",
  globalflow: "Payments",
  aurelia: "Jewels",
  welding: "Welding",
  kaprielle: "Skincare",
  ericfilm: "Film",
  healingrituals: "Healing",
};

const rings = [
  { platforms: platforms.slice(0, 5), radius: 130, speed: "orbital-ring-1" },
  { platforms: platforms.slice(5, 9), radius: 200, speed: "orbital-ring-2" },
  { platforms: platforms.slice(9, 13), radius: 270, speed: "orbital-ring-3" },
];

const ringColors = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(var(--accent))",
];

const OrbitalPlatforms = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const isPaused = hoveredId !== null;

  if (isMobile) {
    return (
      <div className="glass-terminal rounded-xl overflow-hidden border border-white/[0.06]">
        <div className="flex items-center gap-3 px-5 py-3 border-b border-white/[0.06]">
          <Circle size={6} className="text-accent fill-current animate-pulse" />
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">&gt;_ Platform Registry</span>
        </div>
        {platforms.map((p, i) => {
          const Icon = p.icon;
          const slug = caseStudies.find(cs => cs.platformId === p.id)?.slug || '';
          return (
            <Link
              key={p.id}
              href={`/ai-platforms/${slug}`}
              className={`flex items-center gap-4 px-5 py-5 hover:bg-white/[0.03] active:bg-white/[0.05] transition-colors ${i < platforms.length - 1 ? "border-b border-white/[0.04]" : ""}`}
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Icon size={20} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-mono font-semibold text-foreground truncate">{p.title}</p>
                <p className="text-[11px] font-mono text-muted-foreground truncate">{p.description}</p>
              </div>
              <ArrowRight size={14} className="text-muted-foreground shrink-0" />
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div className="relative w-full flex items-center justify-center" style={{ height: 620 }}>
      {/* Radar sweep */}
      <div
        className="absolute rounded-full pointer-events-none orbital-sweep"
        style={{
          width: 540,
          height: 540,
          background: `conic-gradient(from 0deg, transparent 0deg, hsl(var(--primary) / 0.08) 30deg, transparent 60deg)`,
        }}
      />

      {/* Concentric ring lines */}
      {rings.map((ring, ri) => (
        <div
          key={ri}
          className="absolute rounded-full border pointer-events-none"
          style={{
            width: ring.radius * 2,
            height: ring.radius * 2,
            borderColor: `hsl(var(--border) / 0.4)`,
          }}
        />
      ))}

      {/* Central core */}
      <div className="absolute z-10 flex flex-col items-center justify-center pointer-events-none">
        <div className="relative">
          <div className="absolute inset-[-20px] rounded-full animate-deploy-pulse" />
          <div
            className="w-24 h-24 rounded-full flex flex-col items-center justify-center relative"
            style={{
              background: `radial-gradient(circle, hsl(var(--primary) / 0.2) 0%, hsl(var(--background)) 70%)`,
              boxShadow: `0 0 60px hsl(var(--primary) / 0.15), inset 0 0 30px hsl(var(--primary) / 0.1)`,
            }}
          >
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse-glow mb-1" />
            <span className="text-[9px] font-mono font-bold text-primary tracking-[0.2em]">AI CORE</span>
          </div>
        </div>
      </div>

      {/* Orbital rings with platform nodes */}
      {rings.map((ring, ri) => (
        <div
          key={ri}
          className={`absolute pointer-events-none ${ring.speed}`}
          style={{
            width: ring.radius * 2,
            height: ring.radius * 2,
            animationPlayState: isPaused ? "paused" : "running",
          }}
        >
          {ring.platforms.map((platform, pi) => {
            const Icon = platform.icon;
            const angle = (360 / ring.platforms.length) * pi;
            const slug = caseStudies.find(cs => cs.platformId === platform.id)?.slug || '';
            const isHovered = hoveredId === platform.id;
            const label = shortLabels[platform.id] || platform.title;

            return (
              <div
                key={platform.id}
                className="absolute pointer-events-auto"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: `rotate(${angle}deg) translateX(${ring.radius}px) rotate(-${angle}deg)`,
                  marginTop: -28,
                  marginLeft: -28,
                  zIndex: isHovered ? 60 : 20,
                }}
              >
                {/* Counter-rotate wrapper */}
                <div
                  className={`orbital-node-counter ${ring.speed}-counter`}
                  style={{
                    animationPlayState: isPaused ? "paused" : "running",
                  }}
                >
                  <Link
                    href={`/ai-platforms/${slug}`}
                    className="relative flex flex-col items-center group"
                    onMouseEnter={() => setHoveredId(platform.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    {/* Node circle */}
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isHovered ? "scale-110" : ""
                      }`}
                      style={{
                        background: `radial-gradient(circle, ${ringColors[ri]}20, hsl(var(--background)))`,
                        boxShadow: isHovered
                          ? `0 0 30px ${ringColors[ri]}40, 0 0 60px ${ringColors[ri]}15`
                          : `0 0 15px ${ringColors[ri]}20`,
                        border: `1px solid ${ringColors[ri]}40`,
                      }}
                    >
                      <Icon size={22} style={{ color: ringColors[ri] }} />
                    </div>

                    {/* Label */}
                    <span
                      className="mt-1 text-[10px] font-mono font-semibold whitespace-nowrap transition-opacity duration-300"
                      style={{ color: ringColors[ri], opacity: isHovered ? 1 : 0.7 }}
                    >
                      {label}
                    </span>

                    {/* Hover detail card */}
                    <div
                      className={`absolute left-1/2 -translate-x-1/2 top-[72px] w-56 glass-terminal rounded-lg p-4 border border-white/[0.08] transition-all duration-200 ${
                        isHovered
                          ? "opacity-100 translate-y-0 pointer-events-auto"
                          : "opacity-0 translate-y-2 pointer-events-none"
                      }`}
                      style={{ zIndex: 70 }}
                    >
                      <div
                        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-lg"
                        style={{ background: `linear-gradient(to right, ${ringColors[ri]}, transparent)` }}
                      />
                      <p className="text-xs font-mono font-bold text-foreground mb-1">
                        <span style={{ color: ringColors[ri] }}>&gt;_</span> {platform.title}
                      </p>
                      <p className="text-[10px] font-mono text-muted-foreground leading-relaxed mb-3">
                        {platform.description}
                      </p>
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium" style={{ color: ringColors[ri] }}>
                        View Demo <ArrowRight size={10} />
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default OrbitalPlatforms;
