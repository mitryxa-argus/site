'use client';

import { useEffect, useRef } from "react";

const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const fontSize = 14;
    const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF{}[]<>/=;:";

    const colors = [
      { r: 59, g: 130, b: 246 },
      { r: 139, g: 92, b: 246 },
      { r: 6, g: 182, b: 212 },
    ];

    let columns: number;
    let drops: number[];
    let colorIndices: number[];
    let lastWidth = -1;

    const init = (w: number, h: number) => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      columns = Math.floor(w / fontSize);
      drops = Array.from({ length: columns }, () => Math.random() * -100);
      colorIndices = Array.from({ length: columns }, () => Math.floor(Math.random() * 3));
      lastWidth = w;
    };

    // Use ResizeObserver so we only reinitialize on actual element size changes
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.round(entry.contentRect.width);
        const h = Math.round(entry.contentRect.height);
        if (w !== lastWidth && w > 0) {
          init(w, h);
        }
      }
    });

    ro.observe(canvas);
    init(canvas.offsetWidth || window.innerWidth, canvas.offsetHeight || window.innerHeight);

    const draw = () => {
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);

      ctx.fillStyle = "rgba(10, 12, 16, 0.06)";
      ctx.fillRect(0, 0, w, h);
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < columns; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const color = colors[colorIndices[i]];
        const y = drops[i] * fontSize;

        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.9)`;
        ctx.fillText(char, i * fontSize, y);

        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.4)`;
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * fontSize, y - fontSize);
        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.15)`;
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * fontSize, y - fontSize * 2);

        drops[i]++;
        if (y > h && Math.random() > 0.975) {
          drops[i] = 0;
          colorIndices[i] = Math.floor(Math.random() * 3);
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.7 }}
      aria-hidden="true"
    />
  );
};

export default MatrixRain;
