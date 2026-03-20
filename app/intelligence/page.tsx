'use client';

import Link from 'next/link';
import { useScrollReveal } from "@/hooks/useScrollReveal";
import SEOHead from "@/components/seo/SEOHead";
import PersonalizedInsight from "@/components/intelligence/PersonalizedInsight";
import CtaChevrons from "@/components/ui/CtaChevrons";
import {
  Radar, MessageSquare, FileText, Filter, BarChart3, Award,
  Target, Compass, Shield, Route,
  Scale, Stethoscope, Briefcase, Building2, Code2, User,
  CheckCircle2, ArrowRight, ChevronRight,
  Phone, Bell, TrendingUp, Zap,
} from "lucide-react";

import NetworkHubViz from "@/components/intelligence/NetworkHubViz";
import RippleViz from "@/components/intelligence/RippleViz";
import {
  RadarSweepViz, ConversationFlowViz, ConvergingNodesViz,
  FunnelViz, HeatmapViz, ExpandingNetworkViz,
} from "@/components/intelligence/CapabilityVisuals";
import {
  DecisionTreeViz, ContentRadarViz, ShieldViz, JourneyPathViz,
} from "@/components/intelligence/AdvancedVisuals";
import SignalFlowViz from "@/components/intelligence/SignalFlowViz";

/* ── Bottom-line impact blocks ── */
const impactBlocks = [
  {
    icon: TrendingUp,
    title: "Generate New Clients",
    description: "The system identifies relevant conversations and opportunities where your expertise can provide value. This helps your business appear where potential clients are already searching for answers.",
    accent: "from-primary to-secondary",
  },
  {
    icon: Phone,
    title: "Capture Missed Opportunities",
    description: "Many businesses lose leads because calls go unanswered or inquiries are delayed. The intelligence layer helps ensure that every inquiry receives immediate attention.",
    accent: "from-secondary to-accent",
  },
  {
    icon: Zap,
    title: "Reduce Operational Waste",
    description: "Businesses spend time filtering irrelevant inquiries. Structured qualification systems ensure your team focuses on the most relevant opportunities.",
    accent: "from-accent to-primary",
  },
  {
    icon: Award,
    title: "Build Authority",
    description: "By consistently contributing valuable insight in the right conversations, businesses strengthen their reputation and attract more clients.",
    accent: "from-primary to-accent",
  },
];

/* ── Capabilities ── */
const capabilities = [
  {
    icon: Radar,
    title: "Opportunity Discovery",
    description: "The platform analyzes relevant public discussions to identify conversations where your expertise may be valuable. Businesses gain visibility into opportunities they might never have seen.",
    Visual: RadarSweepViz,
  },
  {
    icon: MessageSquare,
    title: "Conversation Assistance",
    description: "Businesses receive intelligent guidance on how to respond thoughtfully to questions and discussions related to their field. This helps maintain consistent engagement without constant monitoring.",
    Visual: ConversationFlowViz,
  },
  {
    icon: Phone,
    title: "AI Reception & Call Handling",
    description: "The platform can assist with answering inquiries, gathering structured information, and directing potential clients to the correct next step. This helps ensure that no opportunity is ignored.",
    Visual: FunnelViz,
  },
  {
    icon: Filter,
    title: "Client Qualification Systems",
    description: "Inquiries can be structured so businesses receive clear information about what potential clients need before engaging directly. This allows teams to focus on the most relevant opportunities.",
    Visual: ConvergingNodesViz,
  },
  {
    icon: FileText,
    title: "Content Intelligence",
    description: "The system identifies recurring questions and concerns within your industry. This helps businesses create useful content that addresses real market needs.",
    Visual: HeatmapViz,
  },
  {
    icon: BarChart3,
    title: "Market Awareness",
    description: "Businesses gain insight into the conversations shaping their industry and can adapt messaging accordingly.",
    Visual: RadarSweepViz,
  },
  {
    icon: Award,
    title: "Authority Building",
    description: "By participating thoughtfully in relevant discussions, businesses strengthen their position as trusted experts.",
    Visual: ExpandingNetworkViz,
  },
  {
    icon: Bell,
    title: "Opportunity Alerts",
    description: "When important conversations or signals appear, the system can surface those moments so businesses can respond quickly.",
    Visual: ConversationFlowViz,
  },
];

