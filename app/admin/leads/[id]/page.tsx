'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from 'next/navigation';
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Loader2, Globe, MessageSquare, Search, FileText, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import PricingIntel from "@/components/admin/PricingIntel";

const STATUS_OPTIONS = ["new", "contacted", "proposal_sent", "won", "lost"] as const;
const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-400",
  contacted: "bg-yellow-500/10 text-yellow-400",
  proposal_sent: "bg-purple-500/10 text-purple-400",
  won: "bg-green-500/10 text-green-400",
  lost: "bg-red-500/10 text-red-400",
};

const LeadDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [leadStatus, setLeadStatus] = useState<any>(null);
  const [report, setReport] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<string>("new");
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "conversation" | "research" | "report" | "pricing">("pricing");

  useEffect(() => {
    (async () => {
      const { data: { session: authSession } } = await supabase.auth.getSession();
      if (!authSession) { router.push("/mx-control/login"); return; }
      const { data: isAdmin } = await supabase.rpc("has_role", {
        _user_id: authSession.user.id,
        _role: "admin",
      } as any);
      if (!isAdmin) { router.push("/mx-control/login"); return; }
      setAuthenticated(true);

      if (!id) { setLoading(false); return; }
      const { data: sess } = await (supabase.from("discovery_sessions") as any)
        .select("*")
        .eq("id", id)
        .maybeSingle();
      setSession(sess);

      const { data: ls } = await (supabase.from("admin_lead_status") as any)
        .select("*")
        .eq("session_id", id)
        .maybeSingle();
      if (ls) {
        setLeadStatus(ls);
        setStatus(ls.status);
        setNotes(ls.notes || "");
      }

      if (sess?.report_id) {
        const { data: rpt } = await supabase.from("tool_reports")
          .select("report_markdown")
          .eq("id", sess.report_id)
          .maybeSingle();
        if (rpt) setReport(rpt.report_markdown);
      }

      setLoading(false);
    })();
  }, [id, router]);

  if (!authenticated && !loading) return null;

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    const payload = { session_id: id, status, notes, updated_at: new Date().toISOString() };
    if (leadStatus) {
      await (supabase.from("admin_lead_status") as any).update(payload).eq("id", leadStatus.id);
    } else {
      await (supabase.from("admin_lead_status") as any).insert(payload);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <p className="text-muted-foreground font-mono">Session not found</p>
      </div>
    );
  }

  const sel = session.selections || {};
  const convo = (session.conversation || []) as { role: string; content: string }[];
  const research = session.research_snapshot;

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
        <Button variant="ghost" size="sm" className="mb-4 font-mono text-xs" onClick={() => router.push("/mx-control")}>
          <ArrowLeft className="w-3 h-3 mr-1" /> Back to Leads
        </Button>

        {/* Header */}
        <div className="glass-terminal rounded-xl overflow-hidden mb-6">
          <div className="h-[2px] bg-gradient-to-r from-primary to-accent" />
          <div className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-xl font-mono font-bold text-foreground">{sel.businessName || sel.leadName || "Unknown Lead"}</h1>
                <p className="text-sm text-muted-foreground font-mono">{sel.industry || "Unknown industry"} • {sel.geography || "N/A"}</p>
              </div>
              <div className="flex items-center gap-3">
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-[160px] font-mono text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map(s => (
                      <SelectItem key={s} value={s} className="font-mono text-xs">{s.replace("_", " ")}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button size="sm" onClick={handleSave} disabled={saving} className="font-mono text-xs">
                  {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : "Save"}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              {[
                { label: "Category", value: sel.projectCategory?.replace(/_/g, " ") || "N/A" },
                { label: "Budget", value: sel.budgetRange || "N/A" },
                { label: "Timeline", value: sel.timeline || "N/A" },
                { label: "Phase", value: session.phase },
              ].map(({ label, value }) => (
                <div key={label} className="bg-background/50 rounded-lg p-2.5">
                  <p className="text-[10px] text-muted-foreground/60 font-mono uppercase">{label}</p>
                  <p className="text-xs font-mono text-foreground capitalize">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <label className="text-xs font-mono text-muted-foreground mb-1 block">Notes</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Internal notes..."
                className="font-mono text-xs min-h-[60px]"
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {[
            { key: "pricing", label: "Pricing Intel", icon: <DollarSign className="w-3 h-3" /> },
            { key: "overview", label: "Overview", icon: <Globe className="w-3 h-3" /> },
            { key: "conversation", label: "Conversation", icon: <MessageSquare className="w-3 h-3" /> },
            { key: "research", label: "Research", icon: <Search className="w-3 h-3" /> },
            { key: "report", label: "Report", icon: <FileText className="w-3 h-3" /> },
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg border transition-all ${
                activeTab === key
                  ? "border-primary/50 text-primary bg-primary/10"
                  : "border-primary/10 text-muted-foreground hover:text-foreground"
              }`}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="glass-terminal rounded-xl overflow-hidden">
          <div className="h-[2px] bg-gradient-to-r from-primary to-accent" />
          <div className="p-5 max-h-[60vh] overflow-y-auto">
            {activeTab === "pricing" && (
              <PricingIntel pricingResult={session.pricing_result} selections={sel} />
            )}

            {activeTab === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                {Object.entries(sel).filter(([, v]) => v && (!Array.isArray(v) || v.length > 0)).map(([k, v]) => (
                  <div key={k} className="bg-background/30 rounded-lg p-2.5">
                    <p className="text-[10px] text-muted-foreground/60 uppercase">{k.replace(/([A-Z])/g, " $1")}</p>
                    <p className="text-foreground">{Array.isArray(v) ? (v as string[]).join(", ") : String(v)}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "conversation" && (
              <div className="space-y-3">
                {convo.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-lg px-3 py-2 text-xs font-mono ${
                      msg.role === "user" ? "bg-primary/10 text-foreground" : "bg-secondary/5 text-muted-foreground"
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {convo.length === 0 && <p className="text-muted-foreground text-xs font-mono">No conversation data</p>}
              </div>
            )}

            {activeTab === "research" && (
              <div className="text-xs font-mono">
                {research ? (
                  <pre className="whitespace-pre-wrap text-muted-foreground overflow-auto">
                    {JSON.stringify(research, null, 2)}
                  </pre>
                ) : (
                  <p className="text-muted-foreground">No research data available</p>
                )}
              </div>
            )}

            {activeTab === "report" && (
              <div>
                {report ? (
                  <div className="prose prose-sm prose-invert max-w-none text-muted-foreground [&_strong]:text-foreground">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{report}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-xs font-mono text-muted-foreground">No report generated yet</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetail;
