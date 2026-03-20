'use client';

import { useState } from "react";
import Link from 'next/link';
import { useScrollReveal } from "@/hooks/useScrollReveal";
import SEOHead from "@/components/seo/SEOHead";
import { platforms } from "@/data/platforms";
import { caseStudies } from "@/data/caseStudies";
import { ArrowRight, Users, Cpu, FileCheck, ExternalLink } from "lucide-react";
import CtaChevrons from "@/components/ui/CtaChevrons";

const platformsHero = '/assets/platforms-hero.jpg';
import NetworkHubViz from "@/components/intelligence/NetworkHubViz";

const platformDetails: Record<string, { useCases: string[]; metrics: string; category: string }> = {
  legal: { useCases: ["Personal injury case assessment", "Family law intake qualification", "Employment dispute evaluation", "Criminal defense eligibility screening"], metrics: "12x conversion improvement", category: "Legal" },
  medical: { useCases: ["Symptom assessment and triage", "Treatment eligibility evaluation", "Insurance pre-qualification", "Specialist referral routing"], metrics: "8x lead quality increase", category: "Healthcare" },
  realestate: { useCases: ["Buyer readiness assessment", "Property matching algorithm", "Mortgage pre-qualification", "Neighborhood fit analysis"], metrics: "340% more qualified leads", category: "Real Estate" },
  wealth: { useCases: ["Risk tolerance profiling", "Retirement planning assessment", "Investment strategy matching", "Tax optimization evaluation"], metrics: "65% time saved on intake", category: "Finance" },
  mortgage: { useCases: ["Borrower pre-qualification", "Loan type comparison tool", "Rate scenario modeling", "Documentation readiness check"], metrics: "5x application completion", category: "Finance" },
  cosmetic: { useCases: ["Procedure suitability assessment", "Expectation alignment tool", "Recovery planning guide", "Provider matching system"], metrics: "4x consultation bookings", category: "Healthcare" },
  homehealth: { useCases: ["Care needs evaluation", "Provider skill matching", "Insurance coverage check", "Family coordination portal"], metrics: "70% faster placement", category: "Healthcare" },
  globalflow: { useCases: ["Multi-rail payment processing", "USD account management", "Stablecoin settlement", "Compliance dashboard"], metrics: "5x demo requests", category: "Finance" },
  aurelia: { useCases: ["Interactive ring builder", "Collection showcase", "Bespoke consultation flow", "Client preference profiling"], metrics: "6x bespoke inquiries", category: "Creative" },
  welding: { useCases: ["Project type classification", "Material specification intake", "Complexity scoring", "Estimator routing"], metrics: "280% qualified leads", category: "Industrial" },
  kaprielle: { useCases: ["Product ritual education", "Shopify e-commerce storefront", "Entrepreneur program recruitment", "Ingredient transparency showcase"], metrics: "380% revenue increase", category: "Creative" },
  ericfilm: { useCases: ["Video portfolio showcase", "Celebrity wedding highlights", "Production reel integration", "Cinematic inquiry flow"], metrics: "420% inquiry volume", category: "Creative" },
  healingrituals: { useCases: ["Interactive Experience Finder", "Modality matching by intention", "Service education and benefits", "Sacred booking flow"], metrics: "290% new bookings", category: "Healthcare" },
};

const categories = ["All", "Healthcare", "Legal", "Finance", "Real Estate", "Creative", "Industrial"];

