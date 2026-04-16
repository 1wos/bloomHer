/**
 * ThinkingDots — CareFlow-style three-dot thinking indicator.
 *
 * Usage:
 *   <ThinkingDots />
 *   <ThinkingDots label="BloomHer is thinking" />
 *   <ThinkingDots size="lg" label="Structuring your story" />
 */

interface ThinkingDotsProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_MAP = {
  sm: { dot: 6, gap: 4, fontSize: '11px' },
  md: { dot: 8, gap: 6, fontSize: '13px' },
  lg: { dot: 10, gap: 8, fontSize: '15px' },
};

export default function ThinkingDots({ label, size = 'md' }: ThinkingDotsProps) {
  const { dot, gap, fontSize } = SIZE_MAP[size];

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label ?? 'Thinking'}
      className="inline-flex items-center"
      style={{ gap: `${gap + 2}px` }}
    >
      {label && (
        <span
          className="text-[#7B2D8E] font-medium"
          style={{ fontSize, letterSpacing: '0.2px' }}
        >
          {label}
        </span>
      )}
      <span className="inline-flex items-center" style={{ gap: `${gap}px` }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="bloomher-dot"
            style={{
              width: `${dot}px`,
              height: `${dot}px`,
              borderRadius: '50%',
              background: '#7B2D8E',
              animationDelay: `${i * 150}ms`,
            }}
          />
        ))}
      </span>

      <style>{`
        .bloomher-dot {
          display: inline-block;
          opacity: 0.3;
          animation: bloomher-dot-pulse 1.2s ease-in-out infinite;
        }
        @keyframes bloomher-dot-pulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.85); }
          40%           { opacity: 1.0; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
