'use client';

const LAMap = () => {
  return (
    <div className="glass-terminal rounded-xl aspect-square relative overflow-hidden group">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary to-accent" />

      {/* Scanning HUD overlay */}
      <div className="absolute top-3 left-3 z-10 font-mono text-[10px] space-y-1">
        <p className="text-primary/60 animate-pulse-glow">● SCANNING</p>
        <p className="text-muted-foreground/50">SYS:ACTIVE</p>
      </div>
      <div className="absolute top-3 right-3 z-10 font-mono text-[10px] text-right space-y-1">
        <p className="text-accent/60">NODE:LA-01</p>
        <p className="text-muted-foreground/40">SIGNAL:98%</p>
      </div>

      <svg
        viewBox="0 0 300 300"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(217 91% 60%)" stopOpacity="0.25" />
            <stop offset="50%" stopColor="hsl(217 91% 60%)" stopOpacity="0.05" />
            <stop offset="100%" stopColor="hsl(217 91% 60%)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="pinGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(186 100% 42%)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="hsl(186 100% 42%)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="coastFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(217 91% 60%)" stopOpacity="0.08" />
            <stop offset="100%" stopColor="hsl(263 70% 50%)" stopOpacity="0.03" />
          </linearGradient>
          <linearGradient id="sweepGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(217 91% 60%)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="hsl(217 91% 60%)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid */}
        {Array.from({ length: 16 }).map((_, i) => (
          <g key={`grid-${i}`}>
            <line x1="0" y1={i * 20} x2="300" y2={i * 20} stroke="hsl(220 14% 14%)" strokeWidth="0.3" />
            <line x1={i * 20} y1="0" x2={i * 20} y2="300" stroke="hsl(220 14% 14%)" strokeWidth="0.3" />
          </g>
        ))}

        {/* Grid intersection dots */}
        {Array.from({ length: 8 }).map((_, row) =>
          Array.from({ length: 8 }).map((_, col) => (
            <circle
              key={`dot-${row}-${col}`}
              cx={col * 40 + 20}
              cy={row * 40 + 20}
              r="1"
              fill="hsl(217 91% 60%)"
              opacity="0.15"
            />
          ))
        )}

        {/* Coastline */}
        <path
          d="M 0 80 Q 30 65, 70 85 Q 100 100, 130 90 Q 160 78, 190 110 Q 210 135, 240 125 Q 265 118, 280 130 Q 290 136, 300 140 L 300 300 L 0 300 Z"
          fill="url(#coastFill)"
          stroke="hsl(217 91% 60%)"
          strokeWidth="0.8"
          strokeOpacity="0.3"
          className="animate-dash"
          strokeDasharray="4 6"
        />

        {/* Highway lines */}
        <path d="M 60 0 Q 100 80, 130 150 Q 145 190, 150 300" fill="none" stroke="hsl(263 70% 50%)" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="6 4" className="animate-dash" />
        <path d="M 0 160 Q 80 140, 160 150 Q 240 160, 300 130" fill="none" stroke="hsl(263 70% 50%)" strokeOpacity="0.15" strokeWidth="0.8" strokeDasharray="4 3" className="animate-dash" />
        <path d="M 100 0 Q 140 100, 200 180 Q 240 230, 300 250" fill="none" stroke="hsl(186 100% 42%)" strokeOpacity="0.12" strokeWidth="0.8" strokeDasharray="4 3" className="animate-dash" />

        {/* Area labels */}
        <text x="55" y="200" fill="hsl(215 20% 55%)" fontSize="6.5" fontFamily="monospace" opacity="0.35">Santa Monica</text>
        <text x="175" y="98" fill="hsl(215 20% 55%)" fontSize="6.5" fontFamily="monospace" opacity="0.35">Hollywood</text>
        <text x="195" y="218" fill="hsl(215 20% 55%)" fontSize="6.5" fontFamily="monospace" opacity="0.35">Downtown</text>
        <text x="25" y="128" fill="hsl(215 20% 55%)" fontSize="6.5" fontFamily="monospace" opacity="0.25">Pacific Ocean</text>

        {/* Radar glow background */}
        <circle cx="150" cy="150" r="80" fill="url(#radarGlow)" />

        {/* Radar sweep */}
        <g className="origin-center" style={{ transformOrigin: '150px 150px', animation: 'radar-sweep 4s linear infinite' }}>
          <path d="M 150 150 L 150 70 A 80 80 0 0 1 206 102 Z" fill="url(#sweepGrad)" />
        </g>

        {/* Radar rings */}
        <circle cx="150" cy="150" r="30" fill="none" stroke="hsl(217 91% 60%)" strokeOpacity="0.12" strokeWidth="0.5" />
        <circle cx="150" cy="150" r="55" fill="none" stroke="hsl(217 91% 60%)" strokeOpacity="0.08" strokeWidth="0.5" />
        <circle cx="150" cy="150" r="80" fill="none" stroke="hsl(217 91% 60%)" strokeOpacity="0.05" strokeWidth="0.5" />

        {/* Sonar ripples */}
        <circle cx="150" cy="150" r="10" fill="none" stroke="hsl(186 100% 42%)" strokeWidth="1" style={{ animation: 'ripple 3s ease-out infinite' }} />
        <circle cx="150" cy="150" r="10" fill="none" stroke="hsl(186 100% 42%)" strokeWidth="1" style={{ animation: 'ripple 3s ease-out 1s infinite' }} />
        <circle cx="150" cy="150" r="10" fill="none" stroke="hsl(186 100% 42%)" strokeWidth="1" style={{ animation: 'ripple 3s ease-out 2s infinite' }} />

        {/* Floating particle dots */}
        {[
          { cx: 80, cy: 120, delay: '0s' }, { cx: 200, cy: 90, delay: '1s' },
          { cx: 110, cy: 250, delay: '0.5s' }, { cx: 230, cy: 200, delay: '1.5s' },
          { cx: 50, cy: 180, delay: '2s' }, { cx: 260, cy: 160, delay: '0.8s' },
          { cx: 170, cy: 260, delay: '1.2s' }, { cx: 90, cy: 60, delay: '2.5s' },
        ].map((p, i) => (
          <circle
            key={`particle-${i}`}
            cx={p.cx} cy={p.cy} r="1.5"
            fill="hsl(217 91% 60%)"
            opacity="0.4"
            style={{ animation: `float-particle 6s ease-in-out ${p.delay} infinite` }}
          />
        ))}

        {/* Pin glow */}
        <circle cx="150" cy="150" r="25" fill="url(#pinGlow)" />

        {/* Location pin */}
        <circle cx="150" cy="150" r="6" fill="hsl(186 100% 42%)" fillOpacity="0.2" />
        <circle cx="150" cy="150" r="3.5" fill="hsl(186 100% 42%)" className="animate-pulse-glow" />
        <circle cx="150" cy="150" r="1.5" fill="hsl(220 20% 6%)" />

        {/* Coordinate readout */}
        <rect x="162" y="138" width="85" height="22" rx="3" fill="hsl(220 20% 8%)" fillOpacity="0.9" stroke="hsl(186 100% 42%)" strokeOpacity="0.3" strokeWidth="0.5" />
        <text x="168" y="148" fill="hsl(186 100% 42%)" fontSize="6" fontFamily="monospace">34.0522° N</text>
        <text x="168" y="156" fill="hsl(217 91% 60%)" fontSize="6" fontFamily="monospace">118.2437° W</text>
      </svg>

      {/* Corner brackets */}
      <div className="absolute top-2 left-2 w-4 h-4 border-l border-t border-primary/20" />
      <div className="absolute top-2 right-2 w-4 h-4 border-r border-t border-primary/20" />
      <div className="absolute bottom-12 left-2 w-4 h-4 border-l border-b border-primary/20" />
      <div className="absolute bottom-12 right-2 w-4 h-4 border-r border-b border-primary/20" />

      {/* Label overlay */}
      <div className="absolute bottom-3 left-3 right-3">
        <div className="glass-terminal rounded-lg px-3 py-2 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
          <p className="text-xs text-muted-foreground font-mono">
            <span className="text-accent">&gt;_</span> Los Angeles, CA
          </p>
        </div>
      </div>
    </div>
  );
};

export default LAMap;
