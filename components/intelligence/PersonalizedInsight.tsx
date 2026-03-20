'use client';

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import CtaChevrons from "@/components/ui/CtaChevrons";
import { RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const PersonalizedInsight = () => {
  const [description, setDescription] = useState("");
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (description.trim().length < 5) {
      toast.error("Please tell us a bit more about what you do.");
      return;
    }

    setLoading(true);
    setInsight("");

    try {
      const { data, error } = await supabase.functions.invoke("intelligence-personalize", {
        body: { description: description.trim() },
      });

      if (error) throw error;

      if (data?.error) {
        toast.error(data.error);
      } else if (data?.insight) {
        setInsight(data.insight);
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setInsight("");
    setDescription("");
  };

  return (
    <div className="glass-terminal rounded-2xl p-8 md:p-10 relative overflow-hidden max-w-3xl mx-auto">
      <div className="tilt-gradient-line" />

      {!insight ? (
        <>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell us what you do — e.g., 'I'm a personal injury attorney in Los Angeles' or 'I run a family dental practice with 3 locations'"
            className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground/60 min-h-[100px] text-sm resize-none focus:border-primary/40"
            maxLength={500}
            disabled={loading}
          />

          <button
            onClick={handleSubmit}
            disabled={loading || description.trim().length < 5}
            className="btn-cta mt-5 w-full sm:w-auto disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="inline-flex gap-[3px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse [animation-delay:300ms]" />
                </span>
                Analyzing your business…
              </span>
            ) : (
              <>
                <span>&gt;_ Show Me</span> <CtaChevrons />
              </>
            )}
          </button>
        </>
      ) : (
        <>
          <div className="border border-border/40 rounded-xl bg-background/30 p-6">
            {insight.split("\n\n").map((para, i) => (
              <p key={i} className={`text-sm text-muted-foreground leading-relaxed ${i > 0 ? "mt-4" : ""}`}>
                {para}
              </p>
            ))}
          </div>

          <button
            onClick={reset}
            className="mt-5 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-mono"
          >
            <RotateCcw size={14} />
            Try Another
          </button>
        </>
      )}
    </div>
  );
};

export default PersonalizedInsight;
