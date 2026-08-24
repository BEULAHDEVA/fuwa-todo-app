import { motion, useReducedMotion } from 'framer-motion';

export default function SparkleBurst() {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) return null;

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 1, scale: 0.2, x: 0, y: 0 }}
          animate={{
            opacity: [1, 1, 0],
            scale: [0.2, 1.2, 0.5],
            x: Math.cos((angle * Math.PI) / 180) * 45,
            y: Math.sin((angle * Math.PI) / 180) * 45,
          }}
          transition={{
            duration: 0.6,
            ease: 'easeOut',
          }}
          style={{
            position: 'absolute',
          }}
        >
          {/* Four-point star/sparkle SVG */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--gold)" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