/* ── Advanced ── */
const advancedCapabilities = [
  {
    icon: Target,
    title: "Strategic Engagement",
    description: "The platform identifies when contributing insight to a conversation would provide real value.",
    Visual: DecisionTreeViz,
  },
  {
    icon: Compass,
    title: "Content Opportunity Radar",
    description: "The system identifies emerging questions and topics that represent valuable content opportunities.",
    Visual: ContentRadarViz,
  },
  {
    icon: Shield,
    title: "Digital Reputation Awareness",
    description: "Businesses remain aware of discussions related to their expertise and can participate constructively when relevant.",
    Visual: ShieldViz,
  },
  {
    icon: Route,
    title: "Client Journey Intelligence",
    description: "By understanding how people discover and interact with a business online, the platform helps guide them toward meaningful engagement.",
    Visual: JourneyPathViz,
  },
];

/* ── Flow ── */
const flowSteps = [
  { label: "People discuss problems online", icon: MessageSquare },
  { label: "The system identifies relevant opportunities", icon: Radar },
  { label: "Businesses contribute meaningful insight", icon: FileText },
  { label: "Interested individuals explore the business", icon: Compass },
  { label: "Engagement becomes real opportunities", icon: Target },
];

/* ── Audiences ── */
const audiences = [
  { icon: Scale, label: "Law Firms" },
  { icon: Stethoscope, label: "Medical & Dental Practices" },
  { icon: Briefcase, label: "Consultants" },
  { icon: Building2, label: "Professional Services" },
  { icon: Code2, label: "Technology Companies" },
  { icon: User, label: "High-Value Local Businesses" },
];

