'use client';

import Link from 'next/link';
import { platforms } from "@/data/platforms";
import { caseStudies } from "@/data/caseStudies";
import { ArrowRight } from "lucide-react";
import { useRef, useEffect, useState, useCallback } from "react";
import { useDeviceOrientation } from "@/hooks/useDeviceOrientation";
import TerminalCodeStream from "@/components/ui/TerminalCodeStream";

const colorMap = {
  blue: { border: "from-primary to-secondary", text: "text-primary" },
  cyan: { border: "from-accent to-primary", text: "text-accent" },
  purple: { border: "from-secondary to-accent", text: "text-secondary" },
} as const;

/* ── Platform Card ── */
const PlatformCard = ({
  p, isGlitching, tiltX, tiltY, isDragging,
}: {
  p: (typeof platforms)[number]; isGlitching: boolean; tiltX: number; tiltY: number; isDragging: boolean;
}) => {
  const colors = colorMap[p.color];
  const Icon = p.icon;
  const borderPos = 50 + tiltY * 40;
  return (
    <Link
      href={`/ai-platforms/${caseStudies.find(cs => cs.platformId === p.id)?.slug || p.id}`}
      onClick={(e) => { if (isDragging) e.preventDefault(); }}
      className={`glass-terminal rounded-lg p-5 w-[260px] shrink-0 relative overflow-hidden group hover:border-primary/20 transition-all duration-300 ${isGlitching ? "card-glitch-jitter" : ""}`}
      style={{ '--tilt-x': tiltX, '--tilt-y': tiltY } as React.CSSProperties}
    >
      {isGlitching && <div className="card-glitch-overlay" />}
      <div
        className="tilt-gradient-border"
        style={{ backgroundPosition: `${borderPos}% 0%` }}
      />
      <div className={`w-10 h-10 rounded-lg bg-muted/40 flex items-center justify-center mb-3 ${colors.text}`}>
        <Icon size={20} />
      </div>
      <h3 className="text-sm font-mono font-semibold text-foreground mb-1">{p.title}</h3>
      <p className="text-[11px] text-muted-foreground line-clamp-2 mb-3">{p.description}</p>
      <span className={`text-[10px] font-mono ${colors.text} flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity`}>
        &gt;_ View <ArrowRight size={10} />
      </span>
    </Link>
  );
};

const SPEED = 0.5;

const PlatformsCarousel = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const offsetRef = useRef(0);
  const [isPaused, setIsPaused] = useState(false);
  const [glitchIndices, setGlitchIndices] = useState<Set<number>>(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const tilt = useDeviceOrientation();
  const dragRef = useRef<{ startX: number; startOffset: number; isDragging: boolean; hasMoved: boolean }>({
    startX: 0, startOffset: 0, isDragging: false, hasMoved: false,
  });

  const items = [...platforms, ...platforms, ...platforms];

  // Random glitch effect
  useEffect(() => {
    const scheduleGlitch = () => {
      const delay = 1500 + Math.random() * 2500;
      return setTimeout(() => {
        const count = Math.random() < 0.4 ? 2 : 1;
        const indices = new Set<number>();
        while (indices.size < count) {
          indices.add(Math.floor(Math.random() * items.length));
        }
        setGlitchIndices(indices);
        setTimeout(() => setGlitchIndices(new Set()), 180 + Math.random() * 120);
        timerRef = scheduleGlitch();
      }, delay);
    };
    let timerRef = scheduleGlitch();
    return () => clearTimeout(timerRef);
  }, [items.length]);

  const wrapOffset = useCallback((offset: number) => {
    const track = trackRef.current;
    if (!track) return offset;
    const singleSetWidth = track.scrollWidth / 3;
    let wrapped = offset % singleSetWidth;
    if (wrapped < 0) wrapped += singleSetWidth;
    return wrapped;
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const animate = () => {
      if (!isPaused && !dragRef.current.isDragging) {
        const singleSetWidth = track.scrollWidth / 3;
        offsetRef.current += SPEED;
        if (offsetRef.current >= singleSetWidth) {
          offsetRef.current -= singleSetWidth;
        }
        track.style.transform = `translateX(-${offsetRef.current}px)`;
      }
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [isPaused]);

  // Shared drag logic
  const startDrag = useCallback((clientX: number) => {
    dragRef.current = { startX: clientX, startOffset: offsetRef.current, isDragging: true, hasMoved: false };
    setIsPaused(true);
    setIsDragging(false);
  }, []);

  const moveDrag = useCallback((clientX: number) => {
    if (!dragRef.current.isDragging) return;
    const deltaX = dragRef.current.startX - clientX;
    if (Math.abs(deltaX) > 5) {
      dragRef.current.hasMoved = true;
      setIsDragging(true);
    }
    const newOffset = wrapOffset(dragRef.current.startOffset + deltaX);
    offsetRef.current = newOffset;
    const track = trackRef.current;
    if (track) track.style.transform = `translateX(-${newOffset}px)`;
  }, [wrapOffset]);

  const endDrag = useCallback(() => {
    const wasDragging = dragRef.current.hasMoved;
    dragRef.current.isDragging = false;
    setTimeout(() => {
      setIsPaused(false);
      setIsDragging(false);
    }, wasDragging ? 1500 : 0);
  }, []);

  // Touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => startDrag(e.touches[0].clientX), [startDrag]);
  const handleTouchMove = useCallback((e: React.TouchEvent) => moveDrag(e.touches[0].clientX), [moveDrag]);
  const handleTouchEnd = useCallback(() => endDrag(), [endDrag]);

  // Mouse handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => { e.preventDefault(); startDrag(e.clientX); }, [startDrag]);
  const handleMouseMove = useCallback((e: React.MouseEvent) => moveDrag(e.clientX), [moveDrag]);
  const handleMouseUp = useCallback(() => endDrag(), [endDrag]);
  const handleMouseLeave = useCallback(() => { if (dragRef.current.isDragging) endDrag(); setIsPaused(false); }, [endDrag]);

  return (
    <div
      className={`glass-terminal rounded-xl overflow-hidden relative touch-pan-y ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
      onMouseEnter={() => { if (!dragRef.current.isDragging) setIsPaused(true); }}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex items-center px-4 py-3 border-b border-border/50">
        <div className="flex items-center gap-2 w-full">
          <div className="flex gap-1.5 shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-destructive/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-accent/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-primary/50" />
          </div>
          <TerminalCodeStream />
        </div>
      </div>

      <div className="overflow-hidden p-4">
        <div
          ref={trackRef}
          className="flex gap-4 will-change-transform"
        >
          {items.map((p, i) => (
            <PlatformCard key={`${p.id}-${i}`} p={p} isGlitching={glitchIndices.has(i)} tiltX={tilt.x} tiltY={tilt.y} isDragging={isDragging} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlatformsCarousel;
