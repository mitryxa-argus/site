'use client';

import { useState, useEffect } from "react";

const PHASES = [
  { label: "Audit", quarter: "Q1" },
  { label: "Build", quarter: "Q2" },
  { label: "Launch", quarter: "Q3" },
  { label: "Scale", quarter: "Q4" },
];

const BlueprintVisual = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % 24);
    }, 400);
    return () => clearInterval(timer);
  }, []);

  const activePhase = step < 16 ? Math.floor(step / 4) : step < 20 ? 3 : -1;
  const progress = activePhase >= 0 ? ((activePhase + 1) / PHASES.length) * 100 : 0;

  const startX = 50;
  const endX = 340;
  const timelineY = 100;
  const span = endX - startX;

  return (
    <svg viewBox="0 0 420 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <text x={20} y={24} className="fill-muted-foreground" fontSize={10} fontFamily="monospace" opacity={0.6}>
        &gt;_ 12-month digital roadmap
      </text>

      {/* Month ticks */}
      {Array.from({ length: 13 }, (_, i) => {
        const x = startX + (i / 12) * span;
        return (
          <g key={i}>
            <line x1={x} y1={timelineY - 5} x2={x} y2={timelineY + 5} stroke="hsl(var(--muted-foreground))" strokeWidth={0.8} opacity={0.4} />
            {i % 3 === 0 && (
              <text x={x} y={timelineY + 22} textAnchor="middle" className="fill-muted-foreground" fontSize={9} fontFamily="monospace" opacity={0.5}>
                M{i}
              </text>
            )}
          </g>
        );
      })}

      {/* Track */}
      <line x1={startX} y1={timelineY} x2={endX} y2={timelineY} stroke="hsl(var(--border))" strokeWidth={3} strokeLinecap="round" opacity={0.5} />

      {/* Progress fill */}
      {activePhase >= 0 && (
        <line
          x1={startX}
          y1={timelineY}
          x2={startX + (span * progress) / 100}
          y2={timelineY}
          stroke="hsl(var(--primary))"
          strokeWidth={3}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      )}

      {/* Phase nodes */}
      {PHASES.map((phase, i) => {
        const nodeX = startX + ((i + 1) / PHASES.length) * span;
        const isActive = i <= activePhase;
        const isCurrent = i === activePhase;

        return (
          <g key={phase.quarter}>
            {isCurrent && (
              <circle cx={nodeX} cy={timelineY} r={16} fill="none" stroke="hsl(var(--primary))" strokeWidth={1.5} opacity={0.4}>
                <animate attributeName="r" values="12;20;12" dur="1.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;0.1;0.5" dur="1.2s" repeatCount="indefinite" />
              </circle>
            )}

            <circle
              cx={nodeX}
              cy={timelineY}
              r={10}
              fill={isActive ? "hsl(var(--primary))" : "hsl(var(--muted))"}
              stroke={isActive ? "hsl(var(--primary))" : "hsl(var(--border))"}
              strokeWidth={2}
              opacity={isActive ? 1 : 0.5}
              className="transition-all duration-400"
            />
            {isActive && (
              <text x={nodeX} y={timelineY + 4} textAnchor="middle" fill="hsl(var(--primary-foreground))" fontSize={9} fontFamily="monospace" fontWeight="bold">
                ✓
              </text>
            )}

            <text
              x={nodeX}
              y={timelineY - 24}
              textAnchor="middle"
              className={isActive ? "fill-primary" : "fill-muted-foreground"}
              fontSize={13}
              fontFamily="monospace"
              fontWeight="bold"
              opacity={isActive ? 1 : 0.35}
            >
              {phase.quarter}
            </text>

            <text
              x={nodeX}
              y={timelineY + 42}
              textAnchor="middle"
              className={isActive ? "fill-foreground" : "fill-muted-foreground"}
              fontSize={11}
              fontFamily="monospace"
              opacity={isActive ? 1 : 0.3}
            >
              {phase.label}
            </text>
          </g>
        );
      })}

      {/* Progress % - moved left to avoid clipping */}
      <text x={endX + 14} y={timelineY + 5} fill="hsl(var(--accent))" fontSize={16} fontFamily="monospace" fontWeight="bold">
        {activePhase >= 0 ? `${Math.round(progress)}%` : "—"}
      </text>

      {/* Status */}
      <text x={20} y={185} className="fill-muted-foreground" fontSize={9} fontFamily="monospace" opacity={0.45}>
        {activePhase >= 0 ? `phase: ${PHASES[activePhase].label.toLowerCase()} · ${PHASES[activePhase].quarter}` : "awaiting initialization..."}
      </text>
    </svg>
  );
};

export default BlueprintVisual;
