'use client';

/* ── Capability card visuals — meaningful, on-brand, same vibe as the site ── */

// Opportunity Discovery — radar scanning the internet for signals
export const RadarSweepViz = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
    <defs>
      <linearGradient id="rsweep" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="hsl(186,100%,42%)" stopOpacity="0" />
        <stop offset="100%" stopColor="hsl(186,100%,42%)" stopOpacity="0.35" />
      </linearGradient>
    </defs>
    {[30,55,80].map(r => <circle key={r} cx="100" cy="80" r={r} fill="none" stroke="hsl(217,91%,60%)" strokeWidth="0.4" opacity="0.15"/>)}
    <line x1="100" y1="5" x2="100" y2="155" stroke="hsl(217,91%,60%)" strokeWidth="0.3" opacity="0.1"/>
    <line x1="20" y1="80" x2="180" y2="80" stroke="hsl(217,91%,60%)" strokeWidth="0.3" opacity="0.1"/>
    <g style={{transformOrigin:"100px 80px"}}>
      <path d="M100,80 L100,0 A80,80 0 0,1 158,20 Z" fill="url(#rsweep)">
        <animateTransform attributeName="transform" type="rotate" from="0 100 80" to="360 100 80" dur="4s" repeatCount="indefinite"/>
      </path>
      <line x1="100" y1="80" x2="100" y2="0" stroke="hsl(186,100%,42%)" strokeWidth="1" opacity="0.6">
        <animateTransform attributeName="transform" type="rotate" from="0 100 80" to="360 100 80" dur="4s" repeatCount="indefinite"/>
      </line>
    </g>
    {/* Signal blips — representing found opportunities */}
    {[{cx:65,cy:45,d:"0.9s"},{cx:148,cy:58,d:"2.1s"},{cx:78,cy:120,d:"3.3s"},{cx:135,cy:110,d:"1.5s"}].map((s,i)=>(
      <g key={i}>
        <circle cx={s.cx} cy={s.cy} r="3" fill="hsl(186,100%,42%)" opacity="0">
          <animate attributeName="opacity" values="0;1;0.8;0" dur="4s" begin={s.d} repeatCount="indefinite" keyTimes="0;0.05;0.5;1"/>
        </circle>
        <circle cx={s.cx} cy={s.cy} r="3" fill="none" stroke="hsl(186,100%,42%)" strokeWidth="1" opacity="0">
          <animate attributeName="r" values="3;10;10" dur="4s" begin={s.d} repeatCount="indefinite" keyTimes="0;0.1;1"/>
          <animate attributeName="opacity" values="0;0.4;0" dur="4s" begin={s.d} repeatCount="indefinite" keyTimes="0;0.1;1"/>
        </circle>
      </g>
    ))}
  </svg>
);

