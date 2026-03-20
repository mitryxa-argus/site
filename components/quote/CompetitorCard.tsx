'use client';

import { Globe, Check, X } from "lucide-react";

type Competitor = {
  name: string;
  url: string;
  branding: Record<string, unknown> | null;
  features: Record<string, unknown>;
};

type Props = {
  competitors: Competitor[];
  businessName: string;
  clientFeatures: Record<string, unknown>;
};

const CompetitorCard = ({ competitors, businessName, clientFeatures }: Props) => {
  if (competitors.length === 0) return null;

  const featureKeys = [
    { key: "hasSSL", label: "SSL Security" },
    { key: "hasMetaDescription", label: "Meta Description" },
    { key: "hasOGTags", label: "Social Tags" },
  ];

  return (
    <div className="glass-terminal rounded-xl overflow-hidden" style={{ animation: "fade-up 0.4s ease-out 0.1s both" }}>
      <div className="h-[2px] bg-gradient-to-r from-accent to-primary" />
      <div className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-md bg-accent/10 flex items-center justify-center">
            <Globe size={18} />
          </div>
          <h2 className="text-base font-mono font-bold text-foreground">Competitive Landscape</h2>
        </div>

        <div className="space-y-3">
          {/* Header row */}
          <div className="grid gap-2" style={{ gridTemplateColumns: `1fr repeat(${competitors.length + 1}, 80px)` }}>
            <div className="text-[10px] font-mono text-muted-foreground/50">Feature</div>
            <div className="text-[10px] font-mono text-primary text-center truncate" title={businessName}>
              {businessName || "You"}
            </div>
            {competitors.map((c) => (
              <div key={c.url} className="text-[10px] font-mono text-muted-foreground/60 text-center truncate" title={c.name}>
                {c.name.length > 10 ? c.name.slice(0, 10) + "…" : c.name}
              </div>
            ))}
          </div>

          {/* Feature rows */}
          {featureKeys.map((fk) => (
            <div key={fk.key} className="grid gap-2 items-center" style={{ gridTemplateColumns: `1fr repeat(${competitors.length + 1}, 80px)` }}>
              <span className="text-xs font-mono text-muted-foreground">{fk.label}</span>
              <div className="flex justify-center">
                {clientFeatures[fk.key]
                  ? <Check size={14} className="text-green-500" />
                  : <X size={14} className="text-destructive/60" />
                }
              </div>
              {competitors.map((c) => (
                <div key={c.url} className="flex justify-center">
                  {(c.features as any)?.[fk.key]
                    ? <Check size={14} className="text-green-500/60" />
                    : <X size={14} className="text-destructive/40" />
                  }
                </div>
              ))}
            </div>
          ))}

          {/* Content length comparison */}
          <div className="grid gap-2 items-center" style={{ gridTemplateColumns: `1fr repeat(${competitors.length + 1}, 80px)` }}>
            <span className="text-xs font-mono text-muted-foreground">Content Depth</span>
            <div className="text-center text-xs font-mono text-muted-foreground">—</div>
            {competitors.map((c) => {
              const len = (c.features as any)?.contentLength || 0;
              const label = len > 3000 ? "Rich" : len > 1000 ? "Good" : "Thin";
              const color = len > 3000 ? "text-green-500/60" : len > 1000 ? "text-yellow-500/60" : "text-destructive/60";
              return (
                <div key={c.url} className={`text-center text-xs font-mono ${color}`}>{label}</div>
              );
            })}
          </div>

          {/* Competitor brand color swatches */}
          {competitors.some((c) => c.branding) && (
            <div className="pt-2 border-t border-primary/5">
              <p className="text-[10px] font-mono text-muted-foreground/50 mb-2">Competitor Brand Colors</p>
              <div className="space-y-1.5">
                {competitors.filter((c) => c.branding).map((c) => {
                  const colors = (c.branding as any)?.colors || {};
                  return (
                    <div key={c.url} className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-muted-foreground/60 w-20 truncate">{c.name}</span>
                      <div className="flex gap-1">
                        {Object.values(colors).slice(0, 4).map((hex, i) => (
                          <div
                            key={i}
                            className="w-4 h-4 rounded border border-primary/10"
                            style={{ backgroundColor: String(hex) }}
                            title={String(hex)}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompetitorCard;
