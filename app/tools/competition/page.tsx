'use client';

import { Suspense, useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Search, ArrowRight, ArrowLeft, Check, Cpu, Shield, FileDown, MessageSquare, Send, X, Terminal, Loader2, Zap, BarChart3, Globe, Target, Users, TrendingUp, DollarSign } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import { openBrandedPdf } from "@/lib/brandedPdf";
import TalkToMitryxa from "@/components/tools/TalkToMitryxa";
import ReportChatPanel from "@/components/tools/ReportChatPanel";
import StickyReportActions from "@/components/tools/StickyReportActions";
import { generateFingerprint } from "@/lib/fingerprint";

// ─── Wizard Steps ───

const industries = [
  "Law Firm", "Medical Clinic", "Real Estate", "Financial Advisor",
  "Mortgage", "Cosmetic Surgery", "Home Health Care",
];

const marketPositions = [
  "New / Startup (< 1 year)",
  "Established but struggling online",
  "Growing and want to dominate",
  "Market leader defending position",
];

const geographyScopes = [
  "Local (specific cities)",
  "Regional (specific states)",
  "National",
];

const popularStates = [
  "California", "Texas", "Florida", "New York", "Arizona", "Nevada",
  "Illinois", "Georgia", "Colorado", "Washington", "Oregon", "Pennsylvania",
  "Ohio", "Virginia", "North Carolina", "Massachusetts", "New Jersey", "Maryland",
];

const competitorCounts = [
  "1–3 specific competitors in mind",
  "5–10 competitors I know of",
  "I don't know who my competitors are",
  "Saturated market — everyone is a competitor",
];

const focusAreas = [
  "SEO & Organic Rankings",
  "Paid Advertising Strategy",
  "Content & Thought Leadership",
  "Social Media Presence",
  "Website & Conversion",
  "Reputation & Reviews",
];

type Selections = {
  industry: string;
  customIndustry: string;
  marketPosition: string;
  geographyScope: string;
  targetLocations: string[];
  customLocation: string;
  competitorCount: string;
  knownCompetitors: string;
  focusAreas: string[];
};

const INITIAL_SELECTIONS: Selections = {
  industry: "",
  customIndustry: "",
  marketPosition: "",
  geographyScope: "",
  targetLocations: [],
  customLocation: "",
  competitorCount: "",
  knownCompetitors: "",
  focusAreas: [],
};

const TOKEN_KEY = "mitryxa_competition_token";
const REPORT_STORAGE_KEY = "mitryxa_competition_report";
const TOOL_PRICE = "$25";
type Phase = "wizard" | "paying" | "analyzing" | "complete" | "error";
type ChatMsg = { role: "user" | "assistant"; content: string };

function saveCompetitionData(data: { selections: Selections; report: string }) {
  try { sessionStorage.setItem(REPORT_STORAGE_KEY, JSON.stringify(data)); } catch { /* ignore */ }
}

