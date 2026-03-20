'use client';

import { useState, useEffect, useRef } from "react";

const CATEGORIES = [
  { label: "SEO", angle: -90, score: 87, color: "hsl(var(--primary))" },
  { label: "Security", angle: -18, score: 72, color: "hsl(var(--accent))" },
  { label: "Speed", angle: 54, score: 94, color: "hsl(142 71% 45%)" },
  { label: "Mobile", angle: 126, score: 68, color: "hsl(var(--secondary))" },
  { label: "Content", angle: 198, score: 81, color: "hsl(45 93% 47%)" },
];

const AuditVisual = () => {
  const [sweepAngle, setSweepAngle] = useState(-90);
  const [revealedIdx, setRevealedIdx] = useState(-1);
  const [overallScore, setOverallScore] = useState(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    let startTime = 0;
    const SWEEP = 4000;
    const PAUSE = 2000;
    const TOTAL = SWEEP + PAUSE;

    const animate = (ts: number) => {
      if (!startTime) startTime = ts;
      const elapsed = (ts - startTime) % TOTAL;

      if (elapsed < SWEEP) {
        const progress = elapsed / SWEEP;
        const angle = -90 + progress * 360;
        setSweepAngle(angle);

        const revealed = CATEGORIES.filter((c) => {
          const norm = (a: number) => ((a + 360) % 360);
          return norm(angle + 90) >= norm(c.angle + 90);
        }).length;
        setRevealedIdx(revealed - 1);

        const avg = CATEGORIES.slice(0, revealed).reduce((s, c) => s + c.score, 0) / Math.max(revealed, 1);
        setOverallScore(revealed > 0 ? Math.round(avg) : 0);
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  const cx = 210;
  const cy = 100;
  const radius = 62;
  const sweepRad = (sweepAngle * Math.PI) / 180;

  return (
    <svg viewBox="0 0 420 210" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <text x={20} y={20} className="fill-muted-foreground" fontSize={10} fontFamily="monospace" opacity={0.6}>
        &gt;_ multi-signal diagnostic scan
      </text>

      {/* Rings */}
      {[0.33, 0.66, 1].map((r) => (
        <circle key={r} cx={cx} cy={cy} r={radius * r} fill="none" stroke="hsl(var(--border))" strokeWidth={0.8} opacity={0.35} />
      ))}

      {/* Spokes + scores */}
      {CATEGORIES.map((cat, i) => {
        const rad = (cat.angle * Math.PI) / 180;
        const x2 = cx + Math.cos(rad) * radius;
        const y2 = cy + Math.sin(rad) * radius;
        const labelDist = radius + 22;
        const labelX = cx + Math.cos(rad) * labelDist;
        const labelY = cy + Math.sin(rad) * labelDist;
        const isRevealed = i <= revealedIdx;
        const scoreLen = (cat.score / 100) * radius;
        const dotX = cx + Math.cos(rad) * scoreLen;
        const dotY = cy + Math.sin(rad) * scoreLen;

        return (
          <g key={cat.label}>
            <line x1={cx} y1={cy} x2={x2} y2={y2} stroke="hsl(var(--border))" strokeWidth={0.8} opacity={0.4} />

            {isRevealed && (
              <>
                <line x1={cx} y1={cy} x2={dotX} y2={dotY} stroke={cat.color} strokeWidth={2.5} strokeLinecap="round" opacity={0.8} />
                <circle cx={dotX} cy={dotY} r={4} fill={cat.color} opacity={0.9}>
                  <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
                </circle>
              </>
            )}

            <text
              x={labelX}
              y={labelY + 3}
              textAnchor="middle"
              fontSize={9}
              fontFamily="monospace"
              fontWeight="bold"
              className={isRevealed ? "fill-foreground" : "fill-muted-foreground"}
              opacity={isRevealed ? 1 : 0.3}
            >
              {cat.label}
            </text>

            {isRevealed && (
              <text x={labelX} y={labelY + 14} textAnchor="middle" fontSize={10} fontFamily="monospace" fontWeight="bold" fill={cat.color}>
                {cat.score}
              </text>
            )}
          </g>
        );
      })}

      {/* Sweep line */}
      <line
        x1={cx}
        y1={cy}
        x2={cx + Math.cos(sweepRad) * radius}
        y2={cy + Math.sin(sweepRad) * radius}
        stroke="hsl(var(--accent))"
        strokeWidth={2}
        opacity={0.7}
      />

      {/* Sweep cone */}
      <path
        d={`M${cx},${cy} L${cx + Math.cos(sweepRad) * radius},${cy + Math.sin(sweepRad) * radius} A${radius},${radius} 0 0,0 ${cx + Math.cos(sweepRad - 0.4) * radius},${cy + Math.sin(sweepRad - 0.4) * radius} Z`}
        fill="hsl(var(--accent))"
        opacity={0.08}
      />

      {/* Center score */}
      <text x={cx} y={cy + 6} textAnchor="middle" fill="hsl(var(--accent))" fontSize={22} fontFamily="monospace" fontWeight="bold">
        {overallScore}
      </text>
      <text x={cx} y={cy - 14} textAnchor="middle" className="fill-muted-foreground" fontSize={8} fontFamily="monospace" opacity={0.6}>
        SCORE
      </text>

      {/* Status */}
      <text x={20} y={200} className="fill-muted-foreground" fontSize={9} fontFamily="monospace" opacity={0.45}>
        {revealedIdx >= 4 ? "scan complete · 5/5 signals" : `scanning · ${revealedIdx + 2}/5 signals...`}
      </text>
    </svg>
  );
};

export default AuditVisual;
