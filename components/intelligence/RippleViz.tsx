'use client';

const RippleViz = () => (
  <svg viewBox="0 0 400 300" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
    <defs>
      <radialGradient id="ripple-center" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="hsl(217, 91%, 60%)" stopOpacity="0.3" />
        <stop offset="100%" stopColor="transparent" stopOpacity="0" />
      </radialGradient>
    </defs>
    {/* Ripple circles */}
    {[0, 1, 2, 3].map((i) => (
      <circle
        key={i}
        cx="200" cy="150" r="20"
        fill="none"
        stroke="hsl(186, 100%, 42%)"
        strokeWidth="0.5"
        opacity="0"
      >
        <animate attributeName="r" from="20" to="140" dur="4s" begin={`${i}s`} repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.4" to="0" dur="4s" begin={`${i}s`} repeatCount="indefinite" />
      </circle>
    ))}
    {/* Central intelligence node */}
    <circle cx="200" cy="150" r="8" fill="hsl(217, 91%, 60%)" opacity="0.6">
      <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite" />
    </circle>
    <circle cx="200" cy="150" r="4" fill="hsl(186, 100%, 42%)" opacity="0.9" />
    {/* Signal dots emerging */}
    {[
      { cx: 120, cy: 80, delay: "0.5s" },
      { cx: 300, cy: 100, delay: "1.2s" },
      { cx: 80, cy: 200, delay: "2s" },
      { cx: 320, cy: 220, delay: "2.8s" },
      { cx: 160, cy: 240, delay: "3.5s" },
      { cx: 280, cy: 60, delay: "1.8s" },
    ].map((s, i) => (
      <g key={i}>
        <circle cx={s.cx} cy={s.cy} r="3" fill="hsl(263, 70%, 50%)" opacity="0">
          <animate attributeName="opacity" values="0;0.7;0" dur="3s" begin={s.delay} repeatCount="indefinite" />
        </circle>
        <line x1={s.cx} y1={s.cy} x2="200" y2="150" stroke="hsl(217, 91%, 60%)" strokeWidth="0.5" opacity="0" strokeDasharray="4 4">
          <animate attributeName="opacity" values="0;0.2;0" dur="3s" begin={s.delay} repeatCount="indefinite" />
        </line>
      </g>
    ))}
  </svg>
);

export default RippleViz;
