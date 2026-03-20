'use client';

import { useEffect, useState } from "react";
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";

function applyInlineFormatting(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "<em>$1</em>");
}

function convertMarkdownTables(md: string): string {
  return md.replace(
    /(?:^|\n)((?:\|.+\|\n)+)/g,
    (_, tableBlock: string) => {
      const rows = tableBlock.trim().split("\n").filter(r => r.trim());
      if (rows.length < 2) return tableBlock;
      const isSeparator = /^\|[\s\-:]+\|/.test(rows[1]);
      const headerRow = rows[0];
      const dataRows = isSeparator ? rows.slice(2) : rows.slice(1);
      const parseRow = (row: string) =>
        row.split("|").filter((_, i, a) => i > 0 && i < a.length - 1).map(c => c.trim());
      const headers = parseRow(headerRow);
      let html = "<table><thead><tr>" + headers.map(h => `<th>${applyInlineFormatting(h)}</th>`).join("") + "</tr></thead><tbody>";
      for (const row of dataRows) {
        const cells = parseRow(row);
        html += "<tr>" + cells.map(c => `<td>${applyInlineFormatting(c)}</td>`).join("") + "</tr>";
      }
      html += "</tbody></table>";
      return "\n" + html + "\n";
    }
  );
}

function markdownToHtml(md: string): string {
  // Strip [ADMIN: Lead Summary] section
  const clientMd = md.replace(/## \[ADMIN:.*$/s, "").trim();
  const processed = convertMarkdownTables(clientMd);
  const lines = processed.replace(/^## /gm, "\n## ").split("\n");
  const htmlLines: string[] = [];

  let inList = false;

  for (const line of lines) {
    // Pass through HTML table tags as-is
    if (line.startsWith("<table") || line.startsWith("</table") || line.startsWith("<thead") || 
        line.startsWith("<tbody") || line.startsWith("<tr") || line.startsWith("</tr") ||
        line.startsWith("<th") || line.startsWith("<td") || line.startsWith("</thead") || 
        line.startsWith("</tbody")) {
      if (inList) { htmlLines.push("</ul>"); inList = false; }
      htmlLines.push(line);
      continue;
    }

    const isListItem = line.startsWith("- ") || line.startsWith("* ");

    if (!isListItem && inList) {
      htmlLines.push("</ul>");
      inList = false;
    }

    if (line.startsWith("## ")) {
      htmlLines.push(`<h2>${applyInlineFormatting(line.slice(3))}</h2>`);
    } else if (line.startsWith("### ")) {
      htmlLines.push(`<h3>${applyInlineFormatting(line.slice(4))}</h3>`);
    } else if (isListItem) {
      if (!inList) {
        htmlLines.push("<ul>");
        inList = true;
      }
      htmlLines.push(`<li>${applyInlineFormatting(line.slice(2))}</li>`);
    } else if (line.trim()) {
      htmlLines.push(`<p>${applyInlineFormatting(line)}</p>`);
    }
  }

  if (inList) htmlLines.push("</ul>");

  return htmlLines.join("\n");
}

const toolLabels: Record<string, string> = {
  audit: "Site Audit Report",
  estimator: "Price Estimator Report",
  competition: "Competition Analysis Report",
};

const ReportView = () => {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchReport = async () => {
      const { data, error: fetchError } = await supabase
        .from("tool_reports")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError || !data) {
        setError("Report not found");
      } else {
        setReport(data);
      }
      setLoading(false);
    };

    fetchReport();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <SEOHead title="Report Not Found | Mitryxa" description="This report could not be found." />
        <p className="text-muted-foreground font-mono">Report not found</p>
        <Link href="/" className="text-primary hover:underline text-sm font-mono">
          ← Back to Mitryxa
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(report.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const reportTitle = toolLabels[report.tool_type] || "Report";
  const subtitle = report.metadata?.url || report.metadata?.industry || "";

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title={`${reportTitle} | Mitryxa`} description="View your Mitryxa intelligence report." />

      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-mono font-bold text-lg">
            M
          </div>
          <span className="font-mono font-bold text-lg tracking-widest text-foreground">MITRYXA</span>
        </div>

        <div className="h-[3px] bg-gradient-to-r from-primary to-primary/40 rounded mb-8" />

        <h1 className="text-2xl font-bold text-foreground mb-1">{reportTitle}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mb-1">{subtitle}</p>}
        {report.lead_name && (
          <p className="text-xs text-muted-foreground/70 mb-1">
            Prepared for: {report.lead_name}
          </p>
        )}
        <p className="text-xs text-muted-foreground/50 mb-10">
          Generated on {formattedDate} by Mitryxa Signal Intelligence Engine
        </p>

        {/* Report Content */}
        <div
          className="report-content prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: markdownToHtml(report.report_markdown) }}
        />

        {/* Footer */}
        <div className="mt-16 pt-4 border-t-[3px] border-primary text-center">
          <p className="text-xs text-muted-foreground">
            <span className="text-primary font-semibold">Mitryxa</span> — AI Decision Platforms for Professional Services
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">mitryxa.com</p>
        </div>
      </div>

      <style>{`
        .report-content h2 {
          font-size: 1.1rem;
          font-weight: 700;
          color: hsl(var(--primary));
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          padding-bottom: 0.4rem;
          border-bottom: 1px solid hsl(var(--border));
        }
        .report-content h3 {
          font-size: 0.95rem;
          font-weight: 600;
          color: hsl(var(--foreground));
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .report-content p {
          font-size: 0.875rem;
          color: hsl(var(--muted-foreground));
          margin-bottom: 0.5rem;
          line-height: 1.7;
        }
        .report-content ul {
          padding-left: 1.25rem;
          margin-bottom: 0.75rem;
          list-style-type: disc;
        }
        .report-content li {
          font-size: 0.875rem;
          color: hsl(var(--muted-foreground));
          margin-bottom: 0.3rem;
          line-height: 1.6;
        }
        .report-content strong {
          color: hsl(var(--foreground));
        }
        .report-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 0.75rem 0 1rem;
          font-size: 0.8125rem;
        }
        .report-content th {
          background: hsl(var(--muted));
          color: hsl(var(--foreground));
          font-weight: 600;
          text-align: left;
          padding: 0.5rem 0.75rem;
          border: 1px solid hsl(var(--border));
        }
        .report-content td {
          padding: 0.5rem 0.75rem;
          border: 1px solid hsl(var(--border));
          color: hsl(var(--muted-foreground));
        }
      `}</style>
    </div>
  );
};

export default ReportView;
