import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTodos } from '../context/TodoContext';
import TodoCard from '../components/TodoCard';
import ProgressRing from '../components/ProgressRing';
import PageTransition from '../components/PageTransition';
import FuwaMascot, { type MascotMood } from '../components/mascot/FuwaMascot';

/**
 * Home page animation responsibilities:
 *
 * Framer Motion:
 *   - Staggered card entrance (containerVariants + cardVariants)
 *   - AnimatePresence for add/remove cards
 *   - Quick-add input layout expand on focus
 *   - Mascot mood transition (AnimatePresence key change)
 *   - Completed section collapse expand
 *
 * anime.js:
 *   - Mascot idle float + blink (owned inside FuwaMascot)
 *   - ProgressRing fill tween (owned inside ProgressRing)
 *   - Task completion particle burst (owned inside TodoCard)
 *   - CloudBackground drift (owned in CloudBackground)
 */

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055 } },
};

const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 14, scale: 0.95 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring', stiffness: 420, damping: 28 },
  },
};

function getMascotMood(pct: number, total: number): MascotMood {
  if (total === 0)  return 'sleepy';
  if (pct >= 100)  return 'happy';
  if (pct >= 40)   return 'happy';
  return 'idle';
}

function getMascotText(pct: number, total: number): string {
  if (total === 0)  return 'No tasks yet — what\'s on your mind?';
  if (pct >= 100)  return 'All done! You\'re amazing ✿';
  if (pct >= 50)   return 'You\'re on a roll, keep going!';
  return 'Ready when you are ✿';
}

export default function Home() {
  const { todos, addTodo, categories } = useTodos();
  const [quickAdd,      setQuickAdd]      = useState('');
  const [showCompleted, setShowCompleted] = useState(false);
  const [inputFocused,  setInputFocused]  = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const activeTodos    = todos.filter(t => !t.completed);
  const completedTodos = todos.filter(t =>  t.completed);
  const total     = todos.length;
  const completed = completedTodos.length;
  const pct       = total === 0 ? 0 : Math.round((completed / total) * 100);
  const mood      = getMascotMood(pct, total);

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = quickAdd.trim();
    if (!trimmed) return;
    addTodo({ title: trimmed, note: '', categoryId: categories[0]?.id ?? '', dueDate: '', completed: false });
    setQuickAdd('');
    inputRef.current?.focus();
  };

  return (
    <PageTransition>
      <div className="page-shell">
        <div className="page-container">

          {/* ── Hero: mascot + progress ─────────────────────── */}
          <div className="hero-blob">
            {/* AnimatePresence handles mood change (Framer — key-based re-mount) */}
            <AnimatePresence mode="wait">
              <motion.div
                key={mood}
                initial={{ opacity: 0, scale: 0.85, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: -8 }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              >
                {/* FuwaMascot owns its own anime.js float loop */}
                <FuwaMascot mood={mood} size={90} />
              </motion.div>
            </AnimatePresence>

            <p className="mascot-mood-text">{getMascotText(pct, total)}</p>

            {total > 0 && (
              <div style={{ width: '100%', maxWidth: 220, marginTop: 8 }}>
                {/* ProgressRing owns its anime.js tween */}
                <ProgressRing completed={completed} total={total} />
                <p style={{
                  textAlign: 'center', marginTop: 6,
                  fontSize: '0.75rem', fontWeight: 700, color: 'var(--cocoa)',
                  fontFamily: 'var(--font-body)',
                }}>
                  {completed} of {total} done
                </p>
              </div>
            )}
          </div>

          {/* ── Quick-add ────────────────────────────────────── */}
          <form onSubmit={handleQuickAdd} style={{ marginBottom: '1.75rem' }}>
            {/* Framer layout on the bar for expand-on-focus */}
            <motion.div
              className="quick-add-bar"
              layout
              animate={{ boxShadow: inputFocused
                ? '0 0 0 2.5px rgba(244,167,185,0.35), 0 4px 18px rgba(74,53,64,0.08)'
                : '0 2px 14px rgba(74,53,64,0.07)' }}
              transition={{ duration: 0.2 }}
            >
              <input
                ref={inputRef}
                className="quick-add-input"
                value={quickAdd}
                onChange={e => setQuickAdd(e.target.value)}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                placeholder="Add a quick task…"
                aria-label="Quick-add task"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.12, rotate: 8 }}
                whileTap={{ scale: 0.88 }}
                style={{
                  width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                  background: quickAdd.trim()
                    ? 'linear-gradient(135deg, var(--pink) 0%, var(--pink-deep) 100%)'
                    : 'var(--cream-dark)',
                  color: quickAdd.trim() ? 'white' : 'var(--dusty-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.2s, color 0.2s',
                  boxShadow: quickAdd.trim() ? 'var(--shadow-pink)' : 'none',
                }}
                aria-label="Add task"
                transition={{ type: 'spring', stiffness: 500, damping: 28 }}
              >
                <Plus size={18} strokeWidth={2.5} />
              </motion.button>
            </motion.div>
          </form>

          {/* ── Today's tasks ─────────────────────────────────── */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 className="section-label">Today ✿</h2>

            {/* Framer staggered container (staggerChildren on parent) */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}
            >
              <AnimatePresence mode="popLayout">
                {activeTodos.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="empty-state"
                  >
                    <FuwaMascot mood="sleepy" size={100} />
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--cocoa)', fontWeight: 500 }}>
                      All clear! Time to rest.
                    </p>
                    <motion.button
                      onClick={() => navigate('/task/new')}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      style={{
                        marginTop: 4,
                        padding: '0.5rem 1.25rem',
                        borderRadius: 'var(--r-pill)',
                        background: 'var(--pink-soft)',
                        border: '1.5px solid rgba(244,167,185,0.4)',
                        color: 'var(--pink-deep)',
                        fontWeight: 700, fontSize: '0.875rem',
                        fontFamily: 'var(--font-body)',
                      }}
                    >
                      + Add something
                    </motion.button>
                  </motion.div>
                ) : (
                  activeTodos.map(todo => (
                    <motion.div key={todo.id} variants={cardVariants}>
                      <TodoCard todo={todo} />
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* ── Completed ─────────────────────────────────────── */}
          {completedTodos.length > 0 && (
            <div>
              <motion.button
                onClick={() => setShowCompleted(v => !v)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '0.4rem 0', marginBottom: '0.625rem',
                  fontFamily: 'var(--font-display)', fontSize: '1.05rem',
                  color: 'var(--cocoa)', fontWeight: 500,
                }}
                whileHover={{ color: 'var(--pink-deep)' }}
              >
                Done ✓ ({completedTodos.length})
                {showCompleted ? <ChevronUp size={16} strokeWidth={2.5}/> : <ChevronDown size={16} strokeWidth={2.5}/>}
              </motion.button>

              <AnimatePresence>
                {showCompleted && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ overflow: 'hidden' }}
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', paddingBottom: '1rem' }}>
                      <AnimatePresence mode="popLayout">
                        {completedTodos.map(todo => <TodoCard key={todo.id} todo={todo} />)}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

        </div>
      </div>
    </PageTransition>
  );
}
