'use client';

import { MessageSquare, FileDown, Send, ChevronUp } from "lucide-react";

interface StickyReportActionsProps {
  visible: boolean;
  onDiscuss: () => void;
  onDownload: () => void;
  onTalk: () => void;
  chatOpen?: boolean;
  labels?: {
    discuss?: string;
    hideChat?: string;
    download?: string;
    talk?: string;
  };
}

const StickyReportActions = ({
  visible,
  onDiscuss,
  onDownload,
  onTalk,
  chatOpen = false,
  labels = {},
}: StickyReportActionsProps) => {
  const {
    discuss = "Discuss Report",
    hideChat = "Hide Chat",
    download = "Download Report",
    talk = "Talk to Mitryxa",
  } = labels;

  return (
    <div
      className={`fixed bottom-0 left-0 z-50 transition-all duration-300 ease-out ${
        chatOpen ? "right-0 sm:right-96" : "right-0"
      } ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      {/* Top gradient border */}
      <div className="h-[2px] bg-gradient-to-r from-primary via-secondary to-primary" />

      {/* Glass bar */}
      <div
        className="backdrop-blur-xl border-t border-primary/10 px-4 py-3"
        style={{ background: "hsl(220 20% 6% / 0.92)" }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            <button
              onClick={onDiscuss}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 text-xs font-mono rounded-lg border border-primary/10 bg-primary/5 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
            >
              <MessageSquare size={13} />
              <span className="hidden xs:inline">{chatOpen ? hideChat : discuss}</span>
            </button>
            <button
              onClick={onDownload}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 text-xs font-mono rounded-lg border border-primary/10 bg-primary/5 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
            >
              <FileDown size={13} />
              <span className="hidden xs:inline">{download}</span>
            </button>
            <button
              onClick={onTalk}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 text-xs font-mono rounded-lg border border-primary/10 bg-primary/5 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
            >
              <Send size={13} />
              <span className="hidden xs:inline">{talk}</span>
            </button>
          </div>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-1 px-2 py-2.5 text-[10px] font-mono text-muted-foreground/60 hover:text-muted-foreground transition-colors shrink-0"
          >
            <ChevronUp size={12} />
            <span className="hidden sm:inline">Top</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StickyReportActions;
