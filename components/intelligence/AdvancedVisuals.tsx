'use client';

/* SVG animated visuals for the 4 advanced capability sections */

export const DecisionTreeViz = () => (
  <svg viewBox="0 0 300 200" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
    {/* Tree structure */}
    <line x1="50" y1="100" x2="150" y2="50" stroke="hsl(217, 91%, 60%)" strokeWidth="0.5" opacity="0.2" />
    <line x1="50" y1="100" x2="150" y2="100" stroke="hsl(217, 91%, 60%)" strokeWidth="0.5" opacity="0.2" />
    <line x1="50" y1="100" x2="150" y2="150" stroke="hsl(217, 91%, 60%)" strokeWidth="0.5" opacity="0.2" />
    <line x1="150" y1="50" x2="250" y2="30" stroke="hsl(263, 70%, 50%)" strokeWidth="0.5" opacity="0.15" />
    <line x1="150" y1="50" x2="250" y2="70" stroke="hsl(263, 70%, 50%)" strokeWidth="0.5" opacity="0.15" />
    <line x1="150" y1="100" x2="250" y2="100" stroke="hsl(263, 70%, 50%)" strokeWidth="0.5" opacity="0.15" />
    <line x1="150" y1="150" x2="250" y2="140" stroke="hsl(263, 70%, 50%)" strokeWidth="0.5" opacity="0.15" />
    <line x1="150" y1="150" x2="250" y2="170" stroke="hsl(263, 70%, 50%)" strokeWidth="0.5" opacity="0.15" />
    {/* Nodes */}
    {[
      { x: 50, y: 100, r: 6, c: "hsl(217, 91%, 60%)" },
      { x: 150, y: 50, r: 4, c: "hsl(186, 100%, 42%)" },
      { x: 150, y: 100, r: 4, c: "hsl(186, 100%, 42%)" },
      { x: 150, y: 150, r: 4, c: "hsl(186, 100%, 42%)" },
      { x: 250, y: 30, r: 3, c: "hsl(263, 70%, 50%)" },
      { x: 250, y: 70, r: 3, c: "hsl(263, 70%, 50%)" },
      { x: 250, y: 100, r: 3, c: "hsl(263, 70%, 50%)" },
      { x: 250, y: 140, r: 3, c: "hsl(263, 70%, 50%)" },
      { x: 250, y: 170, r: 3, c: "hsl(263, 70%, 50%)" },
    ].map((n, i) => (
      <circle key={i} cx={n.x} cy={n.y} r={n.r} fill={n.c} opacity="0.3" />
    ))}
    {/* Traveling signal choosing a path */}
    <circle r="4" fill="hsl(186, 100%, 42%)" opacity="0">
      <animate attributeName="cx" values="50;150;250" dur="3s" repeatCount="indefinite" />
      <animate attributeName="cy" values="100;50;70" dur="3s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.8;0.6;0" dur="3s" repeatCount="indefinite" />
    </circle>
    <circle r="4" fill="hsl(217, 91%, 60%)" opacity="0">
      <animate attributeName="cx" values="50;150;250" dur="3s" begin="1.5s" repeatCount="indefinite" />
      <animate attributeName="cy" values="100;150;140" dur="3s" begin="1.5s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.8;0.6;0" dur="3s" begin="1.5s" repeatCount="indefinite" />
    </circle>
  </svg>
);

export const ContentRadarViz = () => (
  <svg viewBox="0 0 300 200" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
    {/* Radar circles */}
    {[30, 60, 90].map((r) => (
      <circle key={r} cx="150" cy="100" r={r} fill="none" stroke="hsl(186, 100%, 42%)" strokeWidth="0.3" opacity="0.12" />
    ))}
    {/* Sweep arm */}
    <line x1="150" y1="100" x2="150" y2="10" stroke="hsl(186, 100%, 42%)" strokeWidth="1" opacity="0.4">
      <animateTransform attributeName="transform" type="rotate" from="0 150 100" to="360 150 100" dur="6s" repeatCount="indefinite" />
    </line>
    <path d="M150,100 L150,10 A90,90 0 0,1 213,55 Z" fill="hsl(186, 100%, 42%)" opacity="0.05">
      <animateTransform attributeName="transform" type="rotate" from="0 150 100" to="360 150 100" dur="6s" repeatCount="indefinite" />
    </path>
    {/* Signal points appearing */}
    {[
      { cx: 180, cy: 60, delay: "1s" },
      { cx: 120, cy: 130, delay: "2.5s" },
      { cx: 200, cy: 110, delay: "4s" },
      { cx: 110, cy: 70, delay: "5s" },
    ].map((s, i) => (
      <circle key={i} cx={s.cx} cy={s.cy} r="4" fill="hsl(217, 91%, 60%)" opacity="0">
        <animate attributeName="opacity" values="0;0.8;0.8;0.3;0" dur="6s" begin={s.delay} repeatCount="indefinite" keyTimes="0;0.05;0.3;0.7;1" />
      </circle>
    ))}
  </svg>
);

