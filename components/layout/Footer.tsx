import Link from "next/link";

const Footer = () => (
  <footer className="border-t border-border/40 py-12 mt-24">
    <div className="container mx-auto px-4 lg:px-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <p className="font-mono font-bold text-lg text-white">MITRYXA</p>
          <p className="text-xs text-muted-foreground mt-1 font-mono">AI Decision Platforms & Digital Intelligence</p>
        </div>
        <nav className="flex flex-wrap gap-6 text-xs text-muted-foreground font-mono">
          <Link href="/ai-platforms" className="hover:text-foreground transition-colors">Platforms</Link>
          <Link href="/use-cases" className="hover:text-foreground transition-colors">Solutions</Link>
          <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
          <Link href="/insights" className="hover:text-foreground transition-colors">Insights</Link>
          <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
        </nav>
        <p className="text-xs text-muted-foreground font-mono">© {new Date().getFullYear()} Mitryxa. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
