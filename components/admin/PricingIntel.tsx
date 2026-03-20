'use client';

import { AlertTriangle, TrendingUp, ArrowUpDown, Shield, DollarSign, Clock } from "lucide-react";

interface PricingIntelProps {
  pricingResult: any;
  selections: Record<string, any>;
}

const fmt = (n: number) => `$${n.toLocaleString()}`;

const PricingIntel = ({ pricingResult, selections }: PricingIntelProps) => {
  if (!pricingResult) {
    return <p className="text-xs font-mono text-muted-foreground">No pricing data captured for this lead yet.</p>;
  }

  const p = pricingResult;
  const multipliers = p.multipliers || {};
  const activeMultipliers = Object.entries(multipliers) as [string, { factor: number; reason: string }][];
  const roi = p.roi;
  const phased = p.phasedOption;

  // Budget comparison
  const budgetRange = selections.budgetRange || "";
  const budgetFlex = selections.budgetFlexibility || "";
  const budgetLow = parseBudgetLow(budgetRange);
  const budgetHigh = parseBudgetHigh(budgetRange);
  const isUnderBudget = budgetHigh > 0 && budgetHigh < p.lowEstimate;
  const isOverBudget = budgetLow > 0 && budgetLow > p.highEstimate;

  // Negotiation signals
  const signals = generateSignals(p, selections, budgetLow, budgetHigh, activeMultipliers);

  return (
    <div className="space-y-5">
      {/* Negotiation Signals */}
      {signals.length > 0 && (
        <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-yellow-400" />
            <h3 className="text-sm font-mono font-bold text-yellow-400">Negotiation Intel</h3>
          </div>
          <ul className="space-y-1.5">
            {signals.map((s, i) => (
              <li key={i} className="text-xs font-mono text-yellow-300/80 flex items-start gap-2">
                <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Price vs Budget */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className={`rounded-lg p-3 border ${isUnderBudget ? "border-red-500/30 bg-red-500/5" : "border-primary/10 bg-background/30"}`}>
          <p className="text-[10px] font-mono text-muted-foreground/60 uppercase mb-1">Engine Price Range</p>
          <p className="text-lg font-mono font-bold text-foreground">
            {fmt(p.lowEstimate)} – {fmt(p.highEstimate)}
          </p>
          <p className="text-[10px] font-mono text-muted-foreground mt-1">
            {p.categoryLabel}{p.upgraded ? ` (↑ from ${p.originalCategory?.replace(/_/g, " ")})` : ""}
          </p>
        </div>
        <div className={`rounded-lg p-3 border ${isUnderBudget ? "border-red-500/30 bg-red-500/5" : "border-primary/10 bg-background/30"}`}>
          <p className="text-[10px] font-mono text-muted-foreground/60 uppercase mb-1">Prospect Stated Budget</p>
          <p className="text-lg font-mono font-bold text-foreground">{budgetRange || "Not disclosed"}</p>
          <p className="text-[10px] font-mono text-muted-foreground mt-1">
            Flexibility: {budgetFlex || "Unknown"}
            {isUnderBudget && <span className="text-red-400 ml-2">⚠ Below range</span>}
            {isOverBudget && <span className="text-green-400 ml-2">✓ Above range</span>}
          </p>
        </div>
      </div>

      {/* Maturity */}
      <div className="bg-background/30 rounded-lg p-3 border border-primary/10">
        <p className="text-[10px] font-mono text-muted-foreground/60 uppercase mb-1">Business Maturity Assessment</p>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="w-full bg-muted/30 rounded-full h-2 mb-1">
              <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${Math.min(p.maturityScore || 0, 100)}%` }} />
            </div>
          </div>
          <span className="text-sm font-mono font-bold text-foreground">{p.maturityScore}/100</span>
        </div>
        <p className="text-xs font-mono text-muted-foreground mt-1">{p.maturityTier} • Multiplier: {p.maturityMultiplier}x</p>
      </div>

      {/* Active Multipliers */}
      {activeMultipliers.length > 0 && (
        <div className="bg-background/30 rounded-lg border border-primary/10 overflow-hidden">
          <div className="px-3 py-2 border-b border-primary/10 flex items-center gap-2">
            <ArrowUpDown className="w-3 h-3 text-primary" />
            <h3 className="text-xs font-mono font-bold text-foreground">Active Multipliers</h3>
            <span className="ml-auto text-xs font-mono text-primary font-bold">Total: {p.totalMultiplier}x</span>
          </div>
          <div className="divide-y divide-primary/5">
            {activeMultipliers.map(([key, m]) => (
              <div key={key} className="px-3 py-2 flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono text-foreground">{m.reason}</p>
                  <p className="text-[10px] font-mono text-muted-foreground/50">{key}</p>
                </div>
                <span className={`text-xs font-mono font-bold ${m.factor > 1 ? "text-red-400" : "text-green-400"}`}>
                  {m.factor > 1 ? "+" : ""}{((m.factor - 1) * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ROI Scenarios */}
      {roi && (
        <div className="bg-background/30 rounded-lg border border-primary/10 overflow-hidden">
          <div className="px-3 py-2 border-b border-primary/10 flex items-center gap-2">
            <TrendingUp className="w-3 h-3 text-primary" />
            <h3 className="text-xs font-mono font-bold text-foreground">ROI Projections ({roi.type})</h3>
          </div>
          <div className="p-3">
            {roi.type === "ecommerce" && roi.assumptions && (
              <p className="text-[10px] font-mono text-muted-foreground mb-2">
                AOV: ${roi.assumptions.averageOrderValue} • Margin: {roi.assumptions.profitMargin} • Break-even: {roi.ordersToBreakEven} orders
              </p>
            )}
            {roi.type === "service" && roi.assumptions && (
              <p className="text-[10px] font-mono text-muted-foreground mb-2">
                Close rate: {roi.assumptions.industryCloseRate} • Avg client: ${roi.assumptions.averageClientValue} • Break-even: {roi.breakEvenClients} clients ({roi.leadsNeeded} leads)
              </p>
            )}
            {roi.scenarios && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {Object.entries(roi.scenarios).map(([key, s]: [string, any]) => (
                  <div key={key} className="bg-muted/20 rounded-lg p-2 text-center">
                    <p className="text-[10px] font-mono text-muted-foreground uppercase">{s.label}</p>
                    <p className="text-sm font-mono font-bold text-foreground">{s.monthsToBreakEven}mo</p>
                    <p className="text-[10px] font-mono text-green-400">
                      {fmt(s.annualAdditionalRevenue || s.annualRevenueFromWebsite || 0)}/yr
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Phased Option */}
      {phased && (
        <div className="bg-background/30 rounded-lg border border-primary/10 overflow-hidden">
          <div className="px-3 py-2 border-b border-primary/10 flex items-center gap-2">
            <Clock className="w-3 h-3 text-primary" />
            <h3 className="text-xs font-mono font-bold text-foreground">Phased Option Available</h3>
          </div>
          <div className="p-3 grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] font-mono text-muted-foreground/60 uppercase">Phase 1 (Core)</p>
              <p className="text-sm font-mono font-bold text-foreground">{fmt(phased.phase1Range[0])} – {fmt(phased.phase1Range[1])}</p>
              <p className="text-[10px] font-mono text-muted-foreground">{phased.phase1Timeline}</p>
            </div>
            <div>
              <p className="text-[10px] font-mono text-muted-foreground/60 uppercase">Phase 2 (Enhancement)</p>
              <p className="text-sm font-mono font-bold text-foreground">{fmt(phased.phase2Range[0])} – {fmt(phased.phase2Range[1])}</p>
              <p className="text-[10px] font-mono text-muted-foreground">{phased.phase2Timeline}</p>
            </div>
          </div>
        </div>
      )}

      {/* Timeline */}
      {p.timeline && typeof p.timeline === "object" && (
        <div className="bg-background/30 rounded-lg p-3 border border-primary/10">
          <p className="text-[10px] font-mono text-muted-foreground/60 uppercase mb-2">Timeline Breakdown</p>
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { label: "Discovery", val: p.timeline.discovery },
              { label: "Design", val: p.timeline.design },
              { label: "Build", val: p.timeline.build },
              { label: "Revision", val: p.timeline.revision },
            ].map(t => (
              <div key={t.label}>
                <p className="text-[10px] font-mono text-muted-foreground/60">{t.label}</p>
                <p className="text-sm font-mono font-bold text-foreground">{t.val}w</p>
              </div>
            ))}
          </div>
          <p className="text-[10px] font-mono text-muted-foreground mt-2 text-center">Total: {p.timeline.total}</p>
        </div>
      )}
    </div>
  );
};

// ─── Helpers ───

function parseBudgetLow(range: string): number {
  const m = range.match(/\$?([\d,]+)/);
  return m ? parseInt(m[1].replace(/,/g, "")) : 0;
}

function parseBudgetHigh(range: string): number {
  const matches = [...range.matchAll(/\$?([\d,]+)/g)];
  if (matches.length >= 2) return parseInt(matches[1][1].replace(/,/g, ""));
  return parseBudgetLow(range);
}

function generateSignals(
  p: any,
  sel: Record<string, any>,
  budgetLow: number,
  budgetHigh: number,
  multipliers: [string, { factor: number; reason: string }][],
): string[] {
  const signals: string[] = [];

  // Budget mismatch
  if (budgetHigh > 0 && budgetHigh < p.lowEstimate) {
    signals.push(`Stated budget ceiling (${fmt(budgetHigh)}) is ${Math.round((1 - budgetHigh / p.lowEstimate) * 100)}% below minimum estimate (${fmt(p.lowEstimate)})`);
  }

  // Category upgrade
  if (p.upgraded) {
    signals.push(`Category auto-upgraded from "${p.originalCategory?.replace(/_/g, " ")}" — their needs exceed what they think they need`);
  }

  // Rush premium
  const rushMul = multipliers.find(([k]) => k === "urgency");
  if (rushMul && rushMul[1].factor >= 1.3) {
    signals.push(`Rush timeline adds ${Math.round((rushMul[1].factor - 1) * 100)}% premium — potential lever if they drop urgency`);
  }

  // Content readiness risk
  if (sel.contentReadiness === "need_all") {
    signals.push("No content ready — full content creation needed, increases scope and revision risk");
  }

  // High maturity = can afford more
  if (p.maturityScore >= 70) {
    signals.push(`High maturity score (${p.maturityScore}/100) — established business, likely has budget capacity`);
  }

  // Low budget flexibility
  if (sel.budgetFlexibility === "strict" || sel.budgetFlexibility === "fixed") {
    signals.push("Stated strict/fixed budget — may need phased approach or scope reduction");
  }

  // Many multipliers stacking
  if (multipliers.length >= 6) {
    signals.push(`${multipliers.length} complexity factors active — project is more complex than typical, price is justified`);
  }

  return signals;
}

export default PricingIntel;
