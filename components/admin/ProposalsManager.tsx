'use client';

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Plus, ExternalLink, Copy, Trash2, Edit2, Check, X,
  Loader2, FileText, ChevronDown, ChevronUp,
} from "lucide-react";
import { toast } from "sonner";

interface ProposalSection {
  title: string;
  price: string;
  frequency: string;
  items: string[];
  description?: string;
  note?: string;
  optional: boolean;
}

interface ProposalData {
  greeting: string;
  demo_url?: string;
  scope_url?: string;
  sections: ProposalSection[];
  closing: string;
  sender_name: string;
  sender_url: string;
}

interface Proposal {
  id: string;
  client_name: string;
  business_name: string | null;
  subject: string;
  slug: string;
  status: "draft" | "sent" | "accepted" | "declined";
  proposal_data: ProposalData;
  created_at: string | null;
  expires_at: string | null;
}

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  sent: "bg-primary/20 text-primary",
  accepted: "bg-green-500/20 text-green-400",
  declined: "bg-destructive/20 text-destructive",
};

const EMPTY_SECTION: ProposalSection = {
  title: "",
  price: "",
  frequency: "one-time",
  items: [""],
  description: "",
  note: "",
  optional: false,
};

const EMPTY_PROPOSAL_DATA: ProposalData = {
  greeting: "",
  demo_url: "",
  scope_url: "",
  sections: [{ ...EMPTY_SECTION }],
  closing: "",
  sender_name: "Mitryxa",
  sender_url: "https://mitryxa.com",
};

