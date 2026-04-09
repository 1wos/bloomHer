import { useState, useRef, useEffect } from 'react';
import { useTypewriter } from '../hooks/useTypewriter';

// --- Mock Data ---
const WEEKLY_DATA = {
  grewIn: ['Empathy', 'Problem Solving', 'Creative Thinking'],
  hiddenStrength: {
    skill: 'Active Listening',
    emoji: '\u{1F4AC}',
    insight: 'You mentioned listening and understanding others 4 times this week. This quiet strength makes you an anchor for your team.',
  },
  growthTrend: [
    { day: 'Mon', skills: 3 },
    { day: 'Tue', skills: 2 },
    { day: 'Wed', skills: 4 },
    { day: 'Thu', skills: 1 },
    { day: 'Fri', skills: 5 },
    { day: 'Sat', skills: 3 },
    { day: 'Sun', skills: 2 },
  ],
  nextOpportunity: {
    skill: 'Public Speaking',
    emoji: '\u{1F3A4}',
    suggestion: 'You\'ve been building confidence in communication. Try sharing your ideas in the next group setting — your voice matters.',
  },
};

interface CardProps {
  isActive: boolean;
  index: number;
}

function Card1({ isActive }: CardProps) {
  const grewInText = useTypewriter('You grew in...', { speed: 30, enabled: isActive });

  return (
    <div
      className="w-full h-full rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden"
      style={{
        background: 'linear-gradient(150deg, #7B2D8E 0%, #5A1A6B 40%, #7B2D8E 100%)',
      }}
    >

      <div className="relative z-10">
        <p className="text-white/60 text-sm font-medium mb-2">This week</p>
        <h2 className="text-3xl font-bold text-white leading-tight">
          {grewInText}
        </h2>
      </div>

      <div className="relative z-10 space-y-3">
        {WEEKLY_DATA.grewIn.map((skill, i) => (
          <div
            key={skill}
            className="flex items-center gap-3 transition-all duration-500"
            style={{
              opacity: isActive ? 1 : 0,
              transform: isActive ? 'translateX(0)' : 'translateX(-20px)',
              transitionDelay: `${300 + i * 150}ms`,
            }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
            >
              <span className="text-xl">
                {['\u{1F49B}', '\u{1F9E0}', '\u{1F3A8}'][i]}
              </span>
            </div>
            <span className="text-white text-lg font-semibold">{skill}</span>
          </div>
        ))}
      </div>

      <div className="relative z-10">
        <p className="text-white/50 text-xs">
          Week of April 3 - 9, 2026
        </p>
      </div>
    </div>
  );
}

function Card2({ isActive }: CardProps) {
  const { hiddenStrength } = WEEKLY_DATA;
  return (
    <div
      className="w-full h-full rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden"
      style={{
        background: 'linear-gradient(150deg, #9B4DB0 0%, #7B2D8E 50%, #5A1A6B 100%)',
      }}
    >

      <div className="relative z-10">
        <p className="text-white/60 text-sm font-medium mb-2">Hidden strength</p>
        <h2 className="text-3xl font-bold text-white leading-tight">
          Your superpower{'\u2026'}
        </h2>
      </div>

      <div className="relative z-10 text-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3 transition-all duration-700"
          style={{
            backgroundColor: 'rgba(255,255,255,0.15)',
            transform: isActive ? 'scale(1)' : 'scale(0.5)',
            opacity: isActive ? 1 : 0,
          }}
        >
          <span className="text-5xl">{hiddenStrength.emoji}</span>
        </div>
        <h3
          className="text-2xl font-bold text-white mb-2 transition-all duration-500"
          style={{
            opacity: isActive ? 1 : 0,
            transform: isActive ? 'translateY(0)' : 'translateY(10px)',
            transitionDelay: '300ms',
          }}
        >
          {hiddenStrength.skill}
        </h3>
        <p
          className="text-white/70 text-sm leading-relaxed transition-all duration-500"
          style={{
            opacity: isActive ? 1 : 0,
            transitionDelay: '500ms',
          }}
        >
          {hiddenStrength.insight}
        </p>
      </div>

      <div className="relative z-10">
        <p className="text-white/40 text-xs text-center">
          Discovered through your journal entries
        </p>
      </div>
    </div>
  );
}

function Card3({ isActive }: CardProps) {
  const { growthTrend } = WEEKLY_DATA;
  const maxSkills = Math.max(...growthTrend.map(d => d.skills));
  const totalSkills = growthTrend.reduce((sum, d) => sum + d.skills, 0);

  return (
    <div
      className="w-full h-full rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden"
      style={{
        background: 'linear-gradient(150deg, #5A1A6B 0%, #7B2D8E 60%, #9B4DB0 100%)',
      }}
    >

      <div className="relative z-10">
        <p className="text-white/60 text-sm font-medium mb-2">Growth trend</p>
        <h2 className="text-3xl font-bold text-white leading-tight">
          {totalSkills} skill moments
        </h2>
        <p className="text-white/50 text-sm mt-1">across 7 days</p>
      </div>

      {/* Bar chart */}
      <div className="relative z-10 flex items-end justify-between gap-2 h-36 px-2">
        {growthTrend.map((day, i) => (
          <div key={day.day} className="flex flex-col items-center gap-2 flex-1">
            <span
              className="text-white text-xs font-bold transition-all duration-500"
              style={{
                opacity: isActive ? 1 : 0,
                transitionDelay: `${400 + i * 80}ms`,
              }}
            >
              {day.skills}
            </span>
            <div
              className="w-full rounded-t-lg transition-all duration-700 ease-out"
              style={{
                height: isActive ? `${(day.skills / maxSkills) * 100}%` : '0%',
                backgroundColor:
                  day.skills === maxSkills
                    ? '#4CAF50'
                    : 'rgba(255,255,255,0.25)',
                transitionDelay: `${200 + i * 80}ms`,
                minHeight: isActive ? '8px' : '0px',
              }}
            />
            <span className="text-white/50 text-[10px]">{day.day}</span>
          </div>
        ))}
      </div>

      <div className="relative z-10">
        <p className="text-white/50 text-xs text-center">
          Friday was your peak growth day {'\u{1F31F}'}
        </p>
      </div>
    </div>
  );
}

function Card4({ isActive }: CardProps) {
  const { nextOpportunity } = WEEKLY_DATA;
  return (
    <div
      className="w-full h-full rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden"
      style={{
        background: 'linear-gradient(150deg, #7B2D8E 0%, #D946A8 100%)',
      }}
    >

      <div className="relative z-10">
        <p className="text-white/60 text-sm font-medium mb-2">Looking ahead</p>
        <h2 className="text-3xl font-bold text-white leading-tight">
          Next week's opportunity
        </h2>
      </div>

      <div className="relative z-10 text-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-700"
          style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            transform: isActive ? 'scale(1) rotate(0deg)' : 'scale(0.3) rotate(-20deg)',
            opacity: isActive ? 1 : 0,
          }}
        >
          <span className="text-5xl">{nextOpportunity.emoji}</span>
        </div>
        <h3
          className="text-2xl font-bold text-white mb-3 transition-all duration-500"
          style={{
            opacity: isActive ? 1 : 0,
            transform: isActive ? 'translateY(0)' : 'translateY(10px)',
            transitionDelay: '300ms',
          }}
        >
          {nextOpportunity.skill}
        </h3>
        <p
          className="text-white/80 text-sm leading-relaxed transition-all duration-500"
          style={{
            opacity: isActive ? 1 : 0,
            transitionDelay: '500ms',
          }}
        >
          {nextOpportunity.suggestion}
        </p>
      </div>

      <div className="relative z-10 text-center">
        <p className="text-white/60 text-xs">
          You've got this {'\u{1F33F}'}
        </p>
      </div>
    </div>
  );
}