// Conversation Assistance — a message being composed and sent
export const ConversationFlowViz = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
    {/* Incoming question bubble */}
    <rect x="10" y="20" width="90" height="28" rx="8" fill="none" stroke="hsl(263,70%,50%)" strokeWidth="0.6" opacity="0.3"/>
    <rect x="10" y="20" width="90" height="28" rx="8" fill="hsl(263,70%,50%)" opacity="0.07"/>
    {/* Text lines in question bubble */}
    <rect x="18" y="29" width="50" height="4" rx="2" fill="hsl(263,70%,50%)" opacity="0.3"/>
    <rect x="18" y="37" width="35" height="4" rx="2" fill="hsl(263,70%,50%)" opacity="0.2"/>
    <text x="106" y="37" fill="hsl(263,70%,50%)" fontSize="9" fontFamily="monospace" opacity="0.5">?</text>

    {/* AI processing pulse */}
    <circle cx="100" cy="80" r="10" fill="none" stroke="hsl(186,100%,42%)" strokeWidth="0.6" opacity="0.2">
      <animate attributeName="r" values="10;18;10" dur="2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite"/>
    </circle>
    <circle cx="100" cy="80" r="5" fill="hsl(217,91%,60%)" opacity="0.5">
      <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite"/>
    </circle>
    <text x="93" y="84" fill="hsl(186,100%,42%)" fontSize="8" fontFamily="monospace" opacity="0.6">AI</text>

    {/* Outgoing response bubble */}
    <rect x="100" y="112" width="90" height="32" rx="8" fill="none" stroke="hsl(217,91%,60%)" strokeWidth="0.6" opacity="0">
      <animate attributeName="opacity" values="0;0.35;0.35" dur="3s" repeatCount="indefinite" keyTimes="0;0.5;1"/>
    </rect>
    <rect x="100" y="112" width="90" height="32" rx="8" fill="hsl(217,91%,60%)" opacity="0">
      <animate attributeName="opacity" values="0;0.07;0.07" dur="3s" repeatCount="indefinite" keyTimes="0;0.5;1"/>
    </rect>
    <rect x="108" y="121" width="60" height="4" rx="2" fill="hsl(217,91%,60%)" opacity="0">
      <animate attributeName="opacity" values="0;0.35;0.35" dur="3s" repeatCount="indefinite" keyTimes="0;0.55;1"/>
    </rect>
    <rect x="108" y="129" width="45" height="4" rx="2" fill="hsl(217,91%,60%)" opacity="0">
      <animate attributeName="opacity" values="0;0.25;0.25" dur="3s" repeatCount="indefinite" keyTimes="0;0.6;1"/>
    </rect>

    {/* Connecting arrow down */}
    <line x1="100" y1="52" x2="100" y2="68" stroke="hsl(186,100%,42%)" strokeWidth="0.5" opacity="0.3" strokeDasharray="3 3"/>
    <line x1="100" y1="92" x2="100" y2="110" stroke="hsl(186,100%,42%)" strokeWidth="0.5" opacity="0.3" strokeDasharray="3 3"/>
  </svg>
);

// AI Reception & Call Handling — a call being routed and handled
export const FunnelViz = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
    {/* Phone icon top left */}
    <circle cx="35" cy="40" r="14" fill="none" stroke="hsl(263,70%,50%)" strokeWidth="0.6" opacity="0.25"/>
    <text x="28" y="45" fill="hsl(263,70%,50%)" fontSize="13" fontFamily="monospace" opacity="0.5">☏</text>

    {/* Phone icon top right */}
    <circle cx="165" cy="40" r="14" fill="none" stroke="hsl(263,70%,50%)" strokeWidth="0.6" opacity="0.25"/>
    <text x="158" y="45" fill="hsl(263,70%,50%)" fontSize="13" fontFamily="monospace" opacity="0.5">☏</text>

    {/* Central AI handler */}
    <rect x="72" y="65" width="56" height="40" rx="8" fill="none" stroke="hsl(186,100%,42%)" strokeWidth="0.7" opacity="0.3"/>
    <rect x="72" y="65" width="56" height="40" rx="8" fill="hsl(186,100%,42%)" opacity="0.06"/>
    <text x="85" y="83" fill="hsl(186,100%,42%)" fontSize="7" fontFamily="monospace" opacity="0.7">&gt;_ ARGUS</text>
    <text x="84" y="96" fill="hsl(186,100%,42%)" fontSize="6" fontFamily="monospace" opacity="0.45">AI RECEPTION</text>

    {/* Pulse on AI center */}
    <circle cx="100" cy="85" r="28" fill="none" stroke="hsl(186,100%,42%)" strokeWidth="0.4" opacity="0">
      <animate attributeName="r" values="28;42;28" dur="3s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.25;0;0.25" dur="3s" repeatCount="indefinite"/>
    </circle>

    {/* Arrows from phones to AI */}
    <path d="M49,48 Q70,48 72,75" fill="none" stroke="hsl(217,91%,60%)" strokeWidth="0.6" opacity="0.25" strokeDasharray="4 3">
      <animate attributeName="opacity" values="0.2;0.5;0.2" dur="2s" repeatCount="indefinite"/>
    </path>
    <path d="M151,48 Q130,48 128,75" fill="none" stroke="hsl(217,91%,60%)" strokeWidth="0.6" opacity="0.25" strokeDasharray="4 3">
      <animate attributeName="opacity" values="0.2;0.5;0.2" dur="2s" begin="1s" repeatCount="indefinite"/>
    </path>

    {/* Qualified lead output */}
    <rect x="72" y="130" width="56" height="18" rx="5" fill="hsl(217,91%,60%)" opacity="0.1"/>
    <text x="80" y="143" fill="hsl(217,91%,60%)" fontSize="7" fontFamily="monospace" opacity="0.6">QUALIFIED LEAD</text>
    <line x1="100" y1="105" x2="100" y2="130" stroke="hsl(217,91%,60%)" strokeWidth="0.6" opacity="0.3" strokeDasharray="3 3">
      <animate attributeName="opacity" values="0.2;0.5;0.2" dur="2s" begin="0.5s" repeatCount="indefinite"/>
    </line>
  </svg>
);

