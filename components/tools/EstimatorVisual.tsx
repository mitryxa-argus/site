'use client';

import { useState, useEffect } from "react";

const SEGMENTS = [
  { label: "Design", amount: 2400, color: "hsl(var(--primary))" },
  { label: "Development", amount: 5800, color: "hsl(var(--accent))" },
  { label: "Content", amount: 1200, color: "hsl(var(--secondary))" },
  { label: "SEO Setup", amount: 800, color: "hsl(142 71% 45%)" },
  { label: "Testing", amount: 600, color: "hsl(45 93% 47%)" },
];

const TOTAL = SEGMENTS.reduce((s, seg) => s + seg.amount, 0);

const EstimatorVisual = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % 30); // 0-24 animate, 25-29 pause
    }, 350);
    return () => clearInterval(timer);
  }, []);

  const visibleCount = step < 25 ? Math.min(Math.floor(step / 5) + (step > 0 ? 1 : 0), SEGMENTS.length) : step < 28 ? SEGMENTS.length : 0;
  const runningTotal = SEGMENTS.slice(0, visibleCount).reduce((s, seg) => s + seg.amount, 0);

  const barStartX = 120;
  const barMaxW = 230;
  const barH = 26;
  const barGap = 8;
  const startY = 38;

  return (
    <svg viewBox="0 0 420 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <text x={20} y={24} className="fill-muted-foreground" fontSize={10} fontFamily="monospace" opacity={0.6}>
        &gt;_ project cost decomposition
      </text>

      {SEGMENTS.map((seg, i) => {
        const y = startY + i * (barH + barGap);
        const w = (seg.amount / TOTAL) * barMaxW;
        const isVisible = i < visibleCount;

        return (
          <g key={seg.label}>
            <text
              x={barStartX - 10}
              y={y + barH / 2 + 4}
              textAnchor="end"
              fontSize={10}
              fontFamily="monospace"
              className={isVisible ? "fill-foreground" : "fill-muted-foreground"}
              opacity={isVisible ? 0.9 : 0.3}
            >
              {seg.label}
            </text>

            <rect x={barStartX} y={y} width={barMaxW} height={barH} rx={5} fill="hsl(var(--muted))" opacity={0.4} />

            {isVisible && (
              <rect
                x={barStartX}
                y={y}
                width={w}
                height={barH}
                rx={5}
                fill={seg.color}
                opacity={0.9}
                className="transition-all duration-600"
              />
            )}

            {isVisible && w > 50 && (
              <text
                x={barStartX + w - 8}
                y={y + barH / 2 + 4}
                textAnchor="end"
                fontSize={10}
                fontFamily="monospace"
                fontWeight="bold"
                fill="hsl(var(--background))"
              >
                ${(seg.amount / 1000).toFixed(1)}K
              </text>
            )}

            {isVisible && w <= 50 && (
              <text
                x={barStartX + w + 8}
                y={y + barH / 2 + 4}
                fontSize={10}
                fontFamily="monospace"
                fontWeight="bold"
                fill={seg.color}
              >
                ${(seg.amount / 1000).toFixed(1)}K
              </text>
            )}
          </g>
        );
      })}

      {/* Divider */}
      <line
        x1={barStartX}
        y1={startY + SEGMENTS.length * (barH + barGap)}
        x2={barStartX + barMaxW}
        y2={startY + SEGMENTS.length * (barH + barGap)}
        stroke="hsl(var(--border))"
        strokeWidth={1}
        strokeDasharray="4 2"
        opacity={0.5}
      />

      {/* Total */}
      <text x={barStartX} y={startY + SEGMENTS.length * (barH + barGap) + 20} className="fill-muted-foreground" fontSize={11} fontFamily="monospace">
        TOTAL
      </text>
      <text
        x={barStartX + barMaxW}
        y={startY + SEGMENTS.length * (barH + barGap) + 20}
        textAnchor="end"
        fill="hsl(var(--accent))"
        fontSize={20}
        fontFamily="monospace"
        fontWeight="bold"
      >
        ${runningTotal > 0 ? runningTotal.toLocaleString() : "—"}
      </text>
    </svg>
  );
};

export default EstimatorVisual;
