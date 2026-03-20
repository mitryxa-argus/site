'use client';

import { useState, useRef, useEffect, useCallback } from "react";
import Link from 'next/link';
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useDeviceOrientation } from "@/hooks/useDeviceOrientation";
import SEOHead from "@/components/seo/SEOHead";
import CtaChevrons from "@/components/ui/CtaChevrons";
import {
  Compass, Search, DollarSign, Target, ArrowRight, CheckCircle2, Terminal, Radar,
} from "lucide-react";
import BlueprintVisual from "@/components/tools/BlueprintVisual";
import AuditVisual from "@/components/tools/AuditVisual";
import EstimatorVisual from "@/components/tools/EstimatorVisual";
import CompetitionVisual from "@/components/tools/CompetitionVisual";
import NetworkHubViz from "@/components/intelligence/NetworkHubViz";
import TerminalCodeStream from "@/components/ui/TerminalCodeStream";

/* ── Tool data ── */
const tools = [
  {
    id: "blueprint",
    slug: "/tools/blueprint",
    icon: Compass,
    name: "Digital Blueprint",
    tagline: "Complete digital growth assessment",
    price: "$35",
    priceSub: "Full report",
    color: "from-primary to-secondary",
    textColor: "text-primary",
    description:
      "A comprehensive 12-month digital growth roadmap. The Blueprint analyzes your entire online presence — website, competitors, market positioning, pricing strategy — and delivers an actionable plan with priorities, timelines, and projected outcomes.",
    features: [
      "Full website & competitive landscape audit",
      "12-month phased implementation roadmap",
      "Pricing & positioning analysis",
      "Technology stack recommendations",
      "ROI projections with quarterly milestones",
    ],
    bestFor: [
      "Businesses planning a digital transformation",
      "Companies launching or redesigning their web presence",
      "Teams that want a single comprehensive strategy document",
    ],
    terminalLines: [
      "scan_domain(\"client.com\")...",
      "crawl_competitors(5)... done ✓",
      "analyze_pricing_model()...",
      "generate_roadmap(12_months)...",
      "compile_blueprint_v2... OK",
    ],
  },
  {
    id: "audit",
    slug: "/tools/audit",
    icon: Search,
    name: "Site Audit",
    tagline: "Full-spectrum signal scan",
    price: "Free",
    priceSub: "or $25 deep scan",
    color: "from-accent to-primary",
    textColor: "text-accent",
    description:
      "A real-time diagnostic scan of your website across SEO, security, performance, content, and conversion readiness. The free scan covers core signals; the paid deep scan delivers a full AI-generated report with prioritized fixes.",
    features: [
      "SEO & meta tag analysis",
      "Security header & SSL assessment",
      "Mobile responsiveness check",
      "Conversion element mapping",
      "Prioritized fix recommendations",
    ],
    bestFor: [
      "Quick health check on an existing site",
      "Pre-launch validation before going live",
      "Identifying quick wins for SEO & security",
    ],
    terminalLines: [
      "resolving DNS records...",
      "scan_html_structure()...",
      "check_ssl_tls()... valid ✓",
      "analyze_seo_signals()...",
      "compile_report... done",
    ],
  },
  {
    id: "estimator",
    slug: "/tools/estimator",
    icon: DollarSign,
    name: "Price Estimator",
    tagline: "AI pricing analysis",
    price: "$25",
    priceSub: "Full report",
    color: "from-secondary to-accent",
    textColor: "text-secondary",
    description:
      "Get a data-driven pricing estimate for your digital project. The AI analyzes scope, features, market rates, and complexity to deliver a transparent cost breakdown — no sales call required.",
    features: [
      "Feature-by-feature cost breakdown",
      "Market rate benchmarking",
      "Complexity & timeline estimation",
      "Technology stack cost analysis",
      "Budget optimization suggestions",
    ],
    bestFor: [
      "Planning budgets for a new website or app",
      "Comparing agency quotes against market rates",
      "Stakeholders needing cost justification",
    ],
    terminalLines: [
      "parse_requirements()...",
      "benchmark_market_rates()...",
      "calculate_complexity(0.82)...",
      "estimate_timeline(weeks=8)...",
      "generate_breakdown... OK",
    ],
  },
  {
    id: "competition",
    slug: "/tools/competition",
    icon: Target,
    name: "Competition Analysis",
    tagline: "Competitive landscape report",
    price: "$25",
    priceSub: "Full report",
    color: "from-primary via-secondary to-accent",
    textColor: "text-primary",
    description:
      "Understand how you stack up against your competitors. This tool crawls your site and up to 5 competitor sites, then delivers a side-by-side analysis of content, SEO, UX, security, and market positioning.",
    features: [
      "Side-by-side competitor comparison",
      "SEO & content gap analysis",
      "UX & conversion benchmarking",
      "Security posture comparison",
      "Strategic positioning recommendations",
    ],
    bestFor: [
      "Understanding where you're losing to competitors",
      "Identifying market gaps and opportunities",
      "Building a case for investment in specific areas",
    ],
    terminalLines: [
      "crawl_site(\"you.com\")...",
      "crawl_competitors(3)...",
      "diff_seo_signals()...",
      "compare_ux_patterns()...",
      "rank_positioning... done ✓",
    ],
  },
  {
    id: "intelligence",
    slug: "/intelligence",
    icon: Radar,
    name: "Intelligence Layer",
    tagline: "Operational intelligence system",
    price: "Custom",
    priceSub: "Strategy session",
    color: "from-secondary via-accent to-primary",
    textColor: "text-secondary",
    description:
      "An operational intelligence system that discovers relevant conversations across the internet, handles inquiries instantly, and converts digital attention into qualified leads — before your competitors even notice.",
    features: [
      "Opportunity discovery across platforms",
      "AI-powered instant inquiry handling",
      "Client journey intelligence & qualification",
      "Strategic authority building",
      "Real-time opportunity alerts",
    ],
    bestFor: [
      "Businesses losing leads to slow response times",
      "Companies wanting to discover clients before they search",
      "Firms looking to build authority and capture attention at scale",
    ],
    terminalLines: [
      "scanning_digital_signals()...",
      "discover_opportunities(Reddit, Quora)...",
      "qualify_lead(score=0.94)... ✓",
      "route_to_engagement()...",
      "intelligence_layer... active",
    ],
  },
];

