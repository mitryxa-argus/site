'use client';

import { useState, useEffect } from "react";

/* ─── 1. Decision Flow ─── */
function DecisionFlowVisual() {
  const [activeNode, setActiveNode] = useState(0);
  const [packetPath, setPacketPath] = useState<number[]>([]);

  useEffect(() => {
    const nodes = [0, 1, 2, 3, 4, 5, 6];
    let idx = 0;
    const paths = [
      [0, 1, 3],
      [0, 2, 5],
      [0, 1, 4],
      [0, 2, 6],
    ];
    let pathIdx = 0;

    const iv = setInterval(() => {
      const currentPath = paths[pathIdx];
      if (idx < currentPath.length) {
        setActiveNode(currentPath[idx]);
        setPacketPath(currentPath.slice(0, idx + 1));
        idx++;
      } else {
        idx = 0;
        pathIdx = (pathIdx + 1) % paths.length;
        setPacketPath([]);
      }
    }, 600);
    return () => clearInterval(iv);
  }, []);

  // Tree layout: node 0 top-center, 1/2 mid, 3/4/5/6 bottom
  const positions: Record<number, { x: number; y: number }> = {
    0: { x: 140, y: 30 },
    1: { x: 75, y: 95 },
    2: { x: 205, y: 95 },
    3: { x: 40, y: 160 },
    4: { x: 110, y: 160 },
    5: { x: 170, y: 160 },
    6: { x: 240, y: 160 },
  };

  const edges: [number, number][] = [
    [0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6],
  ];

  const labels: Record<number, string> = {
    0: "Start",
    1: "Yes",
    2: "No",
    3: "Qualified",
    4: "Learn More",
    5: "Nurture",
    6: "Redirect",
  };

  const isEdgeActive = (from: number, to: number) => {
    for (let i = 0; i < packetPath.length - 1; i++) {
      if (packetPath[i] === from && packetPath[i + 1] === to) return true;
    }
    return false;
  };

  return (
    <svg viewBox="0 0 280 200" className="w-full h-full">
      {edges.map(([f, t]) => {
        const active = isEdgeActive(f, t);
        return (
          <line
            key={`${f}-${t}`}
            x1={positions[f].x}
            y1={positions[f].y}
            x2={positions[t].x}
            y2={positions[t].y}
            stroke={active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground) / 0.2)"}
            strokeWidth={active ? 2 : 1}
            className="transition-all duration-300"
          />
        );
      })}
      {Object.entries(positions).map(([key, pos]) => {
        const id = Number(key);
        const isActive = activeNode === id;
        const isInPath = packetPath.includes(id);
        return (
          <g key={id}>
            <circle
              cx={pos.x}
              cy={pos.y}
              r={isActive ? 14 : 11}
              fill={
                isActive
                  ? "hsl(var(--primary) / 0.3)"
                  : isInPath
                  ? "hsl(var(--secondary) / 0.15)"
                  : "hsl(var(--muted) / 0.4)"
              }
              stroke={
                isActive
                  ? "hsl(var(--primary))"
                  : isInPath
                  ? "hsl(var(--secondary) / 0.5)"
                  : "hsl(var(--muted-foreground) / 0.2)"
              }
              strokeWidth={isActive ? 2 : 1}
              className="transition-all duration-300"
            />
            {isActive && (
              <circle
                cx={pos.x}
                cy={pos.y}
                r={18}
                fill="none"
                stroke="hsl(var(--primary) / 0.3)"
                strokeWidth={1}
                className="animate-pulse"
              />
            )}
            <text
              x={pos.x}
              y={pos.y + 3}
              textAnchor="middle"
              fontSize={7}
              fill={isInPath ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))"}
              className="font-mono transition-all duration-300"
            >
              {labels[id]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ─── 2. Behavior Analysis ─── */
function BehaviorAnalysisVisual() {
  const [tick, setTick] = useState(0);
  const [metrics, setMetrics] = useState({ engagement: 0, intent: 0, time: 0 });
  const [heatmap, setHeatmap] = useState<boolean[]>(Array(8).fill(false));

  useEffect(() => {
    const iv = setInterval(() => {
      setTick((t) => {
        const next = (t + 1) % 40;
        if (next === 0) {
          setMetrics({ engagement: 0, intent: 0, time: 0 });
          setHeatmap(Array(8).fill(false));
        }
        return next;
      });
    }, 250);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    setMetrics({
      engagement: Math.min(Math.floor((tick / 35) * 94), 94),
      intent: Math.min(Math.floor((tick / 35) * 87), 87),
      time: Math.min(Math.floor((tick / 35) * 134), 134),
    });
    setHeatmap((prev) => {
      const next = [...prev];
      const idx = Math.floor((tick / 40) * 8);
      if (idx < 8) next[idx] = true;
      return next;
    });
  }, [tick]);

  // Generate waveform data
  const wavePoints = Array.from({ length: 30 }, (_, i) => {
    const isSpike = [4, 8, 13, 18, 22, 27].includes(i);
    const active = i <= tick * 0.75;
    const y = active ? (isSpike ? 15 + Math.random() * 25 : 35 + Math.random() * 8) : 40;
    return { x: 20 + i * 8, y };
  });

  const intentLabel = metrics.intent > 70 ? "High" : metrics.intent > 40 ? "Medium" : "Low";
  const timeStr = `${Math.floor(metrics.time / 60)}m ${(metrics.time % 60).toString().padStart(2, "0")}s`;

  return (
    <svg viewBox="0 0 280 200" className="w-full h-full">
      {/* Waveform */}
      <text x="20" y="12" fontSize={7} fill="hsl(var(--muted-foreground))" className="font-mono">
        Activity Timeline
      </text>
      <polyline
        points={wavePoints.map((p) => `${p.x},${p.y}`).join(" ")}
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth={1.5}
        className="transition-all duration-200"
      />
      {wavePoints.map(
        (p, i) =>
          [4, 8, 13, 18, 22, 27].includes(i) &&
          i <= tick * 0.75 && (
            <circle key={i} cx={p.x} cy={p.y} r={2.5} fill="hsl(var(--accent))" className="animate-pulse" />
          )
      )}

      {/* Heatmap */}
      <text x="20" y="72" fontSize={7} fill="hsl(var(--muted-foreground))" className="font-mono">
        Section Heatmap
      </text>
      {heatmap.map((active, i) => (
        <rect
          key={i}
          x={20 + i * 30}
          y={78}
          width={26}
          height={14}
          rx={3}
          fill={
            active
              ? i < 3
                ? "hsl(var(--primary) / 0.6)"
                : i < 6
                ? "hsl(var(--secondary) / 0.5)"
                : "hsl(var(--accent) / 0.5)"
              : "hsl(var(--muted) / 0.3)"
          }
          className="transition-all duration-500"
        />
      ))}

      {/* Metrics */}
      {[
        { label: "Engagement", value: `${metrics.engagement}%`, y: 118, color: "--primary" },
        { label: "Intent", value: intentLabel, y: 145, color: "--secondary" },
        { label: "Time on Page", value: timeStr, y: 172, color: "--accent" },
      ].map((m) => (
        <g key={m.label}>
          <text x="20" y={m.y} fontSize={7} fill="hsl(var(--muted-foreground))" className="font-mono">
            {m.label}
          </text>
          <text x="110" y={m.y} fontSize={9} fill={`hsl(var(${m.color}))`} className="font-mono font-bold">
            {m.value}
          </text>
          {/* Gauge bar */}
          <rect x="160" y={m.y - 8} width={100} height={6} rx={3} fill="hsl(var(--muted) / 0.3)" />
          <rect
            x="160"
            y={m.y - 8}
            width={m.label === "Engagement" ? metrics.engagement : m.label === "Intent" ? metrics.intent : Math.min(metrics.time / 1.34, 100)}
            height={6}
            rx={3}
            fill={`hsl(var(${m.color}) / 0.6)`}
            className="transition-all duration-300"
          />
        </g>
      ))}
    </svg>
  );
}

/* ─── 3. Lead Intelligence ─── */
function LeadIntelligenceVisual() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setStep((s) => (s + 1) % 24), 350);
    return () => clearInterval(iv);
  }, []);

  const fields = [
    { label: "Name", value: "Sarah Mitchell", delay: 3 },
    { label: "Need", value: "Personal Injury", delay: 6 },
    { label: "Score", value: "92 / 100", delay: 9 },
    { label: "Timeline", value: "Immediate", delay: 12 },
    { label: "Budget", value: "$15k–25k", delay: 15 },
  ];

  const showBadge = step >= 19;

  // Data stream particles converging toward center
  const particles = Array.from({ length: 6 }, (_, i) => {
    const angle = (i / 6) * Math.PI * 2;
    const progress = Math.min(step / 16, 1);
    const startX = 140 + Math.cos(angle) * 130;
    const startY = 100 + Math.sin(angle) * 90;
    const x = startX + (140 - startX) * progress;
    const y = startY + (100 - startY) * progress;
    return { x, y, visible: step > i * 2 };
  });

  return (
    <svg viewBox="0 0 280 200" className="w-full h-full">
      {/* Converging particles */}
      {particles.map(
        (p, i) =>
          p.visible && (
            <g key={i}>
              <line
                x1={140 + Math.cos((i / 6) * Math.PI * 2) * 130}
                y1={100 + Math.sin((i / 6) * Math.PI * 2) * 90}
                x2={p.x}
                y2={p.y}
                stroke="hsl(var(--primary) / 0.15)"
                strokeWidth={0.5}
                strokeDasharray="3 3"
              />
              <circle cx={p.x} cy={p.y} r={2} fill="hsl(var(--primary) / 0.6)" className="animate-pulse" />
            </g>
          )
      )}

      {/* Profile card outline */}
      <rect
        x="60"
        y="20"
        width="160"
        height="155"
        rx="8"
        fill="hsl(var(--muted) / 0.2)"
        stroke="hsl(var(--primary) / 0.3)"
        strokeWidth={1}
        className="transition-all duration-500"
      />

      {/* Card header */}
      <rect x="60" y="20" width="160" height="24" rx="8" fill="hsl(var(--primary) / 0.1)" />
      <text x="140" y="36" textAnchor="middle" fontSize={8} fill="hsl(var(--primary))" className="font-mono font-bold">
        Prospect Profile
      </text>

      {/* Fields sliding in */}
      {fields.map((f, i) => {
        const visible = step >= f.delay;
        const yPos = 56 + i * 22;
        return (
          <g
            key={f.label}
            opacity={visible ? 1 : 0}
            transform={`translate(${visible ? 0 : (i % 2 === 0 ? -30 : 30)}, 0)`}
            className="transition-all duration-500"
          >
            <text x="72" y={yPos} fontSize={7} fill="hsl(var(--muted-foreground))" className="font-mono">
              {f.label}
            </text>
            <text x="208" y={yPos} textAnchor="end" fontSize={8} fill="hsl(var(--foreground))" className="font-mono">
              {f.value}
            </text>
            <line
              x1="72"
              y1={yPos + 4}
              x2="208"
              y2={yPos + 4}
              stroke="hsl(var(--muted-foreground) / 0.1)"
              strokeWidth={0.5}
            />
          </g>
        );
      })}

      {/* CRM Ready badge */}
      {showBadge && (
        <g className="animate-fade-in">
          <rect x="95" y="178" width="90" height="18" rx="9" fill="hsl(var(--accent) / 0.2)" stroke="hsl(var(--accent) / 0.5)" strokeWidth={1} />
          <text x="140" y="190" textAnchor="middle" fontSize={7} fill="hsl(var(--accent))" className="font-mono font-bold">
            ✓ CRM Ready
          </text>
        </g>
      )}
    </svg>
  );
}

/* ─── 4. Platform Architecture ─── */
function PlatformArchitectureVisual() {
  const [activeLayer, setActiveLayer] = useState(0);
  const [configIdx, setConfigIdx] = useState(0);
  const [particleY, setParticleY] = useState(0);

  const industries = ["Legal", "Medical", "Finance", "Real Estate"];

  // Cycle active layer
  useEffect(() => {
    const iv = setInterval(() => setActiveLayer((l) => (l + 1) % 4), 2400);
    return () => clearInterval(iv);
  }, []);

  // Cycle industry label
  useEffect(() => {
    const iv = setInterval(() => setConfigIdx((c) => (c + 1) % industries.length), 3000);
    return () => clearInterval(iv);
  }, []);

  // Animate particle flowing down
  useEffect(() => {
    const iv = setInterval(() => setParticleY((p) => (p + 1) % 60), 80);
    return () => clearInterval(iv);
  }, []);

  const layers = [
    { label: "UI Layer", subtitle: "Components & Interactions", color: "--primary" },
    { label: "Logic Layer", subtitle: "Decision Engine & Scoring", color: "--secondary" },
    { label: "Config Layer", subtitle: industries[configIdx], color: "--accent" },
    { label: "Data Layer", subtitle: "Storage & CRM Sync", color: "--primary" },
  ];

  const layerHeight = 30;
  const gap = 18;
  const startY = 20;
  const cx = 140; // center x

  // Calculate y positions for each layer
  const getLayerY = (i: number) => startY + i * (layerHeight + gap);

  // Particle travels from top of first layer to bottom of last layer
  const totalTravel = getLayerY(3) + layerHeight - startY;
  const particleAbsY = startY + (particleY / 60) * totalTravel;

  // Determine which layer the particle is currently at
  const particleAtLayer = layers.findIndex((_, i) => {
    const ly = getLayerY(i);
    return particleAbsY >= ly && particleAbsY <= ly + layerHeight;
  });

  return (
    <svg viewBox="0 0 280 210" className="w-full h-full">
      {/* Connecting lines between layers */}
      {[0, 1, 2].map((i) => {
        const fromY = getLayerY(i) + layerHeight;
        const toY = getLayerY(i + 1);
        return (
          <line
            key={`conn-${i}`}
            x1={cx} y1={fromY}
            x2={cx} y2={toY}
            stroke="hsl(var(--muted-foreground) / 0.15)"
            strokeWidth={1}
            strokeDasharray="3 3"
          />
        );
      })}

      {/* Animated particle */}
      <circle
        cx={cx}
        cy={particleAbsY}
        r={3}
        fill={particleAtLayer >= 0
          ? `hsl(var(${layers[particleAtLayer].color}))`
          : "hsl(var(--primary))"
        }
        className="transition-colors duration-200"
      />
      <circle
        cx={cx}
        cy={particleAbsY}
        r={7}
        fill="none"
        stroke={particleAtLayer >= 0
          ? `hsl(var(${layers[particleAtLayer].color}) / 0.3)`
          : "hsl(var(--primary) / 0.3)"
        }
        strokeWidth={1}
        className="transition-colors duration-200"
      />

      {/* Layers */}
      {layers.map((layer, i) => {
        const isActive = activeLayer === i;
        const y = getLayerY(i);
        const isConfig = i === 2;

        return (
          <g key={layer.label}>
            {/* Layer pill */}
            <rect
              x="50" y={y}
              width="180" height={layerHeight}
              rx="15"
              fill={isActive ? `hsl(var(${layer.color}) / 0.1)` : "hsl(var(--muted) / 0.15)"}
              stroke={isActive ? `hsl(var(${layer.color}) / 0.5)` : "hsl(var(--muted-foreground) / 0.1)"}
              strokeWidth={isActive ? 1.5 : 0.5}
              className="transition-all duration-500"
            />

            {/* Glow effect when active */}
            {isActive && (
              <rect
                x="48" y={y - 2}
                width="184" height={layerHeight + 4}
                rx="17"
                fill="none"
                stroke={`hsl(var(${layer.color}) / 0.15)`}
                strokeWidth={1}
                className="animate-pulse"
              />
            )}

            {/* Layer label */}
            <text
              x="72" y={y + 13}
              fontSize={8}
              fill={isActive ? `hsl(var(${layer.color}))` : "hsl(var(--foreground) / 0.7)"}
              className="font-mono font-bold transition-all duration-300"
            >
              {layer.label}
            </text>

            {/* Subtitle */}
            <text
              x="72" y={y + 24}
              fontSize={6}
              fill={isActive ? `hsl(var(${layer.color}) / 0.7)` : "hsl(var(--muted-foreground) / 0.5)"}
              className={`font-mono transition-all duration-500 ${isConfig ? 'opacity-100' : ''}`}
            >
              {layer.subtitle}
            </text>

            {/* Active indicator */}
            {isActive && (
              <g>
                <circle cx="207" cy={y + 15} r={3} fill="hsl(142 71% 45%)" className="animate-pulse" />
                <text
                  x="215" y={y + 18}
                  fontSize={5}
                  fill="hsl(142 71% 45% / 0.8)"
                  className="font-mono"
                >
                  Active
                </text>
              </g>
            )}

            {/* Color dot indicator on left */}
            <circle
              cx="62" cy={y + 15}
              r={3}
              fill={isActive ? `hsl(var(${layer.color}))` : `hsl(var(${layer.color}) / 0.3)`}
              className="transition-all duration-300"
            />
          </g>
        );
      })}
    </svg>
  );
}

/* ─── Exports ─── */
const visuals: Record<string, React.FC> = {
  "AI-Guided Decision Flows": DecisionFlowVisual,
  "User Behavior Analysis": BehaviorAnalysisVisual,
  "Structured Lead Intelligence": LeadIntelligenceVisual,
  "Platform Architecture": PlatformArchitectureVisual,
};

export default function TechnologyVisual({ title }: { title: string }) {
  const Visual = visuals[title];
  if (!Visual) return null;
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Visual />
    </div>
  );
}
