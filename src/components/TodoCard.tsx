import { useRef } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Check, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTodos } from '../context/TodoContext';
import type { Todo } from '../types';
import anime from 'animejs';

interface TodoCardProps { todo: Todo; }

/**
 * Animation responsibilities:
 *
 * Framer Motion:
 *   - Card enter/exit via AnimatePresence (cardVariants)
 *   - layout prop for list reordering
 *   - whileHover lift, whileTap squish
 *   - checkbox appearance (background/border color change)
 *
 * anime.js:
 *   - Task-completion celebration timeline:
 *       1. Checkbox scale burst (elastic overshoot)
 *       2. 8 SVG particle dots burst in radial pattern
 *   (Targets: checkboxRef + particleContainer — separate from Framer nodes)
 */

const PARTICLE_COLORS = ['#F4A7B9', '#B8D8C0', '#C4B5D0', '#F9C784', '#D97A95', '#B8D8C0'];
const N_PARTICLES = 8;

const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 14, scale: 0.95 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring', stiffness: 400, damping: 28 },
  },
  exit: {
    opacity: 0, scale: 0.88, y: -8,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

export default function TodoCard({ todo }: TodoCardProps) {
  const { toggleTodo, deleteTodo, categories } = useTodos();
  const navigate = useNavigate();
  const category = categories.find(c => c.id === todo.categoryId);
  const checkboxRef       = useRef<HTMLButtonElement>(null);
  const particleContainer = useRef<HTMLDivElement>(null);

  const formattedDate = todo.dueDate
    ? new Date(todo.dueDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : null;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();

    // ── anime.js celebration (checking only — not unchecking) ──
    if (!todo.completed) {
      const tl = anime.timeline({ easing: 'easeOutExpo' });

      // 1. Checkbox elastic bounce
      if (checkboxRef.current) {
        tl.add({
          targets: checkboxRef.current,
          scale: [1, 1.38, 0.92, 1],
          duration: 480,
          easing: 'easeOutElastic(1, 0.5)',
        });
      }

      // 2. Radial particle burst
      if (particleContainer.current) {
        const particles = Array.from(particleContainer.current.children);
        const angleStep = 360 / N_PARTICLES;
        tl.add({
          targets: particles,
          translateX: (_: HTMLElement, i: number) =>
            Math.round(Math.cos(((angleStep * i - 90) * Math.PI) / 180) * 38),
          translateY: (_: HTMLElement, i: number) =>
            Math.round(Math.sin(((angleStep * i - 90) * Math.PI) / 180) * 38),
          scale: [0, 1.1, 0],
          opacity: [0, 1, 0],
          duration: 650,
          delay: anime.stagger(28),
          easing: 'easeOutCubic',
        }, '-=380');
      }
    }

    toggleTodo(todo.id);
  };

  return (
    <motion.div
      layout
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`task-card ${todo.completed ? 'completed' : ''}`}
      onClick={() => navigate(`/task/${todo.id}`)}
      style={{ cursor: 'pointer' }}
      whileHover={{ y: -2, boxShadow: '0 6px 24px rgba(74,53,64,0.10), 0 0 0 1.5px rgba(244,167,185,0.35)' }}
      whileTap={{ scale: 0.985 }}
    >
      {/* ── Particle burst container (anime.js only) ─────── */}
      <div
        ref={particleContainer}
        style={{ position: 'absolute', top: 18, left: 18, pointerEvents: 'none', zIndex: 10 }}
      >
        {Array.from({ length: N_PARTICLES }, (_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 7, height: 7,
              borderRadius: '50%',
              background: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
              opacity: 0,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </div>

      {/* ── Checkbox (Framer controls appearance, anime.js the scale burst) ── */}
      <motion.button
        ref={checkboxRef}
        onClick={handleToggle}
        className={`fuwa-checkbox ${todo.completed ? 'checked' : ''}`}
        aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        <AnimatePresence>
          {todo.completed && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 22 }}
            >
              <Check size={14} strokeWidth={3} color="white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ── Content ─────────────────────────────────────── */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p className="task-title">{todo.title}</p>
        {todo.note && <p className="task-note">{todo.note}</p>}
        <div className="task-meta">
          {category && (
            <span
              className="fuwa-pill"
              style={{ background: `${category.color}28`, color: category.textColor }}
            >
              {category.name}
            </span>
          )}
          {formattedDate && (
            <span className="fuwa-pill" style={{ background: 'rgba(249,199,132,0.2)', color: '#7A4A10' }}>
              {formattedDate}
            </span>
          )}
        </div>
      </div>

      {/* ── Delete ─────────────────────────────────────── */}
      <motion.button
        onClick={e => { e.stopPropagation(); deleteTodo(todo.id); }}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.85 }}
        style={{
          width: 30, height: 30,
          borderRadius: 10,
          background: 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--dusty-light)', flexShrink: 0,
          transition: 'all 0.15s',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(244,167,185,0.15)';
          (e.currentTarget as HTMLButtonElement).style.color = 'var(--pink-deep)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
          (e.currentTarget as HTMLButtonElement).style.color = 'var(--dusty-light)';
        }}
        aria-label="Delete task"
      >
        <Trash2 size={15} strokeWidth={2} />
      </motion.button>
    </motion.div>
  );
}
