import { useEffect, useRef, useState, useCallback } from "react";

interface TiltValues {
  x: number; // -1 to 1 (beta: front-back)
  y: number; // -1 to 1 (gamma: left-right)
}

const LERP_FACTOR = 0.1;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export function useDeviceOrientation({ applyToRoot = false } = {}): TiltValues {
  const [tilt, setTilt] = useState<TiltValues>({ x: 0, y: 0 });
  const targetRef = useRef<TiltValues>({ x: 0, y: 0 });
  const currentRef = useRef<TiltValues>({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const permissionRequested = useRef(false);

  const requestPermission = useCallback(async () => {
    if (permissionRequested.current) return;
    permissionRequested.current = true;
    const DOE = DeviceOrientationEvent as any;
    if (typeof DOE.requestPermission === "function") {
      try {
        await DOE.requestPermission();
      } catch {}
    }
  }, []);

  useEffect(() => {
    const handler = () => {
      requestPermission();
      window.removeEventListener("touchstart", handler);
      window.removeEventListener("click", handler);
    };
    window.addEventListener("touchstart", handler, { once: true });
    window.addEventListener("click", handler, { once: true });

    const onOrientation = (e: DeviceOrientationEvent) => {
      const beta = e.beta ?? 0;
      const gamma = e.gamma ?? 0;
      targetRef.current = {
        x: clamp(beta / 45, -1, 1),
        y: clamp(gamma / 45, -1, 1),
      };
    };

    window.addEventListener("deviceorientation", onOrientation);

    const animate = () => {
      const cur = currentRef.current;
      const tgt = targetRef.current;
      const newX = lerp(cur.x, tgt.x, LERP_FACTOR);
      const newY = lerp(cur.y, tgt.y, LERP_FACTOR);
      if (Math.abs(newX - cur.x) > 0.001 || Math.abs(newY - cur.y) > 0.001) {
        currentRef.current = { x: newX, y: newY };
        setTilt({ x: newX, y: newY });

        if (applyToRoot) {
          const root = document.documentElement;
          root.style.setProperty("--tilt-x", String(newX));
          root.style.setProperty("--tilt-y", String(newY));
        }
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("deviceorientation", onOrientation);
      window.removeEventListener("touchstart", handler);
      window.removeEventListener("click", handler);
      cancelAnimationFrame(rafRef.current);
    };
  }, [requestPermission, applyToRoot]);

  return tilt;
}
