'use client';

import { Suspense, useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowRight, Terminal, Search, Cpu, Shield, BarChart3, Eye, Palette, Globe, Zap, GitCompareArrows, FileDown, X, MessageSquare, Send, Sparkles, Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import CtaChevrons from "@/components/ui/CtaChevrons";
import { generateFingerprint } from "@/lib/fingerprint";
import { openBrandedPdf } from "@/lib/brandedPdf";
import TalkToMitryxa from "@/components/tools/TalkToMitryxa";
import ReportChatPanel from "@/components/tools/ReportChatPanel";
import StickyReportActions from "@/components/tools/StickyReportActions";


const scanLines = [
  "Initializing Mitryxa audit engine...",
  "Establishing secure connection...",
  "Resolving DNS records...",
  "Scanning HTML structure...",
  "Parsing meta tags and headers...",
  "Analyzing content hierarchy...",
  "Evaluating internal link structure...",
  "Checking mobile responsiveness signals...",
  "Scanning HTTP security headers...",
  "Analyzing SSL/TLS configuration...",
  "Checking for known vulnerabilities...",
  "Scanning open ports...",
  "Extracting conversion elements...",
  "Mapping user flow patterns...",
  "Scanning for SEO indicators...",
  "Evaluating trust signals...",
  "Compiling raw data for AI analysis...",
  "Transferring to Mitryxa AI engine...",
];

const compareScanLines = [
  "Initializing comparison engine...",
  "Crawling Site A...",
  "Crawling Site B...",
  "Normalizing content structures...",
  "Cross-referencing SEO signals...",
  "Comparing conversion elements...",
  "Evaluating competitive positioning...",
  "Building comparative analysis...",
  "Transferring to Mitryxa AI engine...",
];

const sectionIcons: Record<string, React.ReactNode> = {
  "Executive Summary": <Terminal size={18} />,
  "Comparison Overview": <GitCompareArrows size={18} />,
  "Content & Messaging": <BarChart3 size={18} />,
  "User Experience & Conversion": <Eye size={18} />,
  "SEO & Technical Structure": <Search size={18} />,
  "Security & Vulnerability Assessment": <Shield size={18} />,
  "Industry Positioning": <Globe size={18} />,
  "Visual Design & Credibility": <Palette size={18} />,
  "The Mitryxa Advantage": <Zap size={18} />,
  "Overall Score": <Shield size={18} />,
  "Overall Scores": <Shield size={18} />,
  "Key Takeaways": <Terminal size={18} />,
};

function getIconForSection(title: string) {
  for (const [key, icon] of Object.entries(sectionIcons)) {
    if (title.includes(key)) return icon;
  }
  return <Cpu size={18} />;
}

function extractScore(title: string): string | null {
  const scorePattern = /(?:Score[s]?[:\s—–-]+)(.+)/i;
  const match = title.match(scorePattern);
  return match ? match[1].trim() : null;
}

// Persistence keys
const STORAGE_KEY = "mitryxa_audit_data";
const META_STORAGE_KEY = "mitryxa_audit_meta";

function saveAuditData(data: { domain: string; compareDomain: string; mode: string; report: string }) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch { /* ignore */ }
}

function loadAuditData(): { domain: string; compareDomain: string; mode: string; report: string } | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveMetaData(meta: Record<string, any>) {
  try {
    sessionStorage.setItem(META_STORAGE_KEY, JSON.stringify(meta));
  } catch { /* ignore */ }
}

