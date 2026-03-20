"use client";
import { useState, useRef, useEffect } from "react";
import { X, Send } from "lucide-react";

const ARGUS_API = "https://argus-9a3170af.base44.app/functions/chatWidget";

interface Message { role: "user" | "assistant"; content: string; }

interface ArgusChatProps {
  triggerLabel?: string;
  floatingBubble?: boolean;
}

const ArgusChat = ({ triggerLabel = "Talk to Argus", floatingBubble = false }: ArgusChatProps) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) initChat();
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const initChat = async () => {
    setLoading(true);
    try {
      const res = await fetch(ARGUS_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "message", message: "hello", sessionId: null, visitorInfo: { source_page: typeof window !== "undefined" ? window.location.href : "mitryxa.com" } }),
      });
      const data = await res.json();
      setSessionId(data.sessionId);
      setMessages([{ role: "assistant", content: data.reply }]);
    } catch { setMessages([{ role: "assistant", content: "Hey! 👋 I'm Argus — Hamlik's partner at Mitryxa. Tell me about your business." }]); }
    setLoading(false);
  };

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);
    try {
      const res = await fetch(ARGUS_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "message", message: userMsg, sessionId, visitorInfo: {} }),
      });
      const data = await res.json();
      if (data.sessionId) setSessionId(data.sessionId);
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch { setMessages((prev) => [...prev, { role: "assistant", content: "Give me a second, I'll be right back." }]); }
    setLoading(false);
  };

  const chatPanel = (
    <div className={`${floatingBubble ? "fixed bottom-24 right-6 z-50" : "fixed inset-0 z-50 flex items-end sm:items-center justify-center"}`}>
      {!floatingBubble && <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />}
      <div className={`relative ${floatingBubble ? "w-[360px]" : "w-full max-w-md mx-4"} bg-[#0D0D0D] border border-purple-500/30 rounded-2xl flex flex-col overflow-hidden shadow-2xl`} style={{ height: 520 }}>
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.07] bg-gradient-to-r from-purple-950/60 to-transparent">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-lg">🤖</div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">Argus</p>
            <p className="text-xs text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
              Hamlik's partner · Online
            </p>
          </div>
          <button onClick={() => setOpen(false)} className="text-zinc-500 hover:text-white transition-colors"><X size={20} /></button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {messages.map((m, i) => (
            <div key={i} className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${m.role === "assistant" ? "self-start bg-[#1a1a2e] border border-purple-500/20 text-slate-200 rounded-bl-sm" : "self-end bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-br-sm"}`}>
              {m.content}
            </div>
          ))}
          {loading && (
            <div className="self-start bg-[#1a1a2e] border border-purple-500/20 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1">
              {[0,1,2].map(i => <span key={i} className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-white/[0.07] flex gap-2 bg-[#0D0D0D]">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 bg-zinc-900 border border-purple-500/20 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-zinc-600 outline-none resize-none focus:border-purple-500/50 transition-colors"
          />
          <button onClick={send} disabled={loading || !input.trim()} className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center disabled:opacity-40 hover:opacity-85 transition-opacity flex-shrink-0">
            <Send size={15} className="text-white" />
          </button>
        </div>
        <p className="text-center text-[10px] text-zinc-700 py-1.5 bg-[#0D0D0D]">Powered by <span className="text-zinc-500">Mitryxa</span></p>
      </div>
    </div>
  );

  if (floatingBubble) {
    return (
      <>
        <button
          onClick={() => setOpen(!open)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/40 hover:scale-105 transition-transform"
          aria-label="Chat with Argus"
        >
          <span className="text-2xl">🤖</span>
          <span className="absolute top-0.5 right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0D0D0D] animate-pulse" />
        </button>
        {open && chatPanel}
      </>
    );
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-cta">
        {triggerLabel} →
      </button>
      {open && chatPanel}
    </>
  );
};

export default ArgusChat;
