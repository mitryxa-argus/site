'use client';

import { useState, useEffect } from "react";

const METRICS = [
  { label: "SEO", you: 85, comp: 62 },
  { label: "UX", you: 78, comp: 81 },
  { label: "Speed", you: 92, comp: 70 },
  { label: "Security", you: 88, comp: 55 },
];

const CompetitionVisual = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % 24);
    }, 400);
    return () => clearInterval(timer);
  }, []);

  const revealed = step < 16 ? Math.min(Math.floor(step / 4) + (step > 0 ? 1 : 0), METRICS.length) : step < 20 ? METRICS.length : 0;

  const startX = 90;
  const barAreaW = 220;
  const rowH = 38;
  const startY = 36;
  const barH = 12;

  return (
    <svg viewBox="0 0 420 210" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <text x={20} y={20} className="fill-muted-foreground" fontSize={10} fontFamily="monospace" opacity={0.6}>
        &gt;_ competitive positioning analysis
      </text>

      {/* Legend */}
      <rect x={280} y={8} width={12} height={12} rx={3} fill="hsl(var(--primary))" opacity={0.9} />
      <text x={296} y={18} className="fill-foreground" fontSize={9} fontFamily="monospace" opacity={0.8}>You</text>
      <rect x={330} y={8} width={12} height={12} rx={3} fill="hsl(var(--muted-foreground))" opacity={0.5} />
      <text x={346} y={18} className="fill-muted-foreground" fontSize={9} fontFamily="monospace">Comp</text>

      {METRICS.map((m, i) => {
        const y = startY + i * rowH;
        const isRevealed = i < revealed;
        const youW = (m.you / 100) * barAreaW;
        const compW = (m.comp / 100) * barAreaW;
        const diff = m.you - m.comp;
        const isWinning = diff > 0;

        return (
          <g key={m.label}>
            <text
              x={startX - 12}
              y={y + barH + 4}
              textAnchor="end"
              fontSize={11}
              fontFamily="monospace"
              fontWeight="bold"
              className={isRevealed ? "fill-foreground" : "fill-muted-foreground"}
              opacity={isRevealed ? 0.9 : 0.3}
            >
              {m.label}
            </text>

            <rect x={startX} y={y} width={barAreaW} height={barH} rx={4} fill="hsl(var(--muted))" opacity={0.4} />
            <rect x={startX} y={y + barH + 3} width={barAreaW} height={barH} rx={4} fill="hsl(var(--muted))" opacity={0.4} />

            {isRevealed && (
              <rect x={startX} y={y} width={youW} height={barH} rx={4} fill="hsl(var(--primary))" opacity={0.9} className="transition-all duration-500" />
            )}

            {isRevealed && (
              <rect x={startX} y={y + barH + 3} width={compW} height={barH} rx={4} fill="hsl(var(--muted-foreground))" opacity={0.5} className="transition-all duration-500" />
            )}

            {isRevealed && (
              <>
                <text x={startX + youW + 6} y={y + barH - 1} fontSize={9} fontFamily="monospace" fontWeight="bold" fill="hsl(var(--primary))">
                  {m.you}
                </text>
                <text x={startX + compW + 6} y={y + barH * 2 + 1} fontSize={9} fontFamily="monospace" fill="hsl(var(--muted-foreground))" opacity={0.7}>
                  {m.comp}
                </text>
              </>
            )}

            {isRevealed && (
              <text
                x={barAreaW + startX + 40}
                y={y + barH + 4}
                fontSize={11}
                fontFamily="monospace"
                fontWeight="bold"
                textAnchor="middle"
                fill={isWinning ? "hsl(142 71% 45%)" : "hsl(var(--destructive))"}
              >
                {isWinning ? `+${diff}` : diff}
              </text>
            )}
          </g>
        );
      })}

      {/* Status - positioned well below last row */}
      <text x={20} y={200} className="fill-muted-foreground" fontSize={9} fontFamily="monospace" opacity={0.45}>
        {revealed >= 4 ? "analysis complete · 4/4 metrics" : `comparing · ${revealed}/4 metrics...`}
      </text>
    </svg>
  );
};

export default CompetitionVisual;
