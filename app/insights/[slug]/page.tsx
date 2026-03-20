'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import SEOHead from "@/components/seo/SEOHead";
import JsonLd from "@/components/seo/JsonLd";
import { articles } from "@/data/articles";
import { ArrowLeft, Clock, Tag, Share2, Twitter, Facebook, Linkedin, ArrowRight } from "lucide-react";

const InsightArticle = () => {
  const { slug } = useParams();
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Article not found</h1>
          <Link href="/insights" className="text-primary mt-4 inline-block">← Back to Insights</Link>
        </div>
      </div>
    );
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription,
    datePublished: article.date,
    author: { "@type": "Organization", name: "Mitryxa" },
    publisher: { "@type": "Organization", name: "Mitryxa Labs LLC" },
  };

  // Extract headings for TOC
  const headings = article.content
    .split("\n")
    .filter((line) => line.startsWith("## "))
    .map((line) => line.replace("## ", ""));

  // Related articles
  const related = articles
    .filter((a) => a.slug !== article.slug)
    .filter((a) => a.category === article.category || a.tags.some((t) => article.tags.includes(t)))
    .slice(0, 3);

  // Convert markdown-ish content to paragraphs
  const sections = article.content.split("\n\n").map((block, i) => {
    if (block.startsWith("## ")) {
      const text = block.replace("## ", "");
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return <h2 key={i} id={id} className="text-2xl font-bold text-foreground mt-12 mb-4 scroll-mt-24">{text}</h2>;
    }
    return <p key={i} className="text-muted-foreground leading-relaxed mb-4">{block}</p>;
  });

  const shareUrl = `https://mitryxa.com/insights/${article.slug}`;

  return (
    <>
      <SEOHead
        title={article.metaTitle + " | Mitryxa"}
        description={article.metaDescription}
        canonical={`https://mitryxa.com/insights/${article.slug}`}
      />
      <JsonLd data={articleSchema} />

      <div className="pt-16">
        <article className="py-24">
          <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
            <Link href="/insights" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8">
              <ArrowLeft size={14} /> Back to Insights
            </Link>

            {/* Hero image */}
            <div className="aspect-video rounded-2xl overflow-hidden mb-10">
              <img src={article.heroImage} alt={article.title} className="w-full h-full object-cover" />
            </div>

            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
              <span>{article.date}</span>
              <span className="flex items-center gap-1"><Clock size={14} /> {article.readTime}</span>
              <span className="px-2 py-0.5 rounded-md glass text-xs font-medium text-primary">{article.category}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-4">{article.title}</h1>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {article.tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 text-xs text-muted-foreground glass px-3 py-1 rounded-full">
                  <Tag size={10} /> {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-col lg:flex-row gap-10">
              {/* Sidebar - TOC */}
              <aside className="lg:w-64 shrink-0 order-2 lg:order-1">
                <div className="lg:sticky lg:top-24 space-y-6">
                  {/* Table of Contents */}
                  <div className="glass rounded-xl p-5 glow-border">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">Table of Contents</h3>
                    <nav className="space-y-2">
                      {headings.map((h) => (
                        <a
                          key={h}
                          href={`#${h.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                          className="block text-xs text-muted-foreground hover:text-primary transition-colors leading-snug"
                        >
                          {h}
                        </a>
                      ))}
                    </nav>
                  </div>

                  {/* Share */}
                  <div className="glass rounded-xl p-5 glow-border">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3 flex items-center gap-1">
                      <Share2 size={12} /> Share
                    </h3>
                    <div className="flex gap-2">
                      <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${article.title}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                        <Twitter size={14} />
                      </a>
                      <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                        <Facebook size={14} />
                      </a>
                      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                        <Linkedin size={14} />
                      </a>
                    </div>
                  </div>
                </div>
              </aside>

              {/* Article Content */}
              <div className="flex-1 order-1 lg:order-2 prose-custom min-w-0">
                {sections}
              </div>
            </div>

            {/* Related Articles */}
            {related.length > 0 && (
              <section className="mt-20 pt-12 border-t border-white/10">
                <h2 className="text-xl font-bold text-foreground mb-8">Related Articles</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {related.map((a) => (
                    <Link
                      key={a.slug}
                      href={`/insights/${a.slug}`}
                      className="glass rounded-xl p-6 group hover:scale-[1.02] transition-all duration-300 glow-border"
                    >
                      <span className="text-[10px] text-primary font-semibold">{a.category}</span>
                      <h3 className="text-sm font-semibold text-foreground mt-2 group-hover:text-primary transition-colors leading-snug">{a.title}</h3>
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{a.excerpt}</p>
                      <span className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        Read <ArrowRight size={10} />
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </article>
      </div>
    </>
  );
};

export default InsightArticle;