const Intelligence = () => {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <>
      <SEOHead
        title="Digital Intelligence Layer | Mitryxa"
        description="An operational intelligence system that helps businesses discover opportunities, engage with potential customers, handle inquiries instantly, and convert attention into revenue."
        canonical="https://mitryxa.com/intelligence"
      />

      <div ref={ref} className="pt-16">
        {/* ── Hero ── */}
        <section className="py-24 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-hero" />
          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
              <div className="flex-1 text-center lg:text-left max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-3 font-mono">&gt;_ Digital Intelligence Layer</p>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  The Mitryxa{" "}
                  <span className="text-gradient">Digital Intelligence Layer</span>
                </h1>
                <p className="text-lg text-muted-foreground mt-6">
                  An operational intelligence system that helps businesses discover opportunities, engage with potential customers, handle inquiries instantly, and convert attention into revenue.
                </p>
                <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
                  Every day potential clients discuss problems, ask questions, and search for solutions across the internet. Most businesses never see these moments. The Mitryxa Digital Intelligence Layer helps organizations identify those opportunities, respond intelligently, guide potential customers toward their services, and ensure that no inquiry is ignored.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-10">
                  <Link href="/contact" className="btn-cta">
                    <span>&gt;_ Schedule a Strategy Session</span> <CtaChevrons />
                  </Link>
                  <a
                    href="#personalized"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    See What It Does For You <ChevronRight size={16} />
                  </a>
                </div>
              </div>
              <div className="flex-1 w-full max-w-lg lg:max-w-none">
                <div className="aspect-square max-h-[480px] w-full">
                  <NetworkHubViz />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Bottom Line Impact ── */}
        <section className="py-24 scroll-reveal">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3 font-mono">&gt;_ Impact</p>
              <h2 className="text-3xl font-bold text-foreground">How This System Impacts Your Bottom Line</h2>
              <p className="text-muted-foreground mt-3 max-w-xl mx-auto">The platform focuses on two outcomes: generating new client opportunities and preventing lost opportunities.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {impactBlocks.map((block) => {
                const Icon = block.icon;
                return (
                  <div key={block.title} className="glass-terminal rounded-xl p-8 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                    <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${block.accent}`} />
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon size={22} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground font-mono mb-2">
                          <span className="text-primary/50">&gt;_</span> {block.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{block.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Capabilities Grid ── */}
        <section id="capabilities" className="py-24 scroll-reveal">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-3 font-mono">&gt;_ Capabilities</p>
              <h2 className="text-3xl font-bold text-foreground">Capabilities of the Digital Intelligence Layer</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {capabilities.map((cap) => {
                const Icon = cap.icon;
                const Visual = cap.Visual;
                return (
                  <div key={cap.title} className="glass-terminal rounded-xl p-5 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group">
                    <div className="tilt-gradient-line" />
                    <div className="h-28 mb-3 opacity-50 group-hover:opacity-75 transition-opacity">
                      <Visual />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon size={16} className="text-primary" />
                      </div>
                      <h3 className="text-sm font-bold text-foreground font-mono">
                        <span className="text-primary/50">&gt;_</span> {cap.title}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{cap.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Advanced Capabilities ── */}
        <section className="py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3 font-mono">&gt;_ Advanced</p>
              <h2 className="text-3xl font-bold text-foreground">Advanced Capabilities</h2>
            </div>
            <div className="space-y-16">
              {advancedCapabilities.map((item, i) => {
                const Visual = item.Visual;
                return (
                  <div key={item.title} className={`scroll-reveal flex flex-col lg:flex-row gap-10 items-center ${i % 2 ? "lg:flex-row-reverse" : ""}`}>
                    <div className="flex-1 w-full">
                      <div className="glass-terminal rounded-2xl p-6 aspect-video flex items-center justify-center relative overflow-hidden">
                        <div className="tilt-gradient-line" />
                        <Visual />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-foreground mb-4 font-mono">
                        <span className="text-primary/50">&gt;_</span> {item.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section className="py-24 scroll-reveal">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-3 font-mono">&gt;_ Process</p>
              <h2 className="text-3xl font-bold text-foreground">How the Intelligence Layer Works</h2>
            </div>
            <div className="relative">
              <SignalFlowViz />
              <div className="flex flex-col lg:flex-row items-stretch gap-0">
                {flowSteps.map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.label} className="flex-1 flex flex-col lg:flex-row items-center">
                      <div className="glass-terminal rounded-xl p-6 text-center flex-1 w-full lg:w-auto relative overflow-hidden">
                        <div className="tilt-gradient-line" />
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                          <Icon size={20} className="text-primary" />
                        </div>
                        <span className="text-xs font-mono text-accent/60 mb-2 block">0{i + 1}</span>
                        <p className="text-sm text-foreground font-medium leading-snug">{step.label}</p>
                      </div>
                      {i < flowSteps.length - 1 && (
                        <ArrowRight size={20} className="text-muted-foreground/40 my-3 lg:my-0 lg:mx-2 shrink-0 rotate-90 lg:rotate-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── Who This Is For ── */}
        <section className="py-24 scroll-reveal">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3 font-mono">&gt;_ Designed For</p>
              <h2 className="text-3xl font-bold text-foreground">Who This Platform Is Designed For</h2>
              <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Organizations where a single client may represent significant revenue benefit the most from intelligent discovery systems.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {audiences.map((a) => {
                const Icon = a.icon;
                return (
                  <div key={a.label} className="glass-terminal rounded-xl p-5 text-center hover:scale-[1.03] transition-transform duration-300 relative overflow-hidden">
                    <div className="tilt-gradient-line" />
                    <Icon size={28} className="text-primary mx-auto mb-3" />
                    <p className="text-xs font-medium text-foreground">{a.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Personalized Insight ── */}
        <section id="personalized" className="py-24 scroll-reveal scroll-mt-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-3 font-mono">&gt;_ Personalized</p>
              <h2 className="text-3xl font-bold text-foreground">See What This Means For Your Business</h2>
              <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Describe your business below and discover exactly how the Digital Intelligence Layer can impact your bottom line.</p>
            </div>
            <PersonalizedInsight />
          </div>
        </section>

        {/* ── Part of the Mitryxa System ── */}
        <section className="py-24 scroll-reveal">
          <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
            <div className="text-center mb-12">
              <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-3 font-mono">&gt;_ Part of the Mitryxa System</p>
              <h2 className="text-3xl font-bold text-foreground">Intelligence + Decision Platforms</h2>
              <p className="text-muted-foreground mt-3">The Intelligence Layer powers every Mitryxa Decision Platform. Together they discover opportunities, qualify leads, and convert attention into revenue.</p>
            </div>
            <div className="glass-terminal rounded-2xl p-8 relative overflow-hidden">
              <div className="tilt-gradient-line" />
            <p className="text-muted-foreground leading-relaxed mb-6">
                The Intelligence Layer discovers opportunities across the internet, while our AI Decision Platforms qualify and convert visitors on your site. Two engines, one system — built for professional service businesses.
              </p>
              <ul className="space-y-4">
                {[
                  "Discover opportunities before competitors",
                  "Engage intelligently where expertise matters",
                  "Handle inquiries instantly — no missed calls",
                  "Convert digital attention into real revenue",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-foreground">
                    <CheckCircle2 size={18} className="text-accent shrink-0" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/ai-platforms" className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-primary hover:text-primary/80 transition-colors font-mono">
                &gt;_ Explore AI Decision Platforms <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="py-24 scroll-reveal">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Turn Digital Awareness Into{" "}
              <span className="text-gradient">Real Revenue</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Discover how the Mitryxa Digital Intelligence Layer can help your business identify opportunities, respond intelligently, and convert interest into meaningful growth.
            </p>
            <Link href="/contact" className="btn-cta mt-8">
              <span>&gt;_ Schedule a Strategy Session</span> <CtaChevrons />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default Intelligence;
