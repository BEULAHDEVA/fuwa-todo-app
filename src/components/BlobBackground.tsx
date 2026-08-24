import { motion, useReducedMotion } from 'framer-motion';

/**
 * Satin shimmer — a single diagonal light sweep across the full page,
 * like light catching a hot-pink satin dress.
 * Derived directly from: "glossy, like a convertible-and-dreamhouse world"
 * NOT: radial orbs / sparkle filler / glassmorphism
 */
export default function BlobBackground() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {/* Primary satin sweep — crosses full screen on a diagonal */}
      {!prefersReducedMotion && (
        <motion.div
          animate={{ x: ['-120%', '240%'] }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: 'linear',
            repeatDelay: 5,
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '35%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.14) 50%, transparent 100%)',
            transform: 'skewX(-18deg)',
          }}
        />
      )}

      {/* Secondary slower sweep — offset timing for depth */}
      {!prefersReducedMotion && (
        <motion.div
          animate={{ x: ['-120%', '240%'] }}
          transition={{
            duration: 13,
            repeat: Infinity,
            ease: 'linear',
            repeatDelay: 3,
            delay: 4,
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '18%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.09) 50%, transparent 100%)',
            transform: 'skewX(-14deg)',
          }}
        />
      )}

      {/* Soft top-left gold warmth — static, derived from champagne highlight in palette */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          left: '-15%',
          width: '50vw',
          height: '50vw',
          background: 'radial-gradient(circle, rgba(245,200,66,0.13) 0%, transparent 70%)',
          borderRadius: '50%',
        }}
      />

      {/* Soft bottom-right deepening — magenta depth */}
      <div
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '-10%',
          width: '55vw',
          height: '55vw',
          background: 'radial-gradient(circle, rgba(200,0,107,0.1) 0%, transparent 65%)',
          borderRadius: '50%',
        }}
      />
    </div>
  );
}
