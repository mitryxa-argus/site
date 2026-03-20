'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import { Send, Zap } from "lucide-react";

/* ── Typing indicator ── */
const TypingDots = () => (
  <div className="flex items-center gap-1.5 px-4 py-3">
    {[0, 1, 2].map(i => (
      <span
        key={i}
        className="w-2 h-2 rounded-full bg-primary/60 inline-block"
        style={{ animation: `argus-bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
      />
    ))}
  </div>
);

type Message = { role: 'argus' | 'user'; content: string; id: number };

const STORAGE_KEY = 'argus_conversation';

const INITIAL_MESSAGE: Message = {
  role: 'argus',
  content: `Hey — I'm Argus.\n\nI'm not a generic chatbot. I'm Mitryxa's intelligence system, and I'm here to do one thing: understand your business and show you exactly how we'd build an AI platform around it.\n\nWhat kind of business are you running?`,
  id: 0,
};

export default function ArgusPage() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const idRef = useRef(1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);

  // Load saved conversation from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Message[];
        if (parsed.length > 0) {
          setMessages(parsed);
          idRef.current = Math.max(...parsed.map(m => m.id)) + 1;
        }
      }
    } catch {}
    setLoaded(true);
  }, []);

  // Save conversation to localStorage whenever it changes
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages, loaded]);

  // Scroll to bottom of chat area only (not whole page)
  useEffect(() => {
    if (!loaded) return;
    const chatArea = chatAreaRef.current;
    if (chatArea) {
      chatArea.scrollTop = chatArea.scrollHeight;
    }
  }, [messages, isTyping, loaded]);

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    const userMsg: Message = { role: 'user', content: text, id: idRef.current++ };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    await new Promise(r => setTimeout(r, 1000 + Math.random() * 800));

    const allMsgs = [...messages, userMsg];
    const reply = getArgusReply(allMsgs);
    setMessages(prev => [...prev, { role: 'argus', content: reply, id: idRef.current++ }]);
    setIsTyping(false);

    setTimeout(() => textareaRef.current?.focus(), 100);
  }, [input, isTyping, messages]);

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const clearConversation = () => {
    const fresh = [{ ...INITIAL_MESSAGE, id: 0 }];
    setMessages(fresh);
    idRef.current = 1;
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  };

  return (
    <>
      <style>{`
        @keyframes argus-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes argus-fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .argus-msg { animation: argus-fade-in 0.3s ease forwards; }

        /* Prevent the whole page from scrolling — only chat area scrolls */
        .argus-page {
          position: fixed;
          inset: 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
      `}</style>

      <div className="argus-page bg-background" style={{
        background: 'radial-gradient(ellipse at 50% 0%, hsl(217 91% 60% / 0.06) 0%, transparent 50%), hsl(var(--background))',
      }}>
        {/* Subtle grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(hsl(217 91% 60% / 0.025) 1px, transparent 1px), linear-gradient(90deg, hsl(217 91% 60% / 0.025) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        {/* ── HEADER — fixed at top ── */}
        <div className="relative z-10 shrink-0 pt-16">
          <div className="max-w-2xl mx-auto px-4 py-5 flex items-center gap-4 border-b border-white/[0.06]">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div
                className="w-14 h-14 rounded-full overflow-hidden"
                style={{
                  border: '2px solid hsl(217 91% 60% / 0.4)',
                  boxShadow: '0 0 20px hsl(217 91% 60% / 0.25), 0 0 40px hsl(217 91% 60% / 0.08)',
                }}
              >
                <img
                  src="/assets/argus-avatar.jpg"
                  alt="Argus"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              {/* Online indicator */}
              <span
                className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full border-2 border-background"
                style={{ background: 'hsl(142 70% 45%)', boxShadow: '0 0 6px hsl(142 70% 45% / 0.6)' }}
              />
            </div>

            {/* Name + status */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold font-mono tracking-wide text-foreground">Argus</h1>
                <span className="text-[10px] text-muted-foreground/50 font-mono">— Mitryxa Intelligence</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Zap size={9} className="text-accent" />
                <span className="text-[11px] text-accent/80 font-mono">Online · Ready to analyze your business</span>
              </div>
            </div>

            {/* Clear chat */}
            {messages.length > 1 && (
              <button
                onClick={clearConversation}
                className="shrink-0 text-[10px] font-mono text-muted-foreground/40 hover:text-muted-foreground transition-colors px-2 py-1 rounded border border-white/5 hover:border-white/10"
              >
                New chat
              </button>
            )}
          </div>
        </div>

        {/* ── MESSAGES — scrollable middle ── */}
        <div
          ref={chatAreaRef}
          className="relative z-10 flex-1 overflow-y-auto overscroll-contain"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`argus-msg flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {/* Argus avatar on left */}
                {msg.role === 'argus' && (
                  <div className="shrink-0 w-8 h-8 rounded-full overflow-hidden mt-1"
                    style={{
                      border: '1.5px solid hsl(217 91% 60% / 0.3)',
                      boxShadow: '0 0 8px hsl(217 91% 60% / 0.15)',
                    }}
                  >
                    <img
                      src="/assets/argus-avatar.jpg"
                      alt="Argus"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                )}

                {/* Bubble */}
                <div
                  className={`max-w-[78%] sm:max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words ${
                    msg.role === 'argus'
                      ? 'rounded-tl-sm glass-terminal text-foreground'
                      : 'rounded-tr-sm text-foreground'
                  }`}
                  style={msg.role === 'user' ? {
                    background: 'hsl(217 91% 60% / 0.18)',
                    border: '1px solid hsl(217 91% 60% / 0.25)',
                  } : {}}
                >
                  {msg.content}
                </div>

                {/* User bubble right spacer */}
                {msg.role === 'user' && <div className="shrink-0 w-8" />}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="argus-msg flex gap-3 justify-start">
                <div className="shrink-0 w-8 h-8 rounded-full overflow-hidden mt-1"
                  style={{
                    border: '1.5px solid hsl(217 91% 60% / 0.3)',
                    boxShadow: '0 0 8px hsl(217 91% 60% / 0.15)',
                  }}
                >
                  <img src="/assets/argus-avatar.jpg" alt="Argus" className="w-full h-full object-cover object-top" />
                </div>
                <div className="glass-terminal rounded-2xl rounded-tl-sm">
                  <TypingDots />
                </div>
              </div>
            )}
            <div ref={bottomRef} className="h-1" />
          </div>
        </div>

        {/* ── INPUT — always pinned at bottom ── */}
        <div className="relative z-10 shrink-0">
          <div className="max-w-2xl mx-auto px-4 pb-4 pt-2">
            {/* Fade gradient above input */}
            <div className="absolute -top-8 left-0 right-0 h-8 pointer-events-none"
              style={{ background: 'linear-gradient(transparent, hsl(var(--background)))' }}
            />
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: 'hsl(220 20% 9% / 0.9)',
                border: '1px solid hsl(217 91% 60% / 0.18)',
                boxShadow: '0 0 24px hsl(217 91% 60% / 0.08)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-[1px]"
                style={{ background: 'linear-gradient(90deg, transparent, hsl(217 91% 60% / 0.4), transparent)' }}
              />
              <div className="flex items-end gap-2 px-4 pt-3 pb-3">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKey}
                  placeholder="Tell Argus about your business…"
                  rows={1}
                  className="flex-1 bg-transparent resize-none text-sm text-foreground placeholder:text-muted-foreground/40 outline-none font-sans leading-relaxed py-1 min-h-[24px]"
                  style={{
                    scrollbarWidth: 'none',
                    WebkitAppearance: 'none',
                    fontSize: '16px', // prevents iOS zoom on focus
                  }}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={true}
                />
                <button
                  onClick={send}
                  disabled={!input.trim() || isTyping}
                  className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-95"
                  style={{
                    background: input.trim() && !isTyping ? 'hsl(217 91% 60%)' : 'hsl(217 91% 60% / 0.12)',
                    boxShadow: input.trim() && !isTyping ? '0 0 16px hsl(217 91% 60% / 0.35)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                  aria-label="Send message"
                >
                  <Send size={15} className={input.trim() && !isTyping ? 'text-white' : 'text-muted-foreground/40'} />
                </button>
              </div>
              <div className="flex items-center justify-between px-4 pb-2">
                <span className="text-[10px] text-muted-foreground/25 font-mono hidden sm:block">
                  Enter to send · Shift+Enter for new line
                </span>
                <span className="text-[10px] text-muted-foreground/25 font-mono sm:hidden">
                  Tap send or press Enter
                </span>
                <span className="text-[10px] text-muted-foreground/20 font-mono">
                  {messages.length > 1 ? `${messages.length - 1} message${messages.length > 2 ? 's' : ''} · saved locally` : 'conversation saved locally'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Reply logic — placeholder until real AI backend is wired ── */
function getArgusReply(messages: Message[]): string {
  const userMessages = messages.filter(m => m.role === 'user');
  const last = userMessages[userMessages.length - 1]?.content.toLowerCase() ?? '';
  const count = userMessages.length;

  if (count === 1) {
    return `Got it.\n\nBefore I can show you what's possible for a business like yours, I need to understand the gap.\n\nWhat's the biggest thing getting in the way between someone finding you online and actually becoming a paying client?`;
  }
  if (last.includes('price') || last.includes('cost') || last.includes('how much') || last.includes('pricing')) {
    return `Straightforward question — here's the honest answer:\n\nPlatforms start at $1,500 with $150/month for maintenance and updates. For markets with heavy competition, ad management, or more complex systems, it scales with the value we're delivering.\n\nBut before we talk numbers — I'd rather show you the ROI first. What's your average client worth to you?`;
  }
  if (last.includes('lead') || last.includes('traffic') || last.includes('website') || last.includes('site')) {
    return `That's exactly the problem we solve.\n\nMost websites are passive. They sit there waiting for someone to fill out a form — and most people don't.\n\nA Mitryxa platform is different. It engages visitors, qualifies them in real time, answers their objections, and hands you a warm lead instead of a cold contact form submission.\n\nWhat industry are you in? I want to show you exactly how this would work for your specific market.`;
  }
  if (last.includes('ai') || last.includes('how does') || last.includes('what do you')) {
    return `Good question.\n\nHere's the short version: I help businesses stop losing qualified buyers to confusion, friction, and slow follow-up.\n\nMitryxa builds the intelligence layer your website is missing — one that thinks, qualifies, and converts while you're focused on doing the actual work.\n\nWhat does your current sales process look like from first contact to close?`;
  }
  if (count >= 4) {
    return `Based on what you've shared, I have a good sense of where the opportunity is.\n\nI'd like to put together something specific for your business — not a generic proposal, but an actual breakdown of what we'd build and what it would do for your pipeline.\n\nWhat's the best way to reach you? An email works, or if you prefer, we can keep going here.`;
  }
  return `Understood.\n\nLet me ask you something specific: how many potential clients visit your site or business in a typical week — and how many of those actually reach out?\n\nThat gap is where we operate.`;
}
