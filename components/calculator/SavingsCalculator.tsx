'use client';

import { useState, useCallback } from "react";
import { Calculator, ArrowRight, ChevronUp, ChevronDown } from "lucide-react";

interface StepperInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  step?: number;
}

const StepperInput = ({ value, onChange, placeholder, step = 1 }: StepperInputProps) => {
  const nudge = useCallback((dir: 1 | -1) => {
    const current = parseInt(value) || 0;
    const next = Math.max(0, current + step * dir);
    onChange(String(next));
  }, [value, onChange, step]);

  return (
    <div className="relative group">
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => {
          const v = e.target.value.replace(/[^0-9]/g, "");
          onChange(v);
        }}
        placeholder={placeholder}
        className="w-full h-12 rounded-lg border border-primary/20 bg-background/50 px-4 pr-10 text-foreground font-mono text-lg placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all [appearance:textfield]"
      />
      {/* Custom stepper buttons */}
      <div className="absolute right-1 top-1 bottom-1 flex flex-col w-7">
        <button
          type="button"
          onClick={() => nudge(1)}
          className="flex-1 flex items-center justify-center rounded-t-md bg-primary/5 hover:bg-primary/15 active:bg-primary/25 border border-primary/10 border-b-0 transition-colors group/btn"
          tabIndex={-1}
          aria-label="Increase"
        >
          <ChevronUp className="w-3.5 h-3.5 text-muted-foreground group-hover/btn:text-primary transition-colors" />
        </button>
        <button
          type="button"
          onClick={() => nudge(-1)}
          className="flex-1 flex items-center justify-center rounded-b-md bg-primary/5 hover:bg-primary/15 active:bg-primary/25 border border-primary/10 transition-colors group/btn"
          tabIndex={-1}
          aria-label="Decrease"
        >
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground group-hover/btn:text-primary transition-colors" />
        </button>
      </div>
    </div>
  );
};

const SavingsCalculator = () => {
  const [leads, setLeads] = useState("");
  const [dealValue, setDealValue] = useState("");

  const monthlyLeads = parseInt(leads) || 0;
  const avgDeal = parseInt(dealValue) || 0;
  const frictionReduction = 0.6;
  const projectedRevenue = monthlyLeads * avgDeal * frictionReduction;

  return (
    <div className="glass-terminal rounded-2xl p-8 sm:p-10 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent via-primary to-secondary" />
      <div className="absolute inset-0 animate-scanline pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <Calculator size={20} className="text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground font-mono">
              <span className="text-accent/50">&gt;_</span> ROI Savings Calculator
            </h3>
            <p className="text-xs text-muted-foreground">See your projected additional revenue</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-2 font-mono uppercase tracking-wider">
              Monthly Leads
            </label>
            <StepperInput value={leads} onChange={setLeads} placeholder="e.g. 200" step={10} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-2 font-mono uppercase tracking-wider">
              Average Deal Value ($)
            </label>
            <StepperInput value={dealValue} onChange={setDealValue} placeholder="e.g. 5000" step={500} />
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
          <div className="flex items-center gap-3 text-sm text-muted-foreground font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            60% Sales Friction Reduction
          </div>
          <ArrowRight size={16} className="text-primary hidden sm:block" />
          <div className="glass-terminal rounded-xl px-6 py-4 text-center flex-1 w-full sm:w-auto">
            <p className="text-xs text-muted-foreground font-mono mb-1">Projected Additional Revenue</p>
            <p className="text-2xl sm:text-3xl font-bold text-gradient font-mono">
              ${projectedRevenue.toLocaleString()}
              <span className="text-sm text-muted-foreground font-normal">/mo</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavingsCalculator;