// Client Qualification — questions filtered down to a scored lead
export const ConvergingNodesViz = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
    {/* Stages */}
    {["INQUIRY","QUALIFY","SCORE","ROUTE"].map((label, i) => (
      <g key={label}>
        <rect x={8 + i * 48} y="65" width="40" height="30" rx="5"
          fill={i === 3 ? "hsl(186,100%,42%)" : "hsl(217,91%,60%)"}
          opacity={i === 3 ? 0.12 : 0.07}
          stroke={i === 3 ? "hsl(186,100%,42%)" : "hsl(217,91%,60%)"}
          strokeWidth="0.5"
          strokeOpacity={i === 3 ? 0.4 : 0.2}
        />
        <text x={14 + i * 48} y="84" fill={i === 3 ? "hsl(186,100%,42%)" : "hsl(217,91%,60%)"} fontSize="6" fontFamily="monospace" opacity={i === 3 ? 0.8 : 0.5}>{label}</text>
        {i < 3 && <line x1={48 + i * 48} y1="80" x2={56 + i * 48} y2="80" stroke="hsl(263,70%,50%)" strokeWidth="0.5" opacity="0.3" strokeDasharray="2 2"/>}
      </g>
    ))}
    {/* Traveling signal across stages */}
    <circle r="4" fill="hsl(186,100%,42%)" opacity="0">
      <animate attributeName="cx" values="28;76;124;172" dur="3s" repeatCount="indefinite" keyTimes="0;0.33;0.66;1"/>
      <animate attributeName="cy" values="80;80;80;80" dur="3s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0;0.8;0.8;0.9" dur="3s" repeatCount="indefinite" keyTimes="0;0.05;0.9;1"/>
    </circle>
    {/* Question marks raining in */}
    {[{x:30,d:"0s"},{x:70,d:"0.7s"},{x:110,d:"1.4s"},{x:150,d:"2.1s"}].map((q,i)=>(
      <text key={i} x={q.x} y="30" fill="hsl(263,70%,50%)" fontSize="10" fontFamily="monospace" opacity="0">
        ?
        <animate attributeName="y" values="30;55" dur="1.5s" begin={q.d} repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0;0.5;0" dur="1.5s" begin={q.d} repeatCount="indefinite"/>
      </text>
    ))}
    {/* Checkmark at the end */}
    <text x="168" y="120" fill="hsl(186,100%,42%)" fontSize="14" fontFamily="monospace" opacity="0">
      ✓
      <animate attributeName="opacity" values="0;0;0.7;0" dur="3s" repeatCount="indefinite" keyTimes="0;0.8;0.9;1"/>
    </text>
  </svg>
);