export const ShieldViz = () => (
  <svg viewBox="0 0 300 200" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
    {/* Shield shape */}
    <path d="M150,25 L230,60 L230,120 Q230,170 150,185 Q70,170 70,120 L70,60 Z" fill="none" stroke="hsl(217, 91%, 60%)" strokeWidth="0.8" opacity="0.2" />
    <path d="M150,40 L215,68 L215,115 Q215,155 150,168 Q85,155 85,115 L85,68 Z" fill="none" stroke="hsl(186, 100%, 42%)" strokeWidth="0.4" opacity="0.1" />
    {/* Central node */}
    <circle cx="150" cy="105" r="6" fill="hsl(217, 91%, 60%)" opacity="0.5">
      <animate attributeName="opacity" values="0.3;0.6;0.3" dur="3s" repeatCount="indefinite" />
    </circle>
    {/* Incoming signals detected at shield boundary */}
    {[
      { sx: 40, sy: 80, ex: 75, ey: 85, delay: "0s" },
      { sx: 260, sy: 70, ex: 225, ey: 75, delay: "1.2s" },
      { sx: 150, sy: 5, ex: 150, ey: 30, delay: "2.4s" },
      { sx: 60, sy: 160, ex: 85, ey: 145, delay: "3.6s" },
    ].map((s, i) => (
      <g key={i}>
        <circle cx={s.sx} cy={s.sy} r="3" fill="hsl(263, 70%, 50%)" opacity="0">
          <animate attributeName="cx" values={`${s.sx};${s.ex}`} dur="2s" begin={s.delay} repeatCount="indefinite" />
          <animate attributeName="cy" values={`${s.sy};${s.ey}`} dur="2s" begin={s.delay} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.6;0.8;0" dur="2s" begin={s.delay} repeatCount="indefinite" />
        </circle>
        {/* Detection flash at shield boundary */}
        <circle cx={s.ex} cy={s.ey} r="2" fill="hsl(186, 100%, 42%)" opacity="0">
          <animate attributeName="r" values="2;10;10" dur="2s" begin={s.delay} repeatCount="indefinite" keyTimes="0;0.5;1" />
          <animate attributeName="opacity" values="0;0;0.4;0" dur="2s" begin={s.delay} repeatCount="indefinite" keyTimes="0;0.4;0.5;1" />
        </circle>
      </g>
    ))}
  </svg>
);

export const JourneyPathViz = () => (
  <svg viewBox="0 0 300 200" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
    {/* Path stages */}
    {[
      { x: 30, y: 100, label: "Discovery" },
      { x: 110, y: 60, label: "Interest" },
      { x: 190, y: 100, label: "Engage" },
      { x: 270, y: 60, label: "Convert" },
    ].map((stage, i) => (
      <g key={i}>
        <circle cx={stage.x} cy={stage.y} r="8" fill="none" stroke="hsl(217, 91%, 60%)" strokeWidth="0.8" opacity="0.25" />
        <circle cx={stage.x} cy={stage.y} r="3" fill="hsl(186, 100%, 42%)" opacity="0.3" />
      </g>
    ))}
    {/* Connecting paths */}
    <path d="M38,100 Q70,40 110,60" fill="none" stroke="hsl(217, 91%, 60%)" strokeWidth="0.5" opacity="0.15" strokeDasharray="4 4" />
    <path d="M118,60 Q150,120 190,100" fill="none" stroke="hsl(263, 70%, 50%)" strokeWidth="0.5" opacity="0.15" strokeDasharray="4 4" />
    <path d="M198,100 Q230,40 270,60" fill="none" stroke="hsl(186, 100%, 42%)" strokeWidth="0.5" opacity="0.15" strokeDasharray="4 4" />
    {/* Traveling signal */}
    <circle r="4" fill="hsl(186, 100%, 42%)" opacity="0">
      <animate attributeName="cx" values="30;110;190;270;270" dur="5s" repeatCount="indefinite" keyTimes="0;0.25;0.5;0.75;1" />
      <animate attributeName="cy" values="100;60;100;60;60" dur="5s" repeatCount="indefinite" keyTimes="0;0.25;0.5;0.75;1" />
      <animate attributeName="opacity" values="0.7;0.8;0.7;0.9;0" dur="5s" repeatCount="indefinite" keyTimes="0;0.25;0.5;0.75;1" />
    </circle>
    {/* Destination glow */}
    <circle cx="270" cy="60" r="8" fill="hsl(186, 100%, 42%)" opacity="0">
      <animate attributeName="r" values="8;20;8" dur="5s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0;0;0.15;0" dur="5s" repeatCount="indefinite" keyTimes="0;0.6;0.8;1" />
    </circle>
  </svg>
);