const ProposalsManager = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    client_name: "",
    business_name: "",
    subject: "",
    slug: "",
    status: "draft" as Proposal["status"],
    expires_at: "",
    proposal_data: { ...EMPTY_PROPOSAL_DATA },
  });

  const fetchProposals = useCallback(async () => {
    const { data, error } = await supabase
      .from("proposals")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) { toast.error("Failed to load proposals"); return; }
    setProposals((data as unknown as Proposal[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchProposals(); }, [fetchProposals]);

  const resetForm = () => {
    setForm({
      client_name: "",
      business_name: "",
      subject: "",
      slug: "",
      status: "draft",
      expires_at: "",
      proposal_data: { ...EMPTY_PROPOSAL_DATA, sections: [{ ...EMPTY_SECTION }] },
    });
  };

  const startCreate = () => {
    resetForm();
    setCreating(true);
    setEditingId(null);
  };

  const startEdit = (p: Proposal) => {
    setForm({
      client_name: p.client_name,
      business_name: p.business_name || "",
      subject: p.subject,
      slug: p.slug,
      status: p.status,
      expires_at: p.expires_at ? p.expires_at.slice(0, 10) : "",
      proposal_data: p.proposal_data,
    });
    setEditingId(p.id);
    setCreating(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setCreating(false);
    resetForm();
  };

  const autoSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleSave = async () => {
    if (!form.client_name || !form.subject || !form.slug) {
      toast.error("Client name, subject, and slug are required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        client_name: form.client_name,
        business_name: form.business_name || null,
        subject: form.subject,
        slug: form.slug,
        status: form.status,
        expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
        proposal_data: form.proposal_data as any,
      };

      if (editingId) {
        const { error } = await supabase.from("proposals").update(payload).eq("id", editingId);
        if (error) throw error;
        toast.success("Proposal updated");
      } else {
        const { error } = await supabase.from("proposals").insert(payload);
        if (error) throw error;
        toast.success("Proposal created");
      }
      cancelEdit();
      fetchProposals();
    } catch (err: any) {
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this proposal?")) return;
    const { error } = await supabase.from("proposals").delete().eq("id", id);
    if (error) { toast.error("Delete failed"); return; }
    toast.success("Proposal deleted");
    fetchProposals();
  };

  const copyLink = (slug: string) => {
    navigator.clipboard.writeText(`https://mitryxa.com/proposal/${slug}`);
    toast.success("Link copied!");
  };

  // Section helpers
  const updateSection = (idx: number, field: keyof ProposalSection, value: any) => {
    const sections = [...form.proposal_data.sections];
    sections[idx] = { ...sections[idx], [field]: value };
    setForm(f => ({ ...f, proposal_data: { ...f.proposal_data, sections } }));
  };

  const addSection = () => {
    setForm(f => ({
      ...f,
      proposal_data: {
        ...f.proposal_data,
        sections: [...f.proposal_data.sections, { ...EMPTY_SECTION, items: [""] }],
      },
    }));
  };

  const removeSection = (idx: number) => {
    setForm(f => ({
      ...f,
      proposal_data: {
        ...f.proposal_data,
        sections: f.proposal_data.sections.filter((_, i) => i !== idx),
      },
    }));
  };

  const updateSectionItem = (sIdx: number, iIdx: number, val: string) => {
    const sections = [...form.proposal_data.sections];
    const items = [...sections[sIdx].items];
    items[iIdx] = val;
    sections[sIdx] = { ...sections[sIdx], items };
    setForm(f => ({ ...f, proposal_data: { ...f.proposal_data, sections } }));
  };

  const addSectionItem = (sIdx: number) => {
    const sections = [...form.proposal_data.sections];
    sections[sIdx] = { ...sections[sIdx], items: [...sections[sIdx].items, ""] };
    setForm(f => ({ ...f, proposal_data: { ...f.proposal_data, sections } }));
  };

  const removeSectionItem = (sIdx: number, iIdx: number) => {
    const sections = [...form.proposal_data.sections];
    sections[sIdx] = { ...sections[sIdx], items: sections[sIdx].items.filter((_, i) => i !== iIdx) };
    setForm(f => ({ ...f, proposal_data: { ...f.proposal_data, sections } }));
  };

  const isEditing = creating || editingId;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-mono font-bold text-foreground">Client Proposals</h2>
          <p className="text-xs text-muted-foreground font-mono mt-1">{proposals.length} proposal{proposals.length !== 1 ? "s" : ""}</p>
        </div>
        {!isEditing && (
          <Button onClick={startCreate} size="sm" className="font-mono text-xs gap-1.5">
            <Plus className="w-3 h-3" /> New Proposal
          </Button>
        )}
      </div>

      {/* Editor */}
      {isEditing && (
        <div className="border border-primary/10 rounded-lg p-5 space-y-5 bg-card/50">
          <h3 className="text-sm font-mono font-bold text-foreground">
            {creating ? "New Proposal" : "Edit Proposal"}
          </h3>

          {/* Basic fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Client Name *</label>
              <Input value={form.client_name} onChange={e => {
                setForm(f => ({ ...f, client_name: e.target.value, slug: creating ? autoSlug(e.target.value) : f.slug }));
              }} className="mt-1 font-mono text-sm" />
            </div>
            <div>
              <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Business Name</label>
              <Input value={form.business_name} onChange={e => setForm(f => ({ ...f, business_name: e.target.value }))} className="mt-1 font-mono text-sm" />
            </div>
            <div>
              <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Subject *</label>
              <Input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="Website + Growth Package" className="mt-1 font-mono text-sm" />
            </div>
            <div>
              <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Slug *</label>
              <Input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="client-name" className="mt-1 font-mono text-sm" />
            </div>
            <div>
              <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as any }))}
                className="mt-1 w-full rounded-md border border-primary/10 bg-background px-3 py-2 text-sm font-mono text-foreground">
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="accepted">Accepted</option>
                <option value="declined">Declined</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Expires</label>
              <Input type="date" value={form.expires_at} onChange={e => setForm(f => ({ ...f, expires_at: e.target.value }))} className="mt-1 font-mono text-sm" />
            </div>
          </div>

          {/* Proposal content */}
          <div className="space-y-3">
            <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Greeting</label>
            <Textarea value={form.proposal_data.greeting} onChange={e => setForm(f => ({ ...f, proposal_data: { ...f.proposal_data, greeting: e.target.value } }))}
              placeholder="Hi [Name], thanks for meeting with us..." className="font-mono text-sm" rows={2} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Demo URL</label>
              <Input value={form.proposal_data.demo_url || ""} onChange={e => setForm(f => ({ ...f, proposal_data: { ...f.proposal_data, demo_url: e.target.value } }))}
                placeholder="https://..." className="mt-1 font-mono text-sm" />
            </div>
            <div>
              <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Scope URL</label>
              <Input value={form.proposal_data.scope_url || ""} onChange={e => setForm(f => ({ ...f, proposal_data: { ...f.proposal_data, scope_url: e.target.value } }))}
                placeholder="https://..." className="mt-1 font-mono text-sm" />
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Sections</label>
              <Button variant="outline" size="sm" onClick={addSection} className="font-mono text-xs gap-1">
                <Plus className="w-3 h-3" /> Add Section
              </Button>
            </div>

            {form.proposal_data.sections.map((section, sIdx) => (
              <div key={sIdx} className="border border-primary/5 rounded-lg p-4 space-y-3 bg-background/50">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-foreground">Section {sIdx + 1}</span>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
                      <input type="checkbox" checked={section.optional} onChange={e => updateSection(sIdx, "optional", e.target.checked)} className="rounded" />
                      Optional
                    </label>
                    {form.proposal_data.sections.length > 1 && (
                      <button onClick={() => removeSection(sIdx)} className="text-destructive/60 hover:text-destructive">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Input value={section.title} onChange={e => updateSection(sIdx, "title", e.target.value)} placeholder="Section title" className="font-mono text-sm" />
                  <Input value={section.price} onChange={e => updateSection(sIdx, "price", e.target.value)} placeholder="$2,500" className="font-mono text-sm" />
                  <Input value={section.frequency} onChange={e => updateSection(sIdx, "frequency", e.target.value)} placeholder="one-time / /mo" className="font-mono text-sm" />
                </div>

                <Textarea value={section.description || ""} onChange={e => updateSection(sIdx, "description", e.target.value)} placeholder="Description..." className="font-mono text-sm" rows={1} />

                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-muted-foreground">Line items</span>
                  {section.items.map((item, iIdx) => (
                    <div key={iIdx} className="flex gap-1.5">
                      <Input value={item} onChange={e => updateSectionItem(sIdx, iIdx, e.target.value)} placeholder="Feature or deliverable..." className="font-mono text-sm" />
                      {section.items.length > 1 && (
                        <button onClick={() => removeSectionItem(sIdx, iIdx)} className="px-2 text-destructive/60 hover:text-destructive">
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                  <Button variant="ghost" size="sm" onClick={() => addSectionItem(sIdx)} className="font-mono text-[10px] gap-1 h-7">
                    <Plus className="w-2.5 h-2.5" /> Add Item
                  </Button>
                </div>

                <Input value={section.note || ""} onChange={e => updateSection(sIdx, "note", e.target.value)} placeholder="Note (optional)..." className="font-mono text-sm" />
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Closing Statement</label>
            <Textarea value={form.proposal_data.closing} onChange={e => setForm(f => ({ ...f, proposal_data: { ...f.proposal_data, closing: e.target.value } }))}
              placeholder="We're excited to partner with you..." className="font-mono text-sm" rows={2} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Sender Name</label>
              <Input value={form.proposal_data.sender_name} onChange={e => setForm(f => ({ ...f, proposal_data: { ...f.proposal_data, sender_name: e.target.value } }))}
                className="mt-1 font-mono text-sm" />
            </div>
            <div>
              <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Sender URL</label>
              <Input value={form.proposal_data.sender_url} onChange={e => setForm(f => ({ ...f, proposal_data: { ...f.proposal_data, sender_url: e.target.value } }))}
                className="mt-1 font-mono text-sm" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <Button onClick={handleSave} disabled={saving} size="sm" className="font-mono text-xs gap-1.5">
              {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
              {editingId ? "Update" : "Create"}
            </Button>
            <Button variant="ghost" size="sm" onClick={cancelEdit} className="font-mono text-xs gap-1.5">
              <X className="w-3 h-3" /> Cancel
            </Button>
          </div>
        </div>
      )}

      {/* List */}
      {proposals.length === 0 && !isEditing ? (
        <div className="text-center py-12 text-muted-foreground font-mono text-sm">
          No proposals yet. Create your first one.
        </div>
      ) : (
        <div className="space-y-2">
          {proposals.map(p => (
            <div key={p.id} className="border border-primary/10 rounded-lg bg-card/30 overflow-hidden">
              {/* Row */}
              <div className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-primary/5 transition-colors"
                onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}>
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="w-4 h-4 text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-mono font-semibold text-foreground truncate">{p.client_name}</p>
                    <p className="text-[10px] font-mono text-muted-foreground truncate">{p.subject}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Badge className={`${STATUS_COLORS[p.status]} text-[10px] font-mono border-0`}>{p.status}</Badge>
                  <span className="text-[10px] font-mono text-muted-foreground hidden sm:inline">
                    {p.created_at ? new Date(p.created_at).toLocaleDateString() : "—"}
                  </span>
                  {expandedId === p.id ? <ChevronUp className="w-3 h-3 text-muted-foreground" /> : <ChevronDown className="w-3 h-3 text-muted-foreground" />}
                </div>
              </div>

              {/* Expanded */}
              {expandedId === p.id && (
                <div className="px-4 pb-3 pt-1 border-t border-primary/5 space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px] font-mono">
                    <div>
                      <span className="text-muted-foreground">Business:</span>
                      <span className="ml-1 text-foreground">{p.business_name || "—"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Slug:</span>
                      <span className="ml-1 text-foreground">/proposal/{p.slug}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Sections:</span>
                      <span className="ml-1 text-foreground">{p.proposal_data?.sections?.length || 0}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Expires:</span>
                      <span className="ml-1 text-foreground">{p.expires_at ? new Date(p.expires_at).toLocaleDateString() : "Never"}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => startEdit(p)} className="font-mono text-[10px] gap-1 h-7">
                      <Edit2 className="w-3 h-3" /> Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => copyLink(p.slug)} className="font-mono text-[10px] gap-1 h-7">
                      <Copy className="w-3 h-3" /> Copy Link
                    </Button>
                    <a href={`/proposal/${p.slug}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="font-mono text-[10px] gap-1 h-7">
                        <ExternalLink className="w-3 h-3" /> Preview
                      </Button>
                    </a>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(p.id)} className="font-mono text-[10px] gap-1 h-7 text-destructive/60 hover:text-destructive">
                      <Trash2 className="w-3 h-3" /> Delete
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProposalsManager;
