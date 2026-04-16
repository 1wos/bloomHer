import { useState, useRef } from 'react';
import type { STARLResult } from '../types';
import { structureSTARL } from '../services/ai';
import { useTypewriter } from '../hooks/useTypewriter';
import { collectSkill, addEntry } from '../services/storage';
import ThinkingDots from './ThinkingDots';

interface StarlViewProps {
  onSkillCollected?: () => void;
}

export default function StarlView({ onSkillCollected }: StarlViewProps = {}) {
  const [userInput, setUserInput] = useState('');
  const [result, setResult] = useState<STARLResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async () => {
    if (!userInput.trim()) return;
    setLoading(true);
    try {
      const res = await structureSTARL({
        situation: userInput,
        task: '',
        action: '',
        result: '',
        learned: '',
      });
      setResult(res);
    } catch (err) {
      console.error('STAR(L) structuring failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleReset = () => {
    setUserInput('');
    setResult(null);
    setSaved(false);
  };

  const handleSaveToGarden = () => {
    if (!result || saved) return;
    const skillEmojis = ['💎', '⭐', '🌟', '✨', '💫'];
    result.skillsDiscovered.forEach((skill, i) => {
      collectSkill(
        skill.name,
        skillEmojis[i % skillEmojis.length],
        skill.explanation,
        userInput,
        'general'
      );
    });
    addEntry({
      id: `starl_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      input: userInput,
      skills: result.skillsDiscovered.map((s, i) => ({
        name: s.name,
        icon: skillEmojis[i % skillEmojis.length],
        description: s.explanation,
      })),
      type: 'starl',
    });
    setSaved(true);
    onSkillCollected?.();
  };

  const animatedSummary = useTypewriter(result?.oneLineSummary ?? '', {
    speed: 30,
    enabled: !!result,
  });

  const handleShareAsCard = () => {
    if (!result) return;
    const card = `
✨ STAR(L) Experience — BloomHer

S: ${result.structured.situation}
T: ${result.structured.task}
A: ${result.structured.action}
R: ${result.structured.result}
L: ${result.structured.learned}

Skills: ${result.skillsDiscovered.map(s => s.name).join(', ')}

"${result.oneLineSummary}"

Powered by BloomHer 🌷`.trim();

    navigator.clipboard.writeText(card).then(() => {
      alert('Copied to clipboard! Share your story anywhere.');
    });
  };

  // --- Result View ---
  if (result) {
    const STEPS = [
      { letter: 'S', label: 'Situation', key: 'situation' as const, emoji: '🌱', tint: '#7B2D8E' },
      { letter: 'T', label: 'Task', key: 'task' as const, emoji: '🎯', tint: '#8E3AA0' },
      { letter: 'A', label: 'Action', key: 'action' as const, emoji: '⚡', tint: '#A249B2' },
      { letter: 'R', label: 'Result', key: 'result' as const, emoji: '🌸', tint: '#BF5AC0' },
      { letter: 'L', label: 'Learned', key: 'learned' as const, emoji: '✨', tint: '#D946A8' },
    ];

    return (
      <div className="min-h-screen bg-[#FAF5FF] pb-28">
        {/* Hero header */}
        <div
          className="px-5 pt-10 pb-8 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #7B2D8E 0%, #9B4DB0 50%, #D946A8 100%)' }}
        >
          <div className="relative z-10">
            <span className="text-4xl block mb-2">🌷</span>
            <h1 className="text-2xl font-bold text-white mb-1">Your STAR(L) Story</h1>
            <p className="text-sm text-white/80">AI discovered your hidden skills</p>
          </div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
        </div>

        <div className="max-w-2xl mx-auto px-4 -mt-4">
          {/* What you shared */}
          <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-[#7B2D8E]/10">
            <p className="text-xs uppercase tracking-wider text-[#7B2D8E]/60 mb-1 font-semibold">You shared</p>
            <p className="text-gray-700 italic text-sm leading-relaxed">"{userInput}"</p>
          </div>

          {/* STAR(L) timeline */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-[#7B2D8E]/10">
            <div className="relative">
              {/* Vertical connecting line */}
              <div
                className="absolute left-[19px] top-4 bottom-4 w-0.5"
                style={{ background: 'linear-gradient(to bottom, #7B2D8E, #D946A8)' }}
              />

              {STEPS.map((s, i) => (
                <div
                  key={s.key}
                  className="relative pl-14 pb-6 last:pb-0 transition-all duration-500"
                  style={{
                    opacity: 1,
                    animation: `fadeInUp 0.5s ease-out ${i * 100}ms both`,
                  }}
                >
                  {/* Letter badge */}
                  <div
                    className="absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md"
                    style={{
                      background: `linear-gradient(135deg, ${s.tint}, ${STEPS[Math.min(i + 1, STEPS.length - 1)].tint})`,
                    }}
                  >
                    {s.letter}
                  </div>

                  {/* Label row */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-base">{s.emoji}</span>
                    <span className="font-bold text-[#7B2D8E] text-sm uppercase tracking-wide">
                      {s.label}
                    </span>
                  </div>

                  {/* Content */}
                  <p className="text-gray-700 leading-relaxed text-[15px]">
                    {result.structured[s.key]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Observable reasoning — how AI arrived here */}
          {result.reasoningSteps && result.reasoningSteps.length > 0 && (
            <details className="group rounded-2xl border border-[#7B2D8E]/15 bg-[#FAF5FF] mb-6 overflow-hidden">
              <summary className="cursor-pointer select-none list-none px-5 py-3 flex items-center gap-2 hover:bg-[#F3E8FF]/70 transition-colors">
                <span className="text-[11px] font-semibold tracking-[0.18em] text-[#7B2D8E] uppercase">
                  How the AI arrived at this
                </span>
                <span className="text-[#7B2D8E]/60 text-xs ml-auto group-open:rotate-90 transition-transform">
                  &rsaquo;
                </span>
              </summary>
              <div className="px-5 pb-5 pt-1 flex flex-col gap-3">
                {result.reasoningSteps.map((step, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-[#7B2D8E]/10 flex items-center justify-center text-[11px] font-bold text-[#7B2D8E] mt-0.5">
                      {idx + 1}
                    </span>
                    <div className="flex-1">
                      <div className="text-[11px] font-semibold text-[#7B2D8E] uppercase tracking-wide">
                        {step.label}
                      </div>
                      <div className="text-sm text-[#4A3860] leading-relaxed mt-1">
                        {step.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </details>
          )}

          {/* One-liner — HERO money shot */}
          <div
            className="rounded-3xl p-8 mb-6 text-white relative overflow-hidden shadow-xl"
            style={{ background: 'linear-gradient(135deg, #5A1A6B 0%, #7B2D8E 40%, #D946A8 100%)' }}
          >
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/10 blur-3xl -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-white/10 blur-3xl -ml-16 -mb-16" />
            <div className="relative z-10 text-center">
              <span className="text-3xl block mb-3">💫</span>
              <p className="text-[11px] uppercase tracking-[0.2em] mb-3 opacity-80 font-semibold">
                Your Story in One Line
              </p>
              <p className="text-xl font-semibold italic leading-relaxed">
                "{animatedSummary}"
              </p>
            </div>
          </div>

          {/* Skills discovered — chip style */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-[#7B2D8E]/10">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🎯</span>
              <h2 className="text-base font-bold text-[#7B2D8E] uppercase tracking-wide">
                Skills Discovered
              </h2>
              <span className="ml-auto bg-[#F3E8FF] text-[#7B2D8E] text-xs font-bold px-2 py-0.5 rounded-full">
                {result.skillsDiscovered.length}
              </span>
            </div>
            <div className="grid gap-3">
              {result.skillsDiscovered.map((skill, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl p-4 border border-[#7B2D8E]/10 hover:border-[#7B2D8E]/30 hover:shadow-md transition-all"
                  style={{
                    background: `linear-gradient(135deg, #F3E8FF 0%, #FFFFFF 100%)`,
                    animation: `fadeInUp 0.5s ease-out ${(STEPS.length + i) * 100}ms both`,
                  }}
                >
                  <div
                    className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm"
                    style={{
                      background: `linear-gradient(135deg, #9B6BB0, #D946A8)`,
                    }}
                  >
                    {['💎', '⭐', '🌟', '✨', '💫'][i % 5]}
                  </div>
                  <div className="flex-1">
                    <span className="font-bold text-[#7B2D8E]">{skill.name}</span>
                    <p className="text-gray-600 text-sm mt-1 leading-relaxed">{skill.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Metacognitive question */}
          {result.metacognitiveQuestion && (
            <div
              className="rounded-2xl p-5 mb-8 border"
              style={{
                background: 'linear-gradient(135deg, #F3E8FF 0%, #FFE8F5 100%)',
                borderColor: 'rgba(123, 45, 142, 0.15)',
              }}
            >
              <p className="text-[#7B2D8E] italic text-center leading-relaxed">
                <span className="block text-2xl mb-2">💭</span>
                {result.metacognitiveQuestion}
              </p>
            </div>
          )}

          {/* Actions — Save is PRIMARY */}
          <div className="space-y-3">
            <button
              onClick={handleSaveToGarden}
              disabled={saved}
              className={`w-full px-6 py-4 rounded-2xl font-bold text-base transition-all shadow-md ${
                saved
                  ? 'bg-[#E8F5E9] text-[#2E7D32] cursor-default'
                  : 'text-white hover:shadow-xl hover:-translate-y-0.5'
              }`}
              style={
                saved
                  ? {}
                  : { background: 'linear-gradient(135deg, #7B2D8E, #D946A8)' }
              }
            >
              {saved ? (
                <span className="flex items-center justify-center gap-2">
                  ✓ Saved to Your Garden
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  🌷 Save {result.skillsDiscovered.length} Skill{result.skillsDiscovered.length > 1 ? 's' : ''} to My Garden
                </span>
              )}
            </button>
            {saved && (
              <p className="text-center text-xs text-[#7B2D8E]/70">
                Check the Skills and Garden tabs to see your growth ✨
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleShareAsCard}
                className="flex-1 px-4 py-3 bg-white text-[#7B2D8E] rounded-xl font-semibold border border-[#7B2D8E]/20 hover:border-[#7B2D8E] hover:bg-[#F3E8FF]/50 transition-all text-sm"
              >
                📋 Copy Card
              </button>
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-3 bg-white text-[#7B2D8E] rounded-xl font-semibold border border-[#7B2D8E]/20 hover:border-[#7B2D8E] hover:bg-[#F3E8FF]/50 transition-all text-sm"
              >
                ↻ Try Another
              </button>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    );
  }

  // --- Loading View ---
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3E8FF]/30 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <ThinkingDots size="lg" />
          </div>
          <p className="text-[#7B2D8E] font-medium text-lg">
            Structuring your experience...
          </p>
          <p className="text-gray-400 text-sm mt-1">
            BloomHer is discovering your hidden skills
          </p>
        </div>
      </div>
    );
  }

  // --- Input View (Single input → AI auto-structures) ---
  return (
    <div className="min-h-screen bg-[#F3E8FF]/30 flex flex-col pb-24">
      {/* Header */}
      <div
        className="px-5 pt-8 pb-6"
        style={{ background: 'linear-gradient(135deg, #7B2D8E, #D946A8)' }}
      >
        <h1 className="text-xl font-bold text-white mb-1">STAR(L) Stories</h1>
        <p className="text-sm text-white/70">
          Share an experience and AI will structure it for you
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="max-w-2xl w-full">
          {/* Intro */}
          <div className="text-center mb-8">
            <span className="text-5xl mb-4 block">🌷</span>
            <h2 className="text-2xl font-bold text-[#7B2D8E] mb-2">
              Tell me about an experience
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Just describe it naturally — BloomHer AI will automatically structure it
              into STAR(L) format and discover your hidden skills.
            </p>
          </div>

          {/* Examples */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {[
              'I led a team project at school',
              'I helped my friend through a tough time',
              'I organized a family event',
              'I learned a new recipe by myself',
            ].map((example) => (
              <button
                key={example}
                onClick={() => setUserInput(example)}
                className="px-3 py-1.5 rounded-full text-xs bg-white border border-[#7B2D8E]/20 text-[#7B2D8E] hover:bg-[#F3E8FF] transition-colors"
              >
                {example}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="bg-white rounded-2xl shadow-lg p-1 border border-[#7B2D8E]/10">
            <textarea
              ref={textareaRef}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={4}
              placeholder="e.g. I was team leader for a school project but my teammates didn't do their part, so I ended up doing almost everything myself..."
              className="w-full resize-none rounded-xl p-4 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B2D8E]/30 text-base leading-relaxed"
            />
          </div>

          <p className="text-gray-400 text-xs text-center mt-2">
            Press Cmd+Enter to analyze • Or click the button below
          </p>

          {/* Submit */}
          <div className="flex justify-center mt-6">
            <button
              onClick={handleSubmit}
              disabled={!userInput.trim()}
              className={`px-8 py-3 rounded-xl font-medium transition-all shadow-md ${
                userInput.trim()
                  ? 'text-white hover:opacity-90 hover:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
              }`}
              style={
                userInput.trim()
                  ? { background: 'linear-gradient(135deg, #7B2D8E, #D946A8)' }
                  : {}
              }
            >
              ✨ Discover My Hidden Skills
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