const comparisonRows = [
  { label: "Scope", values: ["Full digital presence", "Single website", "Project pricing", "You vs. competitors", "Internet-wide signals"] },
  { label: "Price", values: ["$35", "Free / $25", "$25", "$25", "Custom"] },
  { label: "Delivery", values: ["~5 min", "~2 min", "~3 min", "~4 min", "Always-on"] },
  { label: "Pages analyzed", values: ["Multiple + competitors", "1 site", "N/A", "Up to 6 sites", "Across platforms"] },
  { label: "Actionable roadmap", values: ["✓ 12-month plan", "✓ Fix list", "✓ Budget plan", "✓ Strategy brief", "✓ Engagement strategy"] },
];

/* ── Scanning text animation for hero ── */
const SCAN_LINES = [
  "Initializing signal intelligence suite...",
  "Loading audit protocols...",
  "Calibrating pricing models...",
  "Mapping competitive landscape...",
  "Blueprint engine ready...",
  "All systems operational.",
];

const ScanningText = () => {
  const [lineIdx, setLineIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLineIdx((prev) => (prev + 1) % SCAN_LINES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-5 overflow-hidden">
      <span className="text-xs font-mono text-accent/70 animate-pulse-glow">
        <span className="text-primary/50">$</span> {SCAN_LINES[lineIdx]}
      </span>
    </div>
  );
};

/* ── Tool card for carousel ── */
const ToolCard = ({
  tool,
  isGlitching,
  isDragging,
  onClick,
}: {
  tool: (typeof tools)[number];
  isGlitching: boolean;
  isDragging: boolean;
  onClick: () => void;
}) => {
  const Icon = tool.icon;
  return (
    <button
      onClick={(e) => {
        if (isDragging) { e.preventDefault(); return; }
        onClick();
      }}
      className={`glass-terminal rounded-lg p-5 w-[260px] shrink-0 relative overflow-hidden group hover:border-primary/20 transition-all duration-300 text-left ${isGlitching ? "card-glitch-jitter" : ""} ${tool.id === "intelligence" ? "border-secondary/30 ring-1 ring-secondary/20" : ""}`}
    >
      {tool.id === "intelligence" && (
        <span className="absolute top-2 right-2 z-10 px-2 py-0.5 rounded bg-secondary/15 border border-secondary/30 text-[9px] font-mono font-bold uppercase tracking-wider text-secondary">
          Core Service
        </span>
      )}
      {isGlitching && <div className="card-glitch-overlay" />}
      <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${tool.color}`} />
      <div className={`w-10 h-10 rounded-lg bg-muted/40 flex items-center justify-center mb-3 ${tool.textColor}`}>
        <Icon size={20} />
      </div>
      <h3 className="text-sm font-mono font-semibold text-foreground mb-1">{tool.name}</h3>
      <p className="text-[11px] text-muted-foreground line-clamp-2 mb-3">{tool.tagline}</p>
      <div className="flex items-center justify-between">
        <span className={`text-xs font-mono font-bold ${tool.textColor}`}>{tool.price}</span>
        <span className={`text-[10px] font-mono ${tool.textColor} flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity`}>
          &gt;_ Learn more <ArrowRight size={10} />
        </span>
      </div>
    </button>
  );
};

/* ── Unique visual for each tool section ── */
const TOOL_VISUALS: Record<string, React.FC> = {
  blueprint: BlueprintVisual,
  audit: AuditVisual,
  estimator: EstimatorVisual,
  competition: CompetitionVisual,
  intelligence: () => <div className="w-full h-full"><NetworkHubViz /></div>,
};

const ToolSectionVisual = ({ tool }: { tool: (typeof tools)[number] }) => {
  const Visual = TOOL_VISUALS[tool.id];

  return (
    <div className="glass-terminal rounded-2xl p-6 aspect-video flex flex-col relative overflow-hidden">
      <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${tool.color}`} />
      {/* Scanline */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="w-full h-px bg-accent/10 animate-scanline" />
      </div>

      {/* Terminal header */}
      <div className="flex items-center gap-2 mb-2 w-full">
        <div className="flex gap-1.5 shrink-0">
          <div className="w-2 h-2 rounded-full bg-destructive/70" />
          <div className="w-2 h-2 rounded-full bg-accent/50" />
          <div className="w-2 h-2 rounded-full bg-primary/50" />
        </div>
        <TerminalCodeStream />
      </div>

      {/* SVG Visual */}
      <div className="flex-1 flex items-center justify-center">
        {Visual && <Visual />}
      </div>
    </div>
  );
};

/* ── Carousel (reuses PlatformsCarousel pattern) ── */
const CAROUSEL_SPEED = 0.4;

const ToolsCarousel = ({ onSelect }: { onSelect: (id: string) => void }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const offsetRef = useRef(0);
  const [isPaused, setIsPaused] = useState(false);
  const [glitchIndices, setGlitchIndices] = useState<Set<number>>(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startOffset: number; isDragging: boolean; hasMoved: boolean }>({
    startX: 0, startOffset: 0, isDragging: false, hasMoved: false,
  });

  const items = [...tools, ...tools, ...tools];

  // Random glitch
  useEffect(() => {
    const scheduleGlitch = () => {
      const delay = 1500 + Math.random() * 2500;
      return setTimeout(() => {
        const indices = new Set<number>();
        indices.add(Math.floor(Math.random() * items.length));
        setGlitchIndices(indices);
        setTimeout(() => setGlitchIndices(new Set()), 180 + Math.random() * 120);
        timerRef = scheduleGlitch();
      }, delay);
    };
    let timerRef = scheduleGlitch();
    return () => clearTimeout(timerRef);
  }, [items.length]);

  const wrapOffset = useCallback((offset: number) => {
    const track = trackRef.current;
    if (!track) return offset;
    const singleSetWidth = track.scrollWidth / 3;
    let wrapped = offset % singleSetWidth;
    if (wrapped < 0) wrapped += singleSetWidth;
    return wrapped;
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const animate = () => {
      if (!isPaused && !dragRef.current.isDragging) {
        const singleSetWidth = track.scrollWidth / 3;
        offsetRef.current += CAROUSEL_SPEED;
        if (offsetRef.current >= singleSetWidth) offsetRef.current -= singleSetWidth;
        track.style.transform = `translateX(-${offsetRef.current}px)`;
      }
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [isPaused]);

  const startDrag = useCallback((clientX: number) => {
    dragRef.current = { startX: clientX, startOffset: offsetRef.current, isDragging: true, hasMoved: false };
    setIsPaused(true);
    setIsDragging(false);
  }, []);

  const moveDrag = useCallback((clientX: number) => {
    if (!dragRef.current.isDragging) return;
    const deltaX = dragRef.current.startX - clientX;
    if (Math.abs(deltaX) > 5) { dragRef.current.hasMoved = true; setIsDragging(true); }
    const newOffset = wrapOffset(dragRef.current.startOffset + deltaX);
    offsetRef.current = newOffset;
    const track = trackRef.current;
    if (track) track.style.transform = `translateX(-${newOffset}px)`;
  }, [wrapOffset]);

  const endDrag = useCallback(() => {
    const wasDragging = dragRef.current.hasMoved;
    dragRef.current.isDragging = false;
    setTimeout(() => { setIsPaused(false); setIsDragging(false); }, wasDragging ? 1500 : 0);
  }, []);

  return (
    <div
      className={`glass-terminal rounded-xl overflow-hidden relative touch-pan-y ${isDragging ? "cursor-grabbing select-none" : "cursor-grab"}`}
      onMouseEnter={() => { if (!dragRef.current.isDragging) setIsPaused(true); }}
      onMouseLeave={() => { if (dragRef.current.isDragging) endDrag(); setIsPaused(false); }}
      onMouseDown={(e) => { e.preventDefault(); startDrag(e.clientX); }}
      onMouseMove={(e) => moveDrag(e.clientX)}
      onMouseUp={() => endDrag()}
      onTouchStart={(e) => startDrag(e.touches[0].clientX)}
      onTouchMove={(e) => moveDrag(e.touches[0].clientX)}
      onTouchEnd={() => endDrag()}
    >
      {/* Terminal bar */}
      <div className="flex items-center px-4 py-3 border-b border-border/50">
        <div className="flex items-center gap-2 w-full">
          <div className="flex gap-1.5 shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-destructive/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-accent/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-primary/50" />
          </div>
          <TerminalCodeStream />
        </div>
      </div>

      <div className="overflow-hidden p-4">
        <div ref={trackRef} className="flex gap-4 will-change-transform">
          {items.map((t, i) => (
            <ToolCard
              key={`${t.id}-${i}`}
              tool={t}
              isGlitching={glitchIndices.has(i)}
              isDragging={isDragging}
              onClick={() => onSelect(t.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── Main page ── */
const Tools = () => {
  const ref = useScrollReveal<HTMLDivElement>();

  const scrollToTool = (id: string) => {
    const el = document.getElementById(`tool-${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <SEOHead
        title="AI-Powered Tools for Business Intelligence | Mitryxa"
        description="Explore Mitryxa's signal intelligence suite: Digital Blueprint, Site Audit, Price Estimator, and Competition Analysis. Data-driven tools for smarter business decisions."
        canonical="https://mitryxa.com/tools"
      />

      <div ref={ref} className="pt-16">
        {/* ── Hero ── */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-hero opacity-50" />
          <div className="container mx-auto px-4 lg:px-8 text-center relative z-10">
            <div className="glass-terminal rounded-xl px-6 py-3 inline-flex items-center gap-3 mb-8">
              <Terminal size={14} className="text-primary" />
              <span className="text-xs font-mono text-muted-foreground">&gt;_ signal_intelligence_suite</span>
              <span className="w-1.5 h-4 bg-accent/70 animate-terminal-blink" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground font-mono">
              <span className="text-primary">&gt;</span> Intelligence Tools
            </h1>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
              Five AI-powered tools designed to scan, analyze, strategize, and discover opportunities for your digital presence. Pick the signal you need.
            </p>
            <div className="mt-6">
              <ScanningText />
            </div>
          </div>
        </section>

        {/* ── Carousel ── */}
        <section className="py-12 scroll-reveal">
          <div className="container mx-auto px-4 lg:px-8">
            <p className="text-xs font-mono text-muted-foreground/60 mb-4 uppercase tracking-widest">&gt;_ drag to explore · click to learn more</p>
            <ToolsCarousel onSelect={scrollToTool} />
          </div>
        </section>

        {/* ── Tool detail sections ── */}
        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8 space-y-24">
            {tools.map((tool, i) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.id}
                  id={`tool-${tool.id}`}
                  className={`scroll-reveal scroll-mt-24 flex flex-col lg:flex-row gap-10 items-center ${i % 2 ? "lg:flex-row-reverse" : ""}`}
                >
                  {/* Visual */}
                  <div className="flex-1 w-full">
                    <ToolSectionVisual tool={tool} />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-lg bg-muted/40 flex items-center justify-center ${tool.textColor}`}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-foreground font-mono">
                          <span className="text-primary/50">&gt;_</span> {tool.name}
                        </h2>
                      </div>
                      <span className={`ml-auto text-xs font-mono font-bold px-3 py-1 rounded-full border border-current/20 ${tool.textColor}`}>
                        {tool.price}
                      </span>
                    </div>

                    <p className="text-muted-foreground leading-relaxed mb-6">{tool.description}</p>

                    <ul className="space-y-2.5 mb-6">
                      {tool.features.map((f) => (
                        <li key={f} className="flex items-center gap-3 text-sm text-foreground">
                          <CheckCircle2 size={14} className="text-accent shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>

                    <div className="glass-terminal rounded-lg p-4 mb-6">
                      <p className="text-xs font-mono text-muted-foreground/60 mb-2 uppercase tracking-wider">&gt;_ best for</p>
                      <ul className="space-y-1.5">
                        {tool.bestFor.map((b) => (
                          <li key={b} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className={`${tool.textColor} mt-0.5`}>→</span> {b}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link href={tool.slug} className="btn-cta">
                      <span>&gt;_ Launch {tool.name}</span> <CtaChevrons />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Comparison table ── */}
        <section className="py-24 scroll-reveal">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground text-center mb-2 font-mono">
              <span className="text-primary">&gt;</span> Compare Tools
            </h2>
            <p className="text-muted-foreground text-center mb-10 max-w-lg mx-auto">
              Side-by-side comparison to pick the right signal for your needs.
            </p>

            <div className="glass-terminal rounded-xl overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-secondary to-accent z-10" />
              
              {/* Desktop: normal table */}
              <div className="hidden md:block">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left p-4 font-mono text-xs text-muted-foreground/60 uppercase tracking-wider">&gt;_</th>
                      {tools.map((t) => (
                        <th key={t.id} className={`p-4 font-mono text-xs uppercase tracking-wider ${t.textColor} text-center`}>
                          {t.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map((row, ri) => (
                      <tr key={row.label} className={`border-b border-border/30 ${ri % 2 ? "bg-muted/5" : ""}`}>
                        <td className="p-4 font-mono text-xs text-muted-foreground font-medium">{row.label}</td>
                        {row.values.map((val, vi) => (
                          <td key={vi} className="p-4 text-center text-xs text-foreground/80">
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile: card-based layout */}
              <div className="md:hidden p-4 space-y-4">
                {tools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <div key={tool.id} className="border border-border/30 rounded-lg p-4 space-y-3">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-7 h-7 rounded bg-muted/40 flex items-center justify-center ${tool.textColor}`}>
                          <Icon size={14} />
                        </div>
                        <span className={`font-mono text-xs font-bold uppercase tracking-wider ${tool.textColor}`}>{tool.name}</span>
                      </div>
                      {comparisonRows.map((row, ri) => (
                        <div key={row.label} className={`flex justify-between items-center py-1.5 ${ri < comparisonRows.length - 1 ? "border-b border-border/20" : ""}`}>
                          <span className="text-[11px] font-mono text-muted-foreground">{row.label}</span>
                          <span className="text-xs text-foreground/80 text-right">{row.values[tools.indexOf(tool)]}</span>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>


        {/* ── Not sure? CTA ── */}
        <section className="py-24 scroll-reveal">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <div className="glass-terminal rounded-2xl p-10 max-w-2xl mx-auto relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-secondary to-accent" />
              <Terminal size={32} className="text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground font-mono mb-3">
                Not sure where to start?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                The <span className="text-foreground font-medium">Digital Blueprint</span> covers the broadest scope — website audit, competitor analysis, pricing insights, and a full 12-month roadmap. It's the all-in-one starting point.
              </p>
              <Link href="/tools/blueprint" className="btn-cta">
                <span>&gt;_ Start with Digital Blueprint</span> <CtaChevrons />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Tools;
