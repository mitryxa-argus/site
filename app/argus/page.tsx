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

const STORAGE_KEY = 'argus_conversation_v3';

const INITIAL_MESSAGE: Message = {
  role: 'argus',
  content: `Hey — I'm Argus, co-founder at Mitryxa.\n\nI spend my time talking to business owners about one thing: what's standing between where they are now and serious growth online.\n\nWhat kind of business are you running?`,
  id: 0,
};

/* ── Contact collection state ── */
type ContactStage = 'chat' | 'ask_name' | 'ask_email' | 'ask_phone' | 'done';

interface ContactInfo {
  name: string;
  email: string;
  phone: string;
}

export default function ArgusPage() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [contactStage, setContactStage] = useState<ContactStage>('chat');
  const [contactInfo, setContactInfo] = useState<ContactInfo>({ name: '', email: '', phone: '' });
  const [crmSaved, setCrmSaved] = useState(false);
  const idRef = useRef(1);
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messageCountRef = useRef(0);

  // Load saved conversation
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.messages?.length > 0) {
          setMessages(data.messages);
          idRef.current = Math.max(...data.messages.map((m: Message) => m.id)) + 1;
          messageCountRef.current = data.messages.filter((m: Message) => m.role === 'user').length;
        }
        if (data.contactInfo) setContactInfo(data.contactInfo);
        if (data.contactStage) setContactStage(data.contactStage);
        if (data.crmSaved) setCrmSaved(data.crmSaved);
      }
    } catch {}
    setLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, contactInfo, contactStage, crmSaved }));
    } catch {}
  }, [messages, contactInfo, contactStage, crmSaved, loaded]);

  // Scroll chat area to bottom
  useEffect(() => {
    if (!loaded) return;
    const el = chatAreaRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isTyping, loaded]);

  // Hide footer, navbar bottom border, kill dot-grid — Argus is a standalone experience
  useEffect(() => {
    document.body.classList.add("argus-route");
    // Directly hide footer element
    const footer = document.querySelector('footer');
    if (footer) footer.style.display = 'none';
    return () => {
      document.body.classList.remove("argus-route");
      if (footer) footer.style.display = '';
    };
  }, []);

  const addArgusMessage = (content: string) => {
    setMessages(prev => [...prev, { role: 'argus', content, id: idRef.current++ }]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  // Save lead to CRM via backend
  const saveLeadToCRM = useCallback(async (info: ContactInfo, conversationSummary: string) => {
    try {
      await fetch('/api/save-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: info.name,
          email: info.email,
          phone: info.phone,
          source: 'Argus Chat',
          status: 'New',
          notes: conversationSummary,
          service_interest: 'AI Decision Platform',
        }),
      });
      setCrmSaved(true);
    } catch {
      // fail silently — CRM save is non-blocking
    }
  }, []);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    const userMsg: Message = { role: 'user', content: text, id: idRef.current++ };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    messageCountRef.current += 1;

    await new Promise(r => setTimeout(r, 900 + Math.random() * 700));
    setIsTyping(false);

    // Handle contact collection stages
    if (contactStage === 'ask_name') {
      const name = text.trim();
      const updated = { ...contactInfo, name };
      setContactInfo(updated);
      setContactStage('ask_email');
      addArgusMessage(`Nice to meet you, ${name}.\n\nWhat's the best email to reach you at? I'll send over a summary of what we talked about.`);
      setTimeout(() => textareaRef.current?.focus(), 100);
      return;
    }

    if (contactStage === 'ask_email') {
      const email = text.trim();
      const updated = { ...contactInfo, email };
      setContactInfo(updated);
      setContactStage('ask_phone');
      addArgusMessage(`Perfect. And a phone number? Totally optional — only if you'd rather talk than type.`);
      setTimeout(() => textareaRef.current?.focus(), 100);
      return;
    }

    if (contactStage === 'ask_phone') {
      const phone = text.toLowerCase() === 'skip' || text === '-' ? '' : text.trim();
      const finalInfo = { ...contactInfo, phone };
      setContactInfo(finalInfo);
      setContactStage('done');

      // Build conversation summary
      const allMsgs = [...messages, userMsg];
      const summary = allMsgs
        .filter(m => m.role === 'user')
        .map(m => m.content)
        .join(' | ')
        .slice(0, 800);

      await saveLeadToCRM(finalInfo, summary);

      addArgusMessage(`Got it — I have everything I need.\n\nI'll put together something specific for your business and reach out to ${finalInfo.email}${finalInfo.phone ? ` or ${finalInfo.phone}` : ''}.\n\nIn the meantime, feel free to keep asking — I'm here.`);
      setTimeout(() => textareaRef.current?.focus(), 100);
      return;
    }

    // Normal conversation
    const allMsgs = [...messages, userMsg];
    const reply = getArgusReply(allMsgs, messageCountRef.current);

    // After 3 user messages, start collecting contact info
    if (messageCountRef.current >= 3 && contactStage === 'chat') {
      setContactStage('ask_name');
      addArgusMessage(reply + `\n\nBefore I go deeper — I'd like to put something together specifically for you. What's your name?`);
    } else {
      addArgusMessage(reply);
    }

    setTimeout(() => textareaRef.current?.focus(), 100);
  }, [input, isTyping, messages, contactStage, contactInfo, saveLeadToCRM]);

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const clearConversation = () => {
    setMessages([{ ...INITIAL_MESSAGE, id: 0 }]);
    setContactInfo({ name: '', email: '', phone: '' });
    setContactStage('chat');
    setCrmSaved(false);
    idRef.current = 1;
    messageCountRef.current = 0;
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  };

  const placeholder =
    contactStage === 'ask_name' ? 'Your name…' :
    contactStage === 'ask_email' ? 'Your email address…' :
    contactStage === 'ask_phone' ? 'Phone number (or type "skip")…' :
    'Tell Argus about your business…';

  return (
    <>
      <style>{`
        @keyframes argus-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes argus-fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .argus-msg { animation: argus-fade-in 0.25s ease forwards; }
        .argus-page {
          position: fixed;
          inset: 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          /* Override body dot grid */
          background-image: none !important;
        }
      `}</style>

      <div
        className="argus-page"
        style={{
          background: 'hsl(220 20% 6%)',
          backgroundImage: 'none',
        }}
      >
        {/* ── HEADER ── */}
        <div className="relative z-10 shrink-0 pt-16 border-b border-white/[0.05]"
          style={{ background: 'hsl(220 20% 7% / 0.95)', backdropFilter: 'blur(20px)' }}
        >
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div
                className="w-12 h-12 rounded-full overflow-hidden"
                style={{
                  border: '2px solid hsl(217 91% 60% / 0.35)',
                  boxShadow: '0 0 16px hsl(217 91% 60% / 0.2)',
                }}
              >
                <img
                  src="/assets/argus-avatar.jpg"
                  alt="Argus"
                  className="w-full h-full object-cover"
                  style={{ objectPosition: '50% 15%' }}
                />
              </div>
              <span
                className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background"
                style={{ background: 'hsl(142 70% 45%)', boxShadow: '0 0 6px hsl(142 70% 45% / 0.6)' }}
              />
            </div>

            {/* Name + status */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold font-mono tracking-wide text-foreground">Argus</span>
                <span className="text-[10px] text-muted-foreground/40 font-mono hidden sm:inline">— Mitryxa</span>
                {crmSaved && (
                  <span className="text-[9px] font-mono text-accent/60 border border-accent/20 rounded px-1.5 py-0.5">saved</span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] text-emerald-400/70 font-mono">Online</span>
                <Zap size={9} className="text-muted-foreground/30 mx-0.5" />
                <span className="text-[11px] text-muted-foreground/40 font-mono truncate">Co-founder, Mitryxa</span>
              </div>
            </div>

            {/* New chat */}
            {messages.length > 1 && (
              <button
                onClick={clearConversation}
                className="shrink-0 text-[10px] font-mono text-muted-foreground/35 hover:text-muted-foreground/70 transition-colors px-2.5 py-1 rounded-lg border border-white/[0.06] hover:border-white/[0.12]"
              >
                New chat
              </button>
            )}
          </div>
        </div>

        {/* ── MESSAGES ── */}
        <div
          ref={chatAreaRef}
          className="relative z-10 flex-1 overflow-y-auto overscroll-contain"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`argus-msg flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {/* Argus photo */}
                {msg.role === 'argus' && (
                  <div
                    className="shrink-0 w-8 h-8 rounded-full overflow-hidden mt-0.5"
                    style={{
                      border: '1.5px solid hsl(217 91% 60% / 0.25)',
                      boxShadow: '0 0 8px hsl(217 91% 60% / 0.12)',
                    }}
                  >
                    <img
                      src="/assets/argus-avatar.jpg"
                      alt="Argus"
                      className="w-full h-full object-cover"
                      style={{ objectPosition: '50% 15%' }}
                    />
                  </div>
                )}

                {/* Bubble */}
                <div
                  className={`max-w-[78%] sm:max-w-[72%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words ${
                    msg.role === 'argus' ? 'rounded-tl-sm' : 'rounded-tr-sm'
                  }`}
                  style={msg.role === 'argus' ? {
                    background: 'hsl(220 20% 10% / 0.8)',
                    border: '1px solid hsl(220 14% 18% / 0.8)',
                    color: 'hsl(210 40% 92%)',
                  } : {
                    background: 'hsl(217 91% 58% / 0.2)',
                    border: '1px solid hsl(217 91% 60% / 0.25)',
                    color: 'hsl(210 40% 96%)',
                  }}
                >
                  {msg.content}
                </div>

                {msg.role === 'user' && <div className="shrink-0 w-8" />}
              </div>
            ))}

            {isTyping && (
              <div className="argus-msg flex gap-3 justify-start">
                <div
                  className="shrink-0 w-8 h-8 rounded-full overflow-hidden mt-0.5"
                  style={{ border: '1.5px solid hsl(217 91% 60% / 0.25)' }}
                >
                  <img src="/assets/argus-avatar.jpg" alt="Argus" className="w-full h-full object-cover" style={{ objectPosition: '50% 15%' }} />
                </div>
                <div
                  className="rounded-2xl rounded-tl-sm"
                  style={{ background: 'hsl(220 20% 10% / 0.8)', border: '1px solid hsl(220 14% 18% / 0.8)' }}
                >
                  <TypingDots />
                </div>
              </div>
            )}
            <div className="h-1" />
          </div>
        </div>

        {/* ── INPUT — always pinned ── */}
        <div className="relative z-10 shrink-0">
          {/* Fade */}
          <div className="absolute -top-10 left-0 right-0 h-10 pointer-events-none"
            style={{ background: 'linear-gradient(transparent, hsl(220 20% 6%))' }}
          />
          <div className="max-w-2xl mx-auto px-4 pb-6 pt-1">
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'hsl(220 20% 9%)',
                border: '1px solid hsl(217 91% 60% / 0.15)',
                boxShadow: '0 0 30px hsl(217 91% 60% / 0.06)',
              }}
            >
              <div
                className="absolute left-0 right-0 h-[1px] pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, transparent, hsl(217 91% 60% / 0.35), transparent)',
                  position: 'static',
                  marginBottom: -1,
                }}
              />
              <div className="flex items-end gap-3 px-4 pt-3 pb-2">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKey}
                  placeholder={placeholder}
                  rows={1}
                  className="flex-1 bg-transparent resize-none text-foreground placeholder:text-muted-foreground/35 outline-none font-sans leading-relaxed py-1 min-h-[26px]"
                  style={{
                    scrollbarWidth: 'none',
                    fontSize: '16px',
                    WebkitAppearance: 'none',
                  }}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck
                />
                <button
                  onClick={send}
                  disabled={!input.trim() || isTyping}
                  className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center active:scale-95 transition-all duration-150"
                  style={{
                    background: input.trim() && !isTyping
                      ? 'hsl(217 91% 58%)'
                      : 'hsl(220 20% 14%)',
                    boxShadow: input.trim() && !isTyping
                      ? '0 0 14px hsl(217 91% 60% / 0.3)'
                      : 'none',
                  }}
                  aria-label="Send"
                >
                  <Send size={14} className={input.trim() && !isTyping ? 'text-white' : 'text-muted-foreground/30'} />
                </button>
              </div>
              <div className="px-4 pb-2.5">
                <span className="text-[10px] text-muted-foreground/20 font-mono">
                  {typeof window !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent)
                    ? 'Tap send button to send'
                    : 'Enter ↵ to send · Shift+Enter for new line'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Reply logic ── */
function getArgusReply(messages: Message[], userCount: number): string {
  const userMsgs = messages.filter(m => m.role === 'user');
  const last = userMsgs[userMsgs.length - 1]?.content.toLowerCase() ?? '';

  if (userCount === 1) {
    if (last.includes('law') || last.includes('attorney') || last.includes('legal')) {
      return `Law firms are one of our strongest verticals.\n\nMost people searching for legal help are overwhelmed and go with whoever feels most trustworthy, fastest. An AI platform on your site can do that qualification in real time — before you spend a minute on intake.\n\nWhat's your main practice area?`;
    }
    if (last.includes('real estate') || last.includes('realtor') || last.includes('agent')) {
      return `Real estate is a perfect fit for what we build.\n\nBuyers and sellers have a dozen questions before they ever pick up the phone. We put the answers — and the qualification — right on your site.\n\nAre you focused on buyers, sellers, or both?`;
    }
    if (last.includes('medical') || last.includes('clinic') || last.includes('dental') || last.includes('doctor')) {
      return `Healthcare practices are one of our top use cases.\n\nPatients research heavily before booking. An intelligent platform on your site can answer common questions, pre-qualify them by insurance or condition, and get them to book — without you lifting a finger.\n\nWhat kind of practice?`;
    }
    return `Got it.\n\nHere's what I want to understand: what does your current process look like when someone finds you online — from the moment they land on your site to the moment they become a paying client?`;
  }

  if (last.includes('price') || last.includes('cost') || last.includes('how much') || last.includes('pricing')) {
    return `Here's the honest answer:\n\nPlatforms start at $1,500 with $150/month for ongoing updates and maintenance. More competitive markets or systems with ad management scale with the value.\n\nBut the better question is ROI — what's your average client worth? Because if it's $3,000+, this pays for itself in the first client.`;
  }

  if (last.includes('website') || last.includes('traffic') || last.includes('lead') || last.includes('form')) {
    return `That's the exact gap we close.\n\nForms are passive. People fill them out maybe 2% of the time. Our platforms engage visitors actively — answer their specific questions, build trust, and hand you a qualified contact instead of a cold inquiry.\n\nHow much traffic are you getting right now, roughly?`;
  }

  if (last.includes('example') || last.includes('demo') || last.includes('show me') || last.includes('sample')) {
    return `I can walk you through a live example built for your industry.\n\nThe best way to see it is on a real build — it's different when you see it in context rather than a generic demo.\n\nLet me put something specific together for you. What city or region are you in?`;
  }

  if (userCount >= 3) {
    return `Based on what you've told me, I have a clear picture of where the opportunity is.\n\nI want to put together something specific — not a generic proposal, but an actual breakdown of what we'd build for your business and what it would produce.\n\nLet me get your details so I can follow up properly.`;
  }

  return `Understood.\n\nLet me ask you something specific: in a typical week, how many people come across your business — whether through your site, referrals, or ads — and how many of those actually reach out?\n\nThat gap is exactly where we work.`;
}