function loadCompetitionData(): { selections: Selections; report: string } | null {
  try {
    const raw = sessionStorage.getItem(REPORT_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

const sectionIcons: Record<string, React.ReactNode> = {
  "Executive Summary": <Terminal size={18} />,
  "Competitive Landscape": <Globe size={18} />,
  "SEO": <Search size={18} />,
  "Advertising": <DollarSign size={18} />,
  "Content": <BarChart3 size={18} />,
  "Social": <Users size={18} />,
  "Website": <Target size={18} />,
  "Reputation": <TrendingUp size={18} />,
  "Gap Analysis": <Zap size={18} />,
  "Action Plan": <Zap size={18} />,
  "Competitive Threat": <Shield size={18} />,
};

function getIconForSection(title: string) {
  for (const [key, icon] of Object.entries(sectionIcons)) {
    if (title.includes(key)) return icon;
  }
  return <Cpu size={18} />;
}

const CompetitionInner = () => {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState<Selections>(INITIAL_SELECTIONS);
  const [phase, setPhase] = useState<Phase>("wizard");
  const [report, setReport] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [fingerprint, setFingerprint] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  const actionRowRef = useRef<HTMLDivElement>(null);
  const [showStickyActions, setShowStickyActions] = useState(false);

  const [toolToken, setToolToken] = useState<string | null>(() => {
    try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
  });

  const updateToken = useCallback((token: string | null) => {
    setToolToken(token);
    try {
      if (token) localStorage.setItem(TOKEN_KEY, token);
      else localStorage.removeItem(TOKEN_KEY);
    } catch { /* ignore */ }
  }, []);

  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState("");
  
  const [talkOpen, setTalkOpen] = useState(false);

  // Sticky action bar observer
  useEffect(() => {
    const el = actionRowRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setShowStickyActions(!entry.isIntersecting), { threshold: 0 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [phase]);

  useEffect(() => {
    generateFingerprint().then(setFingerprint);
    const saved = loadCompetitionData();
    if (saved && saved.report) {
      setSelections(saved.selections);
      setReport(saved.report);
      setPhase("complete");
    }
  }, []);

  // Handle Stripe redirect
  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) return;
    /* searchParams is read-only in Next.js */;

    (async () => {
      try {
        const resp = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/verify-tool-payment`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({ sessionId, toolType: "competition" }),
          }
        );
        const data = await resp.json();
        if (data.valid && data.toolToken) {
          updateToken(data.toolToken);
          const saved = sessionStorage.getItem("mitryxa_competition_selections");
          if (saved) {
            const parsedSelections = JSON.parse(saved);
            setSelections(parsedSelections);
            setStep(5);
            setTimeout(() => { runAnalysis(parsedSelections, data.toolToken); }, 100);
          }
        } else {
          setErrorMsg(data.error || "Payment verification failed.");
          setPhase("error");
        }
      } catch {
        setErrorMsg("Could not verify payment. Please contact support.");
        setPhase("error");
      }
    })();
  }, [searchParams]);

  useEffect(() => {
    if (reportRef.current && (phase === "analyzing" || phase === "complete")) {
      reportRef.current.scrollTop = reportRef.current.scrollHeight;
    }
  }, [report, phase]);

  

  const runAnalysis = async (sels: Selections, token: string) => {
    setPhase("analyzing");
    setReport("");
    setErrorMsg("");

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY}`,
        "x-tool-token": token,
      };
      if (fingerprint) headers["x-client-fingerprint"] = fingerprint;

      const locationString = sels.geographyScope === "National" ? "National (United States)" : [
        ...sels.targetLocations,
        ...(sels.customLocation.trim() ? [sels.customLocation.trim()] : []),
      ].join(", ");

      const finalSelections = {
        ...sels,
        industry: sels.industry === "Other" ? sels.customIndustry || "Other" : sels.industry,
        geography: locationString,
      };

      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/tools-competition`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ selections: finalSelections }),
        }
      );

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Request failed" }));
        setErrorMsg(err.error || `Error ${resp.status}`);
        setPhase("error");
        return;
      }

      if (!resp.body) { setErrorMsg("No response stream"); setPhase("error"); return; }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let fullReport = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) { fullReport += content; setReport(fullReport); }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) { fullReport += content; setReport(fullReport); }
          } catch { /* ignore */ }
        }
      }

      setPhase("complete");
      saveCompetitionData({ selections: sels, report: fullReport });
      updateToken(null);
      sessionStorage.removeItem("mitryxa_competition_selections");
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong");
      setPhase("error");
    }
  };

  const handlePurchase = async () => {
    setPurchaseLoading(true);
    setCouponError("");
    sessionStorage.setItem("mitryxa_competition_selections", JSON.stringify(selections));

    try {
      const body: Record<string, string> = { toolType: "competition" };
      if (couponCode.trim()) body.couponCode = couponCode.trim();

      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-tool-checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify(body),
        }
      );
      const data = await resp.json();

      if (data.free && data.toolToken) {
        updateToken(data.toolToken);
        setCouponApplied(true);
        runAnalysis(selections, data.toolToken);
        return;
      }

      if (data.error) {
        setCouponError(data.error);
        setPurchaseLoading(false);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        setErrorMsg("Could not create checkout session.");
        setPurchaseLoading(false);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Purchase failed");
      setPurchaseLoading(false);
    }
  };

  const handleSubmitWithToken = () => {
    if (toolToken) { runAnalysis(selections, toolToken); }
    else { handlePurchase(); }
  };

  // Chat
  const handleChatSend = useCallback(async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg: ChatMsg = { role: "user", content: chatInput.trim() };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);
    setChatError("");
    let assistantContent = "";

    try {
      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/tools-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ messages: [...chatMessages, userMsg], reportContext: report }),
        }
      );

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Chat failed" }));
        throw new Error(err.error || `Error ${resp.status}`);
      }
      if (!resp.body) throw new Error("No response stream");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });
        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setChatMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantContent } : m));
                }
                return [...prev, { role: "assistant", content: assistantContent }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (err: any) {
      setChatError(err.message || "Chat failed");
    } finally {
      setChatLoading(false);
    }
  }, [chatInput, chatLoading, chatMessages, report]);

  const handleDownloadReport = useCallback(() => {
    const ind = selections.industry === "Other" ? selections.customIndustry : selections.industry;
    openBrandedPdf({
      title: `Competition Analysis — ${ind}`,
      subtitle: `${selections.targetLocations.length ? selections.targetLocations.join(", ") : selections.geographyScope} • ${selections.marketPosition}`,
      report,
    });
  }, [report, selections]);

  const sections = report
    .split(/(?=^## )/m)
    .filter((s) => s.trim())
    .map((s) => {
      const titleMatch = s.match(/^## (.+)/);
      return { title: titleMatch?.[1] || "", content: s };
    });

  const canProceed = () => {
    switch (step) {
      case 0: return selections.industry !== "" && (selections.industry !== "Other" || selections.customIndustry.trim() !== "");
      case 1: return selections.marketPosition !== "";
      case 2: return selections.geographyScope !== "" && (selections.geographyScope === "National" || selections.targetLocations.length > 0 || selections.customLocation.trim() !== "");
      case 3: return selections.competitorCount !== "";
      case 4: return true; // focus areas multi-select
      case 5: return true; // review
      default: return false;
    }
  };

  const stepLabels = ["Industry", "Position", "Geography", "Competitors", "Focus", "Review"];

  const renderOption = (value: string, selected: boolean, onClick: () => void) => (
    <button
      key={value}
      type="button"
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 text-sm font-mono ${
        selected
          ? "border-primary bg-primary/10 text-primary"
          : "border-primary/10 text-muted-foreground hover:border-primary/30 hover:text-foreground"
      }`}
    >
      <span className="flex items-center gap-2">
        {selected && <Check size={14} className="text-primary shrink-0" />}
        {value}
      </span>
    </button>
  );

  const renderMultiOption = (value: string, selectedList: string[], toggle: (v: string) => void) => {
    const selected = selectedList.includes(value);
    return renderOption(value, selected, () => toggle(value));
  };

  const toggleFocus = (value: string) => {
    setSelections((prev) => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(value)
        ? prev.focusAreas.filter((v) => v !== value)
        : [...prev.focusAreas, value],
    }));
  };

  return (
    <>
      <SEOHead
        title="Competition Analysis | Mitryxa"
        description="AI-powered competitive intelligence for professional service businesses. See what your competitors are doing online and where you can win."
      />
      <div className="relative min-h-screen">
        <div className="relative z-10 container mx-auto px-4 lg:px-8 pt-28 pb-20">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-muted-foreground mb-6">
              <Search size={14} className="text-primary" />
              Mitryxa Competitive Intelligence™
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1]">
              Know What Your{" "}
              <span className="text-gradient">Competitors</span>{" "}
              Are Doing
            </h1>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Our AI analyzes your competitive landscape and reveals gaps, threats, and opportunities you're missing.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/5 border border-primary/10">
              <DollarSign size={14} className="text-primary" />
              <span className="text-sm font-mono text-muted-foreground">
                One-time analysis: <span className="text-foreground font-semibold">{TOOL_PRICE}</span>
              </span>
            </div>
          </div>

          {/* Wizard */}
          {phase === "wizard" && (
            <div className="max-w-xl mx-auto">
              <div className="flex items-center gap-1 mb-8">
                {stepLabels.map((label, i) => (
                  <div key={label} className="flex-1">
                    <div className={`h-1 rounded-full transition-all duration-300 ${i <= step ? "bg-primary" : "bg-primary/10"}`} />
                    <p className={`text-[10px] font-mono mt-1 text-center ${i === step ? "text-primary" : "text-muted-foreground/50"}`}>{label}</p>
                  </div>
                ))}
              </div>

              <div className="glass-terminal rounded-xl p-6" style={{ animation: "fade-up 0.3s ease-out" }}>
                {step === 0 && (
                  <>
                    <h2 className="text-lg font-mono font-bold text-foreground mb-1">What industry are you in?</h2>
                    <p className="text-sm text-muted-foreground mb-4">This helps us identify your real competitors.</p>
                    <div className="grid gap-2">
                      {industries.map((ind) => renderOption(ind, selections.industry === ind, () => setSelections((p) => ({ ...p, industry: ind }))))}
                      {renderOption("Other", selections.industry === "Other", () => setSelections((p) => ({ ...p, industry: "Other" })))}
                      {selections.industry === "Other" && (
                        <input
                          type="text"
                          value={selections.customIndustry}
                          onChange={(e) => setSelections((p) => ({ ...p, customIndustry: e.target.value }))}
                          placeholder="Enter your industry..."
                          className="mt-1 w-full bg-background/50 border border-primary/10 rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/30 font-mono"
                        />
                      )}
                    </div>
                  </>
                )}

                {step === 1 && (
                  <>
                    <h2 className="text-lg font-mono font-bold text-foreground mb-1">What's your market position?</h2>
                    <p className="text-sm text-muted-foreground mb-4">Where do you stand relative to competitors?</p>
                    <div className="grid gap-2">
                      {marketPositions.map((s) => renderOption(s, selections.marketPosition === s, () => setSelections((p) => ({ ...p, marketPosition: s }))))}
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <h2 className="text-lg font-mono font-bold text-foreground mb-1">Where are your target markets?</h2>
                    <p className="text-sm text-muted-foreground mb-4">Select your scope, then pick specific locations. You can select multiple.</p>
                    <div className="grid gap-2 mb-4">
                      {geographyScopes.map((g) => renderOption(g, selections.geographyScope === g, () => setSelections((p) => ({ ...p, geographyScope: g, targetLocations: [], customLocation: "" }))))}
                    </div>

                    {selections.geographyScope && selections.geographyScope !== "National" && (
                      <>
                        <label className="block text-xs font-mono text-muted-foreground mb-2">
                          {selections.geographyScope.includes("states") ? "Select states:" : "Select states or type specific cities:"}
                        </label>
                        <div className="grid grid-cols-2 gap-1.5 mb-3">
                          {popularStates.map((state) => {
                            const selected = selections.targetLocations.includes(state);
                            return (
                              <button
                                key={state}
                                type="button"
                                onClick={() => setSelections((p) => ({
                                  ...p,
                                  targetLocations: selected
                                    ? p.targetLocations.filter((s) => s !== state)
                                    : [...p.targetLocations, state],
                                }))}
                                className={`px-3 py-2 rounded-lg border text-xs font-mono transition-all ${
                                  selected
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-primary/10 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                                }`}
                              >
                                <span className="flex items-center gap-1">
                                  {selected && <Check size={10} className="text-primary shrink-0" />}
                                  {state}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                        <input
                          type="text"
                          value={selections.customLocation}
                          onChange={(e) => setSelections((p) => ({ ...p, customLocation: e.target.value }))}
                          placeholder="Add specific cities (e.g., Los Angeles, Phoenix, Las Vegas)..."
                          className="w-full bg-background/50 border border-primary/10 rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/30 font-mono"
                        />
                        {selections.targetLocations.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {selections.targetLocations.map((loc) => (
                              <span key={loc} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-mono">
                                {loc}
                                <button onClick={() => setSelections((p) => ({ ...p, targetLocations: p.targetLocations.filter((l) => l !== loc) }))} className="hover:text-foreground">
                                  <X size={10} />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}

                {step === 3 && (
                  <>
                    <h2 className="text-lg font-mono font-bold text-foreground mb-1">How many competitors do you know?</h2>
                    <p className="text-sm text-muted-foreground mb-4">We'll identify more for you regardless.</p>
                    <div className="grid gap-2">
                      {competitorCounts.map((c) => renderOption(c, selections.competitorCount === c, () => setSelections((p) => ({ ...p, competitorCount: c }))))}
                    </div>
                    {(selections.competitorCount === "1–3 specific competitors in mind" || selections.competitorCount === "5–10 competitors I know of") && (
                      <textarea
                        value={selections.knownCompetitors}
                        onChange={(e) => setSelections((p) => ({ ...p, knownCompetitors: e.target.value }))}
                        placeholder="List competitor names or websites (optional)..."
                        rows={3}
                        className="mt-3 w-full bg-background/50 border border-primary/10 rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/30 font-mono resize-none"
                      />
                    )}
                  </>
                )}

                {step === 4 && (
                  <>
                    <h2 className="text-lg font-mono font-bold text-foreground mb-1">What areas should we focus on?</h2>
                    <p className="text-sm text-muted-foreground mb-4">Select all that matter most, or skip for a full analysis.</p>
                    <div className="grid gap-2">
                      {focusAreas.map((f) => renderMultiOption(f, selections.focusAreas, toggleFocus))}
                    </div>
                  </>
                )}

                {step === 5 && (
                  <>
                    <h2 className="text-lg font-mono font-bold text-foreground mb-1">Review & Pay</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                      Confirm your inputs. {!toolToken && <>This analysis costs <span className="text-foreground font-semibold">{TOOL_PRICE}</span>.</>}
                    </p>
                    <div className="space-y-3 text-sm font-mono">
                      <div className="flex justify-between border-b border-primary/10 pb-2">
                        <span className="text-muted-foreground">Industry</span>
                        <span className="text-foreground">{selections.industry === "Other" ? selections.customIndustry : selections.industry}</span>
                      </div>
                      <div className="flex justify-between border-b border-primary/10 pb-2">
                        <span className="text-muted-foreground">Position</span>
                        <span className="text-foreground text-right">{selections.marketPosition}</span>
                      </div>
                      <div className="flex justify-between border-b border-primary/10 pb-2">
                        <span className="text-muted-foreground">Target Markets</span>
                        <span className="text-foreground text-right">
                          {selections.geographyScope === "National" ? "National" : [
                            ...selections.targetLocations,
                            ...(selections.customLocation.trim() ? [selections.customLocation.trim()] : []),
                          ].join(", ") || selections.geographyScope}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-primary/10 pb-2">
                        <span className="text-muted-foreground">Competitors</span>
                        <span className="text-foreground text-right">{selections.competitorCount}</span>
                      </div>
                      <div className="flex justify-between pb-2">
                        <span className="text-muted-foreground">Focus Areas</span>
                        <span className="text-foreground text-right">{selections.focusAreas.length ? selections.focusAreas.join(", ") : "All (Full Analysis)"}</span>
                      </div>
                      {selections.knownCompetitors && (
                        <div className="border-t border-primary/10 pt-2">
                          <span className="text-muted-foreground block mb-1">Known Competitors</span>
                          <span className="text-foreground text-xs">{selections.knownCompetitors}</span>
                        </div>
                      )}
                    </div>

                    {/* Coupon input */}
                    {!toolToken && (
                      <div className="mt-4 pt-4 border-t border-primary/10">
                        <label className="text-xs font-mono text-muted-foreground mb-2 block">Have a coupon code?</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(""); }}
                            placeholder="Enter code..."
                            className="flex-1 bg-background/50 border border-primary/10 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/30 font-mono"
                          />
                        </div>
                        {couponError && (
                          <p className="text-xs text-destructive mt-1 font-mono">{couponError}</p>
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-primary/10">
                  {step > 0 ? (
                    <button onClick={() => setStep(step - 1)} className="inline-flex items-center gap-1 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors">
                      <ArrowLeft size={12} /> Back
                    </button>
                  ) : <div />}

                  {step < 5 ? (
                    <button
                      onClick={() => setStep(step + 1)}
                      disabled={!canProceed()}
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-mono font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next <ArrowRight size={14} />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitWithToken}
                      disabled={purchaseLoading}
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-mono font-semibold rounded-lg bg-primary text-primary-foreground hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)] transition-all disabled:opacity-40"
                    >
                      {purchaseLoading ? (
                        <><Loader2 size={14} className="animate-spin" /> Redirecting...</>
                      ) : toolToken ? (
                        <><Zap size={14} /> Run Analysis</>
                      ) : (
                        <><DollarSign size={14} /> Get Analysis — $25</>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Analyzing */}
          {phase === "analyzing" && !report && (
            <div className="max-w-xl mx-auto glass-terminal rounded-xl p-6 text-center">
              <Cpu size={24} className="text-primary animate-spin mx-auto mb-4" />
              <p className="text-sm font-mono text-muted-foreground">Scanning your competitive landscape...</p>
            </div>
          )}

          {/* Report */}
          {(phase === "analyzing" || phase === "complete") && report && (
            <div ref={reportRef} className="max-w-4xl mx-auto space-y-6">
              {phase === "analyzing" && (
                <div className="flex items-center justify-center gap-3 mb-6">
                  <Cpu size={16} className="text-primary animate-spin" />
                  <span className="text-sm font-mono text-muted-foreground">Building your competitive analysis...</span>
                </div>
              )}

              {phase === "complete" && (
                <div ref={actionRowRef} className="flex flex-wrap justify-center gap-2">
                  <button onClick={() => setChatOpen(!chatOpen)} className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono rounded-lg glass text-muted-foreground hover:text-foreground transition-colors">
                    <MessageSquare size={14} />
                    {chatOpen ? "Hide Chat" : "Discuss Report"}
                  </button>
                  <button onClick={handleDownloadReport} className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono rounded-lg glass text-muted-foreground hover:text-foreground transition-colors">
                    <FileDown size={14} />
                    Download Report
                  </button>
                  <button onClick={() => setTalkOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono rounded-lg glass text-muted-foreground hover:text-foreground transition-colors">
                    <Send size={14} />
                    Talk to Mitryxa
                  </button>
                </div>
              )}

              {sections.map((section, i) => (
                <div key={i} className="glass-terminal rounded-xl overflow-hidden" style={{ animation: `fade-up 0.4s ease-out ${i * 0.05}s both` }}>
                  <div className="h-[2px] bg-gradient-to-r from-primary to-secondary" />
                  <div className="p-5">
                    {section.title && (
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">{getIconForSection(section.title)}</div>
                        <h2 className="text-base font-mono font-bold text-foreground">{section.title}</h2>
                      </div>
                    )}
                    <div className="prose prose-sm prose-invert max-w-none text-muted-foreground [&_strong]:text-foreground [&_h3]:text-foreground [&_h3]:text-sm [&_h3]:font-mono [&_li]:text-muted-foreground">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{section.content.replace(/^## .+\n/, "")}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}

            </div>
          )}

          {/* Error */}
          {phase === "error" && (
            <div className="max-w-xl mx-auto glass-terminal rounded-xl p-6 border-destructive/30 text-center">
              <Shield size={24} className="text-destructive mx-auto mb-3" />
              <p className="text-sm text-muted-foreground font-mono mb-4">{errorMsg}</p>
              <button onClick={() => { setPhase("wizard"); setStep(5); setErrorMsg(""); }} className="text-xs font-mono text-primary hover:underline">
                &gt;_ Try again
              </button>
            </div>
          )}
        </div>
      </div>

      <ReportChatPanel
        open={chatOpen && phase === "complete"}
        onClose={() => setChatOpen(false)}
        title="Discuss Your Analysis"
        placeholder="Ask about your analysis..."
        emptyText="Ask anything about your competitive analysis..."
        messages={chatMessages}
        loading={chatLoading}
        error={chatError}
        input={chatInput}
        onInputChange={setChatInput}
        onSend={handleChatSend}
      />

      <TalkToMitryxa
        open={talkOpen}
        onClose={() => setTalkOpen(false)}
        toolType="competition"
        reportMarkdown={report}
        metadata={{
          industry: selections.industry === "Other" ? selections.customIndustry : selections.industry,
          marketPosition: selections.marketPosition,
          geography: selections.geographyScope === "National" ? "National" : [...selections.targetLocations, ...(selections.customLocation.trim() ? [selections.customLocation.trim()] : [])].join(", "),
          competitorCount: selections.competitorCount,
          knownCompetitors: selections.knownCompetitors,
          focusAreas: selections.focusAreas,
        }}
      />

      <StickyReportActions
        visible={showStickyActions && phase === "complete"}
        onDiscuss={() => setChatOpen(!chatOpen)}
        onDownload={handleDownloadReport}
        onTalk={() => setTalkOpen(true)}
        chatOpen={chatOpen}
      />
    </>
  );
};


export default function Competition() {
  return (
    <Suspense fallback={null}>
      <CompetitionInner />
    </Suspense>
  );
}
