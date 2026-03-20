'use client';

import Link from 'next/link';
import { useParams, redirect} from 'next/navigation';
import { useScrollReveal } from "@/hooks/useScrollReveal";
import SEOHead from "@/components/seo/SEOHead";
import { caseStudies } from "@/data/caseStudies";
import { ArrowRight, ArrowLeft, CheckCircle2, Layers, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import CtaChevrons from "@/components/ui/CtaChevrons";

const accents = [
  "from-primary to-secondary",
  "from-secondary to-accent",
  "from-accent to-primary",
  "from-primary via-secondary to-accent",
];

const CaseStudy = () => {
  const { slug } = useParams<{ slug: string }>();
  const ref = useScrollReveal<HTMLDivElement>();
  const study = caseStudies.find((s) => s.slug === slug);

  if (!study) { redirect('/ai-platforms'); return null; }

  return (
    <>
      <SEOHead
        title={`${study.title} — ${study.client} | Mitryxa`}
        description={`${study.tagline} Automated lead qualification and reduced sales friction for ${study.industry.toLowerCase()} businesses.`}
        canonical={`https://mitryxa.com/ai-platforms/${study.slug}`}
      />

      <div ref={ref} className="pt-16">
        {/* Hero */}
        <section className="relative overflow-hidden py-32">
          <div className="absolute inset-0">
            <img src={study.heroImage} alt={study.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
          </div>
          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <Link href="/ai-platforms" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 font-mono">
              <ArrowLeft size={14} /> &gt;_ Back to AI Platforms
            </Link>
            <Badge variant="outline" className="mb-4 border-primary/40 text-primary font-mono">
              {study.industry}
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground max-w-3xl">{study.title}</h1>
            <p className="text-lg text-muted-foreground mt-4 max-w-2xl">{study.tagline}</p>
            <p className="text-sm text-muted-foreground/70 mt-2 font-mono">Client: {study.client}</p>
            {study.liveUrl && (
              <a
                href={study.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-lg border border-primary/40 text-primary font-semibold text-sm font-mono hover:bg-primary/10 hover:border-primary/60 transition-all"
              >
                &gt;_ Visit Live Site <ExternalLink size={16} />
              </a>
            )}
          </div>
        </section>

        {/* Challenge & Solution */}
        <section className="py-24 scroll-reveal">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 font-mono">&gt;_ The Challenge</p>
                <p className="text-foreground/90 leading-relaxed">{study.challenge}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3 font-mono">&gt;_ Our Solution</p>
                <p className="text-foreground/90 leading-relaxed">{study.solution}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="py-24 scroll-reveal">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12 font-mono"><span className="text-primary/50">&gt;_</span> Results</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {study.results.map((r, i) => (
                <div key={r.label} className="glass-terminal rounded-xl p-6 text-center relative overflow-hidden">
                  <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${accents[i % accents.length]}`} />
                  <p className="text-3xl font-bold text-gradient font-mono">{r.value}</p>
                  <p className="text-xs text-muted-foreground mt-2 font-mono">{r.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section className="py-24 scroll-reveal">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12 font-mono"><span className="text-primary/50">&gt;_</span> Project Gallery</h2>
            <div className={`grid gap-6 ${study.gallery.length === 2 ? "lg:grid-cols-2" : "lg:grid-cols-3"}`}>
              {study.gallery.map((img, i) => (
                <div key={i} className="rounded-xl overflow-hidden glass-terminal group relative">
                  <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${accents[i % accents.length]} z-10`} />
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-64 lg:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <p className="text-xs text-muted-foreground p-4 font-mono">{img.alt}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 scroll-reveal">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12 font-mono"><span className="text-primary/50">&gt;_</span> Key Features</h2>
            <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {study.features.map((f) => (
                <div key={f} className="flex items-start gap-3 glass-terminal rounded-lg p-4">
                  <CheckCircle2 size={18} className="text-accent shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground font-mono">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="py-24 scroll-reveal">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-8 font-mono"><span className="text-primary/50">&gt;_</span> Technology Stack</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {study.techStack.map((t) => (
                <div key={t} className="inline-flex items-center gap-2 glass-terminal rounded-full px-5 py-2.5 text-sm text-foreground font-mono">
                  <Layers size={14} className="text-primary" />
                  {t}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 scroll-reveal">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-foreground">Want Something Like This?</h2>
            <p className="text-muted-foreground mt-3 max-w-md mx-auto">
              We build custom decision platforms tailored to your industry and business model.
            </p>
            <Link
              href="/contact"
              className="btn-cta mt-8"
            >
              <span>&gt;_ Start a Project</span> <CtaChevrons />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default CaseStudy;
