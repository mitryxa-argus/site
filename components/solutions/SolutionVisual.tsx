'use client';

import { useEffect, useState } from "react";

/* ─── 1. Interactive Lead Qualification: Chat-style Q&A ─── */
const FunnelVisual = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => (s + 1) % 6); // 0-3 questions, 4 score fill, 5 qualified badge
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const questions = [
    { q: "What type of case?", options: ["Personal Injury", "Medical"], selected: 0 },
    { q: "When did it happen?", options: ["< 30 days", "30-90 days"], selected: 1 },
    { q: "Have you consulted?", options: ["Yes", "No"], selected: 1 },
    { q: "Estimated damages?", options: ["$10K-50K", "$50K+"], selected: 1 },
  ];

  const scorePercent = step >= 4 ? 87 : Math.min(step, 4) * 22;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Chat container */}
      <div className="w-full max-w-[220px] space-y-2">
        {questions.map((item, i) => (
          <div
            key={i}
            className="transition-all duration-500"
            style={{
              opacity: step >= i ? 1 : 0,
              transform: step >= i ? "translateY(0)" : "translateY(8px)",
            }}
          >
            {/* Question bubble */}
            <div className="bg-primary/10 border border-primary/15 rounded-lg rounded-bl-none px-2.5 py-1.5 mb-1.5">
              <span className="text-[8px] font-mono text-foreground/80">{item.q}</span>
            </div>
            {/* Answer chips */}
            <div className="flex gap-1.5 justify-end">
              {item.options.map((opt, oi) => (
                <div
                  key={oi}
                  className={`px-2 py-1 rounded-md text-[7px] font-mono transition-all duration-300 ${
                    step > i && oi === item.selected
                      ? "bg-accent/20 text-accent border border-accent/30"
                      : "bg-muted/30 text-muted-foreground/60 border border-white/5"
                  }`}
                >
                  {opt}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Score bar */}
      <div className="w-full max-w-[220px] mt-3 space-y-1">
        <div className="flex justify-between">
          <span className="text-[7px] font-mono text-muted-foreground/60">Lead Score</span>
          <span className="text-[7px] font-mono text-accent/80">{scorePercent}%</span>
        </div>
        <div className="h-[5px] bg-muted/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full transition-all duration-700"
            style={{ width: `${scorePercent}%` }}
          />
        </div>
      </div>

      {/* Qualified badge */}
      <div
        className="mt-2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/25 transition-all duration-500"
        style={{
          opacity: step >= 5 ? 1 : 0,
          transform: step >= 5 ? "scale(1)" : "scale(0.8)",
        }}
      >
        <span className="text-[9px] font-mono font-bold text-accent">✓ Qualified Lead</span>
      </div>

      {/* Header */}
      <div className="absolute top-2 left-3">
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-[7px] font-mono text-muted-foreground/50">Live Qualification</span>
        </div>
      </div>
    </div>
  );
};

/* ─── 2. Decision Calculators: Comparison Dashboard ─── */
const CalculatorVisual = () => {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => (t + 1) % 60), 120);
    return () => clearInterval(interval);
  }, []);

  const sliderPos = 30 + Math.sin(tick * 0.15) * 25; // oscillates 5-55 mapped to slider
  const planAScore = Math.round(60 + Math.sin(tick * 0.15) * 15);
  const planBScore = Math.round(75 - Math.sin(tick * 0.15) * 10);
  const recommended = planAScore > planBScore ? "A" : "B";

  const metrics = [
    { label: "Monthly Cost", a: `$${Math.round(2000 + sliderPos * 30)}`, b: `$${Math.round(3500 - sliderPos * 15)}` },
    { label: "Setup Time", a: `${Math.round(4 + sliderPos * 0.1)}w`, b: `${Math.round(2 + sliderPos * 0.05)}w` },
    { label: "ROI (12mo)", a: `${planAScore * 2}%`, b: `${planBScore * 2}%` },
  ];

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Two plan cards */}
      <div className="flex gap-3 w-full max-w-[230px]">
        {["A", "B"].map((plan) => {
          const isRec = recommended === plan;
          const score = plan === "A" ? planAScore : planBScore;
          return (
            <div
              key={plan}
              className={`flex-1 rounded-lg border p-2.5 transition-all duration-300 ${
                isRec
                  ? "border-accent/30 bg-accent/5"
                  : "border-white/5 bg-muted/10"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-mono font-bold text-foreground/80">Plan {plan}</span>
                {isRec && (
                  <span className="text-[6px] font-mono px-1.5 py-0.5 rounded bg-accent/15 text-accent border border-accent/20">
                    Best Fit
                  </span>
                )}
              </div>
              {/* Score gauge */}
              <div className="flex items-center gap-1.5 mb-2">
                <div className="flex-1 h-[4px] bg-muted/30 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-200 ${
                      isRec ? "bg-accent/60" : "bg-primary/40"
                    }`}
                    style={{ width: `${score}%` }}
                  />
                </div>
                <span className={`text-[8px] font-mono font-bold ${isRec ? "text-accent" : "text-primary/60"}`}>
                  {score}
                </span>
              </div>
              {/* Metrics */}
              {metrics.map((m) => (
                <div key={m.label} className="flex justify-between py-0.5">
                  <span className="text-[6px] font-mono text-muted-foreground/50">{m.label}</span>
                  <span className="text-[7px] font-mono text-foreground/70">{plan === "A" ? m.a : m.b}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Slider control */}
      <div className="w-full max-w-[230px] mt-3">
        <div className="flex items-center gap-2">
          <span className="text-[7px] font-mono text-muted-foreground/50">Budget</span>
          <div className="flex-1 h-[3px] bg-muted/40 rounded-full relative">
            <div
              className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-primary border border-background shadow-[0_0_8px_hsl(217_91%_60%/0.4)] transition-all duration-200"
              style={{ left: `${sliderPos}%` }}
            />
          </div>
          <span className="text-[7px] font-mono text-muted-foreground/50">Speed</span>
        </div>
      </div>

      {/* Label */}
      <div className="absolute top-2 left-3">
        <span className="text-[7px] font-mono text-muted-foreground/50">Decision Engine</span>
      </div>
    </div>
  );
};

/* ─── 3. Educational Client Platforms: Step-by-step walkthrough ─── */
const LearningPathVisual = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((s) => (s + 1) % 6); // 5 steps + 1 pause
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    { label: "Understanding Your Options", preview: "Learn about the different approaches available and what each involves..." },
    { label: "Compare Approaches", preview: "Side-by-side comparison of costs, timelines, and expected outcomes..." },
    { label: "Review Key Details", preview: "Important considerations, requirements, and documentation needed..." },
    { label: "Personalized Assessment", preview: "Based on your inputs, here's our tailored recommendation..." },
    { label: "Next Steps & Action Plan", preview: "Your complete roadmap with clear milestones and deadlines..." },
  ];

  const completedCount = Math.min(activeStep, 5);
  const progress = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-[220px] space-y-0">
        {steps.map((s, i) => {
          const isComplete = i < activeStep;
          const isCurrent = i === activeStep && activeStep < 5;
          const isLocked = i > activeStep;

          return (
            <div key={i} className="flex gap-2.5">
              {/* Timeline column */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-mono transition-all duration-500 shrink-0 ${
                    isComplete
                      ? "bg-accent/20 border border-accent/40 text-accent"
                      : isCurrent
                      ? "bg-primary/20 border border-primary/40 text-primary"
                      : "bg-muted/20 border border-white/10 text-muted-foreground/40"
                  }`}
                >
                  {isComplete ? "✓" : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`w-[1px] flex-1 min-h-[12px] transition-all duration-500 ${
                      isComplete ? "bg-accent/30" : "bg-white/5"
                    }`}
                  />
                )}
              </div>
              {/* Content */}
              <div className={`pb-2 transition-all duration-500 ${isLocked ? "opacity-40" : ""}`}>
                <span
                  className={`text-[8px] font-mono block ${
                    isCurrent ? "text-primary" : isComplete ? "text-foreground/70" : "text-muted-foreground/50"
                  }`}
                >
                  {s.label}
                </span>
                {/* Expanded preview for current step */}
                <div
                  className="overflow-hidden transition-all duration-500"
                  style={{
                    maxHeight: isCurrent ? "30px" : "0px",
                    opacity: isCurrent ? 1 : 0,
                  }}
                >
                  <p className="text-[6px] font-mono text-muted-foreground/50 mt-0.5 leading-relaxed">
                    {s.preview}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-[220px] mt-2 flex items-center gap-2">
        <div className="flex-1 h-[4px] bg-muted/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-[8px] font-mono text-accent/70">{progress}%</span>
      </div>

      {/* Header */}
      <div className="absolute top-2 left-3">
        <span className="text-[7px] font-mono text-muted-foreground/50">Learning Path</span>
      </div>
    </div>
  );
};

/* ─── 4. Lead Intelligence Reports: Document being generated ─── */
const ReportVisual = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => (s + 1) % 10); // 6 lines + radar fill + download
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const lines = [
    { label: "Name", value: "J. Mitchell" },
    { label: "Score", value: "92/100" },
    { label: "Budget", value: "$150K-250K" },
    { label: "Timeline", value: "Q2 2025" },
    { label: "Intent", value: "High" },
    { label: "Source", value: "Organic Search" },
  ];

  // Radar chart dimensions
  const radarMetrics = [
    { label: "Budget", value: 0.85 },
    { label: "Intent", value: 0.92 },
    { label: "Timeline", value: 0.7 },
    { label: "Fit", value: 0.88 },
    { label: "Authority", value: 0.75 },
  ];

  const radarPoints = (scale: number) =>
    radarMetrics
      .map((m, i) => {
        const angle = (Math.PI * 2 * i) / radarMetrics.length - Math.PI / 2;
        const r = 18 * m.value * scale;
        return `${30 + r * Math.cos(angle)},${22 + r * Math.sin(angle)}`;
      })
      .join(" ");

  const radarLabels = radarMetrics.map((m, i) => {
    const angle = (Math.PI * 2 * i) / radarMetrics.length - Math.PI / 2;
    const r = 24;
    return { ...m, x: 30 + r * Math.cos(angle), y: 22 + r * Math.sin(angle) };
  });

  const radarVisible = step >= 7;
  const downloadReady = step >= 9;

  return (
    <div className="relative w-full h-full flex items-center justify-center p-3 overflow-hidden">
      <div className="flex gap-3 w-full max-w-[260px]">
        {/* Left: Report lines */}
        <div className="flex-1 space-y-0.5">
          {/* Header */}
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-primary/15 to-secondary/15 border border-primary/15 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-primary/30" />
            </div>
            <div>
              <div className="text-[8px] font-mono text-foreground/70 flex items-center gap-1">
                Lead Report <span className="text-primary/40">#847</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-accent animate-pulse" />
                <span className="text-[6px] font-mono text-muted-foreground/50">
                  {downloadReady ? "Complete" : "Generating..."}
                </span>
              </div>
            </div>
          </div>

          {/* Data lines */}
          {lines.map((line, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-0.5 border-b border-white/[0.03] transition-all duration-400"
              style={{
                opacity: step > i ? 1 : 0,
                transform: step > i ? "translateX(0)" : "translateX(-6px)",
              }}
            >
              <span className="text-[7px] font-mono text-muted-foreground/60">{line.label}</span>
              <span className={`text-[7px] font-mono ${
                line.label === "Score" ? "text-accent" : line.label === "Intent" ? "text-primary" : "text-foreground/60"
              }`}>
                {line.value}
              </span>
            </div>
          ))}
        </div>

        {/* Right: Radar chart */}
        <div className="w-[70px] flex flex-col items-center justify-center">
          <svg viewBox="0 0 60 48" className="w-full">
            {/* Grid rings */}
            {[0.33, 0.66, 1].map((s) => (
              <polygon
                key={s}
                points={radarMetrics
                  .map((_, i) => {
                    const angle = (Math.PI * 2 * i) / radarMetrics.length - Math.PI / 2;
                    const r = 18 * s;
                    return `${30 + r * Math.cos(angle)},${22 + r * Math.sin(angle)}`;
                  })
                  .join(" ")}
                fill="none"
                stroke="hsl(220 14% 20% / 0.3)"
                strokeWidth="0.3"
              />
            ))}
            {/* Data polygon */}
            <polygon
              points={radarPoints(radarVisible ? 1 : 0)}
              fill="hsl(217 91% 60% / 0.1)"
              stroke="hsl(217 91% 60% / 0.5)"
              strokeWidth="0.8"
              style={{ transition: "all 0.8s ease-out" }}
            />
            {/* Labels */}
            {radarLabels.map((m) => (
              <text
                key={m.label}
                x={m.x}
                y={m.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="hsl(215 20% 55% / 0.6)"
                className="text-[3px] font-mono"
                style={{ opacity: radarVisible ? 1 : 0, transition: "opacity 0.5s" }}
              >
                {m.label}
              </text>
            ))}
          </svg>

          {/* Grade badge */}
          <div
            className="mt-1 px-2 py-0.5 rounded bg-accent/10 border border-accent/20 transition-all duration-500"
            style={{ opacity: step >= 8 ? 1 : 0, transform: step >= 8 ? "scale(1)" : "scale(0.7)" }}
          >
            <span className="text-[9px] font-mono font-bold text-accent">A+</span>
          </div>
        </div>
      </div>

      {/* Download ready indicator */}
      <div
        className="absolute bottom-2 left-3 right-3 flex items-center justify-center gap-1.5 transition-all duration-500"
        style={{ opacity: downloadReady ? 1 : 0 }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
        <span className="text-[7px] font-mono text-accent/70">Download Ready</span>
      </div>
    </div>
  );
};

/* ─── Export ─── */
const visuals = [FunnelVisual, CalculatorVisual, LearningPathVisual, ReportVisual];

interface SolutionVisualProps {
  index: number;
}

const SolutionVisual = ({ index }: SolutionVisualProps) => {
  const Visual = visuals[index % visuals.length];
  return <Visual />;
};

export default SolutionVisual;
