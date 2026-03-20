'use client';

import { useEffect, useState, useRef, useMemo } from "react";
import { Globe, Lock, FileText, Smartphone, Palette } from "lucide-react";

type Props = {
  insights: Record<string, unknown>;
  branding: Record<string, unknown> | null;
  screenshot: string | null;
  pageCount: number | null;
};

const DigitalHealthCard = ({ insights, branding, screenshot, pageCount }: Props) => {
  const score = (insights.digitalHealthScore as number) || 0;
  const [animatedScore, setAnimatedScore] = useState(0);
  const [imgError, setImgError] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const imageUrl = useMemo(() => {
    if (!screenshot) return null;
    if (screenshot.startsWith("http")) return screenshot;
    if (screenshot.startsWith("data:")) return screenshot;
    return `data:image/jpeg;base64,${screenshot}`;
  }, [screenshot]);

  // Animate score
  useEffect(() => {
    if (!score) return;
    let frame = 0;
    const total = 40;
    const interval = setInterval(() => {
      frame++;
      setAnimatedScore(Math.round((frame / total) * score));
      if (frame >= total) clearInterval(interval);
    }, 25);
    return () => clearInterval(interval);
  }, [score]);

  // Draw gauge
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 120;
    canvas.width = size * 2;
    canvas.height = size * 2;
    ctx.scale(2, 2); // retina

    const cx = size / 2, cy = size / 2, r = 44;
    const startAngle = 0.75 * Math.PI;
    const endAngle = 2.25 * Math.PI;
    const progress = animatedScore / 100;
    const progressAngle = startAngle + (endAngle - startAngle) * progress;

    // Background arc
    ctx.beginPath();
    ctx.arc(cx, cy, r, startAngle, endAngle);
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.stroke();

    // Progress arc
    if (animatedScore > 0) {
      const color = animatedScore >= 70 ? "#22c55e" : animatedScore >= 40 ? "#eab308" : "#ef4444";
      ctx.beginPath();
      ctx.arc(cx, cy, r, startAngle, progressAngle);
      ctx.strokeStyle = color;
      ctx.lineWidth = 8;
      ctx.lineCap = "round";
      ctx.stroke();
    }

    // Score text
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 24px ui-monospace, monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(animatedScore), cx, cy - 4);
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "9px ui-monospace, monospace";
    ctx.fillText("/ 100", cx, cy + 14);
  }, [animatedScore]);

  const features = (insights.hasModernWebFeatures as Record<string, unknown>) || {};
  const strengths = (insights.strengths as string[]) || [];
  const weaknesses = (insights.weaknesses as string[]) || [];
  const brandColors = (branding as any)?.colors || null;

  const featureItems = [
    { icon: <Lock size={12} />, label: "SSL Security", ok: !!features.hasSSL },
    { icon: <FileText size={12} />, label: "Meta Description", ok: !!features.hasMetaDescription },
    { icon: <Globe size={12} />, label: "Social Tags", ok: !!features.hasOGTags },
    { icon: <Smartphone size={12} />, label: "Pages Indexed", value: pageCount },
  ];

  return (
    <div className="glass-terminal rounded-xl overflow-hidden" style={{ animation: "fade-up 0.4s ease-out both" }}>
      <div className="h-[2px] bg-gradient-to-r from-primary to-accent" />
      <div className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
            <Globe size={18} />
          </div>
          <h2 className="text-base font-mono font-bold text-foreground">Digital Health Score</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6">
          {/* Left: Gauge + Screenshot */}
          <div className="flex flex-col items-center gap-4">
            <canvas ref={canvasRef} className="w-[120px] h-[120px]" />

            {imageUrl && !imgError && (
              <div className="w-full max-w-[200px] rounded-lg overflow-hidden border border-primary/10">
                <img
                  src={imageUrl}
                  alt="Current website"
                  className="w-full h-auto"
                  loading="lazy"
                  onError={() => setImgError(true)}
                />
                <p className="text-[9px] font-mono text-muted-foreground/50 text-center py-1">Current Website</p>
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="space-y-4 min-w-0">
            {/* Feature checklist */}
            <div className="grid grid-cols-2 gap-2">
              {featureItems.map((f) => (
                <div key={f.label} className="flex items-center gap-2 text-xs font-mono">
                  <span className={f.ok || (f.value && f.value > 0) ? "text-green-500" : "text-muted-foreground/40"}>
                    {f.icon}
                  </span>
                  <span className="text-muted-foreground">{f.label}</span>
                  {f.value !== undefined && <span className="text-foreground font-bold">{f.value}</span>}
                </div>
              ))}
            </div>

            {/* Brand colors */}
            {brandColors && (
              <div>
                <p className="text-[10px] font-mono text-muted-foreground/60 mb-1.5 flex items-center gap-1">
                  <Palette size={10} /> Extracted Brand Colors
                </p>
                <div className="flex gap-1.5 flex-wrap">
                  {Object.entries(brandColors).slice(0, 6).map(([name, hex]) => (
                    <div key={name} className="flex items-center gap-1">
                      <div
                        className="w-5 h-5 rounded-md border border-primary/10"
                        style={{ backgroundColor: String(hex) }}
                        title={`${name}: ${hex}`}
                      />
                      <span className="text-[9px] font-mono text-muted-foreground/50">{String(hex).slice(0, 7)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strengths & Weaknesses */}
            {(strengths.length > 0 || weaknesses.length > 0) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {strengths.length > 0 && (
                  <div>
                    <p className="text-[10px] font-mono text-green-500/80 mb-1">✓ Strengths</p>
                    <ul className="space-y-0.5">
                      {strengths.slice(0, 3).map((s, i) => (
                        <li key={i} className="text-xs text-muted-foreground">{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {weaknesses.length > 0 && (
                  <div>
                    <p className="text-[10px] font-mono text-destructive/80 mb-1">✗ Gaps</p>
                    <ul className="space-y-0.5">
                      {weaknesses.slice(0, 3).map((w, i) => (
                        <li key={i} className="text-xs text-muted-foreground">{w}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalHealthCard;
