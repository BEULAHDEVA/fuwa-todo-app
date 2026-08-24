import { motion } from 'framer-motion';

/**
 * PageTransition — soft fade + scale wrapper.
 * Framer Motion owns page-level enter/exit (mode="wait" in AnimatePresence).
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.975, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.975, y: -8 }}
      transition={{ type: 'spring', stiffness: 380, damping: 30, mass: 0.8 }}
      style={{ display: 'contents' }}
    >
      {children}
    </motion.div>
  );
}
