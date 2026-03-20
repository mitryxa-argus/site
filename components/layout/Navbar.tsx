'use client';

import { useState, useEffect, useRef } from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Volume2 } from "lucide-react";
import MitrxyaLogo from "./MitrxyaLogo";
import CtaChevrons from "@/components/ui/CtaChevrons";

/* ── Fast-scrolling compact terminal for navbar ── */
const TERMINAL_LINES = [
  'neural_engine.init(v4.2.1)',
  'loadModel("gpt-4-turbo")',
  'GET /api/platforms 200',
  'vertex_shader.glsl ✓',
  'SELECT * FROM leads',
  'k8s deploy... success',
  'epoch 12/50 loss:0.003',
  'scan 443,8080... open',
  'git push origin main',
  'npm run build --prod',
  'POST /v1/infer 200 OK',
  'weights loaded ✓',
  'render(1920x1080,128)',
  'wss://stream connected',
  'batch 847/2000 42%',
  'cache.flush() done',
  'jwt.verify(token) ✓',
  'docker pull latest',
  'ssl cert renewed ✓',
  'cron job scheduled',
];

const GLITCH_CHARS = 'アイウエオカキクケコ01サシスセソタチツテト¥§░▒▓█∑∆∏λΩψ';

const NavTerminal = () => {
  const [lines, setLines] = useState<string[]>([]);
  const [glitching, setGlitching] = useState(false);
  const [glitchLine, setGlitchLine] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const shuffled = [...TERMINAL_LINES].sort(() => Math.random() - 0.5);
    let idx = 0;
    const interval = setInterval(() => {
      const line = shuffled[idx % shuffled.length];
      setLines(prev => [...prev.slice(-8), line]);
      idx++;
      if (idx >= shuffled.length) {
        shuffled.sort(() => Math.random() - 0.5);
        idx = 0;
      }
    }, 350 + Math.random() * 200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const scheduleGlitch = (): ReturnType<typeof setTimeout> => {
      const delay = 2000 + Math.random() * 5000;
      return setTimeout(() => {
        setGlitching(true);
        let flickerCount = 0;
        const maxFlickers = 4 + Math.floor(Math.random() * 6);
        const flickerInterval = setInterval(() => {
          const len = 12 + Math.floor(Math.random() * 20);
          const garbled = Array.from({ length: len }, () =>
            GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
          ).join('');
          setGlitchLine(garbled);
          flickerCount++;
          if (flickerCount >= maxFlickers) {
            clearInterval(flickerInterval);
            setGlitching(false);
            setGlitchLine('');
            timerId = scheduleGlitch();
          }
        }, 60);
      }, delay);
    };
    let timerId = scheduleGlitch();
    return () => clearTimeout(timerId);
  }, []);

  return (
    <div className={`w-48 h-8 overflow-hidden relative z-10 ${glitching ? 'nav-terminal-glitch' : ''}`}>
      <div ref={containerRef} className="flex flex-col justify-end h-full gap-px">
        {lines.slice(-3).map((line, i) => (
          <span
            key={`${line}-${i}`}
            className="text-[8px] font-mono truncate block leading-[9px]"
            style={{ opacity: i === 2 ? 1 : i === 1 ? 0.5 : 0.2 }}
          >
            <span className="text-primary">$</span>{" "}
            <span className={`${glitching && i === 2 ? 'text-destructive' : 'text-foreground/90'}`}>
              {glitching && i === 2 ? glitchLine : line}
            </span>
          </span>
        ))}
      </div>
      {glitching && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-destructive/5" />
          <div
            className="absolute left-0 right-0 h-px bg-destructive/30"
            style={{ top: `${Math.random() * 100}%` }}
          />
        </div>
      )}
    </div>
  );
};

const links = [
  { to: "/ai-platforms", label: "AI Platforms" },
  { to: "/intelligence", label: "Intelligence" },
  { to: "/use-cases", label: "Use Cases" },
  { to: "/technology", label: "Technology" },
  { to: "/argus", label: "Talk to Argus" },
];

