'use client';

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ExternalLink } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const STATUS_OPTIONS = ["all", "new", "contacted", "proposal_sent", "won", "lost"] as const;
const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  contacted: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  proposal_sent: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  won: "bg-green-500/10 text-green-400 border-green-500/20",
  lost: "bg-red-500/10 text-red-400 border-red-500/20",
};

type Lead = {
  id: string;
  session_key: string;
  lead_name: string | null;
  lead_email: string | null;
  selections: any;
  phase: string;
  report_id: string | null;
  created_at: string;
  updated_at: string;
  status?: string;
  ls_id?: string;
};

const LeadsTable = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const router = useRouter();

  useEffect(() => {
    loadLeads();
  }, [statusFilter]);

  const loadLeads = async () => {
    setLoading(true);

    // Fetch sessions
    const { data: sessions } = await (supabase.from("discovery_sessions") as any)
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(200);

    if (!sessions) { setLoading(false); return; }

    // Fetch lead statuses
    const sessionIds = sessions.map((s: any) => s.id);
    const { data: statuses } = await (supabase.from("admin_lead_status") as any)
      .select("*")
      .in("session_id", sessionIds);

    const statusMap = new Map<string, any>();
    (statuses || []).forEach((s: any) => statusMap.set(s.session_id, s));

    const enriched: Lead[] = sessions.map((s: any) => ({
      ...s,
      status: statusMap.get(s.id)?.status || "new",
      ls_id: statusMap.get(s.id)?.id,
    }));

    const filtered = statusFilter === "all"
      ? enriched
      : enriched.filter(l => l.status === statusFilter);

    setLeads(filtered);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-mono text-muted-foreground">{leads.length} leads</p>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px] font-mono text-xs">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map(s => (
              <SelectItem key={s} value={s} className="font-mono text-xs capitalize">{s.replace("_", " ")}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="glass-terminal rounded-xl overflow-hidden">
        <div className="h-[2px] bg-gradient-to-r from-primary to-accent" />
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-primary/10 text-muted-foreground/60">
                <th className="text-left p-3 uppercase tracking-wider">Business</th>
                <th className="text-left p-3 uppercase tracking-wider">Industry</th>
                <th className="text-left p-3 uppercase tracking-wider">Category</th>
                <th className="text-left p-3 uppercase tracking-wider">Status</th>
                <th className="text-left p-3 uppercase tracking-wider">Phase</th>
                <th className="text-left p-3 uppercase tracking-wider">Date</th>
                <th className="text-left p-3 uppercase tracking-wider">Report</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => router.push(`/mx-control/lead/${lead.id}`)}
                  className="border-b border-primary/5 hover:bg-primary/5 cursor-pointer transition-colors"
                >
                  <td className="p-3">
                    <div>
                      <p className="text-foreground">{lead.selections?.businessName || lead.lead_name || "—"}</p>
                      {lead.lead_email && <p className="text-muted-foreground/50 text-[10px]">{lead.lead_email}</p>}
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground">{lead.selections?.industry || "—"}</td>
                  <td className="p-3 text-muted-foreground capitalize">{lead.selections?.projectCategory?.replace(/_/g, " ") || "—"}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] border ${STATUS_COLORS[lead.status || "new"] || ""}`}>
                      {(lead.status || "new").replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground capitalize">{lead.phase}</td>
                  <td className="p-3 text-muted-foreground">{new Date(lead.created_at).toLocaleDateString()}</td>
                  <td className="p-3">
                    {lead.report_id ? (
                      <a
                        href={`/report/${lead.report_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-primary hover:underline inline-flex items-center gap-1"
                      >
                        View <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    ) : (
                      <span className="text-muted-foreground/40">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">No leads found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeadsTable;
