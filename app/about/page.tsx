'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import Link from 'next/link';
import { useScrollReveal } from "@/hooks/useScrollReveal";
import SEOHead from "@/components/seo/SEOHead";
import { MapPin, Target, Lightbulb, Shield, Zap, Users, Code, Sparkles, Volume2 } from "lucide-react";
import CtaChevrons from "@/components/ui/CtaChevrons";

const aboutHero = '/assets/about-hero.jpg';

/* ── Listen button matching hero pill style ── */
const AboutListenButton = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const animFrameRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const barsRef = useRef<HTMLSpanElement[]>([]);
  const BAR_COUNT = 14;

  const stopBars = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    barsRef.current.forEach(b => { if (b) b.style.height = "40%"; });
  }, []);

  const animateBars = useCallback(() => {
    if (!analyserRef.current) return;
    const data = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(data);
    const step = Math.floor(data.length / BAR_COUNT);
    barsRef.current.forEach((bar, i) => {
      if (!bar) return;
      const val = data[i * step] / 255;
      bar.style.height = `${Math.max(15, val * 100)}%`;
    });
    animFrameRef.current = requestAnimationFrame(animateBars);
  }, []);

  const handleClick = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio("/mitryxa-pronunciation.mp3");
      const ctx = new AudioContext();
      const src = ctx.createMediaElementSource(audio);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      src.connect(analyser);
      analyser.connect(ctx.destination);
      analyserRef.current = analyser;
      audio.onended = () => {
        setIsPlaying(false);
        stopBars();
        setTimeout(() => setExpanded(false), 400);
      };
      audioRef.current = audio;
    }
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      stopBars();
      setTimeout(() => setExpanded(false), 300);
    } else {
      setExpanded(true);
      setTimeout(() => {
        audioRef.current?.play();
        setIsPlaying(true);
        animateBars();
      }, 200);
    }
  }, [isPlaying, animateBars, stopBars]);

  return (
    <div className="mt-4 flex justify-center">
      <div
        className="relative rounded-full flex items-center overflow-hidden border border-border/40 backdrop-blur-md bg-background/30"
        style={{
          transition: "width 500ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 400ms ease",
          width: expanded ? "min(80vw, 280px)" : "140px",
          height: 40,
          boxShadow: isPlaying ? "0 0 18px hsl(217 91% 60% / 0.25)" : "0 0 10px hsl(271 81% 56% / 0.08)",
        }}
      >
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: "linear-gradient(135deg, hsla(221,83%,53%,0.15), hsla(271,81%,56%,0.15), hsla(172,66%,50%,0.15))",
            opacity: 0.4,
          }}
        />
        <button
          onClick={handleClick}
          className="relative z-10 shrink-0 flex items-center gap-2.5 px-4 h-full text-xs font-mono font-semibold tracking-wide text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
        >
          <span className="flex items-center gap-[2px] h-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <span
                key={i}
                ref={el => { if (el) barsRef.current[i] = el; }}
                className="inline-block w-[2px] rounded-full bg-primary"
                style={{ height: "40%", transition: "height 80ms ease", opacity: isPlaying ? 1 : 0.6 }}
              />
            ))}
          </span>
          <span>{isPlaying ? "Playing..." : "Listen"}</span>
        </button>
        {expanded && (
          <div className="flex items-center gap-[2px] h-4 px-3 relative z-10 flex-1 justify-center">
            {Array.from({ length: BAR_COUNT }).map((_, i) => (
              <span
                key={i}
                ref={el => { if (el) barsRef.current[i] = el; }}
                className="inline-block w-[2px] rounded-full bg-primary"
                style={{ height: "40%", transition: "height 80ms ease" }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
const mitrxyaIcon = '/assets/mitryxa-icon.png';

const nameBreakdown = [
  { fragment: "M", meaning: "Matrix", color: "text-primary" },
  { fragment: "I", meaning: "Intelligence", color: "text-primary" },
  { fragment: "T", meaning: "Technology", color: "text-secondary" },
  { fragment: "R", meaning: "Routing", color: "text-secondary" },
  { fragment: "Y", meaning: "Yield", color: "text-accent" },
  { fragment: "X", meaning: "eXecution", color: "text-accent" },
  { fragment: "A", meaning: "Architecture", color: "text-primary" },
];

const values = [
  { icon: Target, title: "Precision", description: "Every platform we build is engineered for measurable outcomes — qualified leads, educated prospects, reduced friction.", accent: "from-primary to-secondary" },
  { icon: Lightbulb, title: "Intelligence", description: "We embed genuine decision intelligence into every interaction, creating experiences that think alongside your clients.", accent: "from-secondary to-accent" },
  { icon: Shield, title: "Trust", description: "Professional services require absolute trust. Our platforms earn it through transparency, accuracy, and thoughtful design.", accent: "from-accent to-primary" },
];

const timeline = [
  { year: "2024", title: "Founded", description: "Mitryxa Labs LLC established in Los Angeles with a mission to transform professional service client acquisition." },
  { year: "2024", title: "First Platform", description: "Launched our first AI decision platform for a personal injury law firm, achieving 12x conversion improvement." },
  { year: "2025", title: "Multi-Industry", description: "Expanded to medical, real estate, and financial services verticals with industry-specific decision engines." },
  { year: "2026", title: "Platform Suite", description: "Launched the full Mitryxa platform suite with 7 industry-specific AI decision platforms and the Project Intelligence Navigator." },
];

const team = [
  { name: "Founding Team", role: "Engineering & Strategy", description: "Our founding team combines deep expertise in AI systems, full-stack engineering, and professional service industry knowledge.", accent: "from-primary to-secondary" },
  { name: "Platform Architects", role: "Decision Engine Design", description: "Specialists in behavioral psychology, decision flow design, and user experience who engineer every qualification pathway.", accent: "from-secondary to-accent" },
  { name: "Industry Experts", role: "Domain Knowledge", description: "Advisors from legal, medical, financial, and real estate industries who ensure our platforms reflect real-world practice.", accent: "from-accent to-primary" },
];

const GLITCH_CHARS = "アイウエオカキクケコ0123456789ABCDEF{}[]#%&@!$^*▓░";

const About = () => {
  const ref = useScrollReveal<HTMLDivElement>();
  const [glitchIndex, setGlitchIndex] = useState<number | null>(null);
  const [glitchChar, setGlitchChar] = useState("");
  const [glitchJitter, setGlitchJitter] = useState(false);
  const timeoutRef = useRef<number>(0);
  const intervalRef = useRef<number>(0);

  useEffect(() => {
    const scheduleGlitch = () => {
      const delay = 1200 + Math.random() * 2500;
      timeoutRef.current = window.setTimeout(() => {
        const idx = Math.floor(Math.random() * nameBreakdown.length);
        setGlitchIndex(idx);
        setGlitchJitter(true);

        // Rapid-fire cycle through random chars
        const totalDuration = 400 + Math.random() * 600; // 400-1000ms
        const flickerSpeed = 50 + Math.random() * 30; // 50-80ms per char
        let elapsed = 0;

        intervalRef.current = window.setInterval(() => {
          setGlitchChar(GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]);
          elapsed += flickerSpeed;
          if (elapsed >= totalDuration) {
            clearInterval(intervalRef.current);
            setGlitchIndex(null);
            setGlitchJitter(false);
          }
        }, flickerSpeed);

        scheduleGlitch();
      }, delay);
    };
    scheduleGlitch();
    return () => {
      clearTimeout(timeoutRef.current);
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <>
      <SEOHead
        title="About Mitryxa | AI Decision Platforms"
        description="Mitryxa Labs LLC builds AI decision platforms and digital intelligence systems for professional service businesses from Los Angeles, California."
        canonical="https://mitryxa.com/about"
      />

      <div ref={ref} className="pt-16">
        {/* Hero with image */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0">
            <img src={aboutHero} alt="Mitryxa team collaboration" className="w-full h-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
          </div>
          <div className="container mx-auto px-4 lg:px-8 text-center relative z-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-3 font-mono">&gt;_ About</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">Building <span className="text-gradient">Intelligence</span> Into Every Decision</h1>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">Mitryxa is a technology company that designs AI decision platforms and digital intelligence systems for professional service businesses.</p>
          </div>
        </section>

        {/* Name Origin — The Big Immersive Section */}
        <section className="py-32 scroll-reveal relative overflow-hidden">
          {/* Background decorative grid */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `repeating-linear-gradient(0deg, hsl(217 91% 60%), transparent 1px, transparent 40px),
                              repeating-linear-gradient(90deg, hsl(217 91% 60%), transparent 1px, transparent 40px)`
          }} />

          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            {/* Logo icon + pronunciation */}
            <div className="text-center mb-16">
              <div className="relative inline-block mb-8">
                <div className="w-32 h-32 mx-auto relative">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 blur-2xl animate-pulse" />
                  <img src={mitrxyaIcon} alt="Mitryxa icon" className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_30px_hsl(217_91%_60%/0.4)]" />
                </div>
              </div>
              <h2 className="text-5xl sm:text-7xl font-bold tracking-tight mb-4">
                <span className="text-gradient">MITRYXA</span>
              </h2>
              <p className="text-lg text-muted-foreground font-mono tracking-widest">
                / <span className="text-primary">mih</span>-<span className="text-secondary">TRIKS</span>-<span className="text-accent">uh</span> /
              </p>
              <AboutListenButton />
            </div>

            {/* Letter breakdown */}
            <div className="flex justify-center gap-2 sm:gap-4 mb-20">
              {nameBreakdown.map((l, i) => (
                <div
                  key={i}
                  className="glass-terminal rounded-xl p-3 sm:p-4 text-center relative overflow-hidden group hover:scale-110 transition-all duration-300 cursor-default"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${
                    i < 2 ? "from-primary to-secondary" : i < 4 ? "from-secondary to-accent" : "from-accent to-primary"
                  }`} />
                  <span
                    className={`text-2xl sm:text-4xl font-bold font-mono inline-block text-center transition-all ${
                      glitchIndex === i
                        ? "text-primary/80 scale-110 " + (glitchJitter ? "card-glitch-jitter" : "")
                        : l.color
                    }`}
                    style={{ display: "inline-block", width: "1ch" }}
                  >
                    {glitchIndex === i ? glitchChar : l.fragment}
                  </span>
                  <p className="text-[8px] sm:text-[10px] text-muted-foreground font-mono mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {l.meaning}
                  </p>
                </div>
              ))}
            </div>

            {/* Name story content */}
            <div className="max-w-4xl mx-auto">
              <div className="glass-terminal rounded-2xl p-8 sm:p-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-secondary to-accent" />
                <div className="absolute inset-0 animate-scanline pointer-events-none" />

                {/* Terminal header */}
                <div className="flex items-center gap-2 mb-8 relative z-10">
                  <div className="w-3 h-3 rounded-full bg-primary/60" />
                  <div className="w-3 h-3 rounded-full bg-secondary/60" />
                  <div className="w-3 h-3 rounded-full bg-accent/60" />
                  <span className="text-xs text-muted-foreground font-mono ml-2">name_origin.md</span>
                </div>

                <div className="space-y-6 relative z-10">
                  <div className="flex gap-4 items-start">
                    <Sparkles size={20} className="text-primary shrink-0 mt-1" />
                    <p className="text-foreground/90 leading-relaxed">
                      <span className="text-gradient font-bold">Mitryxa</span> is a modern name created to represent <span className="text-primary font-semibold">structure</span>, <span className="text-secondary font-semibold">intelligence</span>, and <span className="text-accent font-semibold">forward motion</span>.
                    </p>
                  </div>

                  <div className="border-l-2 border-primary/30 pl-6 ml-2">
                    <p className="text-muted-foreground leading-relaxed">
                      The name blends the idea of "<span className="text-foreground font-mono">matrix</span>," a framework where complex systems connect and interact, with a sharper, more distinctive form that feels modern and adaptable. The altered spelling removes the familiarity of the original word and turns it into something unique — allowing the brand to stand on its own rather than borrow meaning from an existing term.
                    </p>
                  </div>

                  <div className="glass-terminal rounded-xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-secondary to-accent" />
                    <p className="text-lg text-foreground font-medium text-center italic">
                      "Powerful systems emerge when <span className="text-gradient font-bold">structure</span> and <span className="text-gradient font-bold">intelligence</span> meet."
                    </p>
                  </div>

                  <div className="border-l-2 border-accent/30 pl-6 ml-2">
                    <p className="text-muted-foreground leading-relaxed">
                      Mitryxa represents that intersection. A place where ideas are organized, technology is applied thoughtfully, and complex challenges can be approached with clarity and precision.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-4">
                    {["Technical", "Approachable", "Modern", "Adaptable", "Precise"].map((trait, i) => (
                      <span
                        key={trait}
                        className={`px-4 py-2 rounded-full font-mono text-xs font-medium border transition-all hover:scale-105 ${
                          i % 3 === 0
                            ? "border-primary/30 text-primary bg-primary/5"
                            : i % 3 === 1
                            ? "border-secondary/30 text-secondary bg-secondary/5"
                            : "border-accent/30 text-accent bg-accent/5"
                        }`}
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-24 scroll-reveal">
          <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
            <h2 className="text-2xl font-bold text-foreground mb-6 font-mono"><span className="text-primary/50">&gt;_</span> Our Story</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>Professional service businesses — law firms, medical practices, financial advisors — operate in an industry where every client interaction matters. Yet most rely on websites that function as digital brochures, unable to qualify leads, educate prospects, or guide decisions.</p>
              <p>Mitryxa was founded to close this gap. We build AI decision platforms and a Digital Intelligence Layer that together transform static websites into intelligent client acquisition systems. Our platforms guide visitors through structured assessments and provide personalized education, while the Intelligence Layer discovers opportunities across the internet, handles inquiries instantly, and builds authority — turning digital attention into qualified leads.</p>
              <p>Based in Los Angeles, California, we combine deep technology expertise with industry-specific knowledge to create systems that feel like expert consultations rather than generic web experiences.</p>
              <p>Our approach is rooted in a simple insight: the best way to earn a client's trust is to demonstrate expertise before the first conversation. When a visitor spends five minutes with one of our platforms, they receive more personalized guidance than most competitor websites deliver in their entire experience. That difference drives the conversion improvements our clients consistently achieve.</p>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-24 scroll-reveal">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="glass-terminal rounded-2xl p-10 sm:p-16 text-center max-w-3xl mx-auto relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-secondary to-accent" />
              <div className="absolute inset-0 animate-scanline pointer-events-none" />
              <h2 className="text-2xl font-bold text-foreground mb-4 font-mono relative z-10"><span className="text-primary/50">&gt;_</span> Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed relative z-10">To make every professional service business an intelligent system that discovers opportunities, qualifies leads, educates prospects, and converts — replacing passive digital brochures with AI decision platforms and digital intelligence that think.</p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-24 scroll-reveal">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground text-center mb-12 font-mono"><span className="text-primary/50">&gt;_</span> What Drives Us</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {values.map((v) => {
                const Icon = v.icon;
                return (
                  <div key={v.title} className="glass-terminal rounded-xl p-8 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden">
                    <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${v.accent}`} />
                    <Icon size={28} className="text-primary mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2 font-mono">{v.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{v.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-24 scroll-reveal">
          <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
            <h2 className="text-2xl font-bold text-foreground text-center mb-12 font-mono"><span className="text-primary/50">&gt;_</span> Our Journey</h2>
            <div className="space-y-8 relative">
              <div className="absolute left-[19px] top-2 bottom-2 w-px bg-primary/20" />
              {timeline.map((t, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="w-10 h-10 rounded-full glass-terminal flex items-center justify-center shrink-0 border border-primary/30 z-10">
                    <span className="text-xs font-mono text-primary">{t.year.slice(2)}</span>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground font-mono"><span className="text-primary/50">&gt;_</span> {t.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{t.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-24 scroll-reveal">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground text-center mb-12 font-mono"><span className="text-primary/50">&gt;_</span> Our Team</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {team.map((t) => (
                <div key={t.name} className="glass-terminal rounded-xl p-8 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden">
                  <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${t.accent}`} />
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <Users size={28} className="text-primary" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground font-mono">{t.name}</h3>
                  <p className="text-xs text-primary mt-1 mb-3 font-mono">{t.role}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-24 scroll-reveal">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Zap, label: "Platforms Built", value: "7+", accent: "from-primary to-secondary" },
                { icon: Users, label: "Industries Served", value: "7", accent: "from-secondary to-accent" },
                { icon: Code, label: "Decision Flows", value: "50+", accent: "from-accent to-primary" },
                { icon: Target, label: "Avg. Conversion Lift", value: "10x", accent: "from-primary via-secondary to-accent" },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="glass-terminal rounded-xl p-6 text-center relative overflow-hidden">
                    <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${s.accent}`} />
                    <Icon size={20} className="text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gradient font-mono">{s.value}</p>
                    <p className="text-xs text-muted-foreground mt-1 font-mono">{s.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="py-24 scroll-reveal">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 text-muted-foreground">
              <MapPin size={18} className="text-primary" />
              <span className="font-mono">Los Angeles, California</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2 font-mono">Mitryxa Labs LLC</p>
            <Link
              href="/argus"
              className="btn-cta mt-8"
            >
              <span>&gt;_ Get in Touch</span> <CtaChevrons />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;