function loadMetaData(): Record<string, any> | null {
  try {
    const raw = sessionStorage.getItem(META_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// Client-side rate limiting — 30 days
const RATE_KEY = "mitryxa_audit_timestamps";
const CLIENT_RATE_LIMIT = 1;
const CLIENT_RATE_WINDOW = 30 * 24 * 60 * 60 * 1000;

function checkClientRateLimit(): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const raw = localStorage.getItem(RATE_KEY);
  let timestamps: number[] = raw ? JSON.parse(raw) : [];
  timestamps = timestamps.filter((t) => now - t < CLIENT_RATE_WINDOW);

  if (timestamps.length >= CLIENT_RATE_LIMIT) {
    const oldest = Math.min(...timestamps);
    const resetMs = oldest + CLIENT_RATE_WINDOW - now;
    const resetDays = Math.ceil(resetMs / (24 * 60 * 60 * 1000));
    return { allowed: false, remaining: 0, resetIn: resetDays };
  }
  return { allowed: true, remaining: CLIENT_RATE_LIMIT - timestamps.length, resetIn: 0 };
}

function recordAuditUsage() {
  const now = Date.now();
  const raw = localStorage.getItem(RATE_KEY);
  let timestamps: number[] = raw ? JSON.parse(raw) : [];
  timestamps = timestamps.filter((t) => now - t < CLIENT_RATE_WINDOW);
  timestamps.push(now);
  localStorage.setItem(RATE_KEY, JSON.stringify(timestamps));
}

type AuditPhase = "input" | "scanning" | "analyzing" | "complete" | "error";
type AuditMode = "single" | "compare";
type ChatMsg = { role: "user" | "assistant"; content: string };

// Rate counter pill component
const GLITCH_CHARS = ["0","1","2","3","4","5","6","7","8","9","#","_","?","▓","░"];

function RateCounter({ remaining, total, loading }: { remaining: number; total: number; loading?: boolean }) {
  const [glitchChar, setGlitchChar] = useState("—");

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setGlitchChar(GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]);
    }, 80);
    return () => clearInterval(interval);
  }, [loading]);

  const used = total - remaining;
  const isLow = !loading && remaining <= 1;
  const isEmpty = !loading && remaining === 0;

  return (
    <div className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full border backdrop-blur-md transition-all duration-300 ${
      loading
        ? "border-primary/20 bg-primary/5 shadow-[0_0_15px_hsl(var(--primary)/0.08)]"
        : isEmpty
          ? "border-destructive/40 bg-destructive/10 shadow-[0_0_15px_hsl(var(--destructive)/0.15)]"
          : isLow
            ? "border-yellow-500/40 bg-yellow-500/10 shadow-[0_0_15px_hsl(45_100%_50%/0.12)]"
            : "border-primary/30 bg-primary/5 shadow-[0_0_15px_hsl(var(--primary)/0.1)]"
    }`}>
      <Zap size={13} className={`${
        loading ? "text-primary/50 animate-pulse" : isEmpty ? "text-destructive" : isLow ? "text-yellow-400" : "text-primary"
      }`} />
      <span className={`text-xs font-mono font-semibold transition-all duration-200 ${
        loading ? "text-primary/60" : isEmpty ? "text-destructive" : isLow ? "text-yellow-400" : "text-primary"
      }`}>
        {loading ? glitchChar : remaining}
      </span>
      <span className="text-xs font-mono text-muted-foreground">
        of {loading ? "—" : total} scans left
      </span>
      <div className="flex gap-1 ml-1">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              loading
                ? "bg-primary/20 animate-pulse"
                : i < used
                  ? isEmpty ? "bg-destructive/60" : isLow ? "bg-yellow-500/60" : "bg-primary/50"
                  : isEmpty ? "bg-destructive" : isLow ? "bg-yellow-400" : "bg-primary shadow-[0_0_4px_hsl(var(--primary)/0.6)]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

const AuditInner = () => {
  const persisted = loadAuditData();
  const persistedMeta = loadMetaData();
  const searchParams = useSearchParams();

  const [domain, setDomain] = useState(persisted?.domain || "");
  const [compareDomain, setCompareDomain] = useState(persisted?.compareDomain || "");
  const [mode, setMode] = useState<AuditMode>((persisted?.mode as AuditMode) || "single");
  const [phase, setPhase] = useState<AuditPhase>(persisted?.report ? "complete" : "input");
  const [scanIndex, setScanIndex] = useState(0);
  const [report, setReport] = useState(persisted?.report || "");
  const [errorMsg, setErrorMsg] = useState("");
  const [scrapeMeta, setScrapeMeta] = useState<Record<string, any> | null>(persistedMeta);
  const [serverRemaining, setServerRemaining] = useState<number | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const actionRowRef = useRef<HTMLDivElement>(null);
  const [showStickyActions, setShowStickyActions] = useState(false);

  // Payment state — persist bypass token in localStorage
  const BYPASS_KEY = "mitryxa_paid_bypass";
  const [bypassToken, setBypassToken] = useState<string | null>(() => {
    try { return localStorage.getItem(BYPASS_KEY); } catch { return null; }
  });
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [paymentVerified, setPaymentVerified] = useState(false);

  // Sync bypass token to localStorage
  const updateBypassToken = useCallback((token: string | null) => {
    setBypassToken(token);
    try {
      if (token) localStorage.setItem(BYPASS_KEY, token);
      else localStorage.removeItem(BYPASS_KEY);
    } catch { /* ignore */ }
  }, []);

  // Chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState("");
  

  // Fix Prompt state
  const [promptOpen, setPromptOpen] = useState(false);
  const [promptContent, setPromptContent] = useState("");
  const [promptLoading, setPromptLoading] = useState(false);
  const [promptCopied, setPromptCopied] = useState(false);
  const [talkOpen, setTalkOpen] = useState(false);

  // Sticky action bar observer
  useEffect(() => {
    const el = actionRowRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setShowStickyActions(!entry.isIntersecting), { threshold: 0 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [phase]);

  // Fingerprint state
  const [clientFingerprint, setClientFingerprint] = useState<string | null>(null);

  // Fetch server-side usage count and fingerprint on mount
  useEffect(() => {
    (async () => {
      const fp = await generateFingerprint();
      setClientFingerprint(fp);

      try {
        const resp = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/audit-usage-check`,
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY}`,
              "x-client-fingerprint": fp,
            },
          }
        );
        if (resp.ok) {
          const data = await resp.json();
          setServerRemaining(data.remaining ?? null);
        }
      } catch {
        // Fall back to client-side count
      }
    })();
  }, []);

  const activeScanLines = mode === "compare" ? compareScanLines : scanLines;

  // Handle Stripe redirect — verify payment
  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) return;

    // Clear URL params
    /* searchParams is read-only in Next.js */;

    (async () => {
      try {
        const resp = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/verify-audit-payment`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({ sessionId }),
          }
        );
        const data = await resp.json();
        if (data.valid && data.bypassToken) {
          updateBypassToken(data.bypassToken);
          setPaymentVerified(true);
          setPhase("input");
          setErrorMsg("");
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

  // Scanning simulation
  useEffect(() => {
    if (phase !== "scanning") return;
    if (scanIndex >= activeScanLines.length) return;
    const timeout = setTimeout(() => {
      setScanIndex((i) => i + 1);
    }, 400 + Math.random() * 300);
    return () => clearTimeout(timeout);
  }, [phase, scanIndex, activeScanLines.length]);

  // Persist report + meta when complete
  useEffect(() => {
    if (phase === "complete" && report) {
      saveAuditData({ domain, compareDomain, mode, report });
      if (scrapeMeta) saveMetaData(scrapeMeta);
    }
  }, [phase, report, domain, compareDomain, mode, scrapeMeta]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!domain.trim()) return;
      if (mode === "compare" && !compareDomain.trim()) return;

      // Allow if has bypass token (paid), otherwise check rate limit
      if (!bypassToken) {
        // Use server count if available, otherwise fall back to client
        const effectiveRemaining = serverRemaining !== null ? serverRemaining : checkClientRateLimit().remaining;
        if (effectiveRemaining <= 0) {
          setErrorMsg("rate_limit");
          setPhase("error");
          return;
        }
      }

      setPhase("scanning");
      setScanIndex(0);
      setReport("");
      setErrorMsg("");
      setScrapeMeta(null);
      setChatMessages([]);
      setChatOpen(false);
      setPromptContent("");
      setPromptOpen(false);
      setPaymentVerified(false);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const body: any = { url: domain.trim() };
        if (mode === "compare") {
          body.mode = "compare";
          body.compareUrl = compareDomain.trim();
        }

        const headers: Record<string, string> = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY}`,
        };
        if (clientFingerprint) {
          headers["x-client-fingerprint"] = clientFingerprint;
        }
        if (bypassToken) {
          headers["x-audit-bypass-token"] = bypassToken;
        }

        const resp = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/audit-website`,
          {
            method: "POST",
            headers,
            body: JSON.stringify(body),
            signal: controller.signal,
          }
        );

        if (!resp.ok) {
          const err = await resp.json().catch(() => ({ error: "Request failed" }));
          setErrorMsg(err.error || `Error ${resp.status}`);
          setPhase("error");
          return;
        }

        if (!resp.body) {
          setErrorMsg("No response stream");
          setPhase("error");
          return;
        }

        // Record usage for free audits only; bypass token consumed after success
        if (!bypassToken) {
          recordAuditUsage();
          // Immediately decrement server counter for instant UI update
          setServerRemaining((prev) => prev !== null ? Math.max(0, prev - 1) : prev);
        } else {
          // Don't consume yet — wait for success
        }
        setPhase("analyzing");

        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        let textBuffer = "";
        let fullReport = "";
        let metaParsed = false;

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

              // Check for _meta payload (first SSE event)
              if (!metaParsed && parsed._meta) {
                setScrapeMeta(parsed._meta);
                metaParsed = true;
                continue;
              }

              const content = parsed.choices?.[0]?.delta?.content as string | undefined;
              if (content) {
                fullReport += content;
                setReport(fullReport);
              }
            } catch {
              textBuffer = line + "\n" + textBuffer;
              break;
            }
          }
        }

        // Final flush
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
              if (!metaParsed && parsed._meta) {
                setScrapeMeta(parsed._meta);
                metaParsed = true;
                continue;
              }
              const content = parsed.choices?.[0]?.delta?.content as string | undefined;
              if (content) {
                fullReport += content;
                setReport(fullReport);
              }
            } catch { /* ignore */ }
          }
        }

        setPhase("complete");
        // Consume bypass token only after successful completion
        if (bypassToken) {
          updateBypassToken(null);
        }
      } catch (err: any) {
        if (err.name === "AbortError") return;
        console.error("Audit error:", err);
        setErrorMsg(err.message || "Something went wrong");
        setPhase("error");
      }
    },
    [domain, compareDomain, mode, bypassToken]
  );

  // Auto-scroll report
  useEffect(() => {
    if (reportRef.current && (phase === "analyzing" || phase === "complete")) {
      reportRef.current.scrollTop = reportRef.current.scrollHeight;
    }
  }, [report, phase]);


  // Generate printable report
  const handleDownloadReport = useCallback(() => {
    const title = mode === "compare"
      ? `Mitryxa AI Audit — ${domain} vs ${compareDomain}`
      : `Mitryxa AI Website Audit — ${domain}`;

    openBrandedPdf({
      title,
      subtitle: mode === "compare" ? "Comparative Analysis" : undefined,
      report,
    });
  }, [report, domain, compareDomain, mode]);

  // New audit
  const handleNewAudit = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(META_STORAGE_KEY);
    setPhase("input");
    setReport("");
    setDomain("");
    setCompareDomain("");
    setScrapeMeta(null);
    setChatMessages([]);
    setChatOpen(false);
    setChatError("");
    setPromptContent("");
    setPromptOpen(false);
  }, []);

  // Purchase additional audit
  const handlePurchaseAudit = useCallback(async () => {
    setPurchaseLoading(true);
    setCouponError("");
    try {
      const body: Record<string, string> = {};
      if (couponCode.trim()) body.couponCode = couponCode.trim();

      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-audit-checkout`,
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

      if (data.free && data.bypassToken) {
        // 100% coupon — skip Stripe, store bypass token
        updateBypassToken(data.bypassToken);
        setPaymentVerified(true);
        setPhase("input");
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
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Purchase failed");
    } finally {
      setPurchaseLoading(false);
    }
  }, [couponCode]);

  const handleGeneratePrompt = useCallback(async () => {
    if (promptLoading) return;
    // If we already have a cached prompt, just show it
    if (promptContent && !promptContent.startsWith("Error:")) {
      setPromptOpen(true);
      return;
    }
    setPromptOpen(true);
    setPromptLoading(true);
    setPromptContent("");
    setPromptCopied(false);

    let fullPrompt = "";

    try {
      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/audit-generate-prompt`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ report, domain }),
        }
      );

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Failed to generate prompt" }));
        setPromptContent(`Error: ${err.error || "Something went wrong"}`);
        setPromptLoading(false);
        return;
      }

      if (!resp.body) {
        setPromptContent("Error: No response");
        setPromptLoading(false);
        return;
      }

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
              fullPrompt += content;
              setPromptContent(fullPrompt);
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Final flush
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
            if (content) {
              fullPrompt += content;
              setPromptContent(fullPrompt);
            }
          } catch { /* ignore */ }
        }
      }
    } catch (err: any) {
      setPromptContent(`Error: ${err.message || "Something went wrong"}`);
    } finally {
      setPromptLoading(false);
    }
  }, [report, domain, promptLoading, promptContent]);

  const handleCopyPrompt = useCallback(() => {
    navigator.clipboard.writeText(promptContent).then(() => {
      setPromptCopied(true);
      setTimeout(() => setPromptCopied(false), 2000);
    });
  }, [promptContent]);

  // Chat with AI about the report
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
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/audit-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: [...chatMessages, userMsg],
            reportContext: report,
          }),
        }
      );

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Chat failed" }));
        if (err.strike) {
          setChatError(err.error);
          setChatLoading(false);
          setChatMessages((prev) => prev.slice(0, -1));
          return;
        }
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

      // Final flush
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
          } catch { /* ignore */ }
        }
      }
    } catch (err: any) {
      setChatError(err.message || "Chat failed");
    } finally {
      setChatLoading(false);
    }
  }, [chatInput, chatLoading, chatMessages, report]);

  // Split report into sections
  const sections = report
    .split(/(?=^## )/m)
    .filter((s) => s.trim())
    .map((s) => {
      const titleMatch = s.match(/^## (.+)/);
      return { title: titleMatch?.[1] || "", content: s };
    });

  const clientRateInfo = checkClientRateLimit();
  // Use server count as source of truth when available, fall back to client
  const rateInfo = serverRemaining !== null
    ? { allowed: serverRemaining > 0, remaining: serverRemaining, resetIn: clientRateInfo.resetIn }
    : clientRateInfo;

  return (
    <>
      <SEOHead
        title="Website Signal Scan | Mitryxa"
        description="Run a full-spectrum signal scan on your website with Mitryxa's proprietary Signal Intelligence Engine. Discover what's holding your site back."
      />
      <div className="relative min-h-screen">
        <div className="relative z-10 container mx-auto px-4 lg:px-8 pt-28 pb-20">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-muted-foreground mb-6">
              <Cpu size={14} className="text-primary" />
              Mitryxa Signal Intelligence™
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1]">
              Run a Full-Spectrum{" "}
              <span className="text-gradient">Signal Scan</span>{" "}
              on Your Website
            </h1>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Our proprietary Signal Intelligence Engine runs multi-layer crawls across content clarity, conversion architecture, trust signals, competitive positioning, and SEO structure — then delivers a strategic breakdown no generic tool can match.
            </p>
            <p className="mt-3 text-xs font-mono text-muted-foreground/70 max-w-lg mx-auto">
              Each Signal Scan is a <span className="text-primary font-semibold">$50 value</span>. Your first scan is complimentary — refreshing every 30 days.
            </p>

            <div className="mt-4 flex flex-col items-center gap-2">
              <RateCounter remaining={rateInfo.remaining} total={CLIENT_RATE_LIMIT} loading={serverRemaining === null} />
              {paymentVerified && bypassToken && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/40 bg-green-500/10 text-xs font-mono text-green-400">
                  <Check size={12} />
                  Payment verified — 1 bonus scan ready
                </div>
              )}
            </div>
          </div>

          {/* New Audit button when viewing results */}
          {phase === "complete" && (
            <div className="flex justify-center mb-6">
              <button
                onClick={handleNewAudit}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono rounded-lg glass text-muted-foreground hover:text-foreground transition-colors"
              >
                <Search size={14} />
                Run New Audit
              </button>
            </div>
          )}

          {/* Mode toggle */}
          {(phase === "input" || phase === "error") && (
            <>
              <div className="flex justify-center gap-2 mb-6">
                <button
                  onClick={() => setMode("single")}
                  className={`px-4 py-2 text-xs font-mono rounded-lg transition-all ${
                    mode === "single"
                      ? "bg-primary text-primary-foreground"
                      : "glass text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Search size={12} className="inline mr-1.5 -mt-0.5" />
                  Single Audit
                </button>
                <button
                  onClick={() => setMode("compare")}
                  className={`px-4 py-2 text-xs font-mono rounded-lg transition-all ${
                    mode === "compare"
                      ? "bg-primary text-primary-foreground"
                      : "glass text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <GitCompareArrows size={12} className="inline mr-1.5 -mt-0.5" />
                  Compare Sites
                </button>
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-16 space-y-3">
                <div className="glass-terminal glow-border rounded-xl p-1 flex items-center">
                  <span className="text-primary font-mono text-sm pl-4 pr-2 select-none">&gt;_</span>
                  <input
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder={mode === "compare" ? "Site A (e.g. example.com)" : "Enter your domain (e.g. example.com)"}
                    disabled={false}
                    className="flex-1 bg-transparent border-none outline-none text-foreground font-mono text-sm placeholder:text-muted-foreground py-3 px-2"
                  />
                  {mode === "single" && (
                    <button
                      type="submit"
                      disabled={!domain.trim()}
                      className="inline-flex items-center gap-2 px-6 py-2.5 mr-1 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:shadow-[0_0_30px_hsl(217_91%_60%/0.4)] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Search size={14} /> Audit
                    </button>
                  )}
                </div>

                {mode === "compare" && (
                  <>
                    <div className="glass-terminal glow-purple rounded-xl p-1 flex items-center">
                      <span className="text-secondary font-mono text-sm pl-4 pr-2 select-none">vs</span>
                      <input
                        type="text"
                        value={compareDomain}
                        onChange={(e) => setCompareDomain(e.target.value)}
                        placeholder="Site B (e.g. competitor.com)"
                        disabled={false}
                        className="flex-1 bg-transparent border-none outline-none text-foreground font-mono text-sm placeholder:text-muted-foreground py-3 px-2"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!domain.trim() || !compareDomain.trim()}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:shadow-[0_0_30px_hsl(217_91%_60%/0.4)] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <GitCompareArrows size={14} /> Compare Sites
                    </button>
                  </>
                )}
              </form>
            </>
          )}

          {/* Scanning phase */}
          {phase === "scanning" && (
            <div className="max-w-2xl mx-auto glass-terminal rounded-xl p-6" style={{ animation: "fade-up 0.4s ease-out" }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                  {mode === "compare" ? `Comparing ${domain} vs ${compareDomain}` : `Scanning ${domain}`}
                </span>
              </div>
              <div className="space-y-1 font-mono text-xs overflow-hidden">
                {activeScanLines.slice(0, scanIndex).map((line, i) => (
                  <div key={i} className="flex items-center gap-2 text-muted-foreground" style={{ animation: `fade-up 0.3s ease-out ${i * 0.05}s both` }}>
                    <span className="text-accent">▸</span>
                    <span>{line}</span>
                  </div>
                ))}
                {scanIndex < activeScanLines.length && (
                  <div className="flex items-center gap-2 text-foreground">
                    <span className="text-primary animate-pulse">▸</span>
                    <span>{activeScanLines[scanIndex]}</span>
                  </div>
                )}
              </div>
              <div className="mt-4 h-1 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-500"
                  style={{ width: `${(scanIndex / activeScanLines.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Error */}
          {phase === "error" && errorMsg === "rate_limit" ? (
            <div className="max-w-2xl mx-auto glass-terminal rounded-xl p-8 text-center" style={{ animation: "fade-up 0.4s ease-out" }}>
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Zap size={24} className="text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-mono font-bold text-foreground mb-2">You've used your complimentary scan</h3>
              <p className="text-sm font-mono text-muted-foreground mb-6 max-w-md mx-auto">
                Your free scans will refresh in ~{checkClientRateLimit().resetIn} days. Need results now? Unlock an additional scan instantly.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handlePurchaseAudit}
                  disabled={purchaseLoading}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-mono font-semibold rounded-lg bg-primary text-primary-foreground hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)] transition-all duration-300 disabled:opacity-40"
                >
                  <Zap size={14} />
                  {purchaseLoading ? "Redirecting..." : "Unlock Scan — $50"}
                </button>
                <button
                  onClick={() => setPhase("input")}
                  className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
                >
                  or wait for free refresh
                </button>
              </div>
              <div className="mt-4 max-w-xs mx-auto">
                <label className="text-xs font-mono text-muted-foreground mb-2 block text-center">Have a coupon code?</label>
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(""); }}
                  placeholder="Enter code..."
                  className="w-full bg-background/50 border border-primary/10 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/30 font-mono text-center"
                />
                {couponError && (
                  <p className="text-xs text-destructive mt-1 font-mono text-center">{couponError}</p>
                )}
              </div>
            </div>
          ) : phase === "error" && (
            <div className="max-w-2xl mx-auto glass-terminal rounded-xl p-6 border-destructive/30">
              <div className="flex items-center gap-2 mb-2">
                <Shield size={16} className="text-destructive" />
                <span className="text-sm font-mono text-destructive">Error</span>
              </div>
              <p className="text-sm text-muted-foreground font-mono">{errorMsg}</p>
              <div className="flex items-center gap-4 mt-4">
                <button
                  onClick={() => setPhase("input")}
                  className="text-xs font-mono text-primary hover:underline"
                >
                  &gt;_ Try again
                </button>
              </div>
            </div>
          )}

          {/* Report */}
          {(phase === "analyzing" || phase === "complete") && (
            <div ref={reportRef} className="max-w-4xl mx-auto space-y-6">
              {phase === "analyzing" && (
                <div className="flex items-center justify-center gap-3 mb-6">
                  <Cpu size={16} className="text-primary animate-spin" />
                  <span className="text-sm font-mono text-muted-foreground">
                    {mode === "compare" ? "Signal Intelligence Engine is comparing both websites..." : "Signal Intelligence Engine is analyzing your website..."}
                  </span>
                </div>
              )}

              {phase === "complete" && (
                <div ref={actionRowRef} className="flex flex-wrap justify-center gap-2">
                  <button
                    onClick={handleGeneratePrompt}
                    disabled={promptLoading}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono rounded-lg glass text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Sparkles size={14} />
                    {promptLoading ? "Generating..." : "Generate Fix Prompt"}
                  </button>
                  <button
                    onClick={() => setChatOpen(!chatOpen)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono rounded-lg glass text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <MessageSquare size={14} />
                    {chatOpen ? "Hide Chat" : "Discuss Report"}
                  </button>
                  <button
                    onClick={handleDownloadReport}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono rounded-lg glass text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <FileDown size={14} />
                    Download Report
                  </button>
                  <button
                    onClick={() => setTalkOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono rounded-lg glass text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Send size={14} />
                    Talk to Mitryxa
                  </button>
                </div>
              )}

              {/* Site identifier banner */}
              {mode === "compare" ? (
                <div className="glass-terminal rounded-xl overflow-hidden" style={{ animation: "fade-up 0.4s ease-out" }}>
                  <div className="h-[2px] bg-gradient-to-r from-primary to-secondary" />
                  <div className="p-5 flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Globe size={18} className="text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60">Site A</p>
                        <p className="text-sm font-mono font-bold text-foreground truncate">{domain}</p>
                      </div>
                    </div>
                    <div className="text-xs font-mono text-muted-foreground/40 select-none">vs</div>
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                        <Globe size={18} className="text-secondary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60">Site B</p>
                        <p className="text-sm font-mono font-bold text-foreground truncate">{compareDomain}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="glass-terminal rounded-xl overflow-hidden" style={{ animation: "fade-up 0.4s ease-out" }}>
                  <div className="h-[2px] bg-gradient-to-r from-primary via-secondary to-accent" />
                  <div className="p-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Globe size={20} className="text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60">Signal Scan Target</p>
                      <p className="text-base font-mono font-bold text-foreground truncate">{domain}</p>
                    </div>
                    <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
                      <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                      <span className="text-[10px] font-mono text-accent uppercase tracking-wider">
                        {phase === "analyzing" ? "Analyzing" : "Complete"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {sections.map((section, i) => {
                const score = extractScore(section.title);
                return (
                  <div
                    key={i}
                    className="glass-terminal rounded-xl overflow-hidden"
                    style={{ animation: `fade-up 0.5s ease-out ${i * 0.1}s both` }}
                  >
                    <div className="h-[2px] bg-gradient-to-r from-primary via-secondary to-accent" />
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-primary">{getIconForSection(section.title)}</span>
                        <h2 className="text-lg font-mono font-bold text-foreground">
                          {section.title
                            .replace(/\s*[—–-]\s*Score[s]?[:\s].*/i, "")
                            .replace(/\s*[—–-]\s*Site A[:\s].*/i, "")
                            .trim()}
                        </h2>
                        {score && (
                          <span className="ml-auto px-3 py-1 rounded-full glass text-xs font-mono font-bold text-accent whitespace-nowrap">
                            {score}
                          </span>
                        )}
                      </div>
                      <div className="prose prose-sm prose-invert max-w-none font-mono text-muted-foreground [&_h2]:hidden [&_strong]:text-foreground [&_li]:text-muted-foreground [&_ul]:space-y-1 [&_p]:leading-relaxed">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {section.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                );
              })}


              {/* CTA */}
              {phase === "complete" && (
                <div
                  className="glass-terminal glow-border rounded-xl p-8 text-center"
                  style={{ animation: "fade-up 0.6s ease-out 0.5s both" }}
                >
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    Ready to Transform Your Website?
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-lg mx-auto mb-6">
                    Let Mitryxa build you an AI-powered decision platform that educates customers, guides choices, and generates highly qualified leads.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                      href="/argus"
                      className="btn-cta"
                    >
                      <span>Start a Project</span> <CtaChevrons />
                    </Link>
                    <button
                      onClick={handleDownloadReport}
                      className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-semibold rounded-lg border border-white/10 text-foreground hover:bg-white/5 transition-all duration-300"
                    >
                      <FileDown size={16} /> Save Report
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Fix Prompt Modal */}
        {promptOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl max-h-[80vh] flex flex-col glass-strong rounded-xl overflow-hidden shadow-2xl border border-white/10">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-primary" />
                  <span className="text-sm font-mono font-bold text-foreground">AI Fix Prompt</span>
                </div>
                <div className="flex items-center gap-2">
                  {promptContent && !promptLoading && (
                    <button
                      onClick={handleCopyPrompt}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      {promptCopied ? <Check size={12} /> : <Copy size={12} />}
                      {promptCopied ? "Copied!" : "Copy"}
                    </button>
                  )}
                  <button onClick={() => setPromptOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                    <X size={18} />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                {promptLoading && !promptContent && (
                  <div className="flex items-center gap-3 justify-center py-12">
                    <Cpu size={16} className="text-primary animate-spin" />
                    <span className="text-sm font-mono text-muted-foreground">Generating fix prompt...</span>
                  </div>
                )}
                {promptContent && (
                  <div className="prose prose-sm prose-invert max-w-none font-mono text-muted-foreground [&_strong]:text-foreground [&_li]:text-muted-foreground [&_p]:leading-relaxed">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{promptContent}</ReactMarkdown>
                  </div>
                )}
              </div>
              {promptContent && !promptLoading && (
                <div className="px-6 py-3 border-t border-white/10">
                  <p className="text-[10px] font-mono text-muted-foreground text-center">
                    Paste this into your AI builder (Lovable, Cursor, Bolt, etc.) to address the issues found in your scan.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      <ReportChatPanel
        open={chatOpen && phase === "complete"}
        onClose={() => setChatOpen(false)}
        title="Audit Consultant"
        placeholder="Ask about your report..."
        emptyText="Ask questions about your audit report. I can explain scores, suggest priorities, or clarify recommendations."
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
        toolType="audit"
        reportMarkdown={report}
        metadata={{ domain, mode }}
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


export default function Audit() {
  return (
    <Suspense fallback={null}>
      <AuditInner />
    </Suspense>
  );
}
