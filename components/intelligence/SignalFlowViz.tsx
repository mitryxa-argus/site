'use client';

/* Animated signal dot that travels through the 5 "How It Works" steps */
const SignalFlowViz = () => (
  <svg viewBox="0 0 1000 40" className="w-full h-10 hidden lg:block" preserveAspectRatio="xMidYMid meet">
    {/* Track line */}
    <line x1="0" y1="20" x2="1000" y2="20" stroke="hsl(217, 91%, 60%)" strokeWidth="0.5" opacity="0.08" />
    {/* Traveling signal */}
    <circle r="4" cy="20" fill="hsl(186, 100%, 42%)" opacity="0">
      <animate attributeName="cx" values="0;200;400;600;800;1000" dur="6s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0;0.7;0.7;0.7;0.7;0" dur="6s" repeatCount="indefinite" />
    </circle>
    {/* Trail glow */}
    <circle r="8" cy="20" fill="hsl(217, 91%, 60%)" opacity="0">
      <animate attributeName="cx" values="0;200;400;600;800;1000" dur="6s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0;0.15;0.15;0.15;0.15;0" dur="6s" repeatCount="indefinite" />
    </circle>
  </svg>
);

export default SignalFlowViz;
