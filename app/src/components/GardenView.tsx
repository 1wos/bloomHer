import { useState } from 'react';

// --- Mock Data ---
const CURRENT_MONTH = new Date(2026, 3); // April 2026
const DAYS_IN_MONTH = 30;
const LOGGED_DAYS = [1, 2, 3, 5, 6, 7, 9, 10, 12, 13, 14, 15, 17, 19, 20, 21, 23, 24, 26, 27, 28, 30];
const TOTAL_DAYS_LOGGED = 87;
const TOTAL_SKILLS = 14;

// Growth stages based on total days logged
const GROWTH_STAGES = [
  { min: 0, max: 14, emoji: '\u{1F331}', label: 'Seed', desc: 'Planting roots' },
  { min: 15, max: 30, emoji: '\u{1F33F}', label: 'Sprout', desc: 'Breaking ground' },
  { min: 31, max: 60, emoji: '\u{1F337}', label: 'Flower', desc: 'Blooming beautifully' },
  { min: 61, max: 120, emoji: '\u{1F333}', label: 'Tree', desc: 'Standing tall' },
  { min: 121, max: Infinity, emoji: '\u{1F338}', label: 'Garden', desc: 'A whole ecosystem' },
];

function getGrowthStage(days: number) {
  return GROWTH_STAGES.find(s => days >= s.min && days <= s.max) || GROWTH_STAGES[0];
}

