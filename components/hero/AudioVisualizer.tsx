'use client';

import { useEffect, useRef } from "react";

interface AudioVisualizerProps {
  audioElement: HTMLAudioElement | null;
  isPlaying: boolean;
}

const WIDTH = 200;
const HEIGHT = 40;

const AudioVisualizer = ({ audioElement, isPlaying }: AudioVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animRef = useRef<number>(0);
  const phaseRef = useRef(0);

  useEffect(() => {
    if (!audioElement) return;

    if (!ctxRef.current) {
      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.85;
      const source = ctx.createMediaElementSource(audioElement);
      source.connect(analyser);
      analyser.connect(ctx.destination);
      ctxRef.current = ctx;
      analyserRef.current = analyser;
      sourceRef.current = source;
    }

    return () => cancelAnimationFrame(animRef.current);
  }, [audioElement]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext("2d")!;
    const dataArray = new Uint8Array(analyser.fftSize);
    const centerY = HEIGHT / 2;
    const centerX = WIDTH / 2;

    const draw = () => {
      animRef.current = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, WIDTH, HEIGHT);

      if (isPlaying) {
        analyser.getByteTimeDomainData(dataArray);
      }

      phaseRef.current += 0.02;

      // Create gradient: blue → purple → cyan
      const grad = ctx.createLinearGradient(0, 0, WIDTH, 0);
      grad.addColorStop(0, "hsla(221, 83%, 53%, 0.9)");
      grad.addColorStop(0.5, "hsla(271, 81%, 56%, 0.9)");
      grad.addColorStop(1, "hsla(172, 66%, 50%, 0.9)");

      // Glow
      ctx.shadowColor = "hsla(271, 81%, 56%, 0.4)";
      ctx.shadowBlur = 8;

      // Draw mirrored waveform from center outward
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);

      const halfPoints = Math.floor(dataArray.length / 2);

      // Right half (center → right)
      for (let i = 0; i < halfPoints; i++) {
        const t = i / halfPoints;
        const x = centerX + t * centerX;
        let amplitude: number;

        if (isPlaying) {
          const val = (dataArray[i] - 128) / 128;
          amplitude = val * (HEIGHT * 0.4);
        } else {
          // Idle: subtle sine pulse
          amplitude = Math.sin(phaseRef.current + t * Math.PI * 2) * 2;
        }

        // Taper at edges for smooth fade
        const taper = 1 - Math.pow(t, 3);
        const y = centerY + amplitude * taper;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();

      // Left half (center → left) — mirrored
      ctx.beginPath();
      for (let i = 0; i < halfPoints; i++) {
        const t = i / halfPoints;
        const x = centerX - t * centerX;
        let amplitude: number;

        if (isPlaying) {
          const val = (dataArray[i] - 128) / 128;
          amplitude = val * (HEIGHT * 0.4);
        } else {
          amplitude = Math.sin(phaseRef.current + t * Math.PI * 2) * 2;
        }

        const taper = 1 - Math.pow(t, 3);
        const y = centerY + amplitude * taper;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.strokeStyle = grad;
      ctx.stroke();

      // Second layer — offset wave for depth
      if (isPlaying) {
        ctx.globalAlpha = 0.3;
        ctx.shadowBlur = 12;

        // Right
        ctx.beginPath();
        for (let i = 0; i < halfPoints; i++) {
          const t = i / halfPoints;
          const x = centerX + t * centerX;
          const val = (dataArray[Math.min(i + 4, dataArray.length - 1)] - 128) / 128;
          const amplitude = val * (HEIGHT * 0.25);
          const taper = 1 - Math.pow(t, 3);
          const y = centerY + amplitude * taper;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Left mirror
        ctx.beginPath();
        for (let i = 0; i < halfPoints; i++) {
          const t = i / halfPoints;
          const x = centerX - t * centerX;
          const val = (dataArray[Math.min(i + 4, dataArray.length - 1)] - 128) / 128;
          const amplitude = val * (HEIGHT * 0.25);
          const taper = 1 - Math.pow(t, 3);
          const y = centerY + amplitude * taper;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        ctx.globalAlpha = 1;
      }

      ctx.shadowBlur = 0;
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      width={WIDTH}
      height={HEIGHT}
      className="block"
      style={{ width: WIDTH, height: HEIGHT, willChange: "transform" }}
    />
  );
};

export default AudioVisualizer;
