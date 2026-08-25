import { motion, type Variants } from 'framer-motion';
import { useTodos } from '../context/TodoContext';
import ProgressRing from '../components/ProgressRing';
import PageTransition from '../components/PageTransition';
import FuwaMascot from '../components/mascot/FuwaMascot';
import { CategoryIcon } from '../components/icons/FuwaIcons';

export default function StatsPage() {
  const { todos, categories, currentStreak, completedThisWeek } = useTodos();

  const streak        = currentStreak();
  const total         = todos.length;
  const completedAll  = todos.filter(t => t.completed).length;
  const weeklyCount   = completedThisWeek().length;

  const catBreakdown = categories.map(cat => {
    const catTodos = todos.filter(t => t.categoryId === cat.id);
    const catDone  = catTodos.filter(t => t.completed).length;
    return { ...cat, total: catTodos.length, done: catDone };
  });

  const itemVariants: Variants = {
    hidden:  { opacity: 0, y: 16 },
    visible: (i: number) => ({
      opacity: 1, y: 0,
      transition: { type: "spring", stiffness: 380, damping: 28, delay: i * 0.07 },
    }),
  };

  return (
    <PageTransition>
      <div className="page-shell">
        <div className="page-container">

          {/* ── Page title ─────────────────────────────────── */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--cocoa)', fontWeight: 500 }}>
              Your progress
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--cocoa)', fontWeight: 500, marginTop: 2 }}>
              Keep going, Fuwa believes in you ✿
            </p>
          </div>

          {/* ── Top stats row ──────────────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem', marginBottom: '1.125rem' }}>
            {/* Streak */}
            <motion.div
              className="stat-card"
              custom={0}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              style={{ background: 'var(--lavender-soft)', borderColor: 'rgba(196,181,208,0.5)' }}
            >
              <FuwaMascot mood={streak > 0 ? 'happy' : 'sleepy'} size={56} />
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', color: 'var(--cocoa)', lineHeight: 1, fontWeight: 500 }}>
                {streak}
              </p>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--cocoa)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-body)' }}>
                Day streak
              </p>
            </motion.div>

            {/* This week */}
            <motion.div
              className="stat-card"
              custom={1}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              style={{ background: 'var(--mint-soft)', borderColor: 'rgba(184,216,192,0.5)' }}
            >
              <FuwaMascot mood={weeklyCount > 0 ? 'happy' : 'idle'} size={56} />
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', color: 'var(--cocoa)', lineHeight: 1, fontWeight: 500 }}>
                {weeklyCount}
              </p>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--dusty)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-body)' }}>
                This week
              </p>
            </motion.div>
          </div>

          {/* All-time total */}
          <motion.div
            className="stat-card"
            custom={2}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', padding: '1rem 1.375rem' }}
          >
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--cocoa)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-body)' }}>
                All-time completed
              </p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--pink-deep)', lineHeight: 1.2, fontWeight: 500 }}>
                {completedAll} / {total}
              </p>
            </div>
            <FuwaMascot mood={completedAll > 0 ? 'happy' : 'idle'} size={60} />
          </motion.div>

          {/* ── Category breakdown ─────────────────────────── */}
          <motion.div
            className="fuwa-card"
            custom={3}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            style={{ padding: '1.375rem 1.25rem' }}
          >
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: 'var(--cocoa)', fontWeight: 500, marginBottom: '1.25rem' }}>
              By category
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
              {catBreakdown.map(cat => (
                <div key={cat.id}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: 28, height: 28, borderRadius: 9,
                        background: `${cat.color}22`, color: cat.textColor,
                      }}>
                        <CategoryIcon id={cat.id} width={15} height={15}/>
                      </span>
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--cocoa)', fontFamily: 'var(--font-body)' }}>
                        {cat.name}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--cocoa)', fontFamily: 'var(--font-body)' }}>
                      {cat.done}/{cat.total}
                    </span>
                  </div>
                  {/* ProgressRing owns its anime.js tween — no conflict */}
                  <ProgressRing completed={cat.done} total={cat.total} compact />
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </PageTransition>
  );
}
