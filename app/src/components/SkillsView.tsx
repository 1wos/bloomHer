import { useState } from 'react';

// --- Mock Data ---
interface Skill {
  id: string;
  emoji: string;
  name: string;
  category: string;
  count: number;
  lastDiscovered: string;
}

const SKILLS: Skill[] = [
  { id: '1', emoji: '\u{1F9E0}', name: 'Problem Solving', category: 'Analytical', count: 12, lastDiscovered: '2026-04-09' },
  { id: '2', emoji: '\u{1F4AC}', name: 'Active Listening', category: 'Communication', count: 9, lastDiscovered: '2026-04-08' },
  { id: '3', emoji: '\u{1F451}', name: 'Decision Making', category: 'Leadership', count: 7, lastDiscovered: '2026-04-07' },
  { id: '4', emoji: '\u{1F3A8}', name: 'Creative Thinking', category: 'Creativity', count: 8, lastDiscovered: '2026-04-09' },
  { id: '5', emoji: '\u{1F49B}', name: 'Empathy', category: 'Empathy', count: 11, lastDiscovered: '2026-04-09' },
  { id: '6', emoji: '\u{1F4CA}', name: 'Data Analysis', category: 'Analytical', count: 6, lastDiscovered: '2026-04-05' },
  { id: '7', emoji: '\u{1F91D}', name: 'Negotiation', category: 'Communication', count: 4, lastDiscovered: '2026-04-03' },
  { id: '8', emoji: '\u{1F680}', name: 'Initiative', category: 'Leadership', count: 5, lastDiscovered: '2026-04-06' },
  { id: '9', emoji: '\u{1F4DD}', name: 'Writing', category: 'Communication', count: 10, lastDiscovered: '2026-04-08' },
  { id: '10', emoji: '\u{1F52E}', name: 'Strategic Vision', category: 'Analytical', count: 3, lastDiscovered: '2026-04-01' },
  { id: '11', emoji: '\u{1F30D}', name: 'Adaptability', category: 'Empathy', count: 7, lastDiscovered: '2026-04-07' },
  { id: '12', emoji: '\u{1F4A1}', name: 'Innovation', category: 'Creativity', count: 6, lastDiscovered: '2026-04-04' },
  { id: '13', emoji: '\u{1F465}', name: 'Team Building', category: 'Leadership', count: 5, lastDiscovered: '2026-04-06' },
  { id: '14', emoji: '\u{1F50D}', name: 'Attention to Detail', category: 'Analytical', count: 8, lastDiscovered: '2026-04-09' },
];

const CATEGORIES = ['All', 'Analytical', 'Communication', 'Leadership', 'Creativity', 'Empathy'];

const CATEGORY_COLORS: Record<string, string> = {
  Analytical: '#9B6BB0',
  Communication: '#6BB0A0',
  Leadership: '#C084B0',
  Creativity: '#B08DC0',
  Empathy: '#8BBAD0',
};

