'use client';

import Link from 'next/link';
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useCountUp } from "@/hooks/useCountUp";
import HeroSectionV2 from "@/components/hero/HeroSectionV2";
import SEOHead from "@/components/seo/SEOHead";
import JsonLd, { organizationSchema } from "@/components/seo/JsonLd";
import PlatformsCarousel from "@/components/platforms/PlatformsCarousel";
import { ArrowRight, Users, Cpu, FileCheck, Radar } from "lucide-react";
import CtaChevrons from "@/components/ui/CtaChevrons";
import NetworkHubViz from "@/components/intelligence/NetworkHubViz";

const stats = [
  { label: "Lead Qualification Rate", value: 85, suffix: "%", prefix: "+", accent: "from-primary to-secondary" },
  { label: "Conversion Improvement", value: 10, suffix: "x", prefix: "+", accent: "from-secondary to-accent" },
  { label: "Client Education Score", value: 94, suffix: "%", prefix: "+", accent: "from-accent to-primary" },
  { label: "Sales Friction Reduction", value: 60, suffix: "%", prefix: "+", accent: "from-primary to-accent" },
];

const StatCard = ({ label, value, suffix, prefix = "" }: { label: string; value: number; suffix: string; prefix?: string; accent: string }) => {
  const { count, ref } = useCountUp(value);
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="glass-terminal rounded-xl p-6 text-center relative overflow-hidden">
      <div className="tilt-gradient-line" />
      <p className="text-3xl sm:text-4xl font-bold font-mono text-gradient">{prefix}{count}{suffix}</p>
      <p className="text-sm text-muted-foreground mt-2 font-mono">{label}</p>
    </div>
  );
};

