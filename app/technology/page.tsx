'use client';

import Link from 'next/link';
import { useScrollReveal } from "@/hooks/useScrollReveal";
import SEOHead from "@/components/seo/SEOHead";
import { Brain, GitBranch, BarChart3, Layers, ArrowRight, Cpu, Database, Shield, Zap, Radar } from "lucide-react";

import TechnologyVisual from "@/components/technology/TechnologyVisual";
const technologyHero = '/assets/technology-hero.jpg';

const topics = [
  {
    icon: Brain,
    title: "AI-Guided Decision Flows",
    description: "Our platforms use intelligent branching logic that adapts in real-time based on user responses. Each path is optimized for qualification accuracy and educational value, creating experiences that feel like expert consultations rather than static questionnaires.",
    details: ["Contextual question branching based on prior answers", "Real-time qualification scoring at each step", "Adaptive educational content delivery", "Multi-dimensional lead intelligence generation"],
  },
  {
    icon: BarChart3,
    title: "User Behavior Analysis",
    description: "Every interaction generates behavioral signals — response speed, engagement depth, navigation patterns. These signals feed into qualification models that predict intent and readiness, enabling smarter lead routing before any human conversation.",
    details: ["Response timing analysis for intent signals", "Engagement depth tracking across sessions", "Pattern recognition for conversion prediction", "Automated urgency and readiness scoring"],
  },
  {
    icon: GitBranch,
    title: "Structured Lead Intelligence",
    description: "Platforms produce detailed prospect profiles organized into actionable intelligence reports. Your team receives structured data about needs, preferences, timeline, and qualification score — transforming cold outreach into informed conversations.",
    details: ["Comprehensive prospect situation summaries", "Multi-criteria qualification scoring", "Recommended conversation approaches", "CRM-ready structured data export"],
  },
  {
    icon: Layers,
    title: "Platform Architecture",
    description: "Built on modular, scalable architecture that separates decision logic from presentation. This enables rapid customization for different industries while maintaining the reliability and performance that professional service businesses require.",
    details: ["Modular component-based design system", "Separation of decision logic and UI layers", "Industry-specific configuration without code changes", "Enterprise-grade performance and reliability"],
  },
  {
    icon: Radar,
    title: "Intelligence Discovery Engine",
    description: "The Intelligence Layer uses real-time scanning and natural language analysis to identify relevant conversations across the internet. It evaluates context, qualifies opportunities, and routes engagement — turning scattered digital signals into structured business intelligence.",
    details: ["Cross-platform opportunity scanning and signal detection", "Natural language conversation analysis", "Real-time engagement routing and qualification", "Automated authority building through strategic participation"],
  },
];

const principles = [
  { icon: Cpu, title: "Edge Computing", description: "Platforms render and compute at the edge for sub-100ms response times worldwide.", accent: "from-primary to-secondary" },
  { icon: Database, title: "Data Isolation", description: "Each client's data is fully isolated with encryption at rest and in transit.", accent: "from-secondary to-accent" },
  { icon: Shield, title: "Security First", description: "SOC 2 aligned practices with regular security audits and penetration testing.", accent: "from-accent to-primary" },
  { icon: Zap, title: "Performance", description: "Lighthouse scores above 95 with lazy loading and optimized asset delivery.", accent: "from-primary via-secondary to-accent" },
];

const Technology = () => {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <>
      <SEOHead
        title="Our Technology | Mitryxa"
        description="Explore the technology behind Mitryxa's AI decision platforms and Digital Intelligence Layer: intelligent flows, behavior analysis, opportunity discovery, and modular architecture."
        canonical="https://mitryxa.com/technology"
      />

      <div ref={ref} className="pt-16">
        {/* Hero with image */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0">
            <img src={technologyHero} alt="Mitryxa platform architecture" className="w-full h-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
          </div>
          <div className="container mx-auto px-4 lg:px-8 text-center relative z-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3 font-mono">&gt;_ Technology</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">Built for <span className="text-gradient">Intelligent</span> Decisions</h1>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">The architecture behind platforms that think and intelligence systems that discover.</p>
          </div>
        </section>


        {/* Topics */}
        <section className="py-24">
          <div className="container mx-auto px-4 lg:px-8 space-y-20">
            {topics.map((t, i) => {
              const Icon = t.icon;
              return (
                <div key={t.title} className={`scroll-reveal flex flex-col lg:flex-row gap-10 items-center ${i % 2 ? "lg:flex-row-reverse" : ""}`}>
                  <div className="flex-1 glass-terminal rounded-2xl aspect-video relative overflow-hidden">
                    <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${["from-primary to-secondary", "from-secondary to-accent", "from-accent to-primary", "from-primary via-secondary to-accent"][i % 4]}`} />
                    <div className="absolute inset-0 animate-scanline pointer-events-none" />
                    <TechnologyVisual title={t.title} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-foreground mb-4 font-mono"><span className="text-primary/50">&gt;_</span> {t.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{t.description}</p>
                    <ul className="mt-6 space-y-2">
                      {t.details.map((d) => (
                        <li key={d} className="flex items-center gap-2 text-sm text-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Engineering Principles */}
        <section className="py-24 scroll-reveal">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground text-center mb-12 font-mono"><span className="text-primary/50">&gt;_</span> Engineering Principles</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {principles.map((p) => {
                const Icon = p.icon;
                return (
                  <div key={p.title} className="glass-terminal rounded-xl p-6 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden">
                    <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${p.accent}`} />
                    <Icon size={24} className="text-primary mb-3" />
                    <h3 className="text-sm font-semibold text-foreground mb-2 font-mono">{p.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{p.description}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                      <span className="text-[10px] text-muted-foreground font-mono">Active</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 scroll-reveal">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-foreground">See the Technology in Action</h2>
            <p className="text-muted-foreground mt-3">Explore our decision platforms and intelligence systems built on this architecture.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link href="/ai-platforms" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm font-mono hover:shadow-[0_0_30px_hsl(217_91%_60%/0.4)] transition-all">
                &gt;_ View Platforms <ArrowRight size={16} />
              </Link>
              <Link href="/intelligence" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg border border-white/10 text-foreground font-semibold text-sm font-mono hover:bg-white/5 transition-all">
                &gt;_ Explore Intelligence <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Technology;
