import { useState, useRef, useEffect } from 'react';
import SkillCard, { type Skill } from './SkillCard';
import GrowthStreak from './GrowthStreak';
import ThinkingDots from './ThinkingDots';
import HITLControls from './HITLControls';
import { discoverGrowth } from '../services/ai';
import { useTypewriter } from '../hooks/useTypewriter';
import { collectSkill, addEntry, setSkillVerification } from '../services/storage';
import type { EntryRecord, VerificationState } from '../services/storage';
import type { ReasoningStep } from '../types';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'skill' | 'reasoning';
  text?: string;
  skill?: Skill;
  // Store raw skill data for storage calls
  rawSkill?: { name: string; icon: string; description: string };
  // HITL verification tracking
  entryId?: string;
  skillId?: string;
  verification?: VerificationState;
  reasoningSteps?: ReasoningStep[];
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
  text: "Hi! I'm BloomHer \u{1F337} Your personal growth discovery companion. Tell me something you did today \u2014 even the smallest thing \u2014 and I'll show you the hidden skills you didn't know you had!",
  timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
};

interface ChatViewProps {
  onSkillCollected: () => void;
  streak: number;
  loggedDays: number[];
}

export default function ChatView({ onSkillCollected, streak, loggedDays }: ChatViewProps) {
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasAnimatedWelcome = useRef(false);
  // Track last user input for storage
  const lastUserInputRef = useRef('');

  const welcomeAnimated = useTypewriter(welcomeMessage.text!, {
    speed: 30,
    enabled: !hasAnimatedWelcome.current,
  });

  useEffect(() => {
    if (welcomeAnimated === welcomeMessage.text) {
      hasAnimatedWelcome.current = true;
    }
  }, [welcomeAnimated]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleVerify = (msg: Message, state: VerificationState) => {
    if (!msg.entryId || !msg.skillId) return;
    let editedName: string | undefined;
    if (state === 'edited') {
      const input = window.prompt(
        'Edit this skill name:',
        msg.rawSkill?.name ?? msg.skill?.title ?? ''
      );
      if (!input || !input.trim()) return;
      editedName = input.trim();
    }
    setSkillVerification(msg.entryId, msg.skillId, state, editedName);
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msg.id
          ? {
              ...m,
              verification: state,
              skill: m.skill && editedName ? { ...m.skill, title: editedName } : m.skill,
              rawSkill: m.rawSkill && editedName ? { ...m.rawSkill, name: editedName } : m.rawSkill,
            }
          : m
      )
    );
    onSkillCollected();
  };

  const handleCollect = (msg: Message) => {
    if (msg.rawSkill) {
      const category = mapCategory(msg.rawSkill.name);
      collectSkill(
        msg.rawSkill.name,
        msg.rawSkill.icon,
        msg.rawSkill.description,
        lastUserInputRef.current,
        category,
      );
    }
    onSkillCollected();
  };

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    lastUserInputRef.current = trimmed;
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

      // Observable reasoning steps (Julia feedback: make thinking transparent)
      if (result.reasoningSteps && result.reasoningSteps.length > 0) {
        const reasoningMsg: Message = {
          id: `reasoning-${Date.now()}`,
          type: 'reasoning',
          reasoningSteps: result.reasoningSteps,
          timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, reasoningMsg]);
      }

      // Pre-generate stable IDs so we can wire HITL callbacks
      const entryId = `entry-${Date.now()}`;
      const skillMetas = (result.skills ?? []).map((s, i) => {
        const icon = s.icon || ['\u{1F331}', '\u{1F50D}', '\u{1F4A1}', '\u26A1', '\u{1F3AF}'][i % 5];
        return {
          skillId: `sk-${Date.now()}-${i}`,
          name: s.name,
          icon,
          description: s.description,
        };
      });

      // Save entry FIRST so setSkillVerification can find it
      const entry: EntryRecord = {
        id: entryId,
        date: new Date().toISOString().split('T')[0],
        input: trimmed,
        skills: skillMetas.map((m) => ({
          id: m.skillId,
          name: m.name,
          icon: m.icon,
          description: m.description,
          verification: 'pending',
        })),
        type: 'daily',
      };
      addEntry(entry);
      onSkillCollected();

      // Skill cards (staggered animation)
      for (let i = 0; i < skillMetas.length; i++) {
        await new Promise((r) => setTimeout(r, 400));
        const m = skillMetas[i];
        const skillMsg: Message = {
          id: `skill-${Date.now()}-${i}`,
          type: 'skill',
          skill: {
            id: m.skillId,
            emoji: m.icon,
            title: m.name,
            description: m.description,
            category: mapCategory(m.name || 'creativity'),
          },
          rawSkill: { name: m.name, icon: m.icon, description: m.description },
          entryId,
          skillId: m.skillId,
          verification: 'pending',
          timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, skillMsg]);
      }
    } catch (err) {
      console.error('AI call failed:', err);
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        type: 'ai',
        text: "I'm having trouble connecting right now, but I can tell that what you shared matters. Try again in a moment! \u{1F337}",
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
                    <p className="text-sm text-text leading-relaxed">
                      {msg.id === 'welcome' ? welcomeAnimated : msg.text}
                    </p>
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
              <div className="ml-10 mr-2 flex flex-col gap-2">
                <SkillCard
                  skill={msg.skill}
                  onCollect={() => handleCollect(msg)}
                  delay={100}
                />
                {msg.entryId && msg.skillId && (
                  <div className="pl-1">
                    <HITLControls
                      size="sm"
                      state={msg.verification ?? 'pending'}
                      onApprove={() => handleVerify(msg, 'approved')}
                      onEdit={() => handleVerify(msg, 'edited')}
                      onReject={() => handleVerify(msg, 'rejected')}
                      onUndo={() => handleVerify(msg, 'pending')}
                    />
                  </div>
                )}
              </div>
            )}

            {msg.type === 'reasoning' && msg.reasoningSteps && msg.reasoningSteps.length > 0 && (
              <div className="ml-10 mr-2 mt-1">
                <details className="group rounded-xl border border-[#7B2D8E]/15 bg-[#FAF5FF] overflow-hidden">
                  <summary className="cursor-pointer select-none list-none px-3 py-2 flex items-center gap-2 hover:bg-[#F3E8FF]/70 transition-colors">
                    <span className="text-[11px] font-semibold tracking-wide text-[#7B2D8E] uppercase">
                      How I arrived at this
                    </span>
                    <span className="text-[#7B2D8E]/60 text-xs ml-auto group-open:rotate-90 transition-transform">
                      &rsaquo;
                    </span>
                  </summary>
                  <div className="px-3 pb-3 pt-1 flex flex-col gap-2">
                    {msg.reasoningSteps.map((step, idx) => (
                      <div key={idx} className="flex gap-2 items-start">
                        <span className="shrink-0 w-5 h-5 rounded-full bg-[#7B2D8E]/10 flex items-center justify-center text-[10px] font-bold text-[#7B2D8E] mt-0.5">
                          {idx + 1}
                        </span>
                        <div className="flex-1">
                          <div className="text-[11px] font-semibold text-[#7B2D8E]">
                            {step.label}
                          </div>
                          <div className="text-xs text-[#4A3860] leading-relaxed mt-0.5">
                            {step.content}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator — CareFlow-style 3 dots */}
        {isTyping && (
          <div className="flex items-start gap-2.5 animate-fade-in-up">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm"
              style={{ background: 'linear-gradient(135deg, #7B2D8E, #D946A8)' }}
            >
              B
            </div>
            <div className="bg-lavender/70 rounded-2xl rounded-tl-md px-4 py-3">
              <ThinkingDots label="BloomHer is thinking" size="sm" />
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
