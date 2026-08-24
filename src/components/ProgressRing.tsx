import { useEffect, useRef } from 'react';
import anime from 'animejs';

interface ProgressRingProps {
  completed: number;
  total: number;
  compact?: boolean;
}

/**
 * ProgressRing — horizontal pill progress bar.
 * anime.js drives the fill-width tween (easeOutExpo).
 * This component owns its own DOM nodes — no Framer Motion conflict.
 */
export default function ProgressRing({ completed, total, compact = false }: ProgressRingProps) {
  const fillRef = useRef<HTMLDivElement>(null);
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
  const height = compact ? 7 : 10;

  useEffect(() => {
    if (!fillRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    anime({
      targets: fillRef.current,
      width: `${pct}%`,
      duration: prefersReducedMotion ? 0 : 650,
      easing: 'easeOutExpo',
    });
  }, [pct]);

  return (
    <div
      style={{
        width: '100%',
        height,
        background: 'var(--track-bg)', /* warm gray-pink — clearly distinct from fill and page bg */
        borderRadius: 'var(--r-pill)',
        overflow: 'hidden',
      }}
    >
      <div
        ref={fillRef}
        style={{
          width: 0,
          height: '100%',
          background: 'linear-gradient(90deg, var(--pink) 0%, var(--pink-deep) 100%)',
          borderRadius: 'var(--r-pill)',
        }}
      />
    </div>
  );
}