const PronunciationBadge = () => {
  const [showDef, setShowDef] = useState(false);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showDef) return;
    const handler = (e: MouseEvent) => {
      if (badgeRef.current && !badgeRef.current.contains(e.target as Node)) {
        setShowDef(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showDef]);

  return (
    <div className="relative hidden xs:block" ref={badgeRef}>
      <button
        onClick={() => setShowDef((p) => !p)}
        className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-primary/15 bg-primary/5 text-[10px] font-mono text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/10 transition-all duration-200 cursor-pointer"
      >
        <span className="opacity-70">/</span>
        <span className="text-primary/80">MIT</span>
        <span className="opacity-50">-</span>
        <span className="text-secondary/80">rick</span>
        <span className="opacity-50">-</span>
        <span className="text-accent/80">suh</span>
        <span className="opacity-70">/</span>
      </button>

      {showDef && (
        <>
          <div className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm sm:hidden" onClick={() => setShowDef(false)} />
          <div className="fixed sm:absolute z-50 inset-0 sm:inset-auto flex items-center justify-center sm:block sm:top-full sm:left-0 sm:mt-2 pointer-events-none">
            <div className="w-[85vw] sm:w-72 pointer-events-auto animate-fade-in">
              <div className="rounded-xl p-4 border border-primary/10 shadow-2xl shadow-primary/5 relative overflow-hidden backdrop-blur-2xl" style={{ background: 'hsl(220 20% 8% / 0.95)' }}>
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-primary via-secondary to-accent" />
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-lg font-bold text-foreground font-mono tracking-wide">Mitryxa</span>
                  <span className="text-[10px] text-muted-foreground/50 italic">proper noun</span>
                </div>
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="text-xs font-mono text-muted-foreground">
                    / <span className="text-primary">mih</span>-<span className="text-secondary">TRIKS</span>-<span className="text-accent">uh</span> /
                  </span>
                  <button
                    onClick={() => new Audio("/mitryxa-pronunciation.mp3").play()}
                    className="text-muted-foreground/40 hover:text-primary transition-colors cursor-pointer"
                    aria-label="Listen to pronunciation"
                  >
                    <Volume2 size={10} />
                  </button>
                </div>
                <div className="w-full h-px bg-primary/10 mb-3" />
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <span className="text-foreground/70 font-medium">1.</span> A technology studio that builds AI-powered decision platforms for professional service businesses.
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <span className="text-foreground/70 font-medium">2.</span> Derived from "<span className="text-foreground/80 font-mono">matrix</span>" — a framework where complex systems connect and interact.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-primary/5">
                  <p className="text-[10px] text-muted-foreground/40 font-mono">
                    origin: <span className="text-primary/40">M</span>atrix + <span className="text-secondary/40">I</span>ntelligence + <span className="text-accent/40">A</span>rchitecture
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "backdrop-blur-xl" : ""}`}
      style={{
        background: scrolled
          ? "hsl(220 20% 6% / 0.85)"
          : "linear-gradient(to bottom, hsl(220 20% 6% / 0.95), hsl(220 20% 6% / 0))",
      }}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4 lg:px-8">
        {/* Logo + pronunciation */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 text-foreground">
            <MitrxyaLogo />
          </Link>
          <PronunciationBadge />
        </div>

        {/* Desktop nav links — center */}
        <div className="hidden nav:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              href={l.to}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors font-sans ${
                l.to === '/argus'
                  ? 'text-primary border border-primary/20 hover:border-primary/40 hover:bg-primary/5 ml-2'
                  : pathname === l.to || (l.to !== '/' && pathname.startsWith(l.to))
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Desktop terminal — right */}
        <div className="hidden nav:flex items-center gap-3">
          <NavTerminal />
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="nav:hidden text-foreground p-2">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="nav:hidden border-t border-white/5 px-4 pb-6 pt-2"
          style={{ background: "hsl(220 20% 6% / 0.97)" }}
        >
          {links.map((l) => (
            <Link
              key={l.to}
              href={l.to}
              className={`block py-3 text-sm font-medium border-b border-white/5 ${
                pathname === l.to || (l.to !== '/' && pathname.startsWith(l.to))
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