export default function Home() {
  const sectionRef = useScrollReveal<HTMLDivElement>();

  return (
    <>
      <SEOHead
        title="Mitryxa | AI Decision Platforms"
        description="Mitryxa builds AI decision platforms and digital intelligence systems that guide customers, discover opportunities, qualify leads, and help professional businesses convert more high-value clients."
        canonical="https://mitryxa.com"
      />
      <JsonLd data={organizationSchema} />

      <HeroSectionV2 />

      <div ref={sectionRef}>

        {/* ── AI Decision Platforms by Industry ── */}
        <section className="py-24 scroll-reveal">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 font-mono">&gt;_ Platform Command</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">AI Decision Platforms by Industry</h2>
              <p className="text-muted-foreground mt-4 max-w-xl mx-auto">Intelligent systems built for professional service businesses across every vertical.</p>
            </div>
            <PlatformsCarousel />
          </div>
        </section>

        {/* ── Intelligence Layer Promo ── */}
        <section className="py-20 scroll-reveal">
          <div className="container mx-auto px-4 lg:px-8">
            <div
              className="glass-terminal rounded-2xl relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, hsl(263 70% 50% / 0.06), hsl(186 100% 42% / 0.04), hsl(217 91% 60% / 0.06))" }}
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-secondary via-accent to-primary" />
              <div className="absolute inset-0 animate-scanline pointer-events-none" />
              <div className="flex flex-col lg:flex-row items-center gap-0">
                <div className="w-full lg:w-[340px] h-[240px] lg:h-[280px] shrink-0 relative">
                  <NetworkHubViz />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background/80 hidden lg:block pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80 lg:hidden pointer-events-none" />
                </div>
                <div className="flex-1 p-8 lg:p-10 relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <Radar size={14} className="text-secondary" />
                    <p className="text-xs font-semibold uppercase tracking-widest text-secondary font-mono">&gt;_ Core Service</p>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Digital Intelligence Layer</h2>
                  <p className="text-muted-foreground mt-3 max-w-lg text-sm leading-relaxed">
                    Discover opportunities across the internet, handle inquiries instantly, and convert digital attention into revenue — all powered by operational intelligence.
                  </p>
                  <Link href="/intelligence" className="btn-cta mt-6 inline-flex">
                    <span>&gt;_ Explore Intelligence</span> <CtaChevrons />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="py-24 scroll-reveal">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((s) => (
                <StatCard key={s.label} {...s} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Two Engines, One System ── */}
        <section className="py-24 scroll-reveal">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 font-mono">&gt;_ How It Works</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Two Engines, One System</h2>
              <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
                Decision platforms qualify visitors on your site. The Intelligence Layer discovers opportunities across the internet. Together, they drive qualified leads.
              </p>
            </div>

            {/* Decision Platform Path */}
            <div className="mb-6">
              <p className="text-[10px] font-mono text-primary/60 uppercase tracking-widest text-center mb-3">Decision Platform</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                <div className="glass-terminal rounded-xl p-5 text-center w-full sm:w-48 relative overflow-hidden">
                  <div className="tilt-gradient-line" />
                  <Users size={24} className="text-primary mx-auto mb-2" />
                  <p className="text-xs font-semibold text-foreground font-mono">User Input</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Guided questions</p>
                </div>
                <ArrowRight size={20} className="text-primary shrink-0 rotate-90 sm:rotate-0" />
                <div className="glass-terminal rounded-xl p-6 text-center w-full sm:w-56 border-primary/30 border relative overflow-hidden">
                  <div className="tilt-gradient-line" />
                  <Cpu size={28} className="text-primary mx-auto mb-2" />
                  <p className="text-sm font-bold text-gradient font-mono">AI Analysis</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Qualifies &amp; routes</p>
                </div>
                <ArrowRight size={20} className="text-accent shrink-0 rotate-90 sm:rotate-0" />
                <div className="glass-terminal rounded-xl p-5 text-center w-full sm:w-48 relative overflow-hidden">
                  <div className="tilt-gradient-line" />
                  <FileCheck size={24} className="text-accent mx-auto mb-2" />
                  <p className="text-xs font-semibold text-foreground font-mono">Qualified Lead</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Intelligence report</p>
                </div>
              </div>
            </div>

            {/* Intelligence Layer Path */}
            <div>
              <p className="text-[10px] font-mono text-secondary/60 uppercase tracking-widest text-center mb-3">Intelligence Layer</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                <div className="glass-terminal rounded-xl p-5 text-center w-full sm:w-48 relative overflow-hidden">
                  <div className="tilt-gradient-line" />
                  <Radar size={24} className="text-secondary mx-auto mb-2" />
                  <p className="text-xs font-semibold text-foreground font-mono">Signal Detection</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Across the internet</p>
                </div>
                <ArrowRight size={20} className="text-secondary shrink-0 rotate-90 sm:rotate-0" />
                <div className="glass-terminal rounded-xl p-6 text-center w-full sm:w-56 border-secondary/30 border relative overflow-hidden">
                  <div className="tilt-gradient-line" />
                  <Radar size={28} className="text-secondary mx-auto mb-2" />
                  <p className="text-sm font-bold text-gradient font-mono">Intelligence Engine</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Discovers &amp; engages</p>
                </div>
                <ArrowRight size={20} className="text-accent shrink-0 rotate-90 sm:rotate-0" />
                <div className="glass-terminal rounded-xl p-5 text-center w-full sm:w-48 relative overflow-hidden">
                  <div className="tilt-gradient-line" />
                  <FileCheck size={24} className="text-accent mx-auto mb-2" />
                  <p className="text-xs font-semibold text-foreground font-mono">New Opportunity</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Qualified &amp; routed</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Final CTA → Argus ── */}
        <section className="py-24 scroll-reveal">
          <div className="container mx-auto px-4 lg:px-8">
            <div
              className="glass-terminal rounded-2xl p-10 sm:p-16 text-center relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, hsl(217 91% 60% / 0.1), hsl(263 70% 50% / 0.1), hsl(186 100% 42% / 0.08))" }}
            >
              <div className="tilt-gradient-line" />
              <div className="absolute inset-0 animate-scanline pointer-events-none" />
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4 font-mono relative z-10">&gt;_ Your AI Partner</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground relative z-10">Ready to Build Your AI Platform?</h2>
              <p className="text-muted-foreground mt-4 max-w-lg mx-auto relative z-10">
                Skip the forms. Talk directly to Argus — Mitryxa&apos;s AI partner. Ask anything, get a real plan, start a project.
              </p>
              <Link href="/argus" className="btn-cta relative z-10 mt-8 inline-flex">
                <span>&gt;_ Talk to Argus</span> <CtaChevrons />
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
