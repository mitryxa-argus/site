'use client';

/* SVG-based animated visuals for the 6 capability cards */

export const RadarSweepViz = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
    {/* Grid lines */}
    {[40, 70, 100].map((r) => (
      <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="hsl(217, 91%, 60%)" strokeWidth="0.3" opacity="0.15" />
    ))}
    <line x1="100" y1="10" x2="100" y2="190" stroke="hsl(217, 91%, 60%)" strokeWidth="0.3" opacity="0.1" />
    <line x1="10" y1="100" x2="190" y2="100" stroke="hsl(217, 91%, 60%)" strokeWidth="0.3" opacity="0.1" />
    {/* Sweep */}
    <g style={{ transformOrigin: "100px 100px" }}>
      <defs>
        <linearGradient id="sweep-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(186, 100%, 42%)" stopOpacity="0" />
          <stop offset="100%" stopColor="hsl(186, 100%, 42%)" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path d="M100,100 L100,5 A95,95 0 0,1 167,33 Z" fill="url(#sweep-grad)">
        <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="4s" repeatCount="indefinite" />
      </path>
      <line x1="100" y1="100" x2="100" y2="5" stroke="hsl(186, 100%, 42%)" strokeWidth="1" opacity="0.5">
        <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="4s" repeatCount="indefinite" />
      </line>
    </g>
    {/* Signal blips */}
    {[
      { cx: 65, cy: 55, d: "0.8s" },
      { cx: 140, cy: 80, d: "2s" },
      { cx: 85, cy: 135, d: "3.2s" },
    ].map((s, i) => (
      <circle key={i} cx={s.cx} cy={s.cy} r="3" fill="hsl(186, 100%, 42%)" opacity="0">
        <animate attributeName="opacity" values="0;0.9;0.9;0" dur="4s" begin={s.d} repeatCount="indefinite" keyTimes="0;0.05;0.6;1" />
      </circle>
    ))}
  </svg>
);

export const ConversationFlowViz = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
    {/* Filter column */}
    <rect x="85" y="10" width="30" height="140" rx="4" fill="none" stroke="hsl(263, 70%, 50%)" strokeWidth="0.5" opacity="0.2" />
    <line x1="85" y1="80" x2="115" y2="80" stroke="hsl(263, 70%, 50%)" strokeWidth="0.3" opacity="0.3" />
    {/* Bubbles flowing left to right through filter */}
    {[
      { y: 30, delay: "0s", color: "hsl(217, 91%, 60%)", passes: true },
      { y: 55, delay: "0.8s", color: "hsl(186, 100%, 42%)", passes: false },
      { y: 80, delay: "1.6s", color: "hsl(263, 70%, 50%)", passes: true },
      { y: 105, delay: "2.4s", color: "hsl(217, 91%, 60%)", passes: false },
      { y: 130, delay: "3.2s", color: "hsl(186, 100%, 42%)", passes: true },
    ].map((b, i) => (
      <g key={i}>
        <circle cx="20" cy={b.y} r="5" fill={b.color} opacity="0">
          <animate attributeName="cx" values={b.passes ? "20;100;180" : "20;95;95"} dur="3s" begin={b.delay} repeatCount="indefinite" />
          <animate attributeName="opacity" values={b.passes ? "0;0.6;0" : "0;0.4;0"} dur="3s" begin={b.delay} repeatCount="indefinite" />
        </circle>
        {b.passes && (
          <circle cx="180" cy={b.y} r="5" fill={b.color} opacity="0" stroke={b.color} strokeWidth="1">
            <animate attributeName="opacity" values="0;0;0.8;0" dur="3s" begin={b.delay} repeatCount="indefinite" keyTimes="0;0.5;0.7;1" />
          </circle>
        )}
      </g>
    ))}
  </svg>
);

export const ConvergingNodesViz = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
    {/* Content blocks at center-right */}
    {[50, 75, 100].map((y, i) => (
      <rect key={i} x="130" y={y} width="50" height="12" rx="2" fill="hsl(186, 100%, 42%)" opacity="0.15" />
    ))}
    {/* Question nodes scattered left, converging */}
    {[
      { sx: 20, sy: 25, delay: "0s" },
      { sx: 40, sy: 60, delay: "0.5s" },
      { sx: 15, sy: 100, delay: "1s" },
      { sx: 50, sy: 130, delay: "1.5s" },
      { sx: 30, sy: 145, delay: "2s" },
    ].map((n, i) => (
      <g key={i}>
        <text x={n.sx} y={n.sy} fill="hsl(263, 70%, 50%)" fontSize="10" opacity="0" fontFamily="monospace">?
          <animate attributeName="opacity" values="0;0.6;0.3;0" dur="4s" begin={n.delay} repeatCount="indefinite" />
          <animate attributeName="x" values={`${n.sx};${n.sx + 40};120`} dur="4s" begin={n.delay} repeatCount="indefinite" />
        </text>
      </g>
    ))}
  </svg>
);

