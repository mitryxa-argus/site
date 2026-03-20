'use client';

import { useState } from "react";
import Link from 'next/link';
import { useScrollReveal } from "@/hooks/useScrollReveal";
import SEOHead from "@/components/seo/SEOHead";
import { articles, categories } from "@/data/articles";
import { ArrowRight, Clock, Tag, ChevronLeft, ChevronRight } from "lucide-react";

const insightsHero = '/assets/insights-hero.jpg';

const ARTICLES_PER_PAGE = 9;

const Insights = () => {
  const ref = useScrollReveal<HTMLDivElement>();
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = activeCategory === "All" ? articles : articles.filter((a) => a.category === activeCategory);
  const totalPages = Math.ceil(filtered.length / ARTICLES_PER_PAGE);
  const paged = filtered.slice((currentPage - 1) * ARTICLES_PER_PAGE, currentPage * ARTICLES_PER_PAGE);

  const handleCategoryChange = (c: string) => {
    setActiveCategory(c);
    setCurrentPage(1);
  };

  return (
    <>
      <SEOHead
        title="Insights | Mitryxa"
        description="Expert insights on AI decision platforms, lead qualification, client acquisition, and interactive marketing for professional service businesses."
        canonical="https://mitryxa.com/insights"
      />

      <div ref={ref} className="pt-16">
        {/* Hero with image */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0">
            <img src={insightsHero} alt="AI knowledge visualization" className="w-full h-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
          </div>
          <div className="container mx-auto px-4 lg:px-8 text-center relative z-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 font-mono">&gt;_ Insights</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">Thinking About AI & Client Acquisition</h1>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">Research, analysis, and perspectives on intelligent client acquisition for professional service businesses.</p>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => handleCategoryChange(c)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium font-mono transition-all duration-300 ${
                    activeCategory === c
                      ? "bg-primary text-primary-foreground shadow-[0_0_20px_hsl(217_91%_60%/0.3)]"
                      : "glass-terminal text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paged.map((a) => (
                <Link
                  key={a.slug}
                  href={`/insights/${a.slug}`}
                  className="glass-terminal rounded-xl overflow-hidden group hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 relative"
                >
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary to-secondary z-10" />
                  <div className="aspect-video relative overflow-hidden">
                    <img src={a.heroImage} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    <span className="absolute top-3 left-3 px-2 py-1 rounded-md glass-terminal text-[10px] font-semibold text-primary font-mono">{a.category}</span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3 font-mono">
                      <span>{a.date}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {a.readTime}</span>
                    </div>
                    <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">{a.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{a.excerpt}</p>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {a.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="flex items-center gap-1 text-[10px] text-muted-foreground glass-terminal px-2 py-0.5 rounded-full font-mono">
                          <Tag size={8} /> {tag}
                        </span>
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 mt-4 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                      &gt;_ Read article <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg glass-terminal text-sm text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-mono"
                >
                  <ChevronLeft size={14} /> Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium font-mono transition-all ${
                      currentPage === page
                        ? "bg-primary text-primary-foreground shadow-[0_0_15px_hsl(217_91%_60%/0.3)]"
                        : "glass-terminal text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg glass-terminal text-sm text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-mono"
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default Insights;
