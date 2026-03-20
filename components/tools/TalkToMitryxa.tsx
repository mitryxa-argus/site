'use client';

import { useState } from "react";
import { X, Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface TalkToMitrxyaProps {
  open: boolean;
  onClose: () => void;
  toolType: "audit" | "estimator" | "competition" | "blueprint" | "discovery";
  reportMarkdown: string;
  metadata?: Record<string, any>;
}

const TalkToMitryxa = ({ open, onClose, toolType, reportMarkdown, metadata }: TalkToMitrxyaProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const toolLabels: Record<string, string> = {
    audit: "Site Audit",
    estimator: "Price Estimator",
    competition: "Competition Analysis",
    blueprint: "Digital Blueprint",
    discovery: "Project Discovery",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setLoading(true);
    setError("");

    try {
      // 1. Save report to tool_reports table
      const { data: reportRow, error: insertError } = await supabase
        .from("tool_reports")
        .insert({
          tool_type: toolType,
          report_markdown: reportMarkdown,
          metadata: metadata || {},
          lead_name: name.trim(),
          lead_email: email.trim(),
        })
        .select("id")
        .single();

      if (insertError || !reportRow) {
        throw new Error("Failed to save report");
      }

      const reportUrl = `${window.location.origin}/report/${reportRow.id}`;

      // 2. Send email with report link (not full report text)
      const userMessage = message.trim() || `Requesting review of my ${toolLabels[toolType]} report.`;

      const { error: emailError } = await supabase.functions.invoke("send-contact-email", {
        body: {
          name: name.trim(),
          email: email.trim(),
          company: "",
          industry: metadata?.industry || "N/A",
          projectType: toolLabels[toolType] || "Tool Report",
          message: userMessage,
          reportUrl,
        },
      });

      if (emailError) {
        throw new Error(emailError.message || "Failed to send");
      }

      setSent(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      <div
        className="relative w-full max-w-md rounded-xl border border-primary/10 p-6"
        style={{ background: "hsl(220 20% 8% / 0.98)" }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={18} />
        </button>

        {sent ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Send size={20} className="text-primary" />
            </div>
            <h3 className="text-lg font-mono font-bold text-foreground mb-2">Message Sent</h3>
            <p className="text-sm text-muted-foreground">
              We've received your report and will be in touch shortly.
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-6 py-2 text-sm font-mono rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-mono font-bold text-foreground mb-1">Talk to Mitryxa</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Send us your {toolLabels[toolType]} report and we'll review it with you.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-muted-foreground mb-1.5">Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-background/50 border border-primary/10 rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/30 transition-colors"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-muted-foreground mb-1.5">Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-background/50 border border-primary/10 rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/30 transition-colors"
                  placeholder="you@company.com"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-muted-foreground mb-1.5">Message (optional)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="w-full bg-background/50 border border-primary/10 rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/30 transition-colors resize-none"
                  placeholder="Any specific questions or context..."
                />
              </div>

              {error && (
                <p className="text-xs text-destructive font-mono">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || !name.trim() || !email.trim()}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-mono font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    Send Report to Mitryxa
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default TalkToMitryxa;
