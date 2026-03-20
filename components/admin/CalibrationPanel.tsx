'use client';

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type WonLead = {
  id: string;
  session_id: string;
  status: string;
  final_price: number | null;
  final_category: string | null;
  final_timeline: string | null;
  businessName?: string;
  industry?: string;
  estimatedLow?: number;
  estimatedHigh?: number;
  estimatedCategory?: string;
};

const CalibrationPanel = () => {
  const [wonLeads, setWonLeads] = useState<WonLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editTimeline, setEditTimeline] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadCalibration();
  }, []);

  const loadCalibration = async () => {
    setLoading(true);

    // Get won/proposal_sent leads
    const { data: statuses } = await (supabase.from("admin_lead_status") as any)
      .select("*")
      .in("status", ["won", "proposal_sent"]);

    if (!statuses || statuses.length === 0) {
      setLoading(false);
      return;
    }

    // Get corresponding sessions
    const sessionIds = statuses.map((s: any) => s.session_id);
    const { data: sessions } = await (supabase.from("discovery_sessions") as any)
      .select("id, selections, pricing_result")
      .in("id", sessionIds);

    const sessionMap = new Map<string, any>();
    (sessions || []).forEach((s: any) => sessionMap.set(s.id, s));

    const enriched: WonLead[] = statuses.map((s: any) => {
      const sess = sessionMap.get(s.session_id);
      const sel = sess?.selections || {};
      const pricing = sess?.pricing_result;
      return {
        ...s,
        businessName: sel.businessName || sel.leadName || "Unknown",
        industry: sel.industry,
        estimatedLow: pricing?.lowEstimate,
        estimatedHigh: pricing?.highEstimate,
        estimatedCategory: pricing?.categoryLabel || sel.projectCategory,
      };
    });

    setWonLeads(enriched);
    setLoading(false);
  };

  const handleSaveCalibration = async (leadId: string) => {
    const price = parseFloat(editPrice) || null;
    await (supabase.from("admin_lead_status") as any)
      .update({
        final_price: price,
        final_category: editCategory || null,
        final_timeline: editTimeline || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", leadId);

    setEditingId(null);
    loadCalibration();
    toast({ title: "Calibration saved" });
  };

  // Stats
  const calibrated = wonLeads.filter(l => l.final_price && l.estimatedLow && l.estimatedHigh);
  const overPriced = calibrated.filter(l => l.final_price! < l.estimatedLow!).length;
  const underPriced = calibrated.filter(l => l.final_price! > l.estimatedHigh!).length;
  const accurate = calibrated.filter(l => l.final_price! >= l.estimatedLow! && l.final_price! <= l.estimatedHigh!).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm font-mono text-muted-foreground">
        Record actual deal values to calibrate the pricing engine over time.
      </p>

      {/* Stats */}
      {calibrated.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="glass-terminal rounded-xl p-4 text-center">
            <TrendingUp className="w-5 h-5 text-green-400 mx-auto mb-1" />
            <p className="text-xl font-mono font-bold text-green-400">{accurate}</p>
            <p className="text-[10px] font-mono text-muted-foreground">Accurate</p>
          </div>
          <div className="glass-terminal rounded-xl p-4 text-center">
            <TrendingDown className="w-5 h-5 text-red-400 mx-auto mb-1" />
            <p className="text-xl font-mono font-bold text-red-400">{overPriced}</p>
            <p className="text-[10px] font-mono text-muted-foreground">Over-priced</p>
          </div>
          <div className="glass-terminal rounded-xl p-4 text-center">
            <Minus className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
            <p className="text-xl font-mono font-bold text-yellow-400">{underPriced}</p>
            <p className="text-[10px] font-mono text-muted-foreground">Under-priced</p>
          </div>
        </div>
      )}

      {/* Leads */}
      <div className="space-y-3">
        {wonLeads.map(lead => (
          <div key={lead.id} className="glass-terminal rounded-xl overflow-hidden">
            <div className="h-[2px] bg-gradient-to-r from-primary to-accent" />
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-mono font-bold text-foreground">{lead.businessName}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">{lead.industry} • {lead.estimatedCategory?.replace(/_/g, " ")}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${
                  lead.status === "won" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-purple-500/10 text-purple-400 border-purple-500/20"
                }`}>
                  {lead.status}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                <div>
                  <p className="text-[10px] text-muted-foreground/60 uppercase">Estimated Range</p>
                  <p className="text-foreground">
                    {lead.estimatedLow && lead.estimatedHigh
                      ? `$${lead.estimatedLow.toLocaleString()} – $${lead.estimatedHigh.toLocaleString()}`
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground/60 uppercase">Final Price</p>
                  {editingId === lead.id ? (
                    <Input
                      type="number"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="h-7 text-xs font-mono"
                      placeholder="$"
                    />
                  ) : (
                    <p className="text-foreground">{lead.final_price ? `$${lead.final_price.toLocaleString()}` : "—"}</p>
                  )}
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground/60 uppercase">Final Category</p>
                  {editingId === lead.id ? (
                    <Input
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="h-7 text-xs font-mono"
                      placeholder="Category"
                    />
                  ) : (
                    <p className="text-foreground">{lead.final_category || "—"}</p>
                  )}
                </div>
                <div className="flex items-end">
                  {editingId === lead.id ? (
                    <div className="flex gap-1">
                      <Button size="sm" className="h-7 text-xs font-mono" onClick={() => handleSaveCalibration(lead.id)}>Save</Button>
                      <Button size="sm" variant="ghost" className="h-7 text-xs font-mono" onClick={() => setEditingId(null)}>Cancel</Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs font-mono"
                      onClick={() => {
                        setEditingId(lead.id);
                        setEditPrice(String(lead.final_price || ""));
                        setEditCategory(lead.final_category || "");
                        setEditTimeline(lead.final_timeline || "");
                      }}
                    >
                      Record Actual
                    </Button>
                  )}
                </div>
              </div>

              {lead.final_price && lead.estimatedLow && lead.estimatedHigh && (
                <div className="mt-2">
                  {lead.final_price >= lead.estimatedLow && lead.final_price <= lead.estimatedHigh ? (
                    <p className="text-[10px] font-mono text-green-400">✓ Within estimated range</p>
                  ) : lead.final_price < lead.estimatedLow ? (
                    <p className="text-[10px] font-mono text-red-400">↓ ${(lead.estimatedLow - lead.final_price).toLocaleString()} below estimate</p>
                  ) : (
                    <p className="text-[10px] font-mono text-yellow-400">↑ ${(lead.final_price - lead.estimatedHigh).toLocaleString()} above estimate</p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {wonLeads.length === 0 && (
          <div className="glass-terminal rounded-xl p-8 text-center">
            <p className="text-sm font-mono text-muted-foreground">No won or proposed leads to calibrate yet.</p>
            <p className="text-xs font-mono text-muted-foreground/50 mt-1">Mark leads as "won" or "proposal sent" to record actual pricing.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalibrationPanel;
