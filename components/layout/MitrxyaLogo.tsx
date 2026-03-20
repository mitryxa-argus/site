'use client';

import { useState, useEffect, useRef } from "react";
const mitrxyaIcon = '/assets/mitryxa-icon.png';

const ORIGINAL = "MITRYXA";
const GLITCH_CHARS = "アイウエオカキクケコ0123456789ABCDEF{}[]#%&@!$^*▓░";

const MitrxyaLogo = ({ className = "h-9", iconOnly = false }: { className?: string; iconOnly?: boolean }) => {
  const [text, setText] = useState(ORIGINAL);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (iconOnly) return;

    const scheduleGlitch = () => {
      const delay = 1200 + Math.random() * 1600;
      timeoutRef.current = setTimeout(() => {
        const chars = ORIGINAL.split("");
        const count = Math.random() > 0.5 ? 3 : 2;
        const maxStart = chars.length - count;
        const start = Math.floor(Math.random() * (maxStart + 1));
        for (let i = start; i < start + count; i++) {
          chars[i] = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        }
        setText(chars.join(""));
        setTimeout(() => setText(ORIGINAL), 120);
        scheduleGlitch();
      }, delay);
    };

    scheduleGlitch();
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [iconOnly]);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="h-full aspect-square flex items-center justify-center">
        <img
          src={mitrxyaIcon}
          alt="Mitryxa"
          className="h-full w-full object-contain drop-shadow-[0_0_8px_hsl(217_91%_60%/0.4)]"
        />
      </div>
      {!iconOnly && (
        <span className="text-foreground font-bold text-lg tracking-wider font-mono">
          {text.split("").map((char, i) => (
            <span key={i} style={{ display: "inline-block", width: "1ch", textAlign: "center" }}>
              {char}
            </span>
          ))}
        </span>
      )}
    </div>
  );
};

export default MitrxyaLogo;
