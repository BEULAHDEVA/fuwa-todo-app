import { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { X } from 'lucide-react';
import { useTodos } from '../context/TodoContext';
import TodoCard from '../components/TodoCard';
import PageTransition from '../components/PageTransition';
import FuwaMascot from '../components/mascot/FuwaMascot';
import { CategoryIcon } from '../components/icons/FuwaIcons';

/** Background tints per category (very soft) */
const CAT_BG: Record<string, string> = {
  work:     'var(--lavender-soft)',
  personal: 'var(--pink-soft)',
  health:   'var(--mint-soft)',
  creative: 'var(--peach-soft)',
};
const CAT_BORDER: Record<string, string> = {
  work:     'rgba(196,181,208,0.45)',
  personal: 'rgba(244,167,185,0.45)',
  health:   'rgba(184,216,192,0.45)',
  creative: 'rgba(249,199,132,0.45)',
};

export default function CategoriesPage() {
  const { todos, categories, todosForCategory } = useTodos();
  const [activeId, setActiveId] = useState<string | null>(null);

  const filteredTodos  = activeId ? todosForCategory(activeId).filter(t => !t.completed) : [];
  const activeCategory = categories.find(c => c.id === activeId);

  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07 } },
  };
  const itemVariants: Variants = {
    hidden:  { opacity: 0, y: 16, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 400, damping: 28 } },
  };

  return (
    <PageTransition>
      <div className="page-shell">
        <div className="page-container">

          {/* ── Page title ──────────────────────────────────── */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--cocoa)', fontWeight: 500 }}>
              Your lists
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--cocoa)', fontWeight: 500, marginTop: 2 }}>
              {todos.length} tasks total
            </p>
          </div>

          {/* ── Category grid (2-col) ────────────────────────── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="fuwa-grid-compact"
            style={{ marginBottom: '1.75rem' }}
          >
            {categories.map(cat => {
              const count  = todosForCategory(cat.id).filter(t => !t.completed).length;
              const active = activeId === cat.id;
              return (
                <motion.div
                  key={cat.id}
                  variants={itemVariants}
                  whileHover={{ y: -3, boxShadow: '0 8px 28px rgba(74,53,64,0.10)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveId(active ? null : cat.id)}
                  className="cat-card"
                  style={{
                    background: CAT_BG[cat.id] ?? 'var(--card)',
                    borderColor: active ? cat.color : CAT_BORDER[cat.id] ?? 'transparent',
                    boxShadow: active
                      ? `0 0 0 2px ${cat.color}, 0 4px 20px rgba(74,53,64,0.08)`
                      : '0 2px 10px rgba(74,53,64,0.06)',
                    cursor: 'pointer',
                  }}
                >
                  {/* Icon chip */}
                  <div
                    className="fuwa-icon-chip"
                    style={{ background: `${cat.color}22`, color: cat.textColor }}
                  >
                    <CategoryIcon id={cat.id} width={20} height={20}/>
                  </div>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--cocoa)', fontWeight: 500 }}>
                    {cat.name}
                  </p>
                  <p style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--cocoa)', fontFamily: 'var(--font-body)' }}>
                    {count} {count === 1 ? 'task' : 'tasks'}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* ── Expanded category task list ─────────────────── */}
          <AnimatePresence mode="popLayout">
            {activeId && (
              <motion.div
                key={activeId}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
              >
                {/* List header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--cocoa)', fontWeight: 500 }}>
                    {activeCategory?.name} tasks
                  </h2>
                  <motion.button
                    onClick={() => setActiveId(null)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: 'var(--cream-dark)', color: 'var(--dusty)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <X size={14} strokeWidth={2.5} />
                  </motion.button>
                </div>

                <div className="fuwa-grid" style={{ paddingBottom: '0.75rem' }}>
                  {filteredTodos.length === 0 ? (
                    <div className="empty-state" style={{ padding: '1.5rem 1rem' }}>
                      <FuwaMascot mood="sleepy" size={72} />
                      <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--dusty)' }}>Nothing here yet!</p>
                    </div>
                  ) : (
                    <AnimatePresence mode="popLayout">
                      {filteredTodos.map(todo => <TodoCard key={todo.id} todo={todo} />)}
                    </AnimatePresence>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </PageTransition>
  );
}
