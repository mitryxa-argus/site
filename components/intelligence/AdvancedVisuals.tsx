'use client';

/* ── Advanced capability section visuals — meaningful, same site vibe ── */

// Strategic Engagement — picking the right moment to speak
export const DecisionTreeViz = () => (
  <svg viewBox="0 0 300 200" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
    {/* Signal stream coming in left */}
    {[40,80,120,160].map((y,i)=>(
      <g key={y}>
        <rect x="10" y={y - 8} width="55" height="16" rx="4" fill="hsl(263,70%,50%)" opacity="0.07" stroke="hsl(263,70%,50%)" strokeWidth="0.4" strokeOpacity="0.25"/>
        <text x="14" y={y + 4} fill="hsl(263,70%,50%)" fontSize="6" fontFamily="monospace" opacity="0.4">
          {["question","discussion","problem","search"][i]}
        </text>
      </g>
    ))}

    {/* AI decision node center */}
    <circle cx="150" cy="100" r="22" fill="hsl(217,91%,60%)" opacity="0.08" stroke="hsl(217,91%,60%)" strokeWidth="0.7" strokeOpacity="0.35"/>
    <circle cx="150" cy="100" r="22" fill="none" stroke="hsl(186,100%,42%)" strokeWidth="0.5" strokeOpacity="0.2">
      <animate attributeName="r" values="22;32;22" dur="3s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.3;0;0.3" dur="3s" repeatCount="indefinite"/>
    </circle>
    <text x="135" y="97" fill="hsl(217,91%,60%)" fontSize="7" fontFamily="monospace" opacity="0.7">&gt;_ ENGAGE</text>
    <text x="136" y="108" fill="hsl(186,100%,42%)" fontSize="6" fontFamily="monospace" opacity="0.5">OR IGNORE?</text>

    {/* Output: engage path (top) */}
    <path d="M172,88 Q220,60 255,55" fill="none" stroke="hsl(186,100%,42%)" strokeWidth="0.8" opacity="0.25" strokeDasharray="4 3"/>
    <rect x="255" y="45" width="38" height="18" rx="4" fill="hsl(186,100%,42%)" opacity="0.1" stroke="hsl(186,100%,42%)" strokeWidth="0.4" strokeOpacity="0.4"/>
    <text x="259" y="57" fill="hsl(186,100%,42%)" fontSize="6" fontFamily="monospace" opacity="0.7">ENGAGE ✓</text>

    {/* Output: ignore path (bottom) */}
    <path d="M172,112 Q220,135 255,140" fill="none" stroke="hsl(263,70%,50%)" strokeWidth="0.6" opacity="0.2" strokeDasharray="4 3"/>
    <rect x="255" y="130" width="38" height="18" rx="4" fill="hsl(263,70%,50%)" opacity="0.07" stroke="hsl(263,70%,50%)" strokeWidth="0.4" strokeOpacity="0.25"/>
    <text x="259" y="142" fill="hsl(263,70%,50%)" fontSize="6" fontFamily="monospace" opacity="0.4">SKIP  ×</text>

    {/* Signals flowing from left to decision node */}
    {[0,1,2,3].map(i=>(
      <circle key={i} r="3" fill="hsl(186,100%,42%)" opacity="0">
        <animate attributeName="cx" values={`65;150`} dur="2s" begin={`${i * 0.5}s`} repeatCount="indefinite"/>
        <animate attributeName="cy" values={`${40 + i * 40};100`} dur="2s" begin={`${i * 0.5}s`} repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.6;0.8;0" dur="2s" begin={`${i * 0.5}s`} repeatCount="indefinite" keyTimes="0;0.7;1"/>
      </circle>
    ))}

    {/* Signal choosing engage path */}
    <circle r="3.5" fill="hsl(186,100%,42%)" opacity="0">
      <animate attributeName="cx" values="172;255" dur="1.5s" begin="1s" repeatCount="indefinite"/>
      <animate attributeName="cy" values="88;55" dur="1.5s" begin="1s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0;0.9;0" dur="1.5s" begin="1s" repeatCount="indefinite" keyTimes="0;0.3;1"/>
    </circle>
  </svg>
);

