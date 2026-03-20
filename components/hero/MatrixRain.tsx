"use client";
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
    let lastWidth = canvas.offsetWidth;

    const resize = () => {
      const currentWidth = canvas.offsetWidth;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = currentWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!columns || currentWidth !== lastWidth) {
        columns = Math.floor(currentWidth / fontSize);
        drops = Array.from({ length: columns }, () => Math.random() * -100);
        colorIndices = Array.from({ length: columns }, () => Math.floor(Math.random() * 3));
        lastWidth = currentWidth;
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.fillStyle = "rgba(10, 12, 16, 0.06)";
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
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
        if (y > canvas.offsetHeight && Math.random() > 0.975) {
          drops[i] = 0;
          colorIndices[i] = Math.floor(Math.random() * 3);
        }
      }
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ opacity: 0.7 }} aria-hidden="true" />
  );
};

export default MatrixRain;
