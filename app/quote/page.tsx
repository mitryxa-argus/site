'use client';

import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowRight, Check, Cpu, Shield,
  FileDown, MessageSquare, Send,
  Zap, BarChart3, Globe, Target, Users, TrendingUp, DollarSign,
  Clock, Briefcase, Search, Palette, ChevronDown,
} from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import { openBrandedPdf } from "@/lib/brandedPdf";
import TalkToMitryxa from "@/components/tools/TalkToMitryxa";
import ReportChatPanel from "@/components/tools/ReportChatPanel";
import StickyReportActions from "@/components/tools/StickyReportActions";
import { supabase } from "@/integrations/supabase/client";
import { generateFingerprint } from "@/lib/fingerprint";
import TerminalCodeStream from "@/components/ui/TerminalCodeStream";
import DigitalHealthCard from "@/components/quote/DigitalHealthCard";
import CompetitorCard from "@/components/quote/CompetitorCard";

// ─── Types ───

type Selections = {
  leadName: string;
  leadEmail: string;
  businessName: string;
  industry: string;
  businessModel: string;
  yearsInBusiness: string;
  employeeCount: string;
  locationCount: string;
  geography: string;
  hasWebsite: string;
  websiteUrl: string;
  websiteCondition: string;
  hasSocialMedia: string;
  socialPlatforms: string[];
  currentDigitalPresence: string[];
  projectType: string;
  projectGoals: string[];
  successDefinition: string;
  functionalityNeeds: string[];
  integrationsNeeded: string[];
  estimatedPageCount: string;
  contentReadiness: string;
  designPreference: string;
  budgetRange: string;
  budgetFlexibility: string;
  timeline: string;
  urgency: string;
  projectCategory: string;
  estimatedComplexityTier: string;
  extraContext: string;
};

const INITIAL: Selections = {
  leadName: "", leadEmail: "", businessName: "", industry: "", businessModel: "",
  yearsInBusiness: "", employeeCount: "", locationCount: "", geography: "",
  hasWebsite: "", websiteUrl: "", websiteCondition: "",
  hasSocialMedia: "", socialPlatforms: [], currentDigitalPresence: [],
  projectType: "", projectGoals: [], successDefinition: "",
  functionalityNeeds: [], integrationsNeeded: [], estimatedPageCount: "",
  contentReadiness: "", designPreference: "",
  budgetRange: "", budgetFlexibility: "", timeline: "", urgency: "",
  projectCategory: "", estimatedComplexityTier: "", extraContext: "",
};

type Phase = "intake" | "researching" | "generating" | "complete" | "error";
type IntakeMsg = { role: "user" | "assistant"; content: string; options?: string[]; optionType?: "single" | "multi" };
type ChatMsg = { role: "user" | "assistant"; content: string };

const SESSION_KEY = "mitryxa_discovery_session";
const MAX_INTAKE_MESSAGES = 50;
const RESET_INTENT_REGEX = /\b(start over|start new quote|restart|reset|new quote|begin again|from scratch|از اول|شروع مجدد|شروع دوباره|ریست)\b/i;

function isResetIntent(input: string): boolean {
  return RESET_INTENT_REGEX.test(input.trim());
}

function getSessionKey(): string {
  let key = localStorage.getItem(SESSION_KEY);
  if (!key) {
    key = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, key);
  }
  return key;
}

// Section icons for report display
const sectionIcons: Record<string, React.ReactNode> = {
  "Executive": <Briefcase size={18} />,
  "Current Digital": <Globe size={18} />,
  "Your Brand": <Palette size={18} />,
  "Competitive": <BarChart3 size={18} />,
  "Project Scope": <Target size={18} />,
  "Investment": <DollarSign size={18} />,
  "Build Timeline": <Clock size={18} />,
  "Expected Results": <TrendingUp size={18} />,
  "ROI": <BarChart3 size={18} />,
  "Return on Investment": <TrendingUp size={18} />,
  "Next Steps": <ArrowRight size={18} />,
  "Phased": <Zap size={18} />,
  "Budget": <DollarSign size={18} />,
};

