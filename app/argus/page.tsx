'use client';

import { useState, useEffect, useRef } from "react";
import { Eye, Zap, Send } from "lucide-react";

/* ── Argus character avatar ── */
const ArgusAvatar = ({ speaking }: { speaking: boolean }) => (
  <div className="relative flex items-center justify-center">
    {/* Outer pulse rings */}
    {speaking && (
      <>
        <span className="absolute w-32 h-32 rounded-full border border-primary/20 animate-ping" style={{ animationDuration: '1.2s' }} />
        <span className="absolute w-24 h-24 rounded-full border border-primary/30 animate-ping" style={{ animationDuration: '0.9s' }} />
      </>
    )}
    {/* Static outer ring */}
    <span className="absolute w-28 h-28 rounded-full border border-primary/10" />
    <span className="absolute w-22 h-22 rounded-full border border-secondary/10" style={{ width: 88, height: 88 }} />

    {/* Main avatar circle */}
    <div
      className="relative w-20 h-20 rounded-full flex items-center justify-center overflow-hidden"
      style={{
        background: 'radial-gradient(circle at 35% 35%, hsl(217 91% 60% / 0.3), hsl(263 70% 50% / 0.2), hsl(220 20% 8%))',
        boxShadow: speaking
          ? '0 0 40px hsl(217 91% 60% / 0.4), 0 0 80px hsl(217 91% 60% / 0.1), inset 0 0 30px hsl(217 91% 60% / 0.1)'
          : '0 0 20px hsl(217 91% 60% / 0.15), inset 0 0 20px hsl(217 91% 60% / 0.05)',
        transition: 'box-shadow 0.3s ease',
        border: '1px solid hsl(217 91% 60% / 0.2)',
      }}
    >
      {/* Eye of Argus — stylized */}
      <div className="relative flex items-center justify-center">
        {/* Iris rings */}
        <div
          className="absolute w-14 h-14 rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, hsl(217 91% 60% / 0.4), hsl(263 70% 50% / 0.3), hsl(186 100% 42% / 0.4), hsl(217 91% 60% / 0.4))',
            animation: speaking ? 'spin 3s linear infinite' : 'spin 8s linear infinite',
          }}
        />
        <div
          className="absolute w-10 h-10 rounded-full"
          style={{ background: 'hsl(220 20% 8%)' }}
        />
        <div
          className="absolute w-8 h-8 rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(217 91% 70%), hsl(217 91% 50%))',
            boxShadow: '0 0 12px hsl(217 91% 60%)',
          }}
        />
        {/* Pupil */}
        <div
          className="absolute w-3 h-3 rounded-full"
          style={{ background: 'hsl(220 20% 6%)', boxShadow: 'inset 0 0 4px hsl(217 91% 60% / 0.5)' }}
        />
        {/* Eye glint */}
        <div
          className="absolute w-1.5 h-1.5 rounded-full bg-white/80"
          style={{ top: '28%', left: '38%' }}
        />
      </div>

      {/* Scanline overlay */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(220 20% 6% / 0.15) 2px, hsl(220 20% 6% / 0.15) 4px)',
        }}
      />
    </div>
  </div>
);

/* ── Typing indicator ── */
const TypingDots = () => (
  <div className="flex items-center gap-1 px-4 py-3">
    {[0, 1, 2].map(i => (
      <span
        key={i}
        className="w-1.5 h-1.5 rounded-full bg-primary/60"
        style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
      />
    ))}
    <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }`}</style>
  </div>
);

type Message = { role: 'argus' | 'user'; content: string; id: number };

const INITIAL_MESSAGE = `Hello. I'm Argus — Mitryxa's intelligence system.

I'm not a chatbot. I'm here to understand your business, assess where you're leaking revenue, and show you exactly what an AI decision platform would do for you.

