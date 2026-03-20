'use client';

import Link from 'next/link';
import { useScrollReveal } from "@/hooks/useScrollReveal";
import SEOHead from "@/components/seo/SEOHead";
import { solutions } from "@/data/platforms";
import { CheckCircle2, TrendingUp, Clock, Target, Users } from "lucide-react";
import CtaChevrons from "@/components/ui/CtaChevrons";

const solutionsHero = '/assets/solutions-hero.jpg';
import SolutionVisual from "@/components/solutions/SolutionVisual";

const caseStudies = [
  { icon: Target, title: "Personal Injury Firm", metric: "12x", label: "conversion improvement", description: "Replaced contact form with interactive case navigator. Qualified consultations increased from 40% to 85%.", accent: "from-primary to-secondary" },
  { icon: TrendingUp, title: "Medical Practice", metric: "8x", label: "lead quality increase", description: "Patient assessment platform pre-qualified and educated patients, reducing no-show rates by 60%.", accent: "from-secondary to-accent" },
  { icon: Clock, title: "Financial Advisory", metric: "65%", label: "time saved on intake", description: "Wealth strategy navigator automated the discovery process, delivering comprehensive client profiles before meetings.", accent: "from-accent to-primary" },
  { icon: Users, title: "Real Estate Agency", metric: "340%", label: "more qualified leads", description: "Home buying path platform matched buyers with ideal properties and pre-qualified their financing readiness.", accent: "from-primary via-secondary to-accent" },
];

const Solutions = () => {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <>
      <SEOHead
        title="AI Use Cases for Professional Services | Mitryxa"
        description="Discover Mitryxa's AI solutions — decision platforms and the Digital Intelligence Layer — for automated lead qualification, opportunity discovery, reducing sales friction, and intelligent engagement."
        canonical="https://mitryxa.com/use-cases"
      />

      <div ref={ref} className="pt-16">
        {/* Hero with image */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0">
            <img src={solutionsHero} alt="AI decision flow visualization" className="w-full h-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
          </div>
          <div className="container mx-auto px-4 lg:px-8 text-center relative z-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-3 font-mono">&gt;_ Solutions</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">Intelligent Systems That Convert</h1>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">AI decision platforms and a Digital Intelligence Layer that qualify leads, discover opportunities, educate clients, and reduce sales friction for professional service businesses.</p>
          </div>
        </section>

        {/* Solutions detail */}
        <section className="py-24">
          <div className="container mx-auto px-4 lg:px-8 space-y-16">
            {solutions.map((s, i) => (
              <div key={s.title} className={`scroll-reveal flex flex-col lg:flex-row gap-10 items-center ${i % 2 ? "lg:flex-row-reverse" : ""}`}>
                <div className="flex-1 w-full">
                  <div className="glass-terminal rounded-2xl p-8 aspect-video flex items-center justify-center relative overflow-hidden">
                    <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${["from-primary to-secondary", "from-secondary to-accent", "from-accent to-primary", "from-primary via-secondary to-accent"][i % 4]}`} />
                    <SolutionVisual index={i} />
                  </div>
                </div>

                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-foreground mb-4 font-mono"><span className="text-primary/50">&gt;_</span> {s.title}</h2>
                  <p className="text-muted-foreground leading-relaxed">{s.description}</p>
                  <ul className="mt-6 space-y-3">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-sm text-foreground">
                        <CheckCircle2 size={16} className="text-accent shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Case Studies */}
        <section className="py-24 scroll-reveal">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground text-center mb-4">Results That Speak</h2>
            <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">Real outcomes from businesses using Mitryxa AI decision platforms and intelligence systems.</p>
            <div className="grid sm:grid-cols-2 gap-6">
              {caseStudies.map((c) => {
                const Icon = c.icon;
                return (
                  <div key={c.title} className="glass-terminal rounded-xl p-8 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden">
                    <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${c.accent}`} />
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon size={24} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-mono">{c.title}</p>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-3xl font-bold text-gradient font-mono">{c.metric}</span>
                          <span className="text-sm text-muted-foreground">{c.label}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{c.description}</p>
                        <div className="flex items-center gap-2 mt-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                          <span className="text-[10px] text-muted-foreground font-mono">Verified Result</span>
                        </div>
                      </div>
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
            <h2 className="text-3xl font-bold text-foreground">Find the Right Solution</h2>
            <p className="text-muted-foreground mt-3">Use our Project Navigator or explore the Intelligence Layer to find the right system for your business.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link href="/#navigator" className="btn-cta-subtle">
                <span>&gt;_ Launch Navigator</span> <CtaChevrons />
              </Link>
              <Link href="/intelligence" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-semibold rounded-lg border border-white/10 text-foreground hover:bg-white/5 transition-all duration-300">
                Explore Intelligence Layer
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Solutions;
