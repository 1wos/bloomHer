import { useState } from 'react';

export interface Skill {
  id: string;
  emoji: string;
  title: string;
  description: string;
  category: 'leadership' | 'creativity' | 'empathy' | 'resilience' | 'strategy';
  collected?: boolean;
}

const categoryColors: Record<Skill['category'], { bg: string; border: string; text: string }> = {
  leadership: { bg: 'bg-purple/8', border: 'border-purple/20', text: 'text-purple' },
  creativity: { bg: 'bg-warm/10', border: 'border-warm/25', text: 'text-warm' },
  empathy: { bg: 'bg-green/8', border: 'border-green/20', text: 'text-green-dark' },
  resilience: { bg: 'bg-purple-light/10', border: 'border-purple-light/20', text: 'text-purple-light' },
  strategy: { bg: 'bg-warm/8', border: 'border-warm/20', text: 'text-warm' },
};

interface SkillCardProps {
  skill: Skill;
  onCollect?: (id: string) => void;
  delay?: number;
}

export default function SkillCard({ skill, onCollect, delay = 0 }: SkillCardProps) {
  const [collected, setCollected] = useState(skill.collected ?? false);
  const [animating, setAnimating] = useState(false);
  const colors = categoryColors[skill.category];

  const handleCollect = () => {
    if (collected) return;
    setAnimating(true);
    setTimeout(() => {
      setCollected(true);
      setAnimating(false);
      onCollect?.(skill.id);
    }, 500);
  };

  return (
    <div
      className={`
        rounded-2xl border p-4 animate-bloom
        ${colors.bg} ${colors.border}
        ${animating ? 'animate-collect' : ''}
        transition-all duration-300
      `}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start gap-3">
        {/* Emoji badge */}
        <div className="w-12 h-12 rounded-xl bg-white/80 flex items-center justify-center text-2xl shadow-sm shrink-0">
          {skill.emoji}
        </div>

        <div className="flex-1 min-w-0">
          {/* Category tag */}
          <span className={`text-[10px] font-semibold uppercase tracking-wider ${colors.text}`}>
            {skill.category}
          </span>

          {/* Title */}
          <h3 className="text-sm font-semibold text-text mt-0.5 leading-snug">
            {skill.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-text-muted mt-1 leading-relaxed">
            {skill.description}
          </p>
        </div>

        {/* Collect button */}
        <button
          onClick={handleCollect}
          disabled={collected}
          className={`
            shrink-0 mt-1 px-3 py-1.5 rounded-full text-xs font-semibold
            transition-all duration-300 cursor-pointer
            ${
              collected
                ? 'bg-green/15 text-green-dark'
                : 'bg-purple text-white shadow-sm hover:bg-purple-light active:scale-95'
            }
          `}
        >
          {collected ? (
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Saved
            </span>
          ) : (
            'Collect'
          )}
        </button>
      </div>
    </div>
  );
}
