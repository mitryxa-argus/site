'use client';

import Link from 'next/link';
import { Shield, Lock, FileCheck, ServerCog } from "lucide-react";
import MitrxyaLogo from "./MitrxyaLogo";

const trustBadges = [
  { icon: Shield, label: "GDPR Compliant" },
  { icon: FileCheck, label: "HIPAA Ready" },
  { icon: ServerCog, label: "SOC 2 Standards" },
  { icon: Lock, label: "Secure Processing" },
];

const Footer = () => (
  <footer className="border-t border-primary/10 mt-20">
    <div className="container mx-auto px-4 lg:px-8 py-16">
      <div className="grid md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
          <MitrxyaLogo />
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            AI decision platforms and digital intelligence systems for professional service businesses.
          </p>
          <p className="mt-2 text-xs text-muted-foreground font-mono">Los Angeles, California</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground mb-4 font-mono"><span className="text-primary/50">&gt;_</span> Platform</h4>
          <div className="space-y-2">
            <Link href="/ai-platforms" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">AI Platforms</Link>
            <Link href="/intelligence" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Intelligence Layer</Link>
            <Link href="/use-cases" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Use Cases</Link>
            <Link href="/technology" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Technology</Link>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground mb-4 font-mono"><span className="text-primary/50">&gt;_</span> Tools</h4>
          <div className="space-y-2">
            <Link href="/tools/audit" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Site Audit</Link>
            <Link href="/tools/estimator" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Price Estimator</Link>
            <Link href="/tools/competition" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Competition Analysis</Link>
            <Link href="/tools/blueprint" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Digital Blueprint</Link>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground mb-4 font-mono"><span className="text-primary/50">&gt;_</span> Company</h4>
          <div className="space-y-2">
            <Link href="/about" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
            <Link href="/insights" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Insights</Link>
            <Link href="/argus" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="mt-12 pt-8 border-t border-primary/10">
        <div className="flex flex-wrap justify-center gap-6">
          {trustBadges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div key={badge.label} className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                <Icon size={14} className="text-primary/60" />
                <span>{badge.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-primary/10 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-xs text-muted-foreground font-mono">© {new Date().getFullYear()} Mitryxa Labs LLC. All rights reserved.</p>
        <div className="flex gap-6 text-xs text-muted-foreground">
          <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
