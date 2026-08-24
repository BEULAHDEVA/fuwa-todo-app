import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useTodos } from '../context/TodoContext';
import TaskForm from '../components/TaskForm';
import PageTransition from '../components/PageTransition';
import FuwaMascot from '../components/mascot/FuwaMascot';

export default function TaskPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTodo } = useTodos();

  const isNew    = id === 'new';
  const existing = isNew ? undefined : getTodo(id!);

  return (
    <PageTransition>
      <div className="page-shell">
        <div className="page-container">

          {/* ── Page header ───────────────────────────── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1.75rem' }}>
            <motion.button
              className="fuwa-back-btn"
              onClick={() => navigate(-1)}
              whileHover={{ scale: 1.08, x: -2 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Go back"
            >
              <ArrowLeft size={18} strokeWidth={2.5} />
            </motion.button>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--cocoa)', fontWeight: 500 }}>
              {isNew ? 'New task' : 'Edit task'}
            </h1>
          </div>

          {/* ── Form card ─────────────────────────────── */}
          {!isNew && !existing ? (
            <div className="empty-state">
              <FuwaMascot mood="sleepy" size={100} />
              <p style={{ fontFamily: 'var(--font-display)', color: 'var(--dusty)' }}>Couldn't find that task.</p>
              <motion.button
                className="fuwa-btn"
                onClick={() => navigate('/')}
                whileTap={{ scale: 0.97 }}
                style={{ maxWidth: 200, marginTop: 8 }}
              >
                Back to home
              </motion.button>
            </div>
          ) : (
            <motion.div
              className="fuwa-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06, type: 'spring', stiffness: 380, damping: 28 }}
              style={{ padding: '1.625rem 1.5rem' }}
            >
              <TaskForm existing={existing} />
            </motion.div>
          )}

        </div>
      </div>
    </PageTransition>
  );
}
