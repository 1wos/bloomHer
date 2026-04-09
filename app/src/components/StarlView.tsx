import { useState, useRef } from 'react';
import type { STARLResult } from '../types';
import { structureSTARL } from '../services/ai';
import { useTypewriter } from '../hooks/useTypewriter';

export default function StarlView() {
  const [userInput, setUserInput] = useState('');
  const [result, setResult] = useState<STARLResult | null>(null);
  const [loading, setLoading] = useState(false);
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
      { letter: 'S', label: 'Situation', key: 'situation' as const },
      { letter: 'T', label: 'Task', key: 'task' as const },
      { letter: 'A', label: 'Action', key: 'action' as const },
      { letter: 'R', label: 'Result', key: 'result' as const },
      { letter: 'L', label: 'Learned', key: 'learned' as const },
    ];

    return (
      <div className="min-h-screen bg-[#F3E8FF]/30 py-8 px-4 pb-28">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#7B2D8E] mb-2">
              Your STAR(L) Story
            </h1>
            <p className="text-gray-500">
              AI discovered your hidden skills
            </p>
          </div>

          {/* What you shared */}
          <div className="bg-[#F3E8FF]/50 rounded-2xl p-4 mb-6 border border-[#7B2D8E]/10">
            <p className="text-sm text-[#7B2D8E]/60 mb-1">You shared:</p>
            <p className="text-gray-700 italic">"{userInput}"</p>
          </div>

          {/* Structured result */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-[#7B2D8E]/10">
            {STEPS.map((s) => (
              <div key={s.key} className="mb-5 last:mb-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white font-bold text-sm"
                    style={{
                      background:
                        s.key === 'learned'
                          ? 'linear-gradient(135deg, #7B2D8E, #D946A8)'
                          : '#7B2D8E',
                    }}
                  >
                    {s.letter}
                  </span>
                  <span className="font-semibold text-[#7B2D8E]">{s.label}</span>
                </div>
                <p className="text-gray-700 leading-relaxed pl-10">
                  {result.structured[s.key]}
                </p>
              </div>
            ))}
          </div>

          {/* Skills discovered */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-[#7B2D8E]/20">
            <h2 className="text-xl font-bold text-[#7B2D8E] mb-4 flex items-center gap-2">
              <span className="text-2xl">🎯</span> Skills Discovered
            </h2>
            <div className="grid gap-3">
              {result.skillsDiscovered.map((skill, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-[#F3E8FF]/50 rounded-xl p-4"
                >
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#9B6BB0] text-white text-sm font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div>
                    <span className="font-semibold text-[#7B2D8E]">{skill.name}</span>
                    <p className="text-gray-600 text-sm mt-0.5">{skill.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* One-liner */}
          <div
            className="rounded-2xl p-6 mb-6 text-white"
            style={{ background: 'linear-gradient(135deg, #7B2D8E, #D946A8)' }}
          >
            <p className="text-sm uppercase tracking-wider mb-2 opacity-80">
              Your Story in One Sentence
            </p>
            <p className="text-lg font-medium italic leading-relaxed">
              "{animatedSummary}"
            </p>
          </div>

          {/* Metacognitive question */}
          {result.metacognitiveQuestion && (
            <div className="bg-[#F3E8FF] rounded-2xl p-5 mb-8 border border-[#7B2D8E]/10">
              <p className="text-[#7B2D8E] italic text-center">
                💭 {result.metacognitiveQuestion}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleShareAsCard}
              className="px-6 py-3 text-white rounded-xl font-medium hover:opacity-90 transition-colors shadow-md"
              style={{ background: 'linear-gradient(135deg, #7B2D8E, #D946A8)' }}
            >
              Share as Card
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-white text-[#7B2D8E] rounded-xl font-medium border-2 border-[#7B2D8E]/30 hover:border-[#7B2D8E] transition-colors"
            >
              Try Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Loading View ---
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3E8FF]/30 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#7B2D8E]/20 border-t-[#7B2D8E] rounded-full animate-spin mb-4" />
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
