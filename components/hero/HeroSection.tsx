"use client";
import { useRef, useState, useCallback } from "react";
import MatrixRain from "./MatrixRain";
import { Layers } from "lucide-react";
import ArgusChat from "@/components/argus/ArgusChat";

const HeroSection = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const toggleAudio = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio("/mitryxa-intro.mp3");
      audio.crossOrigin = "anonymous";
      audio.onended = () => { setIsPlaying(false); setTimeout(() => setExpanded(false), 500); };
      audioRef.current = audio;
    }
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setTimeout(() => setExpanded(false), 300);
    } else {
      setExpanded(true);
      setTimeout(() => { audioRef.current?.play(); setIsPlaying(true); }, 200);
    }
  }, [isPlaying]);

  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden pt-24">
      <div className="absolute inset-0 bg-background" />
      <div
        className="absolute inset-0"
        style={{ maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)" }}
      >
        <MatrixRain />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/80" />

      <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-muted-foreground mb-8">
          <Layers size={14} className="text-primary" />
          Intelligent Client Acquisition
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] max-w-5xl mx-auto">
          Websites That <span className="text-gradient">Think Before</span>{" "}
          <span className="text-gradient">Your Sales Team</span> Has To
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Mitryxa builds AI decision platforms and digital intelligence systems that educate customers, discover opportunities, and generate highly qualified leads for professional service businesses.
        </p>

        {/* Audio pill */}
        <div className="mt-5 flex justify-center">
          <div
            className="relative rounded-full flex items-center overflow-hidden border border-border/40 backdrop-blur-md bg-background/30 cursor-pointer"
            style={{
              transition: "width 500ms cubic-bezier(0.4, 0, 0.2, 1)",
              width: expanded ? "min(90vw, 360px)" : "160px",
              height: 44,
              boxShadow: isPlaying ? "0 0 20px hsla(271,81%,56%,0.25)" : "0 0 10px hsla(271,81%,56%,0.08)",
            }}
            onClick={toggleAudio}
          >
            <div className="absolute inset-0 rounded-full pointer-events-none" style={{ background: "linear-gradient(135deg,hsla(221,83%,53%,0.15),hsla(271,81%,56%,0.15),hsla(172,66%,50%,0.15))", opacity: isPlaying ? 1 : 0.4, transition: "opacity 400ms ease" }} />
            <button className="relative z-10 shrink-0 flex items-center gap-2.5 px-5 h-full text-xs font-mono font-semibold tracking-wide text-muted-foreground hover:text-foreground transition-colors duration-200 whitespace-nowrap">
              <span className="flex items-center gap-[2px] h-3.5">
                {[0,1,2].map((i) => (
                  <span key={i} className="inline-block w-[2px] rounded-full bg-primary" style={{ height: isPlaying ? "100%" : "40%", animation: isPlaying ? `pulse-bar ${0.4 + i * 0.15}s ease-in-out infinite alternate` : "none" }} />
                ))}
              </span>
              {isPlaying ? "Pause" : "Listen"}
            </button>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <ArgusChat triggerLabel="Talk to Argus" />
          <span className="text-sm text-muted-foreground font-mono">Complimentary Site Audit — Limited Availability</span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