// Content Intelligence — recurring questions surfacing as topics
export const HeatmapViz = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
    {/* Topic bars with varying heat */}
    {[
      {label:"cost?", heat:0.7, w:120, c:"hsl(186,100%,42%)"},
      {label:"results?", heat:0.5, w:90, c:"hsl(217,91%,60%)"},
      {label:"how long?", heat:0.85, w:140, c:"hsl(186,100%,42%)"},
      {label:"compare?", heat:0.4, w:70, c:"hsl(263,70%,50%)"},
      {label:"reviews?", heat:0.65, w:108, c:"hsl(217,91%,60%)"},
    ].map((t,i)=>(
      <g key={t.label}>
        <text x="5" y={22 + i * 28} fill="hsl(217,91%,60%)" fontSize="7" fontFamily="monospace" opacity="0.45">{t.label}</text>
        <rect x="52" y={12 + i * 28} width={t.w} height="12" rx="3" fill={t.c} opacity="0">
          <animate attributeName="opacity" values={`0;${t.heat * 0.25};${t.heat * 0.25}`} dur="3s" begin={`${i * 0.3}s`} repeatCount="indefinite" keyTimes="0;0.3;1"/>
          <animate attributeName="width" values={`0;${t.w};${t.w}`} dur="3s" begin={`${i * 0.3}s`} repeatCount="indefinite" keyTimes="0;0.3;1"/>
        </rect>
        {/* Pulse on high-heat topics */}
        {t.heat > 0.6 && (
          <circle cx={52 + t.w} cy={18 + i * 28} r="4" fill={t.c} opacity="0">
            <animate attributeName="opacity" values="0;0;0.7;0" dur="3s" begin={`${i * 0.3 + 0.5}s`} repeatCount="indefinite" keyTimes="0;0.3;0.5;1"/>
          </circle>
        )}
      </g>
    ))}
    <text x="52" y="155" fill="hsl(186,100%,42%)" fontSize="6" fontFamily="monospace" opacity="0.4">&gt;_ trending topic identified</text>
  </svg>
);

// Market Awareness — signals from the internet flowing in
export const ExpandingNetworkViz = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
    {/* Center: your business */}
    <circle cx="100" cy="80" r="14" fill="hsl(217,91%,60%)" opacity="0.1" stroke="hsl(217,91%,60%)" strokeWidth="0.7" strokeOpacity="0.4"/>
    <text x="90" y="78" fill="hsl(217,91%,60%)" fontSize="6" fontFamily="monospace" opacity="0.6">YOUR</text>
    <text x="88" y="87" fill="hsl(217,91%,60%)" fontSize="6" fontFamily="monospace" opacity="0.6">BRAND</text>

    {/* Incoming signals from different channels */}
    {[
      {sx:10, sy:20, label:"Reddit",   c:"hsl(263,70%,50%)",  d:"0s"},
      {sx:180,sy:15, label:"LinkedIn", c:"hsl(217,91%,60%)",  d:"0.8s"},
      {sx:190,sy:90, label:"Forums",   c:"hsl(186,100%,42%)", d:"1.6s"},
      {sx:20, sy:140,label:"Reviews",  c:"hsl(263,70%,50%)",  d:"2.4s"},
      {sx:170,sy:145,label:"Search",   c:"hsl(217,91%,60%)",  d:"3.2s"},
    ].map((s,i)=>{
      const mx = s.sx + (100 - s.sx) * 0.5;
      const my = s.sy + (80 - s.sy) * 0.5;
      return (
        <g key={i}>
          <text x={s.sx - 3} y={s.sy - 5} fill={s.c} fontSize="6" fontFamily="monospace" opacity="0.4">{s.label}</text>
          <circle cx={s.sx} cy={s.sy} r="3" fill={s.c} opacity="0.3"/>
          {/* Traveling dot toward center */}
          <circle r="2.5" fill={s.c} opacity="0">
            <animate attributeName="cx" values={`${s.sx};${mx};95`} dur="2.5s" begin={s.d} repeatCount="indefinite" keyTimes="0;0.5;1"/>
            <animate attributeName="cy" values={`${s.sy};${my};80`} dur="2.5s" begin={s.d} repeatCount="indefinite" keyTimes="0;0.5;1"/>
            <animate attributeName="opacity" values="0.6;0.7;0" dur="2.5s" begin={s.d} repeatCount="indefinite" keyTimes="0;0.7;1"/>
          </circle>
        </g>
      );
    })}

    {/* Expanding awareness ring */}
    {[0,1,2].map(i=>(
      <circle key={i} cx="100" cy="80" r="18" fill="none" stroke="hsl(217,91%,60%)" strokeWidth="0.4" opacity="0">
        <animate attributeName="r" from="18" to="65" dur="4s" begin={`${i * 1.3}s`} repeatCount="indefinite"/>
        <animate attributeName="opacity" from="0.25" to="0" dur="4s" begin={`${i * 1.3}s`} repeatCount="indefinite"/>
      </circle>
    ))}
  </svg>
);