What kind of business are you running?`;

export default function ArgusPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'argus', content: INITIAL_MESSAGE, id: 0 }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [argusActive, setArgusActive] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const idRef = useRef(1);

  useEffect(() => {
    setTimeout(() => setArgusActive(true), 300);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const send = async () => {
    const text = input.trim();
    if (!text || isTyping) return;
    setInput('');

    const userMsg: Message = { role: 'user', content: text, id: idRef.current++ };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // Simulate Argus thinking — this will later connect to the real AI
    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));

    const reply = await getArgusReply([...messages, userMsg]);
    setMessages(prev => [...prev, { role: 'argus', content: reply, id: idRef.current++ }]);
    setIsTyping(false);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col" style={{
      background: 'radial-gradient(ellipse at 50% 0%, hsl(217 91% 60% / 0.05) 0%, transparent 60%), hsl(var(--background))',
    }}>
      {/* Grid overlay */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(hsl(217 91% 60% / 0.03) 1px, transparent 1px), linear-gradient(90deg, hsl(217 91% 60% / 0.03) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      <div className="relative z-10 flex flex-col min-h-screen max-w-3xl mx-auto w-full px-4 pt-24 pb-8">

        {/* Argus header */}
        <div className="flex flex-col items-center mb-10">
          <ArgusAvatar speaking={argusActive} />
          <div className="mt-5 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Eye size={14} className="text-primary" />
              <h1 className="text-xl font-bold font-mono tracking-widest text-foreground">ARGUS</h1>
              <Eye size={14} className="text-primary" />
            </div>
            <p className="text-xs text-muted-foreground font-mono tracking-wider uppercase">
              Mitryxa Intelligence System — v2.4
            </p>
            <div className="flex items-center justify-center gap-1.5 mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-[10px] text-accent font-mono">Online — Analyzing</span>
              <Zap size={10} className="text-accent" />
            </div>
          </div>
        </div>

        {/* Chat messages */}
        <div className="flex-1 flex flex-col gap-4 mb-6">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'argus' && (
                <div className="w-7 h-7 rounded-full shrink-0 mr-3 mt-1 flex items-center justify-center"
                  style={{
                    background: 'radial-gradient(circle, hsl(217 91% 60% / 0.3), hsl(220 20% 8%))',
                    border: '1px solid hsl(217 91% 60% / 0.3)',
                    boxShadow: '0 0 8px hsl(217 91% 60% / 0.2)',
                  }}>
                  <Eye size={12} className="text-primary" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'argus'
                    ? 'glass-terminal rounded-tl-sm'
                    : 'rounded-tr-sm text-foreground'
                }`}
                style={msg.role === 'user' ? {
                  background: 'hsl(217 91% 60% / 0.15)',
                  border: '1px solid hsl(217 91% 60% / 0.2)',
                } : {}}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="w-7 h-7 rounded-full shrink-0 mr-3 mt-1 flex items-center justify-center"
                style={{
                  background: 'radial-gradient(circle, hsl(217 91% 60% / 0.3), hsl(220 20% 8%))',
                  border: '1px solid hsl(217 91% 60% / 0.3)',
                }}>
                <Eye size={12} className="text-primary" />
              </div>
              <div className="glass-terminal rounded-2xl rounded-tl-sm">
                <TypingDots />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div
          className="glass-terminal rounded-2xl relative overflow-hidden"
          style={{ border: '1px solid hsl(217 91% 60% / 0.15)' }}
        >
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <div className="flex items-end gap-3 p-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Tell Argus about your business..."
              rows={1}
              className="flex-1 bg-transparent resize-none text-sm text-foreground placeholder:text-muted-foreground/50 outline-none font-sans leading-relaxed py-2 px-2 max-h-32"
              style={{ scrollbarWidth: 'none' }}
            />
            <button
              onClick={send}
              disabled={!input.trim() || isTyping}
              className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-30"
              style={{
                background: input.trim() ? 'hsl(217 91% 60%)' : 'hsl(217 91% 60% / 0.1)',
                boxShadow: input.trim() ? '0 0 16px hsl(217 91% 60% / 0.3)' : 'none',
              }}
            >
              <Send size={15} className="text-white" />
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground/30 font-mono text-center pb-2">
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

/* ── Temporary local reply logic — will be replaced with real AI backend ── */
async function getArgusReply(messages: Message[]): Promise<string> {
  const last = messages[messages.length - 1].content.toLowerCase();

  if (messages.length <= 2) {
    return `Understood. Before I can show you what's possible, I need to understand one thing:\n\nWhat's the single biggest bottleneck between someone finding you online and them becoming a paying client?`;
  }
  if (last.includes('lead') || last.includes('traffic') || last.includes('website')) {
    return `That's exactly what Mitryxa solves.\n\nMost websites are passive — they wait for someone to fill out a form. Ours think. They qualify visitors, answer objections in real time, and route the right people to you — already warm.\n\nWhat does your current lead flow look like? Walk me through what happens after someone lands on your site.`;
  }
  if (last.includes('price') || last.includes('cost') || last.includes('how much')) {
    return `That depends on what we're building — but here's the honest answer:\n\nPlatforms start at $1,500 with a $150/month maintenance fee. For competitive markets with ad management, it scales with value.\n\nBefore we talk numbers, let me understand your market. What city or region are you serving, and what industry?`;
  }
  return `I'm processing what you've shared.\n\nGive me a moment — I want to make sure my response is actually useful to you, not just a generic answer.\n\nCan you tell me: what does success look like for you in the next 90 days?`;
}
