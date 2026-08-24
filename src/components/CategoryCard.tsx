import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import type { Category } from '../types';

interface CategoryCardProps {
  category: Category;
  count: number;
  activeId: string | null;
  onClick: () => void;
}

export default function CategoryCard({ category, count, activeId, onClick }: CategoryCardProps) {
  const active = activeId === category.id;

  return (
    <motion.div
      className="cat-card"
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(255,29,142,0.25)' }}
      whileTap={{ scale: 0.96 }}
      style={{
        background: active ? category.color : '#fff',
        border: active ? `2px solid ${category.textColor}` : '2px solid rgba(255,29,142,0.1)',
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: active ? category.textColor : category.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 4px 12px ${category.color}60`,
        }}
      >
        <Sparkles size={20} strokeWidth={2.5} color={active ? category.color : category.textColor} />
      </div>

      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: '1.25rem',
          fontWeight: 700,
          color: active ? category.textColor : 'var(--magenta)',
          marginTop: 'auto',
          letterSpacing: '0.01em',
        }}
      >
        {category.name}
      </p>

      <p
        style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          color: active ? category.textColor : '#C08097',
          opacity: active ? 0.9 : 1,
        }}
      >
        {count} {count === 1 ? 'task' : 'tasks'}
      </p>
    </motion.div>
  );
}