// Content Opportunity Radar — topics rising from the market
export const ContentRadarViz = () => (
  <svg viewBox="0 0 300 200" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
    {/* Grid background */}
    {[0,1,2,3,4].map(i=>(
      <line key={`v${i}`} x1={50 + i * 50} y1="20" x2={50 + i * 50} y2="170" stroke="hsl(217,91%,60%)" strokeWidth="0.3" opacity="0.08"/>
    ))}
    {[0,1,2,3].map(i=>(
      <line key={`h${i}`} x1="30" y1={40 + i * 40} x2="270" y2={40 + i * 40} stroke="hsl(217,91%,60%)" strokeWidth="0.3" opacity="0.08"/>
    ))}

    {/* Rising topic bars */}
    {[
      {x:60,  label:"fees?",   h:90,  c:"hsl(186,100%,42%)", d:"0s"},
      {x:110, label:"process?",h:60,  c:"hsl(217,91%,60%)",  d:"0.4s"},
      {x:160, label:"time?",   h:110, c:"hsl(186,100%,42%)", d:"0.8s"},
      {x:210, label:"compare?",h:45,  c:"hsl(263,70%,50%)",  d:"1.2s"},
      {x:255, label:"cost?",   h:130, c:"hsl(186,100%,42%)", d:"1.6s"},
    ].map(t=>(
      <g key={t.label}>
        <rect x={t.x - 12} y={170 - t.h} width="24" height={t.h} rx="3" fill={t.c} opacity="0">
          <animate attributeName="height" values={`0;${t.h}`} dur="2s" begin={t.d} fill="freeze" repeatCount="1"/>
          <animate attributeName="y" values="170;${170 - t.h}" dur="2s" begin={t.d} fill="freeze" repeatCount="1"/>
          <animate attributeName="opacity" values={`0;${t.h > 80 ? 0.22 : 0.12}`} dur="2s" begin={t.d} fill="freeze" repeatCount="1"/>
        </rect>
        <text x={t.x - 14} y="185" fill={t.c} fontSize="6" fontFamily="monospace" opacity="0.4">{t.label}</text>
        {t.h > 80 && (
          <text x={t.x - 4} y={170 - t.h - 5} fill={t.c} fontSize="9" fontFamily="monospace" opacity="0">
            ↑
            <animate attributeName="opacity" values="0;0.7;0.5" dur="2s" begin={t.d} fill="freeze" repeatCount="1"/>
          </text>
        )}
      </g>
    ))}
    <text x="30" y="15" fill="hsl(186,100%,42%)" fontSize="7" fontFamily="monospace" opacity="0.5">&gt;_ trending topics in your market</text>
  </svg>
);

// Digital Reputation Awareness — monitoring mentions across the web
export const ShieldViz = () => (
  <svg viewBox="0 0 300 200" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
    {/* Shield */}
    <path d="M150,18 L235,52 L235,115 Q235,168 150,185 Q65,168 65,115 L65,52 Z"
      fill="none" stroke="hsl(217,91%,60%)" strokeWidth="0.8" opacity="0.2"/>
    <path d="M150,32 L218,60 L218,112 Q218,156 150,170 Q82,156 82,112 L82,60 Z"
      fill="hsl(217,91%,60%)" opacity="0.04"/>

    {/* Central brand node */}
    <circle cx="150" cy="105" r="8" fill="hsl(217,91%,60%)" opacity="0.5">
      <animate attributeName="opacity" values="0.35;0.65;0.35" dur="3s" repeatCount="indefinite"/>
    </circle>
    <circle cx="150" cy="105" r="4" fill="hsl(186,100%,42%)" opacity="0.8"/>
    <text x="130" y="125" fill="hsl(186,100%,42%)" fontSize="6" fontFamily="monospace" opacity="0.5">YOUR BRAND</text>

    {/* Incoming mentions/signals detected at border */}
    {[
      {sx:20,  sy:80,  ex:78,  ey:85,  label:"mention", c:"hsl(263,70%,50%)", d:"0s"},
      {sx:280, sy:65,  ex:222, ey:72,  label:"review",  c:"hsl(263,70%,50%)", d:"1.5s"},
      {sx:150, sy:5,   ex:150, ey:35,  label:"post",    c:"hsl(217,91%,60%)", d:"3s"},
      {sx:30,  sy:155, ex:80,  ey:148, label:"comment", c:"hsl(186,100%,42%)", d:"4.5s"},
    ].map((s,i)=>(
      <g key={i}>
        <text x={s.sx - 8} y={s.sy - 8} fill={s.c} fontSize="6" fontFamily="monospace" opacity="0.35">{s.label}</text>
        <circle cx={s.sx} cy={s.sy} r="3" fill={s.c} opacity="0.3"/>
        <circle cx={s.sx} cy={s.sy} r="3" fill={s.c} opacity="0">
          <animate attributeName="cx" values={`${s.sx};${s.ex}`} dur="2s" begin={s.d} repeatCount="indefinite"/>
          <animate attributeName="cy" values={`${s.sy};${s.ey}`} dur="2s" begin={s.d} repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0;0.7;0.8;0" dur="2s" begin={s.d} repeatCount="indefinite"/>
        </circle>
        {/* Detection flash */}
        <circle cx={s.ex} cy={s.ey} r="2" fill="hsl(186,100%,42%)" opacity="0">
          <animate attributeName="r" values="2;12" dur="2s" begin={s.d} repeatCount="indefinite" keyTimes="0;1"/>
          <animate attributeName="opacity" values="0;0;0.45;0" dur="2s" begin={s.d} repeatCount="indefinite" keyTimes="0;0.45;0.55;1"/>
        </circle>
      </g>
    ))}
  </svg>
);