export const FunnelViz = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
    {/* Funnel shape */}
    <path d="M30,20 L170,20 L130,140 L70,140 Z" fill="none" stroke="hsl(217, 91%, 60%)" strokeWidth="0.5" opacity="0.2" />
    <line x1="50" y1="60" x2="150" y2="60" stroke="hsl(217, 91%, 60%)" strokeWidth="0.3" opacity="0.15" />
    <line x1="60" y1="100" x2="140" y2="100" stroke="hsl(217, 91%, 60%)" strokeWidth="0.3" opacity="0.15" />
    {/* Signals entering top, fewer exiting bottom */}
    {[
      { x: 50, delay: "0s", exits: false },
      { x: 80, delay: "0.4s", exits: true },
      { x: 110, delay: "0.8s", exits: false },
      { x: 140, delay: "1.2s", exits: true },
      { x: 65, delay: "1.6s", exits: false },
      { x: 125, delay: "2s", exits: false },
    ].map((s, i) => (
      <circle key={i} cx={s.x} cy="10" r="3" fill={s.exits ? "hsl(186, 100%, 42%)" : "hsl(263, 70%, 50%)"} opacity="0">
        <animate attributeName="cy" values={s.exits ? "10;80;155" : "10;70;70"} dur="3s" begin={s.delay} repeatCount="indefinite" />
        <animate attributeName="cx" values={s.exits ? `${s.x};100;100` : `${s.x};${s.x > 100 ? s.x - 10 : s.x + 10};${s.x > 100 ? s.x - 10 : s.x + 10}`} dur="3s" begin={s.delay} repeatCount="indefinite" />
        <animate attributeName="opacity" values={s.exits ? "0;0.7;0" : "0;0.4;0"} dur="3s" begin={s.delay} repeatCount="indefinite" />
      </circle>
    ))}
  </svg>
);

export const HeatmapViz = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
    {/* Grid cells */}
    {Array.from({ length: 8 }).map((_, row) =>
      Array.from({ length: 10 }).map((_, col) => {
        const hot = (row === 2 && col >= 4 && col <= 6) || (row === 3 && col >= 3 && col <= 7) || (row === 5 && col >= 1 && col <= 3);
        const baseOpacity = hot ? 0.15 : 0.03;
        return (
          <rect
            key={`${row}-${col}`}
            x={col * 20 + 2}
            y={row * 20 + 2}
            width="16"
            height="16"
            rx="2"
            fill={hot ? "hsl(186, 100%, 42%)" : "hsl(217, 91%, 60%)"}
            opacity={baseOpacity}
          >
            {hot && (
              <animate
                attributeName="opacity"
                values={`${baseOpacity};${baseOpacity + 0.25};${baseOpacity}`}
                dur={`${2 + Math.random() * 2}s`}
                begin={`${Math.random() * 2}s`}
                repeatCount="indefinite"
              />
            )}
          </rect>
        );
      })
    )}
  </svg>
);

export const ExpandingNetworkViz = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
    {/* Central authority node */}
    <circle cx="100" cy="80" r="8" fill="hsl(217, 91%, 60%)" opacity="0.5">
      <animate attributeName="opacity" values="0.4;0.7;0.4" dur="3s" repeatCount="indefinite" />
    </circle>
    <circle cx="100" cy="80" r="4" fill="hsl(186, 100%, 42%)" opacity="0.8" />
    {/* Expanding rings */}
    {[0, 1, 2].map((i) => (
      <circle key={i} cx="100" cy="80" r="15" fill="none" stroke="hsl(217, 91%, 60%)" strokeWidth="0.5" opacity="0">
        <animate attributeName="r" from="15" to="70" dur="5s" begin={`${i * 1.7}s`} repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.3" to="0" dur="5s" begin={`${i * 1.7}s`} repeatCount="indefinite" />
      </circle>
    ))}
    {/* Satellite nodes that appear outward */}
    {[
      { angle: 30, dist: 45, delay: "0.5s" },
      { angle: 110, dist: 50, delay: "1.2s" },
      { angle: 200, dist: 40, delay: "2s" },
      { angle: 280, dist: 55, delay: "2.8s" },
      { angle: 160, dist: 60, delay: "3.5s" },
    ].map((n, i) => {
      const rad = (n.angle * Math.PI) / 180;
      const x = 100 + Math.cos(rad) * n.dist;
      const y = 80 + Math.sin(rad) * n.dist;
      return (
        <g key={i}>
          <line x1="100" y1="80" x2={x} y2={y} stroke="hsl(263, 70%, 50%)" strokeWidth="0.5" opacity="0">
            <animate attributeName="opacity" values="0;0.2;0.2;0" dur="4s" begin={n.delay} repeatCount="indefinite" />
          </line>
          <circle cx={x} cy={y} r="3" fill="hsl(263, 70%, 50%)" opacity="0">
            <animate attributeName="opacity" values="0;0.6;0.6;0" dur="4s" begin={n.delay} repeatCount="indefinite" />
          </circle>
        </g>
      );
    })}
  </svg>
);
