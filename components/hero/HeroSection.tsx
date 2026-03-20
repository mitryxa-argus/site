'use client';

import Link from 'next/link';
import NetworkVisualization from "./NetworkVisualization";
import { Layers } from "lucide-react";
import CtaChevrons from "@/components/ui/CtaChevrons";

const floatingCards = [
  { title: "Case Navigator", desc: "Legal case assessment", delay: "0s" },
  { title: "Health Assessment", desc: "Medical consultation routing", delay: "1s" },
  { title: "Home Buying Path", desc: "Real estate decision guide", delay: "2s" },
  { title: "Wealth Planner", desc: "Financial strategy builder", delay: "3s" },
];

const HeroSection = () => (
  <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16">
    {/* Background effects */}
    <div className="absolute inset-0 bg-gradient-hero" />
    <NetworkVisualization />

    {/* Content */}
    <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-muted-foreground mb-8">
        <Layers size={14} className="text-primary" />
        AI Decision Platforms
      </div>

      <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] max-w-5xl mx-auto">
        Websites That Think{" "}
        <span className="text-gradient">Before Your Sales Team</span>{" "}
        Has To
      </h1>

      <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
        Mitryxa builds AI decision platforms that educate customers, guide choices, and generate highly qualified leads for professional service businesses.
      </p>

      <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/argus" className="btn-cta">
          <span>Start a Project</span> <CtaChevrons />
        </Link>
        <Link
          href="/ai-platforms"
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-semibold rounded-lg border border-white/10 text-foreground hover:bg-white/5 transition-all duration-300"
        >
          Explore Platforms
        </Link>
      </div>
    </div>

    {/* Floating cards */}
    <div className="relative z-10 container mx-auto px-4 lg:px-8 mt-20 pb-20">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {floatingCards.map((card) => (
          <div
            key={card.title}
            className="glass glow-border rounded-xl p-5 hover:scale-[1.03] hover:-translate-y-1 transition-all duration-300 animate-float"
            style={{ animationDelay: card.delay }}
          >
            <h3 className="text-sm font-semibold text-foreground">{card.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HeroSection;
