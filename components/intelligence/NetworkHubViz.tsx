'use client';

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  pulsePhase: number;
  color: string;
}

const COLORS = {
  blue: "hsl(217, 91%, 60%)",
  purple: "hsl(263, 70%, 50%)",
  cyan: "hsl(186, 100%, 42%)",
};

const NetworkHubViz = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const colorArr = [COLORS.blue, COLORS.cyan, COLORS.purple];
    const nodes: Node[] = Array.from({ length: 40 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const dist = 0.3 + Math.random() * 0.5;
      return {
        x: 0.5 + Math.cos(angle) * dist * 0.5,
        y: 0.5 + Math.sin(angle) * dist * 0.5,
        vx: (Math.random() - 0.5) * 0.0003,
        vy: (Math.random() - 0.5) * 0.0003,
        radius: 1.5 + Math.random() * 2.5,
        opacity: 0.3 + Math.random() * 0.5,
        pulsePhase: Math.random() * Math.PI * 2,
        color: colorArr[Math.floor(Math.random() * 3)],
      };
    });

    const cx = 0.5, cy = 0.5;

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);

      // Central hub glow
      const hubR = Math.min(w, h) * 0.06;
      const grad = ctx.createRadialGradient(cx * w, cy * h, 0, cx * w, cy * h, hubR * 3);
      grad.addColorStop(0, "hsla(217, 91%, 60%, 0.15)");
      grad.addColorStop(0.5, "hsla(263, 70%, 50%, 0.05)");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Hub core
      const coreGrad = ctx.createRadialGradient(cx * w, cy * h, 0, cx * w, cy * h, hubR);
      coreGrad.addColorStop(0, "hsla(217, 91%, 60%, 0.4)");
      coreGrad.addColorStop(0.6, "hsla(263, 70%, 50%, 0.15)");
      coreGrad.addColorStop(1, "transparent");
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx * w, cy * h, hubR, 0, Math.PI * 2);
      ctx.fill();

      // Hub ring
      ctx.strokeStyle = `hsla(186, 100%, 42%, ${0.15 + Math.sin(t * 0.001) * 0.05})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx * w, cy * h, hubR * 1.5, 0, Math.PI * 2);
      ctx.stroke();

      // Nodes + connections
      for (const node of nodes) {
        // Drift toward center very slowly
        const dx = cx - node.x;
        const dy = cy - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        node.vx += dx * 0.000008;
        node.vy += dy * 0.000008;
        node.x += node.vx;
        node.y += node.vy;

        // Bounce back if too close to center or too far
        if (dist < 0.08) {
          node.vx -= dx * 0.0003;
          node.vy -= dy * 0.0003;
        }
        if (dist > 0.48) {
          node.vx += dx * 0.0005;
          node.vy += dy * 0.0005;
        }

        const pulse = 0.5 + Math.sin(t * 0.002 + node.pulsePhase) * 0.3;
        const nx = node.x * w;
        const ny = node.y * h;

        // Connection line to hub
        if (dist < 0.4) {
          ctx.strokeStyle = node.color.replace(")", `, ${0.06 + pulse * 0.04})`).replace("hsl", "hsla");
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(nx, ny);
          ctx.lineTo(cx * w, cy * h);
          ctx.stroke();
        }

        // Node glow
        const ng = ctx.createRadialGradient(nx, ny, 0, nx, ny, node.radius * 3);
        ng.addColorStop(0, node.color.replace(")", `, ${node.opacity * pulse})`).replace("hsl", "hsla"));
        ng.addColorStop(1, "transparent");
        ctx.fillStyle = ng;
        ctx.beginPath();
        ctx.arc(nx, ny, node.radius * 3, 0, Math.PI * 2);
        ctx.fill();

        // Node core
        ctx.fillStyle = node.color.replace(")", `, ${node.opacity * pulse * 0.8})`).replace("hsl", "hsla");
        ctx.beginPath();
        ctx.arc(nx, ny, node.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: "block" }}
    />
  );
};

export default NetworkHubViz;
