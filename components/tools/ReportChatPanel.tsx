'use client';

import { useRef, useEffect } from "react";
import { MessageSquare, X, Send, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ReportChatPanelProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  placeholder?: string;
  emptyText?: string;
  messages: ChatMessage[];
  loading: boolean;
  error?: string;
  input: string;
  onInputChange: (val: string) => void;
  onSend: () => void;
}

const ReportChatPanel = ({
  open,
  onClose,
  title = "Discuss Report",
  placeholder = "Ask about your report...",
  emptyText = "Ask anything about your report...",
  messages,
  loading,
  error,
  input,
  onInputChange,
  onSend,
}: ReportChatPanelProps) => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <>
      {/* Backdrop on mobile */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Side panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-96 flex flex-col border-l border-primary/10 transition-transform duration-300 ease-out pb-14 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ background: "hsl(220 20% 6% / 0.98)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-primary/10 shrink-0">
          <div className="flex items-center gap-2">
            <MessageSquare size={16} className="text-secondary" />
            <h3 className="text-sm font-mono font-bold text-foreground">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.length === 0 && (
            <p className="text-xs font-mono text-muted-foreground/60 text-center py-8">
              {emptyText}
            </p>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                  msg.role === "user"
                    ? "bg-primary/10 text-foreground"
                    : "bg-secondary/10 text-muted-foreground"
                }`}
              >
                <div className="prose prose-sm prose-invert max-w-none [&_p]:mb-1">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-secondary/10 rounded-lg px-3 py-2">
                <Loader2 size={14} className="animate-spin text-secondary" />
              </div>
            </div>
          )}
          {error && <p className="text-xs text-destructive font-mono text-center">{error}</p>}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-primary/10 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSend();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder={placeholder}
              className="flex-1 bg-background/50 border border-primary/10 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/30 font-mono"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-3 py-2 rounded-lg bg-primary text-primary-foreground disabled:opacity-40 transition-opacity"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ReportChatPanel;
