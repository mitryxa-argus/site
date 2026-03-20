'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import SEOHead from "@/components/seo/SEOHead";
import { Check, Terminal, ChevronRight } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import NeuralNetworkBg from "@/components/contact/NeuralNetworkBg";

const industries = ["Law Firm", "Medical Clinic", "Real Estate", "Financial Advisor", "Mortgage", "Cosmetic Surgery", "Home Health Care", "Other"];
const projectTypes = ["Interactive Lead Platform", "Decision Calculator", "Educational Platform", "Lead Intelligence System", "Digital Intelligence Layer", "Other"];

interface Step {
  key: string;
  prompt: string;
  type: "text" | "email" | "select" | "textarea";
  options?: string[];
  required?: boolean;
  logSuccess: string;
}

const steps: Step[] = [
  { key: "name", prompt: "Enter your name:", type: "text", required: true, logSuccess: "[OK] Identity registered" },
  { key: "email", prompt: "Enter your email:", type: "email", required: true, logSuccess: "[OK] Comm channel established" },
  { key: "company", prompt: "Company name (optional):", type: "text", required: false, logSuccess: "[OK] Organization linked" },
  { key: "industry", prompt: "Select your industry:", type: "select", options: industries, required: false, logSuccess: "[SCAN] Industry modules loaded" },
  { key: "projectType", prompt: "Select project type:", type: "select", options: projectTypes, required: false, logSuccess: "[SCAN] Platform blueprint selected" },
  { key: "message", prompt: "Describe your project:", type: "textarea", required: true, logSuccess: "[OK] Mission parameters received" },
];