// Client Journey Intelligence — guiding a prospect from discovery to conversion
export const JourneyPathViz = () => (
  <svg viewBox="0 0 300 200" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
    {/* Journey stages */}
    {[
      {x:28,  y:100, label:"DISCOVERS",  sub:"finds you online",  c:"hsl(263,70%,50%)"},
      {x:95,  y:65,  label:"LEARNS",     sub:"reads, watches",    c:"hsl(217,91%,60%)"},
      {x:162, y:100, label:"ENGAGES",    sub:"asks a question",   c:"hsl(186,100%,42%)"},
      {x:240, y:65,  label:"CONVERTS",   sub:"becomes a client",  c:"hsl(186,100%,42%)"},
    ].map((s,i)=>(
      <g key={s.label}>
        <circle cx={s.x} cy={s.y} r="14" fill={s.c} opacity={i === 3 ? 0.15 : 0.07} stroke={s.c} strokeWidth="0.7" strokeOpacity={i === 3 ? 0.5 : 0.25}/>
        <text x={s.x - 11} y={s.y + 3} fill={s.c} fontSize="5.5" fontFamily="monospace" opacity={i === 3 ? 0.9 : 0.6} fontWeight="bold">{s.label}</text>
        <text x={s.x - 16} y={s.y + 22} fill={s.c} fontSize="5" fontFamily="monospace" opacity="0.35">{s.sub}</text>
      </g>
    ))}

    {/* Connecting curved paths */}
    <path d="M42,100 Q68,45 81,65" fill="none" stroke="hsl(217,91%,60%)" strokeWidth="0.6" opacity="0.2" strokeDasharray="4 3"/>
    <path d="M109,65 Q132,110 148,100" fill="none" stroke="hsl(186,100%,42%)" strokeWidth="0.6" opacity="0.2" strokeDasharray="4 3"/>
    <path d="M176,100 Q204,45 226,65" fill="none" stroke="hsl(186,100%,42%)" strokeWidth="0.6" opacity="0.2" strokeDasharray="4 3"/>

    {/* Intelligence layer shown below */}
    <rect x="50" y="145" width="200" height="22" rx="5" fill="hsl(217,91%,60%)" opacity="0.05" stroke="hsl(217,91%,60%)" strokeWidth="0.4" strokeOpacity="0.2"/>
    <text x="88" y="160" fill="hsl(217,91%,60%)" fontSize="6.5" fontFamily="monospace" opacity="0.45">&gt;_ intelligence layer watching</text>

    {/* Vertical dotted lines from journey to intelligence bar */}
    {[28,95,162,240].map(x=>(
      <line key={x} x1={x} y1="114" x2={x} y2="145" stroke="hsl(217,91%,60%)" strokeWidth="0.4" opacity="0.15" strokeDasharray="2 2"/>
    ))}

    {/* Traveling prospect dot */}
    <circle r="5" fill="hsl(186,100%,42%)" opacity="0">
      <animate attributeName="cx" values="28;95;162;240;240" dur="5s" repeatCount="indefinite" keyTimes="0;0.25;0.5;0.8;1"/>
      <animate attributeName="cy" values="100;65;100;65;65" dur="5s" repeatCount="indefinite" keyTimes="0;0.25;0.5;0.8;1"/>
      <animate attributeName="opacity" values="0.8;0.8;0.8;1;0" dur="5s" repeatCount="indefinite" keyTimes="0;0.5;0.7;0.85;1"/>
    </circle>
    {/* Glow at conversion */}
    <circle cx="240" cy="65" r="14" fill="hsl(186,100%,42%)" opacity="0">
      <animate attributeName="opacity" values="0;0;0.12;0" dur="5s" repeatCount="indefinite" keyTimes="0;0.75;0.85;1"/>
    </circle>
  </svg>
);
