'use client';

import { useState } from "react";
import { ArrowLeft, Check, Send, Loader2 } from "lucide-react";
import CtaChevrons from "@/components/ui/CtaChevrons";
import { toast } from "sonner";

const industries = [
  "Law Firm", "Medical Clinic", "Real Estate", "Financial Advisor",
  "Mortgage", "Cosmetic Surgery", "Home Health Care", "Other Professional Service",
];

const goals = [
  "Generate more leads", "Educate potential clients",
  "Reduce unqualified inquiries", "Automate intake",
];

const platformRecommendations: Record<string, { type: string; description: string }> = {
  "Generate more leads": { type: "Interactive Lead Platform", description: "A guided experience that qualifies and captures leads through intelligent question flows." },
  "Educate potential clients": { type: "Educational Client Platform", description: "An interactive system that explains complex services and builds client understanding before consultation." },
  "Reduce unqualified inquiries": { type: "Decision Tool Platform", description: "A structured assessment that filters prospects and routes qualified leads to your team." },
  "Automate intake": { type: "Interactive Lead Platform", description: "An automated intake system that gathers detailed prospect information through guided flows." },
};

const ProjectNavigator = () => {
  const [step, setStep] = useState(0);
  const [industry, setIndustry] = useState("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [website, setWebsite] = useState({ has: "", generates: "", educates: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const toggleGoal = (g: string) =>
    setSelectedGoals((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));

  const recommendation = platformRecommendations[selectedGoals[0] || "Generate more leads"];

  const canNext =
    (step === 0 && industry) ||
    (step === 1 && selectedGoals.length > 0) ||
    (step === 2 && website.has) ||
    step === 3 ||
    step === 4;

  const canSubmit = name.trim().length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async () => {
    if (!canSubmit) {
      toast.error("Please enter your name and a valid email address.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/save-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          industry,
          source: "Project Navigator",
          projectType: recommendation.type,
          notes: `Goals: ${selectedGoals.join(", ")}\nRecommended: ${recommendation.type}\nWebsite: has=${website.has}, generates=${website.generates}, educates=${website.educates}`,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
      toast.success("Consultation request sent!");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-terminal rounded-2xl p-6 sm:p-10 max-w-3xl mx-auto relative overflow-hidden">
      <div className="tilt-gradient-line" />
      <div className="absolute inset-0 animate-scanline pointer-events-none" />

      {/* Progress */}
      <div className="flex gap-1 mb-8 relative z-10">
        {[0, 1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full transition-all duration-500 ${s <= step ? "" : "bg-muted"}`}
            style={s <= step ? {
              background: 'linear-gradient(90deg, hsl(186 100% 42%), hsl(217 91% 60%), hsl(263 70% 50%), hsl(186 100% 42%))',
              backgroundSize: '400% 100%',
            } : undefined}
          />
        ))}
      </div>

      {/* Step 0 */}
      {step === 0 && (
        <div className="animate-fade-in relative z-10">
          <h3 className="text-xl font-bold text-foreground mb-2 font-mono"><span className="text-primary/50">&gt;_</span> Select Your Industry</h3>
          <p className="text-sm text-muted-foreground mb-6">Help us understand your business category.</p>
          <div className="grid grid-cols-2 gap-3">
            {industries.map((ind) => (
              <button key={ind} onClick={() => setIndustry(ind)}
                className={`p-4 rounded-xl text-sm font-medium text-left transition-all duration-200 border font-mono ${industry === ind ? "border-primary bg-primary/10 text-foreground shadow-[0_0_15px_hsl(217_91%_60%/0.2)]" : "border-primary/10 bg-background/30 text-muted-foreground hover:border-primary/30 hover:bg-background/50"}`}>
                {ind}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 1 */}
      {step === 1 && (
        <div className="animate-fade-in relative z-10">
          <h3 className="text-xl font-bold text-foreground mb-2 font-mono"><span className="text-primary/50">&gt;_</span> What Are Your Goals?</h3>
          <p className="text-sm text-muted-foreground mb-6">Select all that apply.</p>
          <div className="flex flex-wrap gap-3">
            {goals.map((g) => (
              <button key={g} onClick={() => toggleGoal(g)}
                className={`px-5 py-3 rounded-full text-sm font-medium transition-all duration-200 border font-mono ${selectedGoals.includes(g) ? "border-secondary bg-secondary/15 text-foreground shadow-[0_0_15px_hsl(263_70%_50%/0.2)]" : "border-primary/10 bg-background/30 text-muted-foreground hover:border-primary/30"}`}>
                {selectedGoals.includes(g) && <Check size={14} className="inline mr-1.5" />}{g}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="animate-fade-in relative z-10">
          <h3 className="text-xl font-bold text-foreground mb-2 font-mono"><span className="text-primary/50">&gt;_</span> Website Evaluation</h3>
          <p className="text-sm text-muted-foreground mb-6">Tell us about your current digital presence.</p>
          <div className="space-y-4">
            {[
              { key: "has" as const, q: "Do you have a current website?" },
              { key: "generates" as const, q: "Does it generate leads?" },
              { key: "educates" as const, q: "Does it educate clients effectively?" },
            ].map(({ key, q }) => (
              <div key={key} className="glass-terminal rounded-xl p-4 relative overflow-hidden">
                <div className="tilt-gradient-line" />
                <p className="text-sm text-foreground mb-3 font-mono">{q}</p>
                <div className="flex gap-3">
                  {["Yes", "No", "Not sure"].map((opt) => (
                    <button key={opt} onClick={() => setWebsite((prev) => ({ ...prev, [key]: opt }))}
                      className={`px-4 py-2 rounded-lg text-xs font-medium transition-all border font-mono ${website[key] === opt ? "border-accent bg-accent/10 text-foreground shadow-[0_0_15px_hsl(186_100%_42%/0.2)]" : "border-primary/10 bg-background/30 text-muted-foreground hover:border-primary/30"}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="animate-fade-in text-center relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_hsl(217_91%_60%/0.2)]">
            <Check size={28} className="text-primary" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2 font-mono"><span className="text-primary/50">&gt;_</span> Recommended Platform</h3>
          <p className="text-2xl font-bold text-gradient mt-4 font-mono">{recommendation.type}</p>
          <p className="text-sm text-muted-foreground mt-4 max-w-md mx-auto">{recommendation.description}</p>
        </div>
      )}

      {/* Step 4 */}
      {step === 4 && !submitted && (
        <div className="animate-fade-in relative z-10">
          <h3 className="text-xl font-bold text-foreground mb-6 font-mono"><span className="text-primary/50">&gt;_</span> Request a Consultation</h3>
          <div className="space-y-4">
            <div className="glass-terminal rounded-xl p-4 relative overflow-hidden">
              <div className="tilt-gradient-line" />
              <p className="text-xs text-muted-foreground font-mono mb-3">&gt;_ Recommendation: <span className="text-primary">{recommendation.type}</span></p>
              <p className="text-xs text-muted-foreground font-mono">Industry: <span className="text-foreground">{industry}</span></p>
            </div>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name *"
              className="w-full bg-background/40 border border-primary/20 rounded-xl px-4 py-3 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:bg-background/60 transition-all" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address *" type="email"
              className="w-full bg-background/40 border border-primary/20 rounded-xl px-4 py-3 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:bg-background/60 transition-all" />
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone (optional)"
              className="w-full bg-background/40 border border-primary/20 rounded-xl px-4 py-3 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:bg-background/60 transition-all" />
          </div>
        </div>
      )}

      {submitted && (
        <div className="animate-fade-in text-center py-10 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_hsl(186_100%_42%/0.2)]">
            <Check size={28} className="text-accent" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2 font-mono">Request Received</h3>
          <p className="text-sm text-muted-foreground">We&apos;ll reach out within 24 hours to discuss your platform.</p>
        </div>
      )}

      {/* Nav */}
      {!submitted && (
        <div className="flex justify-between items-center mt-8 relative z-10">
          <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 font-mono">
            <ArrowLeft size={16} /> Back
          </button>
          {step < 4 ? (
            <button onClick={() => setStep((s) => s + 1)} disabled={!canNext}
              className="btn-cta disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2">
              <span>&gt;_ Continue</span><CtaChevrons />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={!canSubmit || loading}
              className="btn-cta disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              <span>{loading ? "Sending..." : "Submit"}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectNavigator;