const CARDS = [Card1, Card2, Card3, Card4];
const CARD_TITLES = ['Growth', 'Strength', 'Trend', 'Opportunity'];

export default function WeeklyView() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);

  const goTo = (index: number) => {
    if (index >= 0 && index < CARDS.length) {
      setActiveIndex(index);
    }
  };

  // Touch/swipe support
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const diff = touchStartX.current - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) goTo(activeIndex + 1);
        else goTo(activeIndex - 1);
      }
    };

    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  });

  // Keyboard support
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goTo(activeIndex + 1);
      if (e.key === 'ArrowLeft') goTo(activeIndex - 1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  const ActiveCard = CARDS[activeIndex];

  return (
    <div className="min-h-screen bg-white pb-24 flex flex-col">
      {/* Header */}
      <div
        className="px-5 pt-8 pb-6"
        style={{
          background: 'linear-gradient(135deg, #7B2D8E 0%, #9B4DB0 50%, #7B2D8E 100%)',
        }}
      >
        <h1 className="text-xl font-bold text-white mb-1">Weekly Report</h1>
        <p className="text-sm text-white/70">
          Your Wrapped-style growth summary
        </p>
      </div>

      {/* Card area */}
      <div className="flex-1 flex flex-col px-4 pt-4" ref={containerRef}>
        {/* Navigation arrows + card */}
        <div className="flex items-center gap-2 flex-1">
          {/* Left arrow */}
          <button
            onClick={() => goTo(activeIndex - 1)}
            disabled={activeIndex === 0}
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-200"
            style={{
              backgroundColor: activeIndex === 0 ? '#F5F5F5' : '#F3E8FF',
              color: activeIndex === 0 ? '#D0D0D0' : '#7B2D8E',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Card container */}
          <div
            className="flex-1 relative overflow-hidden"
            style={{ minHeight: '420px', maxHeight: '480px' }}
          >
            <div
              className="absolute inset-0 transition-all duration-500 ease-out"
              style={{
                opacity: 1,
                transform: 'scale(1)',
              }}
              key={activeIndex}
            >
              <ActiveCard isActive={true} index={activeIndex} />
            </div>
          </div>

          {/* Right arrow */}
          <button
            onClick={() => goTo(activeIndex + 1)}
            disabled={activeIndex === CARDS.length - 1}
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-200"
            style={{
              backgroundColor: activeIndex === CARDS.length - 1 ? '#F5F5F5' : '#F3E8FF',
              color: activeIndex === CARDS.length - 1 ? '#D0D0D0' : '#7B2D8E',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {CARDS.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="flex flex-col items-center gap-1.5 transition-all duration-200"
            >
              <div
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === activeIndex ? '24px' : '8px',
                  height: '8px',
                  backgroundColor: i === activeIndex ? '#7B2D8E' : '#E8E0F0',
                }}
              />
              <span
                className="text-[10px] font-medium transition-all duration-200"
                style={{
                  color: i === activeIndex ? '#7B2D8E' : '#B0A8B9',
                }}
              >
                {CARD_TITLES[i]}
              </span>
            </button>
          ))}
        </div>

        {/* Swipe hint */}
        <p
          className="text-center text-[10px] mt-3 mb-4"
          style={{ color: '#B0A8B9' }}
        >
          Swipe or use arrows to navigate {'\u2190'} {'\u2192'}
        </p>
      </div>
    </div>
  );
}
