import { useState, useRef, useEffect } from 'react';
import SkillCard, { type Skill } from './SkillCard';
import GrowthStreak from './GrowthStreak';
import { discoverGrowth } from '../services/ai';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'skill';
  text?: string;
  skill?: Skill;
  timestamp: string;
}

const CATEGORY_MAP: Record<string, Skill['category']> = {
  analytical: 'strategy',
  communication: 'leadership',
  leadership: 'leadership',
  creativity: 'creativity',
  empathy: 'empathy',
  resilience: 'resilience',
  strategy: 'strategy',
};

function mapCategory(raw: string): Skill['category'] {
  const lower = raw.toLowerCase();
  for (const [key, val] of Object.entries(CATEGORY_MAP)) {
    if (lower.includes(key)) return val;
  }
  return 'creativity';
}

const welcomeMessage: Message = {
  id: 'welcome',
  type: 'ai',
  text: "Hi! I'm BloomHer 🌷 Your personal growth discovery companion. Tell me something you did today — even the smallest thing — and I'll show you the hidden skills you didn't know you had!",
  timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
};

interface ChatViewProps {
  onSkillCollected: () => void;
}

export default function ChatView({ onSkillCollected }: ChatViewProps) {
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const streak = 12;
  const loggedDays = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    const now = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      text: trimmed,
      timestamp: now,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const result = await discoverGrowth(trimmed);

      // AI text response
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        text: result.encouragement || "I can see real growth in what you shared! Let me show you what skills were at play...",
        timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);

      // Skill cards
      if (result.skills && result.skills.length > 0) {
        for (let i = 0; i < result.skills.length; i++) {
          await new Promise((r) => setTimeout(r, 400));
          const s = result.skills[i];
          const skillMsg: Message = {
            id: `skill-${Date.now()}-${i}`,
            type: 'skill',
            skill: {
              id: `skill-${Date.now()}-${i}`,
              emoji: s.icon || ['🌱', '🔍', '💡', '⚡', '🎯'][i % 5],
              title: s.name,
              description: s.description,
              category: mapCategory(s.name || 'creativity'),
            },
            timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
          };
          setMessages((prev) => [...prev, skillMsg]);
        }
      }
    } catch (err) {
      console.error('AI call failed:', err);
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        type: 'ai',
        text: "I'm having trouble connecting right now, but I can tell that what you shared matters. Try again in a moment! 🌷",
        timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Growth streak header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-border/60 z-10">
        <GrowthStreak streak={streak} loggedDays={loggedDays} />
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-4">
        {messages.map((msg, i) => (
          <div
            key={msg.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${Math.min(i * 50, 300)}ms` }}
          >
            {msg.type === 'ai' && (
              <div className="flex items-start gap-2.5 max-w-[88%]">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5 shadow-sm"
                  style={{ background: 'linear-gradient(135deg, #7B2D8E, #D946A8)' }}>
                  B
                </div>
                <div>
                  <div className="bg-lavender/70 rounded-2xl rounded-tl-md px-4 py-3">
                    <p className="text-sm text-text leading-relaxed">{msg.text}</p>
                  </div>
                  <p className="text-[10px] text-text-muted mt-1 ml-1">{msg.timestamp}</p>
                </div>
              </div>
            )}

            {msg.type === 'user' && (
              <div className="flex justify-end">
                <div className="max-w-[80%]">
                  <div className="bg-purple text-white rounded-2xl rounded-tr-md px-4 py-3 shadow-sm">
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                  <p className="text-[10px] text-text-muted mt-1 mr-1 text-right">{msg.timestamp}</p>
                </div>
              </div>
            )}

            {msg.type === 'skill' && msg.skill && (
              <div className="ml-10 mr-2">
                <SkillCard
                  skill={msg.skill}
                  onCollect={() => onSkillCollected()}
                  delay={100}
                />
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-start gap-2.5 animate-fade-in-up">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm"
              style={{ background: 'linear-gradient(135deg, #7B2D8E, #D946A8)' }}>
              B
            </div>
            <div className="bg-lavender/70 rounded-2xl rounded-tl-md px-4 py-3">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-purple/50 animate-pulse-soft" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-purple/50 animate-pulse-soft" style={{ animationDelay: '300ms' }} />
                <div className="w-2 h-2 rounded-full bg-purple/50 animate-pulse-soft" style={{ animationDelay: '600ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-border/60 bg-white/95 backdrop-blur-md px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] mb-16">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center bg-lavender-soft rounded-full px-4 py-2.5 border border-border/40 focus-within:border-purple/40 focus-within:ring-2 focus-within:ring-purple/10 transition-all duration-200">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tell me about your day..."
              className="flex-1 bg-transparent text-sm text-text placeholder:text-text-muted/60 outline-none"
              disabled={isTyping}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isTyping}
            className={`
              w-10 h-10 rounded-full flex items-center justify-center
              transition-all duration-200 shrink-0 cursor-pointer
              ${
                input.trim() && !isTyping
                  ? 'bg-purple text-white shadow-md hover:bg-purple-light active:scale-90'
                  : 'bg-border/50 text-text-muted/40'
              }
            `}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
