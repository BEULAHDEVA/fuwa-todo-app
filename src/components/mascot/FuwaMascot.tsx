import { useRef, useEffect } from 'react';
import anime from 'animejs';

export type MascotMood = 'idle' | 'happy' | 'sleepy';

interface FuwaMascotProps {
  mood?: MascotMood;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Fuwa-chan — the app mascot.
 * A soft cream bean-bunny drawn as inline SVG.
 *
 * anime.js owns:
 *   - float/breathe loop (whole SVG translateY)
 *   - blush opacity pulse (synced to float)
 *   - eye blink interval (idle only, scaleY on eye groups)
 *
 * Framer Motion owns nothing inside this component —
 * the parent may wrap it in a motion.div for entry/exit.
 */
export default function FuwaMascot({ mood = 'idle', size = 80, className, style }: FuwaMascotProps) {
  const svgRef        = useRef<SVGSVGElement>(null);
  const blushLeftRef  = useRef<SVGEllipseElement>(null);
  const blushRightRef = useRef<SVGEllipseElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!svgRef.current) return;

    if (prefersReducedMotion) return;

    // ── Float / breathe ──────────────────────────────────────
    const floatAnim = anime({
      targets: svgRef.current,
      translateY: [0, mood === 'sleepy' ? -2.5 : -6],
      duration: mood === 'sleepy' ? 3400 : 2000,
      easing: 'easeInOutSine',
      direction: 'alternate',
      loop: true,
    });

    // ── Blush pulse (synced with float) ──────────────────────
    const blushTargets = [blushLeftRef.current, blushRightRef.current].filter(Boolean);
    let blushAnim: ReturnType<typeof anime> | null = null;
    if (blushTargets.length > 0) {
      blushAnim = anime({
        targets: blushTargets,
        opacity: mood === 'happy' ? [0.62, 0.92] : [0.42, 0.65],
        duration: mood === 'sleepy' ? 3400 : 2000,
        easing: 'easeInOutSine',
        direction: 'alternate',
        loop: true,
      });
    }

    // ── Eye blink interval (idle only) ───────────────────────
    let blinkTimeout: ReturnType<typeof setTimeout>;
    const scheduleBlink = () => {
      blinkTimeout = setTimeout(() => {
        if (!svgRef.current) return;
        const eyeGroups = svgRef.current.querySelectorAll<SVGGElement>('.fuwa-eye-group');
        if (eyeGroups.length) {
          anime({
            targets: Array.from(eyeGroups),
            scaleY: [1, 0.06, 1],
            duration: 220,
            easing: 'easeInOutQuad',
          });
        }
        scheduleBlink();
      }, 3000 + Math.random() * 2500);
    };
    if (mood === 'idle') scheduleBlink();

    return () => {
      floatAnim.pause();
      blushAnim?.pause();
      clearTimeout(blinkTimeout);
    };
  }, [mood]);

  return (
    /*
     * ViewBox: 0 0 100 110
     *
     * Z-order (back → front):
     *   ears → inner ears → body → blush → eyes → mouth → arm nubs (happy)
     *
     * The body ellipse top edge (cy=70, ry=28 → top at y=42) naturally covers
     * the bottom of the ears (cy=28, ry=14 → bottom at y=42), giving depth.
     */
    <svg
      ref={svgRef}
      width={size}
      height={size}
      viewBox="0 0 100 110"
      fill="none"
      className={className}
      style={{ display: 'block', ...style }}
      aria-hidden="true"
    >
      {/* ── Ears (rendered behind body) ─────────────────────── */}
      <ellipse cx="28" cy="28" rx="10.5" ry="14" fill="#FFF4F0" stroke="#EDD4D0" strokeWidth="1.5"/>
      <ellipse cx="28" cy="29" rx="5.5"  ry="8.5" fill="#FFCDD8"/>
      <ellipse cx="72" cy="28" rx="10.5" ry="14" fill="#FFF4F0" stroke="#EDD4D0" strokeWidth="1.5"/>
      <ellipse cx="72" cy="29" rx="5.5"  ry="8.5" fill="#FFCDD8"/>

      {/* ── Body ────────────────────────────────────────────── */}
      <ellipse cx="50" cy="70" rx="34" ry="28" fill="#FFF4F0" stroke="#EDD4D0" strokeWidth="1.5"/>

      {/* ── Blush cheeks ────────────────────────────────────── */}
      <ellipse ref={blushLeftRef}  cx="29" cy="77" rx="10" ry="5.5" fill="#F4A7B9" opacity="0.5"/>
      <ellipse ref={blushRightRef} cx="71" cy="77" rx="10" ry="5.5" fill="#F4A7B9" opacity="0.5"/>

      {/* ── Expressions (mood-dependent) ────────────────────── */}

      {/* IDLE — dot eyes with shine, small smile */}
      {mood === 'idle' && (
        <>
          <g className="fuwa-eye-group" style={{ transformBox: 'fill-box', transformOrigin: 'center' } as React.CSSProperties}>
            <circle cx="38" cy="68" r="3.5" fill="#4A3540"/>
            <circle cx="39.5" cy="66.5" r="1.3" fill="white"/>
          </g>
          <g className="fuwa-eye-group" style={{ transformBox: 'fill-box', transformOrigin: 'center' } as React.CSSProperties}>
            <circle cx="62" cy="68" r="3.5" fill="#4A3540"/>
            <circle cx="63.5" cy="66.5" r="1.3" fill="white"/>
          </g>
          <path d="M 44 77 Q 50 83 56 77" stroke="#C89090" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        </>
      )}

      {/* HAPPY — ^ arc eyes, big smile, raised arm nubs */}
      {mood === 'happy' && (
        <>
          <path d="M 32 70 Q 38 61 44 70" stroke="#4A3540" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <path d="M 56 70 Q 62 61 68 70" stroke="#4A3540" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <path d="M 39 80 Q 50 92 61 80" stroke="#D97A95" strokeWidth="2" fill="none" strokeLinecap="round"/>
          {/* Arm nubs */}
          <ellipse cx="12" cy="71" rx="6.5" ry="4" fill="#FFF4F0" stroke="#EDD4D0" strokeWidth="1.5" transform="rotate(-35 12 71)"/>
          <ellipse cx="88" cy="71" rx="6.5" ry="4" fill="#FFF4F0" stroke="#EDD4D0" strokeWidth="1.5" transform="rotate(35 88 71)"/>
        </>
      )}

      {/* SLEEPY — droopy line eyes, tiny smile, zzz */}
      {mood === 'sleepy' && (
        <>
          <path d="M 33 67 Q 38 65.5 43 67" stroke="#4A3540" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <path d="M 57 67 Q 62 65.5 67 67" stroke="#4A3540" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <path d="M 45 77 Q 50 80 55 77" stroke="#C89090" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          {/* z z */}
          <text x="65" y="52" fill="#C4B5D0" fontSize="9"  fontFamily="Nunito, sans-serif" fontWeight="800">z</text>
          <text x="72" y="44" fill="#C4B5D0" fontSize="7"  fontFamily="Nunito, sans-serif" fontWeight="800">z</text>
        </>
      )}
    </svg>
  );
}
