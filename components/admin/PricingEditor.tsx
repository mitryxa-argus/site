'use client';

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Save, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type PricingConfigRow = {
  id: string;
  config_type: string;
  config_key: string;
  config_value: any;
  active: boolean;
};

const PricingEditor = () => {
  const [configs, setConfigs] = useState<PricingConfigRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    setLoading(true);
    const { data } = await (supabase.from("pricing_config") as any)
      .select("*")
      .order("config_key");
    setConfigs(data || []);
    setLoading(false);
  };

  const handleRangeChange = (id: string, field: "low" | "high", value: string) => {
    const num = parseInt(value, 10) || 0;
    setConfigs(prev => prev.map(c => {
      if (c.id !== id) return c;
      const range = [...(c.config_value.baseRange || [0, 0])];
      range[field === "low" ? 0 : 1] = num;
      return { ...c, config_value: { ...c.config_value, baseRange: range } };
    }));
  };

  const handleMultiplierValueChange = (id: string, value: string) => {
    const num = parseFloat(value) || 0;
    setConfigs(prev => prev.map(c => {
      if (c.id !== id) return c;
      return { ...c, config_value: { ...c.config_value, value: num } };
    }));
  };

  const handleToggle = async (id: string, currentActive: boolean) => {
    await (supabase.from("pricing_config") as any)
      .update({ active: !currentActive, updated_at: new Date().toISOString() })
      .eq("id", id);
    setConfigs(prev => prev.map(c => c.id === id ? { ...c, active: !currentActive } : c));
    toast({ title: "Updated", description: `${!currentActive ? "Enabled" : "Disabled"}` });
  };

  const handleSave = async (config: PricingConfigRow) => {
    setSaving(config.id);
    await (supabase.from("pricing_config") as any)
      .update({ config_value: config.config_value, updated_at: new Date().toISOString() })
      .eq("id", config.id);
    setSaving(null);
    toast({ title: "Saved", description: `Updated ${config.config_key.replace(/_/g, " ")}` });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const categories = configs.filter(c => c.config_type === "category");
  const multipliers = configs.filter(c => c.config_type === "multiplier");

  return (
    <div className="space-y-6">
      {/* Categories Section */}
      <div>
        <p className="text-sm font-mono text-muted-foreground mb-3">
          Edit base price ranges for each project category. Changes apply to all future quotes.
        </p>
        <div className="space-y-3">
          {categories.map(config => (
            <div key={config.id} className={`glass-terminal rounded-xl overflow-hidden transition-opacity ${!config.active ? "opacity-50" : ""}`}>
              <div className="h-[2px] bg-gradient-to-r from-primary to-accent" />
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-mono font-bold text-foreground">{config.config_value.label}</h3>
                    <p className="text-[10px] text-muted-foreground font-mono">{config.config_key}</p>
                  </div>
                  <button onClick={() => handleToggle(config.id, config.active)} className="text-muted-foreground hover:text-foreground">
                    {config.active ? <ToggleRight className="w-5 h-5 text-primary" /> : <ToggleLeft className="w-5 h-5" />}
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[10px] text-muted-foreground/60 font-mono uppercase block mb-1">Low ($)</label>
                    <Input type="number" value={config.config_value.baseRange?.[0] || 0} onChange={(e) => handleRangeChange(config.id, "low", e.target.value)} className="font-mono text-xs h-8" />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground/60 font-mono uppercase block mb-1">High ($)</label>
                    <Input type="number" value={config.config_value.baseRange?.[1] || 0} onChange={(e) => handleRangeChange(config.id, "high", e.target.value)} className="font-mono text-xs h-8" />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground/60 font-mono uppercase block mb-1">Timeline</label>
                    <p className="text-xs font-mono text-muted-foreground mt-1">{config.config_value.baseTimeline?.total || "N/A"}</p>
                  </div>
                  <div className="flex items-end">
                    <Button size="sm" variant="outline" onClick={() => handleSave(config)} disabled={saving === config.id} className="font-mono text-xs h-8">
                      {saving === config.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Save className="w-3 h-3 mr-1" /> Save</>}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Multipliers Section */}
      {multipliers.length > 0 && (
        <div>
          <p className="text-sm font-mono text-muted-foreground mb-3">
            Adjust multiplier values. These override hardcoded defaults in the pricing engine.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {multipliers.map(config => (
              <div key={config.id} className={`glass-terminal rounded-xl overflow-hidden transition-opacity ${!config.active ? "opacity-50" : ""}`}>
                <div className="h-[1px] bg-gradient-to-r from-accent/50 to-primary/50" />
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-xs font-mono font-bold text-foreground">{config.config_value.label || config.config_key.replace(/_/g, " ")}</h3>
                      <p className="text-[9px] text-muted-foreground/50 font-mono">{config.config_key}</p>
                    </div>
                    <button onClick={() => handleToggle(config.id, config.active)} className="text-muted-foreground hover:text-foreground">
                      {config.active ? <ToggleRight className="w-4 h-4 text-primary" /> : <ToggleLeft className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <label className="text-[9px] text-muted-foreground/60 font-mono uppercase block mb-1">Multiplier</label>
                      <Input
                        type="number"
                        step="0.05"
                        value={config.config_value.value ?? 1.0}
                        onChange={(e) => handleMultiplierValueChange(config.id, e.target.value)}
                        className="font-mono text-xs h-7"
                      />
                    </div>
                    <div className="flex items-end pt-3">
                      <Button size="sm" variant="outline" onClick={() => handleSave(config)} disabled={saving === config.id} className="font-mono text-[10px] h-7 px-2">
                        {saving === config.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingEditor;
