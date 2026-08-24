import { useEffect, useRef } from 'react';
import anime from 'animejs';
import { motion, useReducedMotion } from 'framer-motion';

interface GlamBarProps {
  completed: number;
  total: number;
  compact?: boolean;
}

export default function GlamBar({ completed, total, compact = false }: GlamBarProps) {
  const prefersReducedMotion = useReducedMotion();
  const pct = total === 0 ? 0 : (completed / total) * 100;
  const height = compact ? 12 : 18;

  // Refs for Anime.js targets
  const fillBarRef = useRef<HTMLDivElement>(null);
  const crownRef   = useRef<HTMLImageElement>(null);
  const pipRef     = useRef<HTMLDivElement>(null);

  // ── Animate fill-bar width via Anime.js ────────────────────────────────────
  useEffect(() => {
    if (!fillBarRef.current) return;

    anime({
      targets: fillBarRef.current,
      width: `${pct}%`,
      easing: 'easeOutExpo',
      duration: prefersReducedMotion ? 0 : 700,
    });
  }, [pct, prefersReducedMotion]);

  // ── Animate leading pip position via Anime.js ──────────────────────────────
  useEffect(() => {
    if (!pipRef.current) return;

    anime({
      targets: pipRef.current,
      left: `${pct}%`,
      opacity: pct > 0 ? 1 : 0,
      easing: 'easeOutExpo',
      duration: prefersReducedMotion ? 0 : 700,
    });
  }, [pct, prefersReducedMotion]);

  // ── Crown celebration when progress hits 100% ──────────────────────────────
  useEffect(() => {
    if (!crownRef.current || pct < 100 || prefersReducedMotion) return;

    const tl = anime.timeline({ easing: 'easeOutElastic(1, .4)' });

    tl
      // Phase 1 — aggressive scale-up overshoot
      .add({
        targets: crownRef.current,
        scale: [1, 2.8],
        rotate: [-15, 0],
        duration: 480,
      })
      // Phase 2 — elastic wobble settle back to a slightly-proud resting size
      .add({
        targets: crownRef.current,
        scale: [2.8, 1.25],
        duration: 600,
        easing: 'easeOutElastic(1, .3)',
      })
      // Phase 3 — gentle float back to normal
      .add({
        targets: crownRef.current,
        scale: 1,
        duration: 350,
        easing: 'easeInOutSine',
      });
  }, [pct, prefersReducedMotion]);

  return (
    // Outer wrapper is position:relative so the leading pip and crown
    // can be positioned absolutely WITHOUT being clipped.
    <div style={{ position: 'relative', paddingRight: compact ? 22 : 30 }}>

      {/* Track — overflow hidden clips only the fill bar */}
      <div
        className="glossy-tube"
        style={{
          width: '100%',
          height,
          background: 'var(--pink-light)',
          borderRadius: 'var(--r-pill)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Fill bar — driven by Anime.js (starts at 0 width) */}
        <div
          ref={fillBarRef}
          style={{
            width: 0,            // Anime.js will tween this
            height: '100%',
            background: 'linear-gradient(90deg, var(--hot-pink) 0%, var(--magenta) 100%)',
            borderRadius: 'var(--r-pill)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Sweeping gloss — the signature GlamBar element */}
          {!prefersReducedMotion && (
            <motion.div
              animate={{ x: ['-100%', '200%'] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'linear',
                repeatDelay: 0.5,
              }}
              style={{
                position: 'absolute',
                top: 0, bottom: 0, left: 0,
                width: '60%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.65), transparent)',
              }}
            />
          )}
        </div>
      </div>

      {/* Crown — Anime.js elastic bounce on 100% */}
      <img
        ref={crownRef}
        src="/icons/crown.png"
        alt=""
        aria-hidden="true"
        className="icon-img"
        style={{
          position: 'absolute',
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          width: compact ? 18 : 26,
          height: compact ? 18 : 26,
          objectFit: 'contain',
          filter: 'drop-shadow(0 1px 4px rgba(245,200,66,0.6))',
          zIndex: 2,
          transformOrigin: 'center center',
          // translateY handled by inline transform; Anime.js only touches scale/rotate
        }}
      />

      {/* Leading pip — positioned relative to outer wrapper */}
      <div
        ref={pipRef}
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,               // Anime.js will tween this
          opacity: 0,            // Anime.js will tween this
          transform: 'translate(-50%, -50%)',
          zIndex: 3,
        }}
      >
        <img
          src="/icons/sparkles.png"
          alt=""
          aria-hidden="true"
          className="icon-img"
          style={{
            width: compact ? 16 : 24,
            height: compact ? 16 : 24,
            objectFit: 'contain',
            filter: 'drop-shadow(0 1px 5px rgba(255,29,142,0.6))',
          }}
        />
      </div>
    </div>
  );
}