const Contact = () => {
  const ref = useScrollReveal<HTMLDivElement>();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({
    name: "", email: "", company: "", industry: "", projectType: "", message: "",
  });
  const [logs, setLogs] = useState<string[]>(["[INIT] Secure session started...", "[SYS] Awaiting operator input..."]);
  const [submitted, setSubmitted] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [typedPrompt, setTypedPrompt] = useState("");
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(null);
  

  // Typing animation for prompts
  useEffect(() => {
    if (currentStep >= steps.length || deploying || submitted) return;
    const prompt = steps[currentStep].prompt;
    setTypedPrompt("");
    let i = 0;
    const interval = setInterval(() => {
      setTypedPrompt(prompt.slice(0, i + 1));
      i++;
      if (i >= prompt.length) {
        clearInterval(interval);
        setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 100);
      }
    }, 25);
    return () => clearInterval(interval);
  }, [currentStep, deploying, submitted]);

  const addLog = useCallback((msg: string) => {
    setLogs(prev => [...prev, msg]);
  }, []);

  const keyboardMashPattern = /(asdf|adsf|qwer|zxcv|wasd|hjkl|uiop|lkj|poi|qaz|wsx|edc|rfv|tgb|yhn|ujm|ik,|mnb|bnm)/i;

  const hasLowSignalPattern = (value: string, minLength = 8) => {
    const normalized = value.toLowerCase().replace(/[^a-z]/g, "");
    if (normalized.length < minLength) return false;
    const vowels = (normalized.match(/[aeiouy]/g) ?? []).length;
    return vowels / normalized.length < 0.28;
  };

  const isValidName = (name: string): string | null => {
    const trimmed = name.trim();
    if (trimmed.length < 2) return "[ERR] Identity scan failed — name too short";
    if (trimmed.length > 80) return "[ERR] Identity scan failed — name too long";
    if (!/^[a-zA-ZÀ-ÿ\s'\-]+$/.test(trimmed)) return "[ERR] Identity scan failed — invalid characters detected";

    const normalized = trimmed.toLowerCase().replace(/[^a-zà-ÿ]/g, "");
    if (/(.)\1{2,}/i.test(normalized)) return "[ERR] Identity scan failed — repeated character pattern detected";
    if (keyboardMashPattern.test(normalized)) return "[ERR] Identity scan failed — keyboard pattern detected";
    if (!/[aeiouy]/i.test(normalized)) return "[ERR] Identity scan failed — name appears invalid";
    if (hasLowSignalPattern(normalized, 8)) return "[ERR] Identity scan failed — name appears random";

    return null;
  };

  const isValidCompany = (company: string): string | null => {
    const trimmed = company.trim();
    if (!trimmed) return null;
    if (trimmed.length > 100) return "[ERR] Organization link failed — company name too long";
    if (!/^[a-zA-Z0-9À-ÿ\s'\-.,&()]+$/.test(trimmed)) return "[ERR] Organization link failed — invalid company characters";

    const normalized = trimmed.toLowerCase().replace(/[^a-z]/g, "");
    if (normalized && keyboardMashPattern.test(normalized)) return "[ERR] Organization link failed — keyboard pattern detected";
    if (hasLowSignalPattern(normalized, 10)) return "[ERR] Organization link failed — company name appears random";

    return null;
  };

  const isValidEmail = (email: string): string | null => {
    const trimmed = email.trim().toLowerCase();
    if (!/^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/.test(trimmed)) return "[ERR] Comm channel rejected — invalid format";

    const [localPart, domain] = trimmed.split("@");
    if (!localPart || localPart.length < 2) return "[ERR] Comm channel rejected — address too short";
    if (localPart.length > 64) return "[ERR] Comm channel rejected — local part too long";

    const fakeDomains = [
      "test.com",
      "fake.com",
      "example.com",
      "invalid.com",
      "mailinator.com",
      "tempmail.com",
      "10minutemail.com",
      "yopmail.com",
      "guerrillamail.com",
    ];
    if (fakeDomains.includes(domain)) return "[ERR] Comm channel rejected — domain not recognized";

    if (keyboardMashPattern.test(localPart) || hasLowSignalPattern(localPart, 10)) {
      return "[ERR] Comm channel rejected — address appears random";
    }

    const tld = domain.split(".").pop() ?? "";
    const suspiciousTlds = new Set(["coms", "con", "cmo", "cm", "om", "comm"]);
    if (suspiciousTlds.has(tld)) return "[ERR] Comm channel rejected — domain typo detected";

    return null;
  };

  const isValidMessage = (msg: string): string | null => {
    const trimmed = msg.trim();
    if (trimmed.length < 15) return "[WARN] Mission brief too short — need more detail";
    if (trimmed.length > 2000) return "[WARN] Mission brief too long — please condense";

    const wordCount = trimmed.split(/\s+/).filter(Boolean).length;
    if (wordCount < 3) return "[WARN] Mission brief rejected — provide a fuller description";

    const normalized = trimmed.toLowerCase().replace(/[^a-z\s]/g, "");
    if (keyboardMashPattern.test(normalized) && hasLowSignalPattern(normalized, 12)) {
      return "[WARN] Mission brief rejected — content appears random";
    }

    return null;
  };

  const advanceStep = useCallback(() => {
    const step = steps[currentStep];
    const value = formData[step.key];

    if (step.required && !value.trim()) {
      addLog("[ERR] Required field — input cannot be empty");
      return;
    }

    if (step.key === "name" && value.trim()) {
      const nameErr = isValidName(value);
      if (nameErr) { addLog(nameErr); return; }
    }

    if (step.key === "email" && value.trim()) {
      const emailErr = isValidEmail(value);
      if (emailErr) { addLog(emailErr); return; }
    }

    if (step.key === "company" && value.trim()) {
      const companyErr = isValidCompany(value);
      if (companyErr) { addLog(companyErr); return; }
    }

    if (step.key === "message" && value.trim()) {
      const msgErr = isValidMessage(value);
      if (msgErr) { addLog(msgErr); return; }
    }

    addLog(step.logSuccess + (value ? ` — "${value.length > 30 ? value.slice(0, 30) + '...' : value}"` : " — skipped"));

    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  }, [currentStep, formData]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && steps[currentStep].type !== "textarea") {
      e.preventDefault();
      advanceStep();
    }
    if (e.key === "Enter" && e.metaKey && steps[currentStep].type === "textarea") {
      e.preventDefault();
      advanceStep();
    }
  };

  const handleSubmit = async () => {
    setDeploying(true);
    addLog("[SYS] Compiling project parameters...");

    await new Promise(r => setTimeout(r, 800));
    addLog("[BUILD] Encrypting transmission...");
    await new Promise(r => setTimeout(r, 600));
    addLog("[DEPLOY] Initiating secure handoff...");
    await new Promise(r => setTimeout(r, 500));

    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: formData,
      });
      if (error) throw error;

      addLog("[OK] Transmission successful — response within 24h");
      await new Promise(r => setTimeout(r, 400));
      setSubmitted(true);
      toast.success("Message sent successfully!");
    } catch (err) {
      console.error("Form submission error:", err);
      addLog("[ERR] Transmission failed — retry recommended");
      toast.error("Something went wrong. Please try again.");
      setDeploying(false);
    } finally {
      setLoading(false);
    }
  };


  const step = currentStep < steps.length ? steps[currentStep] : null;

  return (
    <>
      <SEOHead
        title="Contact Mitryxa | Start a Project"
        description="Get in touch with Mitryxa to discuss your AI decision platform project. Located in Los Angeles, California."
        canonical="https://mitryxa.com/contact"
      />

      <div ref={ref} className="pt-16">
        {/* Hero with Neural Network */}
        <section className="py-24 relative overflow-hidden">
          <NeuralNetworkBg />
          <div className="bg-gradient-hero absolute inset-0 pointer-events-none" />
          <div className="container mx-auto px-4 lg:px-8 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-6">
              <Terminal size={14} className="text-primary" />
              <span className="text-xs font-semibold uppercase tracking-widest text-primary font-mono">Secure Channel</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground"><span className="text-gradient">Initialize</span> Your Project</h1>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto font-mono text-sm">
              &gt;_ Establish a direct connection with our engineering team
            </p>
          </div>
        </section>

        {/* Terminal Form + Sidebar */}
        <section className="py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-2xl mx-auto">
              {/* Holographic Terminal Form */}
              <div className="scroll-reveal">
                {!submitted ? (
                  <div
                    className="holo-card rounded-2xl p-8 relative"
                  >
                    {/* Terminal header */}
                    <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border/50">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-destructive/60" />
                        <div className="w-3 h-3 rounded-full" style={{ background: "hsl(45 93% 47% / 0.6)" }} />
                        <div className="w-3 h-3 rounded-full bg-accent/60" />
                      </div>
                      <span className="text-xs text-muted-foreground font-mono ml-2">mitryxa://new-project</span>
                      <div className="ml-auto flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${deploying ? "bg-primary animate-deploy-pulse" : "bg-accent"}`} />
                        <span className="text-xs text-muted-foreground font-mono">
                          {deploying ? "deploying" : `step ${currentStep + 1}/${steps.length}`}
                        </span>
                      </div>
                    </div>

                    {/* Previous answers displayed */}
                    <div className="space-y-3 mb-6">
                      {steps.slice(0, currentStep).map((s, i) => (
                        <div key={s.key} className="flex items-start gap-2 text-sm font-mono">
                          <ChevronRight size={14} className="text-accent mt-0.5 shrink-0" />
                          <span className="text-muted-foreground">{s.prompt}</span>
                          <span className="text-foreground ml-1">{formData[s.key] || "(skipped)"}</span>
                        </div>
                      ))}
                    </div>

                    {/* Current prompt */}
                    {step && !deploying && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-mono">
                          <span className="text-primary animate-terminal-blink">&gt;_</span>
                          <span className="text-foreground">{typedPrompt}</span>
                          {typedPrompt.length < step.prompt.length && (
                            <span className="w-2 h-4 bg-primary/80 animate-terminal-blink" />
                          )}
                        </div>

                        {typedPrompt === step.prompt && (
                          <div className="pl-6 animate-fade-in">
                            {step.type === "select" ? (
                              <div className="space-y-1.5">
                                {step.options?.map((opt) => (
                                  <button
                                    key={opt}
                                    type="button"
                                    onClick={() => {
                                      setFormData(prev => ({ ...prev, [step.key]: opt }));
                                      setTimeout(() => advanceStep(), 150);
                                    }}
                                    className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm font-mono transition-all ${
                                      formData[step.key] === opt
                                        ? "bg-primary/15 text-primary border border-primary/30"
                                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent"
                                    }`}
                                  >
                                    <span className="text-primary/40 mr-2">›</span>
                                    {opt}
                                  </button>
                                ))}
                                {!step.required && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setFormData(prev => ({ ...prev, [step.key]: "" }));
                                      setTimeout(() => advanceStep(), 150);
                                    }}
                                    className="block w-full text-left px-4 py-2 rounded-lg text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
                                  >
                                    <span className="text-primary/40 mr-2">›</span>
                                    Skip
                                  </button>
                                )}
                              </div>
                            ) : step.type === "textarea" ? (
                              <div>
                                <textarea
                                  ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                                  value={formData[step.key]}
                                  onChange={e => setFormData(prev => ({ ...prev, [step.key]: e.target.value }))}
                                  onKeyDown={handleKeyDown}
                                  rows={4}
                                  placeholder="Type your message..."
                                  className="w-full bg-muted/30 border border-primary/10 rounded-lg px-4 py-3 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/30 focus:ring-1 focus:ring-primary/20 resize-none"
                                />
                                <div className="flex items-center justify-between mt-3">
                                  <span className="text-xs text-muted-foreground font-mono">⌘+Enter to submit</span>
                                  <button
                                    type="button"
                                    onClick={advanceStep}
                                    className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-mono font-semibold hover:shadow-[0_0_25px_hsl(217_91%_60%/0.35)] transition-all"
                                  >
                                    &gt;_ Deploy
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-3">
                                <input
                                  ref={inputRef as React.RefObject<HTMLInputElement>}
                                  type={step.type}
                                  value={formData[step.key]}
                                  onChange={e => setFormData(prev => ({ ...prev, [step.key]: e.target.value }))}
                                  onKeyDown={handleKeyDown}
                                  placeholder={step.required ? "Required" : "Optional — press Enter to skip"}
                                  className="flex-1 bg-muted/30 border border-primary/10 rounded-lg px-4 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/30 focus:ring-1 focus:ring-primary/20"
                                />
                                <button
                                  type="button"
                                  onClick={advanceStep}
                                  className="px-4 py-2.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm font-mono hover:bg-primary/20 transition-colors"
                                >
                                  Enter ↵
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Deploying state */}
                    {deploying && !submitted && (
                      <div className="py-8 text-center space-y-4 animate-fade-in">
                        <div className="w-12 h-12 rounded-full border-2 border-primary/30 border-t-primary mx-auto animate-spin" />
                        <p className="text-sm font-mono text-primary">Deploying transmission...</p>
                      </div>
                    )}

                    {/* Progress bar + System Log */}
                    <div className="mt-8 pt-4 border-t border-border/30 space-y-3">
                      <div className="flex gap-1">
                        {steps.map((_, i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                              i < currentStep
                                ? "bg-accent"
                                : i === currentStep
                                ? "bg-primary"
                                : "bg-muted"
                            }`}
                          />
                        ))}
                      </div>
                      {/* Inline System Log */}
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className="text-[10px] text-muted-foreground/50 font-mono uppercase tracking-wider shrink-0">log</span>
                        <p className="text-[11px] font-mono truncate text-muted-foreground">
                          {logs[logs.length - 1]}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="holo-card rounded-2xl p-16 text-center animate-fade-in">
                    <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4 glow-cyan">
                      <Check size={28} className="text-accent" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground font-mono">&gt;_ Transmission Complete</h3>
                    <p className="text-sm text-muted-foreground mt-2 font-mono">Expect a response within 24 hours.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Contact;
