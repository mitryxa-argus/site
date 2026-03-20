"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import ArgusChat from "@/components/argus/ArgusChat";

const NAV_LINKS = [
  { label: "Platforms", href: "/ai-platforms" },
  { label: "Solutions", href: "/use-cases" },
  { label: "Technology", href: "/technology" },
  { label: "Insights", href: "/insights" },
  { label: "About", href: "/about" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? "glass-strong border-b border-white/[0.07]" : "bg-transparent"}`}>
      <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-mono font-bold text-lg text-white tracking-wider">
          <span className="text-primary font-black">MITRYXA</span>
          <span className="text-[10px] text-muted-foreground border border-border px-1.5 py-0.5 rounded font-mono">/ MIT - rick - suh /</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors font-mono">
              {l.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <ArgusChat triggerLabel=">_ Talk to Argus" />
        </div>

        {/* Mobile menu */}
        <button className="lg:hidden text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden glass-strong border-t border-white/[0.07] px-4 py-4 flex flex-col gap-3">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-muted-foreground hover:text-foreground font-mono py-2" onClick={() => setMobileOpen(false)}>
              {l.label}
            </Link>
          ))}
          <ArgusChat triggerLabel=">_ Talk to Argus" />
        </div>
      )}
    </header>
  );
};

export default Navbar;