type SortMode = 'frequent' | 'recent';

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}`;
}

export default function SkillsView() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortMode, setSortMode] = useState<SortMode>('frequent');

  const maxCount = Math.max(...SKILLS.map(s => s.count));

  const filtered = SKILLS
    .filter(s => selectedCategory === 'All' || s.category === selectedCategory)
    .sort((a, b) => {
      if (sortMode === 'frequent') return b.count - a.count;
      return new Date(b.lastDiscovered).getTime() - new Date(a.lastDiscovered).getTime();
    });

  const totalDiscoveries = SKILLS.reduce((sum, s) => sum + s.count, 0);

  // Category frequency for bar chart
  const categoryFreq = CATEGORIES.filter(c => c !== 'All').map(cat => ({
    name: cat,
    count: SKILLS.filter(s => s.category === cat).reduce((sum, s) => sum + s.count, 0),
    color: CATEGORY_COLORS[cat],
  }));
  const maxCatCount = Math.max(...categoryFreq.map(c => c.count));

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div
        className="px-5 pt-8 pb-6"
        style={{
          background: 'linear-gradient(135deg, #7B2D8E 0%, #9B4DB0 50%, #7B2D8E 100%)',
        }}
      >
        <h1 className="text-xl font-bold text-white mb-1">Skills Collection</h1>
        <p className="text-sm text-white/70">
          {SKILLS.length} skills discovered {'\u00B7'} {totalDiscoveries} total moments
        </p>
      </div>

      {/* Radar chart */}
      <div className="mx-4 mt-4 relative z-10">
        <div
          className="rounded-2xl p-5 shadow-lg animate-scale-in"
          style={{ background: 'linear-gradient(145deg, #FAF5FF 0%, #F3E8FF 100%)' }}
        >
          <h3 className="text-sm font-bold mb-4 text-center" style={{ color: '#2D2235' }}>
            Your Skill Profile
          </h3>
          <div className="flex justify-center">
            <svg viewBox="0 0 200 200" width="220" height="220">
              {/* Background pentagons */}
              {[1, 0.75, 0.5, 0.25].map((scale) => (
                <polygon
                  key={scale}
                  points={categoryFreq.map((_, i) => {
                    const angle = (Math.PI * 2 * i) / categoryFreq.length - Math.PI / 2;
                    const r = 70 * scale;
                    return `${100 + r * Math.cos(angle)},${100 + r * Math.sin(angle)}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#E8D5F5"
                  strokeWidth="1"
                />
              ))}
              {/* Axis lines */}
              {categoryFreq.map((_, i) => {
                const angle = (Math.PI * 2 * i) / categoryFreq.length - Math.PI / 2;
                return (
                  <line
                    key={`axis-${i}`}
                    x1="100" y1="100"
                    x2={100 + 70 * Math.cos(angle)}
                    y2={100 + 70 * Math.sin(angle)}
                    stroke="#E8D5F5"
                    strokeWidth="1"
                  />
                );
              })}
              {/* Data polygon */}
              <polygon
                points={categoryFreq.map((cat, i) => {
                  const angle = (Math.PI * 2 * i) / categoryFreq.length - Math.PI / 2;
                  const r = 70 * (cat.count / maxCatCount);
                  return `${100 + r * Math.cos(angle)},${100 + r * Math.sin(angle)}`;
                }).join(' ')}
                fill="rgba(123, 45, 142, 0.15)"
                stroke="#7B2D8E"
                strokeWidth="2"
              />
              {/* Data dots */}
              {categoryFreq.map((cat, i) => {
                const angle = (Math.PI * 2 * i) / categoryFreq.length - Math.PI / 2;
                const r = 70 * (cat.count / maxCatCount);
                return (
                  <circle
                    key={`dot-${i}`}
                    cx={100 + r * Math.cos(angle)}
                    cy={100 + r * Math.sin(angle)}
                    r="4"
                    fill={cat.color}
                    stroke="white"
                    strokeWidth="2"
                  />
                );
              })}
              {/* Labels */}
              {categoryFreq.map((cat, i) => {
                const angle = (Math.PI * 2 * i) / categoryFreq.length - Math.PI / 2;
                const labelR = 88;
                const x = 100 + labelR * Math.cos(angle);
                const y = 100 + labelR * Math.sin(angle);
                return (
                  <text
                    key={`label-${i}`}
                    x={x} y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="9"
                    fontWeight="600"
                    fill="#7B2D8E"
                  >
                    {cat.name}
                  </text>
                );
              })}
              {/* Count labels */}
              {categoryFreq.map((cat, i) => {
                const angle = (Math.PI * 2 * i) / categoryFreq.length - Math.PI / 2;
                const labelR = 78;
                const x = 100 + labelR * Math.cos(angle);
                const y = 100 + labelR * Math.sin(angle) + 10;
                return (
                  <text
                    key={`count-${i}`}
                    x={x} y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="8"
                    fill="#9B6BB0"
                  >
                    {cat.count}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* Category filter pills */}
      <div className="px-4 mt-4 overflow-x-auto">
        <div className="flex gap-2 pb-1" style={{ minWidth: 'max-content' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
              style={{
                backgroundColor: selectedCategory === cat ? '#7B2D8E' : '#FAF5FF',
                color: selectedCategory === cat ? '#FEFEFE' : '#7A7185',
                border: `1px solid ${selectedCategory === cat ? '#7B2D8E' : '#E8E0F0'}`,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Sort toggle */}
      <div className="flex items-center justify-between px-4 mt-4 mb-2">
        <span className="text-xs" style={{ color: '#7A7185' }}>
          {filtered.length} skill{filtered.length !== 1 ? 's' : ''}
        </span>
        <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid #E8E0F0' }}>
          <button
            onClick={() => setSortMode('frequent')}
            className="px-3 py-1 text-xs font-medium transition-all duration-200"
            style={{
              backgroundColor: sortMode === 'frequent' ? '#7B2D8E' : 'transparent',
              color: sortMode === 'frequent' ? '#FEFEFE' : '#7A7185',
            }}
          >
            Most Frequent
          </button>
          <button
            onClick={() => setSortMode('recent')}
            className="px-3 py-1 text-xs font-medium transition-all duration-200"
            style={{
              backgroundColor: sortMode === 'recent' ? '#7B2D8E' : 'transparent',
              color: sortMode === 'recent' ? '#FEFEFE' : '#7A7185',
            }}
          >
            Most Recent
          </button>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-2 gap-3 px-4 mt-2">
        {filtered.map((skill, i) => (
          <div
            key={skill.id}
            className="rounded-xl p-3.5 transition-all duration-200 animate-fade-in-up cursor-pointer hover:shadow-md"
            style={{
              backgroundColor: '#FAF5FF',
              border: '1px solid #E8E0F0',
              animationDelay: `${i * 50}ms`,
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
            }}
          >
            {/* Emoji sticker */}
            <div className="flex items-start justify-between mb-2">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: '#F3E8FF' }}
              >
                <span className="text-2xl">{skill.emoji}</span>
              </div>
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${CATEGORY_COLORS[skill.category]}15`,
                  color: CATEGORY_COLORS[skill.category],
                }}
              >
                {skill.category}
              </span>
            </div>

            {/* Name */}
            <p className="text-sm font-bold mb-1" style={{ color: '#2D2235' }}>
              {skill.name}
            </p>

            {/* Frequency bar */}
            <div className="flex items-center gap-2 mb-1.5">
              <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: '#E8E0F0' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(skill.count / maxCount) * 100}%`,
                    backgroundColor: CATEGORY_COLORS[skill.category],
                  }}
                />
              </div>
              <span className="text-xs font-bold" style={{ color: '#7B2D8E' }}>
                {skill.count}x
              </span>
            </div>

            {/* Last discovered */}
            <p className="text-[10px]" style={{ color: '#B0A8B9' }}>
              Last: {formatDate(skill.lastDiscovered)}
            </p>
          </div>
        ))}
      </div>

      {/* Encouragement footer */}
      <div className="mx-4 mt-5 mb-4">
        <div
          className="rounded-xl p-4 text-center"
          style={{
            background: 'linear-gradient(135deg, #F3E8FF 0%, #FAF5FF 100%)',
            border: '1px solid #E8E0F0',
          }}
        >
          <span className="text-2xl">{'\u{1F48E}'}</span>
          <p className="text-sm font-semibold mt-1" style={{ color: '#2D2235' }}>
            Every skill is a superpower you already have
          </p>
          <p className="text-xs mt-0.5" style={{ color: '#7A7185' }}>
            Keep journaling to discover more
          </p>
        </div>
      </div>
    </div>
  );
}
