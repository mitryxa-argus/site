import HeroSection from "@/components/hero/HeroSection";
import { ArrowRight, Users, Cpu, FileCheck, Radar } from "lucide-react";

const stats = [
  { label: "Lead Qualification Rate", value: "85%", prefix: "+" },
  { label: "Conversion Improvement", value: "10x", prefix: "+" },
  { label: "Client Education Score", value: "94%", prefix: "+" },
  { label: "Sales Friction Reduction", value: "60%", prefix: "+" },
];

export default function Home() {
  return (
    <>
      <HeroSection />

      {/* Stats */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="glass-terminal rounded-xl p-6 text-center relative overflow-hidden">
                <div className="tilt-gradient-line" />
                <p className="text-3xl sm:text-4xl font-bold font-mono text-gradient">{s.prefix}{s.value}</p>
                <p className="text-sm text-muted-foreground mt-2 font-mono">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 font-mono">&gt;_ How It Works</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">One System. Full Pipeline.</h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">From stranger on the internet to paying client — Argus handles every step.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            {[
              { icon: <Radar size={24} className="text-secondary mx-auto mb-2" />, title: "Signal Detection", sub: "Prospects found online" },
              { icon: <Users size={24} className="text-primary mx-auto mb-2" />, title: "Qualification", sub: "Argus qualifies in real-time" },
              { icon: <Cpu size={28} className="text-primary mx-auto mb-2" />, title: "Proposal", sub: "Auto-generated & sent" },
              { icon: <FileCheck size={24} className="text-accent mx-auto mb-2" />, title: "Closed Client", sub: "Site built & delivered" },
            ].map((step, i) => (
              <div key={step.title} className="flex items-center gap-4 sm:gap-6">
                <div className="glass-terminal rounded-xl p-5 text-center w-full sm:w-48 relative overflow-hidden">
                  <div className="tilt-gradient-line" />
                  {step.icon}
                  <p className="text-xs font-semibold text-foreground font-mono">{step.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{step.sub}</p>
                </div>
                {i < 3 && <ArrowRight size={20} className="text-primary shrink-0 rotate-90 sm:rotate-0 hidden sm:block" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Argus CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="glass-terminal rounded-2xl p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-secondary via-accent to-primary" />
            <div className="absolute inset-0 animate-scanline pointer-events-none" />
            <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-3 font-mono">&gt;_ Meet Your Partner</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Built with Argus. Run by Argus.</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Every Mitryxa client gets Argus — an AI business partner that finds prospects, qualifies them, builds their site, handles edits, and manages the relationship. 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#" className="btn-cta">&gt;_ Talk to Argus</a>
              <a href="/about" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-mono font-semibold text-sm border border-border hover:border-primary/50 transition-colors text-muted-foreground hover:text-foreground">
                How It Works <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
