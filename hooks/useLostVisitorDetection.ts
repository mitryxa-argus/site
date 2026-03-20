import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from 'next/navigation';

const STORAGE_KEY = "mx_lost_dismissed";
const SCORE_THRESHOLD = 6;
const EXCLUDED = ["/quote", "/proposal", "/mx-control"];

interface SignalState {
  score: number;
  routeTimestamps: number[];
  visitedPaths: Set<string>;
  scrollReversals: number;
  lastScrollDir: "up" | "down" | null;
  lastScrollTime: number;
  scrollReversalWindow: number[];
  hasScrolled: boolean;
  pageEntryTime: number;
  deepPages: string[];
}

export function useLostVisitorDetection() {
  const pathname = usePathname();
  const [isLost, setIsLost] = useState(false);
  const stateRef = useRef<SignalState>({
    score: 0,
    routeTimestamps: [],
    visitedPaths: new Set(),
    scrollReversals: 0,
    lastScrollDir: null,
    lastScrollTime: 0,
    scrollReversalWindow: [],
    hasScrolled: false,
    pageEntryTime: Date.now(),
    deepPages: ["/tools", "/technology", "/intelligence"],
  });
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggeredRef = useRef(false);

  const isExcluded = EXCLUDED.some((p) => pathname.startsWith(p));

  const addScore = useCallback((points: number, reason: string) => {
    if (triggeredRef.current) return;
    const s = stateRef.current;
    s.score += points;
    if (s.score >= SCORE_THRESHOLD) {
      triggeredRef.current = true;
      // 2-second delay before showing
      setTimeout(() => setIsLost(true), 2000);
    }
  }, []);

  // Signal 1: Rapid page switches & revisits
  useEffect(() => {
    if (isExcluded || sessionStorage.getItem(STORAGE_KEY)) return;
    const s = stateRef.current;
    const now = Date.now();

    // Track revisits
    if (s.visitedPaths.has(pathname)) {
      addScore(3, "revisit");
    }
    s.visitedPaths.add(pathname);

    // Track rapid switches
    s.routeTimestamps.push(now);
    s.routeTimestamps = s.routeTimestamps.filter((t) => now - t < 20000);
    if (s.routeTimestamps.length >= 3) {
      addScore(3, "rapid-switch");
      s.routeTimestamps = []; // reset so it doesn't double-fire
    }

    // Signal 5: Quick bounce from deep pages
    s.pageEntryTime = now;
    const prevPath = s.visitedPaths.size > 1 ? pathname : null;
    if (prevPath) {
      // We check on the *next* navigation if the previous was a deep page bounce
    }
  }, [pathname, isExcluded, addScore]);

  // Track deep page bounces (check previous page duration on navigate)
  const prevPathRef = useRef(pathname);
  const prevEntryRef = useRef(Date.now());
  useEffect(() => {
    if (isExcluded || sessionStorage.getItem(STORAGE_KEY)) return;
    const s = stateRef.current;
    const now = Date.now();
    const prevDuration = now - prevEntryRef.current;
    if (
      s.deepPages.some((dp) => prevPathRef.current.startsWith(dp)) &&
      prevDuration < 5000
    ) {
      addScore(2, "deep-bounce");
    }
    prevPathRef.current = pathname;
    prevEntryRef.current = now;
  }, [pathname, isExcluded, addScore]);

  // Signal 2: Scroll yo-yo & Signal 3: Idle detection
  useEffect(() => {
    if (isExcluded || sessionStorage.getItem(STORAGE_KEY)) return;
    const s = stateRef.current;

    const resetIdle = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (s.hasScrolled) {
        idleTimerRef.current = setTimeout(() => {
          addScore(2, "idle");
        }, 15000);
      }
    };

    const handleScroll = () => {
      const now = Date.now();
      if (!s.hasScrolled) s.hasScrolled = true;
      resetIdle();

      const currentDir = window.scrollY > (s.lastScrollTime || 0) ? "down" : "up";
      if (s.lastScrollDir && currentDir !== s.lastScrollDir) {
        s.scrollReversalWindow.push(now);
        s.scrollReversalWindow = s.scrollReversalWindow.filter(
          (t) => now - t < 10000
        );
        if (s.scrollReversalWindow.length >= 3) {
          addScore(2, "scroll-yoyo");
          s.scrollReversalWindow = [];
        }
      }
      s.lastScrollDir = currentDir;
      s.lastScrollTime = window.scrollY;
    };

    const handleClick = () => resetIdle();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("click", handleClick);
    resetIdle();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("click", handleClick);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [pathname, isExcluded, addScore]);

  const dismiss = useCallback(() => {
    setIsLost(false);
    sessionStorage.setItem(STORAGE_KEY, "1");
  }, []);

  // Don't show if already dismissed or on excluded pages
  if (sessionStorage.getItem(STORAGE_KEY) || isExcluded) {
    return { isLost: false, dismiss };
  }

  return { isLost, dismiss };
}
