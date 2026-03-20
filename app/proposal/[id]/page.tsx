'use client';

import { useParams } from 'next/navigation';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import MitrxyaLogo from "@/components/layout/MitrxyaLogo";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Download, CheckCircle2, Plus, Monitor, Wrench, TrendingUp, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { openBrandedPdf } from "@/lib/brandedPdf";

interface ProposalSection {
  title: string;
  price: string;
  frequency: string;
  items: string[];
  description?: string;
  note?: string;
  optional: boolean;
}

interface ProposalData {
  greeting: string;
  demo_url?: string;
  scope_url?: string;
  sections: ProposalSection[];
  closing: string;
  sender_name: string;
  sender_url: string;
}

/* Map section titles to icons for visual clarity */
const sectionIcons: Record<string, typeof Monitor> = {
  "Website Development": Monitor,
  "Website Maintenance": Wrench,
  "Growth Package": TrendingUp,
  "Ads Management": Megaphone,
};

const ProposalView = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: proposal, isLoading, error } = useQuery({
    queryKey: ["proposal", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("proposals")
        .select("*")
        .eq("slug", slug!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground font-mono text-sm">Loading proposal...</div>
      </div>
    );
  }

  if (error || !proposal) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Proposal Not Found</h1>
          <p className="text-muted-foreground">This proposal link may have expired or doesn't exist.</p>
        </div>
      </div>
    );
  }

  const data = proposal.proposal_data as unknown as ProposalData;
  const createdDate = new Date(proposal.created_at!).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Split sections into included vs optional for clear visual grouping
  const includedSections = data.sections.filter((s) => !s.optional);
  const optionalSections = data.sections.filter((s) => s.optional);

  const handleDownloadPdf = () => {
    const markdownSections = data.sections
      .map((s) => {
        const optionalTag = s.optional ? " (Optional)" : "";
        const lines = [`## ${s.title}${optionalTag}`, `**${s.price}** ${s.frequency}`, ""];
        if (s.description) lines.push(s.description, "");
        s.items.forEach((item) => lines.push(`- ${item}`));
        if (s.note) lines.push("", `*${s.note}*`);
        return lines.join("\n");
      })
      .join("\n\n");

    const fullMarkdown = [
      data.greeting,
      "",
      markdownSections,
      "",
      data.closing,
      "",
      `— ${data.sender_name}`,
      data.sender_url,
    ].join("\n");

    openBrandedPdf({
      title: proposal.subject,
      subtitle: `Prepared for ${proposal.client_name}`,
      report: fullMarkdown,
      generatedDate: new Date(proposal.created_at!),
    });
  };

  const renderSection = (section: ProposalSection, index: number) => {
    const Icon = sectionIcons[section.title] || Monitor;
    const isOptional = section.optional;

    return (
      <div
        key={index}
        className={`group relative rounded-2xl border overflow-hidden transition-all duration-300 ${
          isOptional
            ? "border-border/40 bg-card/20 hover:border-border/60"
            : "border-primary/20 bg-card hover:border-primary/30"
        }`}
      >
        {/* Gradient top accent — blue for included, subtle for optional */}
        <div
          className={`h-1 w-full ${
            isOptional
              ? "bg-gradient-to-r from-muted-foreground/20 via-muted-foreground/10 to-transparent"
              : "bg-gradient-to-r from-primary via-primary/60 to-transparent"
          }`}
        />

        <div className="p-5 sm:p-7 space-y-5">
          {/* Header row: icon + title + optional badge */}
          <div className="flex items-start gap-4">
            <div
              className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${
                isOptional
                  ? "bg-muted/50 text-muted-foreground"
                  : "bg-primary/10 text-primary"
              }`}
            >
              <Icon size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold text-foreground">{section.title}</h2>
                {isOptional && (
                  <Badge variant="outline" className="text-[10px] font-medium text-muted-foreground border-border/50 bg-muted/30">
                    Optional Add-On
                  </Badge>
                )}
              </div>
              {section.description && (
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{section.description}</p>
              )}
            </div>
          </div>

          {/* Big price block — very clear */}
          <div
            className={`rounded-xl px-5 py-4 flex items-baseline gap-2 ${
              isOptional ? "bg-muted/20" : "bg-primary/5 border border-primary/10"
            }`}
          >
            <span className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isOptional ? "text-foreground/80" : "text-primary"}`}>
              {section.price}
            </span>
            <span className="text-sm text-muted-foreground font-medium">{section.frequency}</span>
          </div>

          {/* What's included list */}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              What's included
            </p>
            <ul className="space-y-2.5">
              {section.items.map((item, j) => (
                <li key={j} className="flex items-start gap-3 text-[15px] text-foreground/85 leading-snug">
                  <CheckCircle2
                    size={16}
                    className={`shrink-0 mt-0.5 ${isOptional ? "text-muted-foreground/50" : "text-primary/70"}`}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Note if any */}
          {section.note && (
            <div className="border-t border-border/20 pt-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                ℹ️ {section.note}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header bar */}
      <header className="border-b border-primary/10 sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center justify-between">
          <MitrxyaLogo className="h-7" />
          <Button variant="outline" size="sm" onClick={handleDownloadPdf} className="gap-1.5 border-primary/20 text-muted-foreground hover:text-foreground">
            <Download size={14} />
            <span className="hidden sm:inline">Save as PDF</span>
          </Button>
        </div>
      </header>

      {/* Hero / Title area */}
      <div className="relative overflow-hidden">
        {/* Subtle radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-2xl mx-auto px-5 pt-10 sm:pt-16 pb-8 space-y-4 text-center">
          <p className="text-xs text-muted-foreground font-mono tracking-wider">{createdDate}</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
            {proposal.subject}
          </h1>
          {proposal.client_name && (
            <p className="text-lg text-muted-foreground">
              Prepared for{" "}
              <span className="text-foreground font-semibold">{proposal.client_name}</span>
              {proposal.business_name && (
                <span className="text-muted-foreground"> · {proposal.business_name}</span>
              )}
            </p>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-2xl mx-auto px-5 pb-16 space-y-10">
        {/* Greeting + demo links */}
        <div className="space-y-5">
          <p className="text-foreground/90 leading-relaxed text-[16px]">{data.greeting}</p>

          {(data.demo_url || data.scope_url) && (
            <div className="flex flex-col sm:flex-row gap-3">
              {data.demo_url && (
                <a href={data.demo_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <div className="rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors p-4 flex items-center gap-3 cursor-pointer">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Monitor size={18} className="text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">View Demo Website</p>
                      <p className="text-xs text-muted-foreground truncate">See how your website will look</p>
                    </div>
                    <ExternalLink size={14} className="text-muted-foreground shrink-0 ml-auto" />
                  </div>
                </a>
              )}
              {data.scope_url && (
                <a href={data.scope_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <div className="rounded-xl border border-border/40 bg-card/50 hover:bg-card transition-colors p-4 flex items-center gap-3 cursor-pointer">
                    <div className="w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                      <ExternalLink size={18} className="text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">Project Scope</p>
                      <p className="text-xs text-muted-foreground truncate">Full project details & features</p>
                    </div>
                    <ExternalLink size={14} className="text-muted-foreground shrink-0 ml-auto" />
                  </div>
                </a>
              )}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Your Plan</span>
          <div className="h-px flex-1 bg-gradient-to-l from-primary/30 to-transparent" />
        </div>

        {/* Included sections */}
        <div className="space-y-5">
          {includedSections.map((section, i) => renderSection(section, i))}
        </div>

        {/* Optional add-ons divider */}
        {optionalSections.length > 0 && (
          <>
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-border/30 to-transparent" />
              <div className="flex items-center gap-2">
                <Plus size={14} className="text-muted-foreground" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                  Optional Add-Ons
                </span>
              </div>
              <div className="h-px flex-1 bg-gradient-to-l from-border/30 to-transparent" />
            </div>

            <div className="space-y-5">
              {optionalSections.map((section, i) => renderSection(section, i))}
            </div>
          </>
        )}

        {/* Closing — ROI callout */}
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
          <div className="relative border border-primary/15 rounded-2xl p-6 sm:p-8 text-center space-y-3">
            <p className="text-xl sm:text-2xl font-bold text-foreground leading-snug">
              {data.closing}
            </p>
          </div>
        </div>

        {/* Sender footer */}
        <div className="text-center space-y-4 pt-6 pb-4">
          <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          <div className="pt-4 space-y-1">
            <p className="text-foreground font-semibold">
              {data.sender_name}
            </p>
            <p className="text-sm text-muted-foreground">{data.sender_url}</p>
          </div>
          <MitrxyaLogo className="h-5 mx-auto opacity-40" iconOnly />
        </div>
      </div>
    </div>
  );
};

export default ProposalView;
