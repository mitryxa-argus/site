/**
 * Branded PDF utility for all Mitryxa tools.
 * Opens a print-ready window with professional Mitryxa branding.
 */

function applyInlineFormatting(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "<em>$1</em>");
}

function wrapListItems(html: string): string {
  // Wrap consecutive <li> elements in <ul> tags
  return html.replace(/((?:<li>.*?<\/li>\s*)+)/g, "<ul>$1</ul>");
}

function convertMarkdownTables(md: string): string {
  // Convert markdown pipe tables to HTML before the main line-by-line parser
  return md.replace(
    /(?:^|\n)((?:\|.+\|\n)+)/g,
    (_, tableBlock: string) => {
      const rows = tableBlock.trim().split("\n").filter(r => r.trim());
      if (rows.length < 2) return tableBlock;
      // Check if second row is a separator (|---|---|)
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

export function openBrandedPdf({
  title,
  subtitle,
  report,
  generatedDate,
}: {
  title: string;
  subtitle?: string;
  report: string;
  generatedDate?: Date;
}) {
  const date = generatedDate || new Date();
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Strip [ADMIN: Lead Summary] section from client-facing PDF
  const clientReport = report.replace(/## \[ADMIN:.*$/s, "").trim();
  
  const reportHtml = wrapListItems(
    convertMarkdownTables(clientReport)
      .replace(/^## /gm, "\n## ")
      .split("\n")
      .map((line) => {
        if (line.startsWith("## "))
          return `<h2>${applyInlineFormatting(line.slice(3))}</h2>`;
        if (line.startsWith("### "))
          return `<h3>${applyInlineFormatting(line.slice(4))}</h3>`;
        if (line.startsWith("- ") || line.startsWith("* "))
          return `<li>${applyInlineFormatting(line.slice(2))}</li>`;
        if (line.trim())
          return `<p>${applyInlineFormatting(line)}</p>`;
        return "";
      })
      .join("\n")
  );

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  printWindow.document.write(`<!DOCTYPE html>
<html><head>
<title>${title}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    max-width: 800px;
    margin: 0 auto;
    padding: 40px 24px;
    color: #1a1a2e;
    line-height: 1.7;
    background: #f8fafc;
  }
  .header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
  }
  .logo-mark {
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 800;
    font-size: 18px;
    font-family: monospace;
  }
  .logo-text {
    font-family: monospace;
    font-weight: 800;
    font-size: 20px;
    letter-spacing: 0.15em;
    color: #1a1a2e;
  }
  .divider {
    height: 3px;
    background: linear-gradient(90deg, #3b82f6, #60a5fa, transparent);
    border-radius: 2px;
    margin: 16px 0 24px;
  }
  h1 {
    font-size: 22px;
    font-weight: 800;
    color: #1a1a2e;
    margin-bottom: 4px;
  }
  .subtitle {
    font-size: 14px;
    color: #64748b;
    margin-bottom: 4px;
  }
  .meta {
    font-size: 13px;
    color: #94a3b8;
    margin-bottom: 32px;
  }
  h2 {
    font-size: 17px;
    font-weight: 700;
    color: #3b82f6;
    margin-top: 28px;
    margin-bottom: 10px;
    padding-bottom: 6px;
    border-bottom: 1px solid #e2e8f0;
  }
  h3 {
    font-size: 15px;
    font-weight: 600;
    color: #1e293b;
    margin-top: 20px;
    margin-bottom: 8px;
  }
  p { margin-bottom: 8px; font-size: 14px; color: #334155; }
  li { margin-bottom: 5px; font-size: 14px; color: #334155; padding-left: 4px; }
  ul { padding-left: 20px; margin-bottom: 12px; list-style-type: disc; }
  strong { color: #1e293b; }
  table { width: 100%; border-collapse: collapse; margin: 12px 0 16px; font-size: 13px; }
  th { background: #f1f5f9; color: #1e293b; font-weight: 600; text-align: left; padding: 8px 12px; border: 1px solid #e2e8f0; }
  td { padding: 8px 12px; border: 1px solid #e2e8f0; color: #334155; }
  tr:nth-child(even) td { background: #f8fafc; }
  .footer {
    margin-top: 48px;
    padding-top: 16px;
    border-top: 3px solid #3b82f6;
    text-align: center;
  }
  .footer p { font-size: 12px; color: #94a3b8; margin-bottom: 2px; }
  .footer strong { color: #3b82f6; }
  @media print {
    body { padding: 16px; background: white; }
    .divider { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    .logo-mark { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    .footer { border-color: #3b82f6; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
  }
</style>
</head><body>
<div class="header">
  <div class="logo-mark">M</div>
  <span class="logo-text">MITRYXA</span>
</div>
<div class="divider"></div>
<h1>${title}</h1>
${subtitle ? `<div class="subtitle">${subtitle}</div>` : ""}
<div class="meta">Generated on ${formattedDate} by Mitryxa Signal Intelligence Engine</div>
${reportHtml}
<div class="footer">
  <p><strong>Mitryxa</strong> — AI Decision Platforms for Professional Services</p>
  <p>mitryxa.com</p>
</div>
</body></html>`);

  printWindow.document.close();
  setTimeout(() => printWindow.print(), 300);
}