const Platforms = () => {
  const ref = useScrollReveal<HTMLDivElement>();
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredPlatforms = activeCategory === "All"
    ? platforms
    : platforms.filter((p) => platformDetails[p.id]?.category === activeCategory);

  return (
    <>
      <SEOHead
        title="AI Decision Platforms | Mitryxa"
        description="Explore Mitryxa's AI decision platforms and Digital Intelligence Layer for automated lead qualification, opportunity discovery, and reducing sales friction across legal, medical, real estate, and financial industries."
        canonical="https://mitryxa.com/ai-platforms"
      />

      <div ref={ref} className="pt-16">
        {/* Hero with image */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0">
            <img src={platformsHero} alt="Mitryxa platform dashboards" className="w-full h-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
          </div>
          <div className="container mx-auto px-4 lg:px-8 text-center relative z-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 font-mono">&gt;_ Platforms</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">Industry-Specific <span className="text-gradient">Decision Engines</span></h1>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">Each platform is designed for a specific industry, combining AI-guided decision flows with deep domain knowledge — powered by our Digital Intelligence Layer.</p>
          </div>
        </section>

        {/* Decision Engine Diagram */}
        <section className="py-24 scroll-reveal">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground">How the Decision Engine Works</h2>
            </div>
            <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-4">
              <div className="glass-terminal rounded-xl p-6 text-center w-full lg:w-56 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary to-secondary" />
                <Users size={28} className="text-primary mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-foreground font-mono"><span className="text-primary/50">&gt;_</span> User Input</h3>
                <p className="text-xs text-muted-foreground mt-1">Visitor answers guided questions</p>
              </div>
              <svg width="60" height="20" className="hidden lg:block text-primary shrink-0">
                <line x1="0" y1="10" x2="50" y2="10" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" className="animate-dash" />
                <polygon points="50,5 60,10 50,15" fill="currentColor" />
              </svg>
              <ArrowRight className="lg:hidden text-primary" />
              <div className="glass-terminal rounded-xl p-8 text-center w-full lg:w-64 border-primary/30 border-2 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-secondary to-accent" />
                <div className="absolute inset-0 animate-scanline pointer-events-none" />
                <Cpu size={32} className="text-primary mx-auto mb-3 relative z-10" />
                <h3 className="text-lg font-bold text-gradient font-mono relative z-10">AI Decision Engine</h3>
                <p className="text-xs text-muted-foreground mt-2 relative z-10">Analyzes, qualifies, and routes</p>
                <div className="flex items-center justify-center gap-2 mt-2 relative z-10">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  <span className="text-[10px] text-muted-foreground font-mono">Processing</span>
                </div>
              </div>
              <svg width="60" height="20" className="hidden lg:block text-accent shrink-0">
                <line x1="0" y1="10" x2="50" y2="10" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" className="animate-dash" />
                <polygon points="50,5 60,10 50,15" fill="currentColor" />
              </svg>
              <ArrowRight className="lg:hidden text-accent" />
              <div className="glass-terminal rounded-xl p-6 text-center w-full lg:w-56 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent to-primary" />
                <FileCheck size={28} className="text-accent mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-foreground font-mono"><span className="text-accent/50">&gt;_</span> Structured Outcome</h3>
                <p className="text-xs text-muted-foreground mt-1">Qualified lead with intelligence report</p>
              </div>
            </div>
          </div>
        </section>

        {/* Category Filters */}
        <section className="scroll-reveal">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-wrap items-center gap-2 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-md text-xs font-mono font-semibold uppercase tracking-wider transition-all duration-300 border ${
                    activeCategory === cat
                      ? "bg-primary/20 border-primary/40 text-primary shadow-[0_0_12px_hsl(217_91%_60%/0.2)]"
                      : "bg-muted/30 border-border text-muted-foreground hover:text-foreground hover:border-primary/20"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Platform Visual Grid */}
        <section className="py-16 scroll-reveal">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlatforms.map((p) => {
                const details = platformDetails[p.id];
                const cs = caseStudies.find((c) => c.platformId === p.id);
                const heroImage = cs?.heroImage;
                const Icon = p.icon;

                return (
                  <div
                    key={p.id}
                    className="platform-card group relative rounded-xl overflow-hidden border border-border hover:border-primary/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_8px_40px_hsl(217_91%_60%/0.15)]"
                  >
                    {/* Hero image */}
                    <div className="relative h-48 sm:h-56 overflow-hidden">
                      {heroImage ? (
                        <img
                          src={heroImage}
                          alt={p.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted" />
                      )}
                      {/* Scanline overlay */}
                      <div className={`platform-card-scanline color-${p.color}`} />
                      {/* Bottom gradient fade */}
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent z-[3]" />
                      {/* Metric badge */}
                      {details && (
                        <div className="absolute top-3 right-3 z-[4]">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-background/80 backdrop-blur-sm border border-border text-xs font-mono font-semibold text-accent">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                            {details.metrics}
                          </span>
                        </div>
                      )}
                      {/* Category badge */}
                      {details && (
                        <div className="absolute top-3 left-3 z-[4]">
                          <span className="px-2 py-0.5 rounded bg-background/70 backdrop-blur-sm border border-border text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                            {details.category}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="relative z-[4] bg-card p-5 -mt-4">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Icon size={18} className="text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-foreground font-mono truncate">
                            <span className="text-primary/50">&gt;_</span> {p.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{p.description}</p>
                        </div>
                      </div>

                      {/* Use cases - shown on hover */}
                      {details && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <ul className="space-y-1">
                            {details.useCases.slice(0, 2).map((u) => (
                              <li key={u} className="text-[11px] text-muted-foreground font-mono flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-primary/50 shrink-0" />
                                <span className="truncate">{u}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Links */}
                      {cs && (
                        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border">
                          <Link
                            href={`/case-study/${cs.slug}`}
                            className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors font-semibold font-mono"
                          >
                            Case Study <ArrowRight size={12} />
                          </Link>
                          {cs.liveUrl && (
                            <a
                              href={cs.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
                            >
                              Live Site <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Top accent line */}
                    <div className="tilt-gradient-line" />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Intelligence Layer Featured */}
        <section className="py-24 scroll-reveal">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="glass-terminal rounded-2xl relative overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(263 70% 50% / 0.06), hsl(186 100% 42% / 0.04), hsl(217 91% 60% / 0.06))" }}>
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-secondary via-accent to-primary" />
              <div className="absolute inset-0 animate-scanline pointer-events-none" />
              <div className="flex flex-col lg:flex-row items-center">
                {/* Copy */}
                <div className="flex-1 p-8 sm:p-12 lg:p-14 relative z-10">
                  <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-3 font-mono">&gt;_ The Intelligence Engine</p>
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Digital Intelligence Layer</h2>
                  <p className="text-muted-foreground mt-4 leading-relaxed">
                    Every decision platform is powered by an intelligence layer underneath. It discovers relevant conversations across the internet, responds to inquiries before competitors do, and turns digital attention into qualified leads — automatically.
                  </p>
                  <ul className="mt-6 space-y-2">
                    {["Opportunity discovery across platforms", "Instant AI-powered inquiry handling", "Strategic engagement & authority building"].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-foreground/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link href="/intelligence" className="btn-cta mt-8">
                    <span>&gt;_ Explore Intelligence</span> <CtaChevrons />
                  </Link>
                </div>
                {/* Viz */}
                <div className="w-full lg:w-[380px] h-[260px] lg:h-[340px] shrink-0 relative">
                  <NetworkHubViz />
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-background/80 hidden lg:block pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-background/80 lg:hidden pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 scroll-reveal">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-foreground">Need a Custom Platform?</h2>
            <p className="text-muted-foreground mt-3 max-w-md mx-auto">We build decision platforms tailored to your industry and business model.</p>
            <Link href="/contact" className="btn-cta mt-8">
              <span>&gt;_ Start a Project</span> <CtaChevrons />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default Platforms;
