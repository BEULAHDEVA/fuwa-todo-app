import { useEffect, useRef } from 'react';
import anime from 'animejs';

/**
 * CloudBackground — three soft radial-gradient blobs that drift
 * slowly via anime.js. Free-running ambient animation, not tied
 * to any React state. Purely decorative.
 */
export default function CloudBackground() {
  const blob1 = useRef<HTMLDivElement>(null);
  const blob2 = useRef<HTMLDivElement>(null);
  const blob3 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const anims = [
      anime({
        targets: blob1.current,
        translateX: [0, 28, -12, 0],
        translateY: [0, -14,   8, 0],
        duration: 11000,
        easing: 'easeInOutSine',
        loop: true,
      }),
      anime({
        targets: blob2.current,
        translateX: [0, -22,  18, 0],
        translateY: [0,  12, -20, 0],
        duration: 14000,
        easing: 'easeInOutSine',
        loop: true,
      }),
      anime({
        targets: blob3.current,
        translateX: [0,  16, -28, 0],
        translateY: [0,  -8,  16, 0],
        duration: 17000,
        easing: 'easeInOutSine',
        loop: true,
      }),
    ];

    return () => anims.forEach(a => a.pause());
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {/* Top-left pink bloom */}
      <div
        ref={blob1}
        style={{
          position: 'absolute', top: '4%', left: '-8%',
          width: 360, height: 260,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(244,167,185,0.14) 0%, transparent 70%)',
          willChange: 'transform',
        }}
      />
      {/* Right-center mint bloom */}
      <div
        ref={blob2}
        style={{
          position: 'absolute', top: '38%', right: '-10%',
          width: 300, height: 340,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(184,216,192,0.11) 0%, transparent 70%)',
          willChange: 'transform',
        }}
      />
      {/* Bottom lavender bloom */}
      <div
        ref={blob3}
        style={{
          position: 'absolute', bottom: '6%', left: '18%',
          width: 240, height: 240,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(196,181,208,0.1) 0%, transparent 70%)',
          willChange: 'transform',
        }}
      />
    </div>
  );
}
