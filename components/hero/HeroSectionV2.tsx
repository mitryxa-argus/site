'use client';

import { useRef, useState, useCallback } from "react";
import MatrixRain from "./MatrixRain";
import AudioVisualizer from "./AudioVisualizer";
import { Layers } from "lucide-react";
import CtaChevrons from "@/components/ui/CtaChevrons";

const HeroSectionV2 = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [audioReady, setAudioReady] = useState(false);

  const toggleAudio = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio("/mitryxa-intro.mp3");
      audio.crossOrigin = "anonymous";
      audio.onended = () => {
        setIsPlaying(false);
        setTimeout(() => setExpanded(false), 500);
      };
      audioRef.current = audio;
      setAudioReady(true);
    }
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setTimeout(() => setExpanded(false), 300);
    } else {
      setExpanded(true);
      setTimeout(() => {
        audioRef.current?.play();
        setIsPlaying(true);
      }, 200);
    }
  }, [isPlaying]);

  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden pt-24">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0" style={{ maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)' }}>
        <MatrixRain />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/80" />

      <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-muted-foreground mb-8">
          <Layers size={14} className="text-primary" />
          Intelligent Client Acquisition
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] max-w-5xl mx-auto">
          Websites That <span className="text-gradient">Think</span>{" "}
          <span className="text-gradient">Before Your Sales Team</span>{" "}
          Has To
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Mitryxa builds AI decision platforms and digital intelligence systems that educate customers, discover opportunities, and generate highly qualified leads for professional service businesses.
        </p>

        {/* Audio intro — futuristic expanding pill */}
        <div className="mt-5 flex justify-center">
          <div
            className="relative rounded-full flex items-center overflow-hidden border border-border/40 backdrop-blur-md bg-background/30"
            style={{
              transition: "width 500ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 400ms ease",
              width: expanded ? "min(90vw, 360px)" : "160px",
              height: 44,
              boxShadow: isPlaying
                ? "0 0 20px hsla(271, 81%, 56%, 0.25), 0 0 40px hsla(221, 83%, 53%, 0.1)"
                : "0 0 10px hsla(271, 81%, 56%, 0.08)",
            }}
          >
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: "linear-gradient(135deg, hsla(221, 83%, 53%, 0.15), hsla(271, 81%, 56%, 0.15), hsla(172, 66%, 50%, 0.15))",
                opacity: isPlaying ? 1 : 0.4,
                transition: "opacity 400ms ease",
              }}
            />
            <button
              onClick={toggleAudio}
              className="relative z-10 shrink-0 flex items-center gap-2.5 px-5 h-full text-xs font-mono font-semibold tracking-wide text-muted-foreground hover:text-foreground transition-colors duration-200 whitespace-nowrap"
            >
              <span className="flex items-center gap-[2px] h-3.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="inline-block w-[2px] rounded-full bg-primary"
                    style={{
                      height: isPlaying ? "100%" : "40%",
                      animation: isPlaying ? `pulse ${0.4 + i * 0.15}s ease-in-out infinite alternate` : "none",
                      transition: "height 300ms ease",
                      opacity: isPlaying ? 1 : 0.6,
                    }}
                  />
                ))}
              </span>
              <span>{isPlaying ? "Pause" : "Listen"}</span>
              <span className="relative ml-1 flex items-center justify-center w-5 h-5">
                {!isPlaying && (
                  <>
                    <style>{`@keyframes energy-ping { 0% { transform: scale(1); opacity: 0.7; } 100% { transform: scale(1.8); opacity: 0; } }`}</style>
                    <span
                      className="absolute inset-0 rounded-full border border-primary/40"
                      style={{ animation: "energy-ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite" }}
                    />
                  </>
                )}
                <span
                  className="relative z-10 flex items-center justify-center w-5 h-5 rounded-full border border-primary/40 text-primary"
                  style={{ fontSize: 8 }}
                >
                  {isPlaying ? "❚❚" : "▶"}
                </span>
              </span>
            </button>
            <div
              className="flex-1 flex items-center justify-center overflow-hidden"
              style={{
                opacity: expanded ? 1 : 0,
                transform: expanded ? "scaleX(1)" : "scaleX(0)",
                transformOrigin: "left center",
                transition: "opacity 400ms ease 100ms, transform 400ms cubic-bezier(0.4, 0, 0.2, 1)",
                paddingRight: expanded ? 12 : 0,
              }}
            >
              {audioReady && (
                <AudioVisualizer audioElement={audioRef.current} isPlaying={isPlaying} />
              )}
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            data-argus-trigger
            onClick={() => {
              const argusBtn = document.querySelector('[data-argus-open]') as HTMLButtonElement;
              if (argusBtn) argusBtn.click();
            }}
            className="btn-cta"
          >
            <span>&gt;_ Talk to Argus</span> <CtaChevrons />
          </button>
          <a
            href="/tools/audit"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-semibold rounded-lg border border-border/30 text-foreground hover:bg-accent/10 transition-all duration-300 font-mono"
          >
            Complimentary Site Audit — Limited Availability
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSectionV2;
