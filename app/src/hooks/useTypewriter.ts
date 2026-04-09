import { useState, useEffect, useRef } from 'react';

interface UseTypewriterOptions {
  /** Milliseconds per character (default: 30) */
  speed?: number;
  /** Whether the animation is enabled (default: true) */
  enabled?: boolean;
}

/**
 * Custom hook that progressively reveals a string one character at a time.
 *
 * Usage:
 *   const displayText = useTypewriter(fullText, { speed: 30, enabled: true });
 */
export function useTypewriter(
  fullText: string,
  { speed = 30, enabled = true }: UseTypewriterOptions = {},
): string {
  const [displayedCount, setDisplayedCount] = useState(enabled ? 0 : fullText.length);
  const prevTextRef = useRef(fullText);

  // Reset when fullText changes (new text to animate)
  useEffect(() => {
    if (fullText !== prevTextRef.current) {
      prevTextRef.current = fullText;
      if (enabled) {
        setDisplayedCount(0);
      } else {
        setDisplayedCount(fullText.length);
      }
    }
  }, [fullText, enabled]);

  // Animate character by character
  useEffect(() => {
    if (!enabled || displayedCount >= fullText.length) return;

    const timer = setTimeout(() => {
      setDisplayedCount((c) => c + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [displayedCount, fullText, speed, enabled]);

  return fullText.slice(0, displayedCount);
}