function getIconForSection(title: string) {
  for (const [k, icon] of Object.entries(sectionIcons)) {
    if (title.includes(k)) return icon;
  }
  return <Cpu size={18} />;
}

const Quote = () => {
  const [sel, setSel] = useState<Selections>(INITIAL);
  const [phase, setPhase] = useState<Phase>("intake");
  const [report, setReport] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [researchSnapshot, setResearchSnapshot] = useState<Record<string, unknown> | null>(null);
  const [researchTriggered, setResearchTriggered] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  const actionRowRef = useRef<HTMLDivElement>(null);
  const [showStickyActions, setShowStickyActions] = useState(false);

  // Intake chat
  const [intakeMessages, setIntakeMessages] = useState<IntakeMsg[]>([{
    role: "assistant",
    content: "Hi! I'm here to help you figure out exactly what you need for your project — and what it should realistically cost. Feel free to chat in your preferred language.\n\nLet's start simple. **What's your name?**",
    options: [],
    optionType: "single",
  }]);
  const [intakeInput, setIntakeInput] = useState("");
  const [intakeLoading, setIntakeLoading] = useState(false);
  const [intakeError, setIntakeError] = useState("");
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const intakeInputRef = useRef<HTMLInputElement>(null);
  const intakeRequestAbortRef = useRef<AbortController | null>(null);
  const resetCounterRef = useRef(0);

  // Post-report chat
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState("");
  const [talkOpen, setTalkOpen] = useState(false);

  // Sticky observer
  useEffect(() => {
    const el = actionRowRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setShowStickyActions(!entry.isIntersecting), { threshold: 0 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [phase]);

  // Load saved session on mount
  useEffect(() => {
    const sessionKey = getSessionKey();
    let cancelled = false;
    const loadToken = resetCounterRef.current;

    (async () => {
      try {
        const { data } = await supabase
          .from("discovery_sessions")
          .select("*")
          .eq("session_key", sessionKey)
          .maybeSingle();

        if (!data || cancelled || loadToken !== resetCounterRef.current) return;

        const savedSel = data.selections as unknown as Selections;
        const savedConvo = data.conversation as unknown as IntakeMsg[];
        const savedPhase = data.phase as Phase;

        if (savedSel) setSel(savedSel);
        if (savedConvo && savedConvo.length > 0) setIntakeMessages(savedConvo);
        if (data.research_snapshot) setResearchSnapshot(data.research_snapshot as Record<string, unknown>);

        if (savedPhase === "complete" && data.report_id) {
          const { data: reportData } = await supabase
            .from("tool_reports")
            .select("report_markdown")
            .eq("id", data.report_id)
            .maybeSingle();

          if (!cancelled && loadToken === resetCounterRef.current && reportData?.report_markdown) {
            setReport(reportData.report_markdown);
            setPhase("complete");
            return;
          }
        }

        if (!cancelled && loadToken === resetCounterRef.current && (savedPhase === "intake" || savedPhase === "researching")) {
          setPhase("intake");
        }
      } catch (e) {
        if (!cancelled) console.error("Failed to load session:", e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Save session periodically
  const saveSession = useCallback(async (
    updatedSel: Selections,
    updatedMessages: IntakeMsg[],
    currentPhase: Phase,
    research?: Record<string, unknown> | null,
    reportId?: string,
    pricingResult?: Record<string, unknown> | null,
  ) => {
    const sessionKey = getSessionKey();
    try {
      // Check if session exists
      const { data: existing } = await supabase
        .from("discovery_sessions")
        .select("id")
        .eq("session_key", sessionKey)
        .maybeSingle();

      const payload: Record<string, unknown> = {
        session_key: sessionKey,
        selections: JSON.parse(JSON.stringify(updatedSel)),
        conversation: JSON.parse(JSON.stringify(updatedMessages)),
        phase: currentPhase,
        research_snapshot: research ? JSON.parse(JSON.stringify(research)) : null,
        report_id: reportId || null,
        lead_name: updatedSel.leadName || null,
        lead_email: updatedSel.leadEmail || null,
        updated_at: new Date().toISOString(),
        ...(pricingResult ? { pricing_result: pricingResult } : {}),
      };

      if (existing) {
        await (supabase.from("discovery_sessions") as any).update(payload).eq("session_key", sessionKey);
      } else {
        await (supabase.from("discovery_sessions") as any).insert(payload);
      }
    } catch (e) {
      console.error("Failed to save session:", e);
    }
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    if (intakeMessages.length > 1) {
      // Use requestAnimationFrame to ensure DOM has rendered before scrolling
      requestAnimationFrame(() => {
        const container = document.getElementById("discovery-chat-scroll");
        if (container) container.scrollTop = container.scrollHeight;
      });
    }
  }, [intakeMessages, intakeLoading]);

  // Auto-scroll report
  useEffect(() => {
    if (reportRef.current && (phase === "generating" || phase === "complete"))
      reportRef.current.scrollTop = reportRef.current.scrollHeight;
  }, [report, phase]);

  // ─── Background Research ───

  const triggerResearch = useCallback(async (currentSel: Selections) => {
    if (researchTriggered) return;
    setResearchTriggered(true);
    console.log("Triggering background research...");
    try {
      const resp = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/discovery-research`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          selections: {
            ...currentSel,
            // Fallback: if businessName looks like a URL but websiteUrl is empty, use it
            websiteUrl: currentSel.websiteUrl || (
              /^[^\s]+\.[a-z]{2,}$/i.test((currentSel.businessName || "").trim())
                ? currentSel.businessName.trim()
                : ""
            ),
          },
        }),
      });
      if (resp.ok) {
        const data = await resp.json();
        setResearchSnapshot(data);
        console.log("Research complete");
      }
    } catch (e) {
      console.error("Research failed:", e);
    }
  }, [researchTriggered]);

  // ─── Intake Conversation ───

  const handleStartOver = useCallback(async () => {
    resetCounterRef.current += 1;
    intakeRequestAbortRef.current?.abort();
    intakeRequestAbortRef.current = null;

    const oldKey = localStorage.getItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);

    setSel(INITIAL);
    setPhase("intake");
    setReport("");
    setErrorMsg("");
    setResearchSnapshot(null);
    setResearchTriggered(false);

    setIntakeMessages([{
      role: "assistant",
      content: "Hi! I'm here to help you figure out exactly what you need for your project — and what it should realistically cost. Feel free to chat in your preferred language.\n\nLet's start simple. **What's your name?**",
      options: [],
      optionType: "single",
    }]);
    setIntakeInput("");
    setIntakeError("");
    setIntakeLoading(false);
    setSelectedChips([]);

    setChatOpen(false);
    setChatMessages([]);
    setChatInput("");
    setChatLoading(false);
    setChatError("");
    setTalkOpen(false);
    setShowStickyActions(false);

    if (oldKey) {
      const { error } = await supabase.from("discovery_sessions").delete().eq("session_key", oldKey);
      if (error) console.error("Failed to delete old session:", error);
    }
  }, []);

  const sendIntakeMessage = async (userMessage: string | null, currentSel: Selections) => {
    if (userMessage && isResetIntent(userMessage)) {
      await handleStartOver();
      return;
    }

    const requestToken = resetCounterRef.current;
    const controller = new AbortController();
    intakeRequestAbortRef.current = controller;

    setIntakeLoading(true);
    setIntakeError("");

    const newMessages = userMessage
      ? [...intakeMessages, { role: "user" as const, content: userMessage }]
      : intakeMessages;

    if (userMessage) setIntakeMessages(newMessages);

    const aiMessages = newMessages.map(m => ({ role: m.role, content: m.content }));

    try {
      const resp = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/discovery-intake`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: aiMessages, selections: currentSel }),
        signal: controller.signal,
      });

      if (requestToken !== resetCounterRef.current) return;

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Request failed" }));
        if (err.strike) {
          setIntakeError(err.error);
        } else {
          throw new Error(err.error || `Error ${resp.status}`);
        }
        return;
      }

      const data = await resp.json();
      if (requestToken !== resetCounterRef.current) return;

      const updatedSel: Selections = {
        ...currentSel,
        ...data.selections,
        extraContext: data.extraContext || currentSel.extraContext,
      };
      setSel(updatedSel);

      const aiMsg: IntakeMsg = {
        role: "assistant",
        content: data.message,
        options: data.options,
        optionType: data.optionType,
      };
      const updatedMessages = [...newMessages, aiMsg];
      setIntakeMessages(updatedMessages);
      setSelectedChips([]);

      saveSession(updatedSel, updatedMessages, "intake");

      if (data.readyForResearch && !researchTriggered) {
        triggerResearch(updatedSel);
      }

      if (data.complete) {
        setTimeout(() => startReport(updatedSel, updatedMessages), 1500);
      }
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      const message = err instanceof Error ? err.message : "Something went wrong";
      setIntakeError(message);
    } finally {
      if (intakeRequestAbortRef.current === controller) intakeRequestAbortRef.current = null;
      if (requestToken === resetCounterRef.current) setIntakeLoading(false);
    }
  };

  const handleIntakeSend = useCallback(() => {
    if (!intakeInput.trim() || intakeLoading) return;

    const msg = intakeInput.trim();
    if (isResetIntent(msg)) {
      setIntakeInput("");
      handleStartOver();
      return;
    }

    if (intakeMessages.length >= MAX_INTAKE_MESSAGES) {
      startReport(sel, intakeMessages);
      return;
    }

    setIntakeInput("");
    sendIntakeMessage(msg, sel);
  }, [intakeInput, intakeLoading, intakeMessages, sel, handleStartOver]);

  const handleChipClick = useCallback((option: string, optionType: string) => {
    if (intakeLoading) return;
    if (optionType === "multi") {
      setSelectedChips(prev => prev.includes(option) ? prev.filter(c => c !== option) : [...prev, option]);
      return;
    }

    if (isResetIntent(option)) {
      handleStartOver();
      return;
    }

    sendIntakeMessage(option, sel);
  }, [intakeLoading, sel, handleStartOver]);

  const handleMultiSubmit = useCallback(() => {
    if (selectedChips.length === 0 || intakeLoading) return;
    const msg = selectedChips.join(", ");
    setSelectedChips([]);
    sendIntakeMessage(msg, sel);
  }, [selectedChips, intakeLoading, sel]);

  // ─── Report Generation ───

  const startReport = async (currentSel: Selections, currentMessages: IntakeMsg[]) => {
    setPhase("researching");
    setReport("");
    setErrorMsg("");

    // If research hasn't been triggered yet, do it now and wait
    let research = researchSnapshot;
    if (!research) {
      try {
        const resp = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/discovery-research`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ selections: currentSel }),
        });
        if (resp.ok) {
          research = await resp.json();
          setResearchSnapshot(research);
        }
      } catch (e) {
        console.error("Research failed:", e);
      }
    }

    // Now generate the report
    setPhase("generating");
    try {
      const resp = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/discovery-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          selections: { ...currentSel, sessionKey: getSessionKey() },
          researchSnapshot: research,
          extraContext: currentSel.extraContext,
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Request failed" }));
        setErrorMsg(err.error || `Error ${resp.status}`);
        setPhase("error");
        return;
      }
      if (!resp.body) { setErrorMsg("No response stream"); setPhase("error"); return; }

      // Capture pricing data from response header before streaming
      let pricingResult: Record<string, unknown> | null = null;
      try {
        const pricingHeader = resp.headers.get("X-Pricing-Data");
        if (pricingHeader) pricingResult = JSON.parse(pricingHeader);
      } catch (e) { console.error("Failed to parse pricing header:", e); }

      // Stream the report
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "", full = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, nl); buf = buf.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || !line.trim() || !line.startsWith("data: ")) continue;
          const j = line.slice(6).trim();
          if (j === "[DONE]") break;
          try {
            const c = JSON.parse(j).choices?.[0]?.delta?.content;
            if (c) { full += c; setReport(full); }
          } catch { buf = line + "\n" + buf; break; }
        }
      }
      // Flush remaining
      if (buf.trim()) {
        for (let raw of buf.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || !raw.trim() || !raw.startsWith("data: ")) continue;
          const j = raw.slice(6).trim();
          if (j === "[DONE]") continue;
          try { const c = JSON.parse(j).choices?.[0]?.delta?.content; if (c) { full += c; setReport(full); } } catch {}
        }
      }

      // Save report to tool_reports
      const { data: reportRow } = await supabase
        .from("tool_reports")
        .insert({
          tool_type: "discovery",
          report_markdown: full,
          lead_name: currentSel.leadName || null,
          lead_email: currentSel.leadEmail || null,
          metadata: {
            industry: currentSel.industry,
            businessName: currentSel.businessName,
            projectCategory: currentSel.projectCategory,
            geography: currentSel.geography,
          },
        })
        .select("id")
        .single();

      setPhase("complete");
      saveSession(currentSel, currentMessages, "complete", research, reportRow?.id, pricingResult);

      // Auto-notify admin on report completion
      try {
        const reportUrl = reportRow?.id ? `${window.location.origin}/report/${reportRow.id}` : "";
        await supabase.functions.invoke("send-contact-email", {
          body: {
            internal: true,
            name: currentSel.leadName || "Discovery Lead",
            email: currentSel.leadEmail || "no-email@discovery.mitryxa.com",
            company: currentSel.businessName || "N/A",
            industry: currentSel.industry || "Other",
            projectType: "Discovery Report",
            message: `New discovery report completed.\n\nBusiness: ${currentSel.businessName || "N/A"}\nIndustry: ${currentSel.industry || "N/A"}\nCategory: ${currentSel.projectCategory?.replace(/_/g, " ") || "N/A"}\nBudget: ${currentSel.budgetRange || "N/A"}\nTimeline: ${currentSel.timeline || "N/A"}`,
            reportUrl,
          },
        });
      } catch (e) {
        console.error("Admin notification failed:", e);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setErrorMsg(message);
      setPhase("error");
    }
  };

  // ─── Post-Report Chat ───

  const handleChatSend = useCallback(async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg: ChatMsg = { role: "user", content: chatInput.trim() };
    setChatMessages(p => [...p, userMsg]);
    setChatInput("");
    setChatLoading(true);
    setChatError("");
    let ac = "";
    try {
      const resp = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/tools-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ messages: [...chatMessages, userMsg], reportContext: report }),
      });
      if (!resp.ok) throw new Error((await resp.json().catch(() => ({}))).error || `Error ${resp.status}`);
      if (!resp.body) throw new Error("No stream");
      const reader = resp.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, nl); buf = buf.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || !line.trim() || !line.startsWith("data: ")) continue;
          const j = line.slice(6).trim();
          if (j === "[DONE]") break;
          try {
            const c = JSON.parse(j).choices?.[0]?.delta?.content;
            if (c) {
              ac += c;
              setChatMessages(p => {
                const last = p[p.length - 1];
                if (last?.role === "assistant") return p.map((m, i) => i === p.length - 1 ? { ...m, content: ac } : m);
                return [...p, { role: "assistant", content: ac }];
              });
            }
          } catch { buf = line + "\n" + buf; break; }
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Chat failed";
      setChatError(message);
    } finally { setChatLoading(false); }
  }, [chatInput, chatLoading, chatMessages, report]);

  const handleDownload = useCallback(() => {
    const clientReport = report.replace(/## \[ADMIN:[\s\S]*$/, "").trim();
    openBrandedPdf({
      title: `Project Discovery — ${sel.businessName || sel.industry || "Quote"}`,
      subtitle: `${sel.geography || ""}${sel.industry ? ` • ${sel.industry}` : ""}`,
      report: clientReport,
    });
  }, [report, sel]);

  // ─── Computed values ───

  const clientReport = report.replace(/## \[ADMIN:[\s\S]*$/, "").trim();
  const sections = clientReport.split(/(?=^## )/m).filter(s => s.trim()).map(s => {
    const m = s.match(/^## (.+)/);
    return { title: m?.[1] || "", content: s };
  });

  // Count filled topics for progress bar
  const topicCount = [
    sel.leadName, sel.industry, sel.projectType,
    sel.projectGoals.length > 0, sel.hasWebsite,
    sel.budgetRange || sel.budgetFlexibility, sel.timeline,
    sel.functionalityNeeds.length > 0,
  ].filter(Boolean).length;

  return (
    <>
      <SEOHead
        title="Get a Quote | Mitryxa"
        description="Get an AI-powered project assessment with realistic pricing, timeline, and ROI projections. Free — no commitment required."
      />
      <div className="relative min-h-screen">
        <div className="relative z-10 container mx-auto px-4 lg:px-8 pt-20 sm:pt-28 pb-20">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-muted-foreground mb-6">
              <Briefcase size={14} className="text-primary" />
              Mitryxa Project Discovery™
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1] text-foreground">
              Get a <span className="text-gradient">Realistic Quote</span>
            </h1>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto hidden sm:block">
              Tell us about your project. We'll research your market, assess complexity, and provide a detailed quote — completely free.
            </p>
            <div className="mt-4 items-center gap-2 px-4 py-2 rounded-lg bg-accent/5 border border-accent/10 hidden sm:inline-flex">
              <Zap size={14} className="text-accent" />
              <span className="text-sm font-mono text-muted-foreground">Free — no commitment required</span>
            </div>
          </div>

          {/* ─── INTAKE PHASE ─── */}
          {phase === "intake" && (
            <div className="max-w-xl mx-auto">
              {/* Progress */}
              <div className="flex items-center justify-between mb-2 gap-3">
                <div className="flex-1 flex items-center gap-1">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className={`flex-1 h-1 rounded-full transition-all duration-500 ${i < topicCount ? "bg-primary" : "bg-primary/10"}`} />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-muted-foreground">{topicCount}/8 topics covered</span>
                  <button
                    type="button"
                    onClick={handleStartOver}
                    disabled={intakeLoading}
                    className="px-2.5 py-1 text-[10px] font-mono rounded-md border border-primary/20 text-muted-foreground hover:text-foreground hover:border-primary/40 disabled:opacity-40 transition-colors"
                  >
                    Start Over
                  </button>
                </div>
              </div>

              {/* Time estimator */}
              <div className="flex items-center gap-2 mb-4 px-1">
                <Clock size={12} className="text-muted-foreground/60 flex-shrink-0" />
                <span className="text-[11px] font-mono text-muted-foreground/70">
                  {topicCount === 0
                    ? "~3–5 min to complete"
                    : topicCount < 3
                    ? `~${5 - topicCount} min remaining`
                    : topicCount < 6
                    ? `~${Math.max(1, 6 - topicCount)} min remaining — almost there`
                    : topicCount < 8
                    ? "Less than a minute left"
                    : "Wrapping up…"}
                </span>
                {topicCount > 0 && topicCount < 8 && (
                  <div className="flex-1 h-px bg-gradient-to-r from-primary/20 to-transparent" />
                )}
              </div>

              {/* Chat */}
              <div className="glass-terminal rounded-xl overflow-hidden flex flex-col" style={{ height: 'calc(100dvh - 220px)', minHeight: '280px', maxHeight: '600px' }}>
                <div className="h-[2px] bg-gradient-to-r from-primary to-accent flex-shrink-0" />
                <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4" id="discovery-chat-scroll">
                  {intakeMessages.map((msg, i) => {
                    const isFirstAssistant = i === 0 && msg.role === "assistant";
                    const isOnlyMessage = intakeMessages.length === 1;
                    return (
                    <div key={i}>
                      <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[85%] rounded-lg px-3 py-2.5 text-sm ${
                          msg.role === "user"
                            ? "bg-primary/10 text-foreground font-mono"
                            : "bg-secondary/5 text-muted-foreground"
                        }`}>
                          <div className={`prose prose-sm prose-invert max-w-none [&_p]:mb-1 ${
                            isFirstAssistant ? '[&_strong]:text-foreground [&_strong]:animate-pulse-glow-text' : ''
                          }`}>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                          </div>
                        </div>
                      </div>
                      {isFirstAssistant && isOnlyMessage && !intakeLoading && (
                        <div className="flex justify-start ml-3 mt-2">
                          <div className="flex items-center gap-1.5 text-primary/70 animate-bounce">
                            <ChevronDown size={14} />
                            <span className="text-[10px] font-mono tracking-wider uppercase">type below</span>
                            <ChevronDown size={14} />
                          </div>
                        </div>
                      )}
                      {/* Chips */}
                      {msg.role === "assistant" && msg.options && msg.options.length > 0 && i === intakeMessages.length - 1 && !intakeLoading && (
                        <div className="space-y-2 mt-2 ml-1 max-w-full overflow-hidden">
                          <div className="flex flex-wrap gap-1.5">
                            {msg.options.map((option) => {
                              const isMulti = msg.optionType === "multi";
                              const isSelected = isMulti && selectedChips.includes(option);
                              return (
                                <button
                                  key={option}
                                  type="button"
                                  onClick={() => handleChipClick(option, msg.optionType || "single")}
                                  className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-all duration-200 ${
                                    isSelected
                                      ? "border-primary/50 text-primary bg-primary/10"
                                      : "border-primary/20 text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5"
                                  }`}
                                >
                                  {isMulti && isSelected && <Check size={10} className="inline mr-1" />}
                                  {option}
                                </button>
                              );
                            })}
                          </div>
                          {msg.optionType === "multi" && selectedChips.length > 0 && (
                            <button
                              type="button"
                              onClick={handleMultiSubmit}
                              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-mono rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                            >
                              <Check size={12} /> Submit ({selectedChips.length})
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    );
                  })}
                  {intakeLoading && (
                    <div className="flex justify-start">
                      <div className="bg-secondary/5 rounded-lg px-3 py-2.5 flex items-center gap-2 w-full max-w-[260px]">
                        <TerminalCodeStream />
                      </div>
                    </div>
                  )}
                  {intakeError && (
                    <div className="flex justify-center">
                      <p className="text-xs text-destructive font-mono bg-destructive/5 px-3 py-2 rounded-lg">{intakeError}</p>
                    </div>
                  )}
                </div>

                {/* Input — pinned at bottom */}
                <div className="border-t border-primary/10 p-3 flex-shrink-0">
                  <form onSubmit={e => { e.preventDefault(); handleIntakeSend(); }} className="flex gap-2">
                    <input
                      ref={intakeInputRef}
                      type="text"
                      value={intakeInput}
                      onChange={e => setIntakeInput(e.target.value.slice(0, 500))}
                      placeholder="Type your answer or tap an option..."
                      disabled={intakeLoading}
                      className="flex-1 min-w-0 bg-background/50 border border-primary/10 rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/30 font-mono disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={intakeLoading || !intakeInput.trim()}
                      className="px-3 py-2.5 rounded-lg bg-primary text-primary-foreground disabled:opacity-40 transition-opacity flex-shrink-0"
                    >
                      <Send size={14} />
                    </button>
                  </form>
                  <p className="text-[10px] font-mono text-muted-foreground/40 mt-1 text-right">{intakeInput.length}/500</p>
                </div>
              </div>

              {/* Research indicator */}
              {researchTriggered && !researchSnapshot && (
                <div className="mt-3 flex items-center justify-center gap-2 text-[10px] font-mono text-muted-foreground/50">
                  <Search size={10} className="animate-pulse text-accent" />
                  Researching your market in the background...
                </div>
              )}
            </div>
          )}

          {/* ─── RESEARCHING PHASE ─── */}
          {phase === "researching" && (
            <div className="max-w-xl mx-auto glass-terminal rounded-xl p-8 text-center">
              <Search size={28} className="text-accent animate-pulse mx-auto mb-4" />
              <p className="text-sm font-mono text-muted-foreground mb-2">Researching your market...</p>
              <p className="text-xs text-muted-foreground/50">Analyzing your industry, competitors, and digital landscape</p>
            </div>
          )}

          {/* ─── GENERATING PHASE ─── */}
          {phase === "generating" && !report && (
            <div className="max-w-xl mx-auto glass-terminal rounded-xl p-8 text-center">
              <Cpu size={28} className="text-primary animate-spin mx-auto mb-4" />
              <p className="text-sm font-mono text-muted-foreground mb-2">Building your project assessment...</p>
              <p className="text-xs text-muted-foreground/50">Calculating pricing, timeline, and expected results</p>
            </div>
          )}

          {/* ─── REPORT ─── */}
          {(phase === "generating" || phase === "complete") && report && (
            <div ref={reportRef} className="max-w-4xl mx-auto space-y-6">
              {phase === "generating" && (
                <div className="flex items-center justify-center gap-3 mb-6">
                  <Cpu size={16} className="text-primary animate-spin" />
                  <span className="text-sm font-mono text-muted-foreground">Generating your quote...</span>
                </div>
              )}
              {phase === "complete" && (
                <div ref={actionRowRef} className="flex flex-wrap justify-center gap-2">
                  <button onClick={() => setChatOpen(!chatOpen)} className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono rounded-lg glass text-muted-foreground hover:text-foreground transition-colors">
                    <MessageSquare size={14} />{chatOpen ? "Hide Chat" : "Discuss Report"}
                  </button>
                  <button onClick={handleDownload} className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono rounded-lg glass text-muted-foreground hover:text-foreground transition-colors">
                    <FileDown size={14} />Download Report
                  </button>
                  <button onClick={() => setTalkOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono rounded-lg glass text-muted-foreground hover:text-foreground transition-colors">
                    <Send size={14} />Talk to Mitryxa
                  </button>
                  <button onClick={handleStartOver} className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono rounded-lg glass text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                    <ArrowRight size={14} />Start New Quote
                  </button>
                </div>
              )}
              {/* Visual Score Cards */}
              {phase === "complete" && researchSnapshot && (
                <>
                  {(researchSnapshot.structuredInsights || researchSnapshot.branding || researchSnapshot.screenshot) && (
                    <DigitalHealthCard
                      insights={(researchSnapshot.structuredInsights as Record<string, unknown>) || {}}
                      branding={(researchSnapshot.branding as Record<string, unknown>) || null}
                      screenshot={(researchSnapshot.screenshot as string) || null}
                      pageCount={((researchSnapshot.structuredInsights as any)?.existingSitePageCount as number) || null}
                    />
                  )}
                  {(researchSnapshot.competitors as any[])?.length > 0 && (
                    <CompetitorCard
                      competitors={researchSnapshot.competitors as any[]}
                      businessName={sel.businessName}
                      clientFeatures={((researchSnapshot.structuredInsights as any)?.hasModernWebFeatures as Record<string, unknown>) || {}}
                    />
                  )}
                </>
              )}
              {sections.map((section, i) => (
                <div key={i} className="glass-terminal rounded-xl overflow-hidden" style={{ animation: `fade-up 0.4s ease-out ${i * 0.05}s both` }}>
                  <div className="h-[2px] bg-gradient-to-r from-primary to-accent" />
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
              <button onClick={() => { setPhase("intake"); setErrorMsg(""); }} className="text-xs font-mono text-primary hover:underline">&gt;_ Try again</button>
            </div>
          )}
        </div>
      </div>

      <ReportChatPanel
        open={chatOpen && phase === "complete"}
        onClose={() => setChatOpen(false)}
        title="Discuss Report"
        placeholder="Ask about your quote..."
        emptyText="Ask anything about your project assessment..."
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
        toolType="discovery"
        reportMarkdown={report}
        metadata={{
          leadName: sel.leadName,
          businessName: sel.businessName,
          industry: sel.industry,
          projectCategory: sel.projectCategory,
          geography: sel.geography,
          projectGoals: sel.projectGoals,
          budgetRange: sel.budgetRange,
          timeline: sel.timeline,
        }}
      />

      <StickyReportActions
        visible={showStickyActions && phase === "complete"}
        onDiscuss={() => setChatOpen(!chatOpen)}
        onDownload={handleDownload}
        onTalk={() => setTalkOpen(true)}
        chatOpen={chatOpen}
      />
    </>
  );
};

export default Quote;