function getGrowthLevel(days: number) {
  const idx = GROWTH_STAGES.findIndex(s => days >= s.min && days <= s.max);
  return idx + 1;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function GardenView() {
  const stage = getGrowthStage(TOTAL_DAYS_LOGGED);
  const level = getGrowthLevel(TOTAL_DAYS_LOGGED);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Progress to next stage
  const currentStageData = GROWTH_STAGES[level - 1];
  const nextStageData = GROWTH_STAGES[level] || null;
  const progressInStage = TOTAL_DAYS_LOGGED - currentStageData.min;
  const stageRange = currentStageData.max === Infinity ? 100 : currentStageData.max - currentStageData.min;
  const progressPct = Math.min(100, Math.round((progressInStage / stageRange) * 100));

  // Calendar grid: first day of month offset
  const firstDayOfWeek = new Date(CURRENT_MONTH.getFullYear(), CURRENT_MONTH.getMonth(), 1).getDay();

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div
        className="px-5 pt-8 pb-6"
        style={{
          background: 'linear-gradient(135deg, #7B2D8E 0%, #9B4DB0 50%, #7B2D8E 100%)',
        }}
      >
        <h1 className="text-xl font-bold text-white mb-1">Growth Garden</h1>
        <p className="text-sm text-white/70">Watch your journey bloom</p>
      </div>

      {/* Character Growth Card */}
      <div className="mx-4 -mt-3 relative z-10">
        <div
          className="rounded-2xl p-6 shadow-lg animate-scale-in"
          style={{ background: 'linear-gradient(145deg, #FAF5FF 0%, #F3E8FF 100%)' }}
        >
          {/* Growth visualization */}
          <div className="flex items-center gap-5">
            {/* Big emoji character */}
            <div className="relative">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center animate-bloom"
                style={{ background: 'linear-gradient(135deg, #F3E8FF 0%, #E9D5FF 100%)' }}
              >
                <span className="text-5xl">{stage.emoji}</span>
              </div>
              {/* Sparkles */}
              <div className="absolute -top-1 -right-1 text-lg animate-pulse-soft">
                {'\u2728'}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-xs font-semibold px-2.5 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: '#7B2D8E' }}
                >
                  Level {level}
                </span>
                <span className="text-xs font-medium" style={{ color: '#7B2D8E' }}>
                  {stage.label}
                </span>
              </div>
              <p className="text-lg font-bold" style={{ color: '#2D2235' }}>
                Growth Level {level} — {stage.desc}!
              </p>
              <p className="text-xs mt-1" style={{ color: '#7A7185' }}>
                {TOTAL_DAYS_LOGGED} days logged total
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1.5">
              <span style={{ color: '#7A7185' }}>
                {nextStageData ? `Next: ${nextStageData.emoji} ${nextStageData.label}` : 'Max level!'}
              </span>
              <span className="font-semibold" style={{ color: '#7B2D8E' }}>
                {progressPct}%
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full" style={{ backgroundColor: '#E8E0F0' }}>
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${progressPct}%`,
                  background: 'linear-gradient(90deg, #7B2D8E, #9B4DB0)',
                }}
              />
            </div>
          </div>

          {/* Growth timeline */}
          <div className="flex items-center justify-between mt-5 px-2">
            {GROWTH_STAGES.slice(0, 4).map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    backgroundColor: i < level ? '#F3E8FF' : '#F5F5F5',
                    opacity: i < level ? 1 : 0.4,
                    transform: i < level ? 'scale(1)' : 'scale(0.85)',
                  }}
                >
                  <span className="text-xl">{s.emoji}</span>
                </div>
                {i < 3 && (
                  <div className="absolute" style={{ marginLeft: '3.5rem' }}>
                    {/* connector line handled by flex gap */}
                  </div>
                )}
                <span className="text-[10px]" style={{ color: i < level ? '#7B2D8E' : '#B0A8B9' }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 mx-4 mt-4">
        {[
          { value: TOTAL_DAYS_LOGGED, label: 'Days Logged', icon: '\u{1F4C5}' },
          { value: TOTAL_SKILLS, label: 'Skills Found', icon: '\u{1F31F}' },
          { value: `${LOGGED_DAYS.length}/${DAYS_IN_MONTH}`, label: 'This Month', icon: '\u{1F525}' },
        ].map((stat, i) => (
          <div
            key={i}
            className="rounded-xl p-3 text-center animate-fade-in-up"
            style={{
              backgroundColor: '#FAF5FF',
              animationDelay: `${i * 100}ms`,
            }}
          >
            <span className="text-lg">{stat.icon}</span>
            <p className="text-lg font-bold mt-0.5" style={{ color: '#2D2235' }}>
              {stat.value}
            </p>
            <p className="text-[10px]" style={{ color: '#7A7185' }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Monthly Calendar */}
      <div className="mx-4 mt-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold" style={{ color: '#2D2235' }}>
            {MONTH_NAMES[CURRENT_MONTH.getMonth()]} {CURRENT_MONTH.getFullYear()}
          </h2>
          <span className="text-xs font-medium" style={{ color: '#7B2D8E' }}>
            {LOGGED_DAYS.length} days {'\u2728'}
          </span>
        </div>

        {/* Day labels */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div key={i} className="text-center text-[10px] font-medium" style={{ color: '#B0A8B9' }}>
              {d}
            </div>
          ))}
        </div>

        {/* Dot calendar */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for offset */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="h-9" />
          ))}
          {/* Day dots */}
          {Array.from({ length: DAYS_IN_MONTH }).map((_, i) => {
            const day = i + 1;
            const isLogged = LOGGED_DAYS.includes(day);
            const isSelected = selectedDay === day;
            const isToday = day === 9; // mock: today is April 9
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(isSelected ? null : day)}
                className="h-9 w-9 flex items-center justify-center rounded-full transition-all duration-200 animate-dot"
                style={{
                  animationDelay: `${i * 15}ms`,
                  backgroundColor: isSelected
                    ? '#7B2D8E'
                    : 'transparent',
                  border: isToday ? '2px solid #7B2D8E' : '2px solid transparent',
                }}
              >
                {isSelected ? (
                  <span className="text-white text-xs font-bold">{day}</span>
                ) : isLogged ? (
                  <span className="text-base">{['🌷', '🌸', '🌱', '💜', '✨'][day % 5]}</span>
                ) : (
                  <span className="text-xs text-gray-300">{day}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected day info */}
        {selectedDay !== null && (
          <div
            className="mt-3 p-3 rounded-xl text-sm animate-fade-in-up"
            style={{ backgroundColor: '#FAF5FF' }}
          >
            {LOGGED_DAYS.includes(selectedDay) ? (
              <p>
                <span className="font-semibold" style={{ color: '#7B2D8E' }}>
                  April {selectedDay}
                </span>{' '}
                — You reflected and grew {'\u{1F331}'}
              </p>
            ) : (
              <p style={{ color: '#7A7185' }}>
                <span className="font-semibold">April {selectedDay}</span> — Rest day.{' '}
                <span style={{ color: '#7B2D8E' }}>Rest days are growth too {'\u{1F49C}'}</span>
              </p>
            )}
          </div>
        )}
      </div>

      {/* Rest days message */}
      <div className="mx-4 mt-5 mb-6">
        <div
          className="rounded-xl p-4 flex items-start gap-3"
          style={{
            background: 'linear-gradient(135deg, #FAF5FF 0%, #F0FFF4 100%)',
            border: '1px solid #E8E0F0',
          }}
        >
          <span className="text-2xl mt-0.5">{'\u{1F33C}'}</span>
          <div>
            <p className="text-sm font-semibold mb-0.5" style={{ color: '#2D2235' }}>
              Rest days are growth too
            </p>
            <p className="text-xs leading-relaxed" style={{ color: '#7A7185' }}>
              Even gardens need quiet days. Every pause lets roots grow deeper. You've shown up{' '}
              <span className="font-semibold" style={{ color: '#7B2D8E' }}>
                {LOGGED_DAYS.length} out of {DAYS_IN_MONTH}
              </span>{' '}
              days this month — that's incredible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
