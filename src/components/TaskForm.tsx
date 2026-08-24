import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowLeft } from 'lucide-react';
import { useTodos } from '../context/TodoContext';
import { CategoryIcon } from './icons/FuwaIcons';
import type { Todo } from '../types';

interface TaskFormProps { existing?: Todo; }

export default function TaskForm({ existing }: TaskFormProps) {
  const { addTodo, updateTodo, categories } = useTodos();
  const navigate = useNavigate();

  const [title,      setTitle]      = useState(existing?.title      ?? '');
  const [note,       setNote]       = useState(existing?.note       ?? '');
  const [categoryId, setCategoryId] = useState(existing?.categoryId ?? categories[0]?.id ?? '');
  const [dueDate,    setDueDate]    = useState(existing?.dueDate    ?? '');
  const [error,      setError]      = useState('');

  useEffect(() => {
    if (existing) {
      setTitle(existing.title);
      setNote(existing.note);
      setCategoryId(existing.categoryId);
      setDueDate(existing.dueDate);
    }
  }, [existing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError('Give your task a name ✿'); return; }
    if (existing) updateTodo(existing.id, { title: title.trim(), note, categoryId, dueDate });
    else          addTodo({ title: title.trim(), note, categoryId, dueDate, completed: false });
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Task name */}
      <div>
        <label className="fuwa-label" htmlFor="task-title">Task name</label>
        <motion.input
          id="task-title"
          className="fuwa-input"
          type="text"
          placeholder="What do you want to do?"
          value={title}
          onChange={e => { setTitle(e.target.value); setError(''); }}
          autoFocus
          whileFocus={{ scale: 1.008 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        />
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ color: 'var(--pink-deep)', fontSize: '0.8rem', fontWeight: 700, marginTop: 6 }}
          >
            {error}
          </motion.p>
        )}
      </div>

      {/* Notes */}
      <div>
        <label className="fuwa-label" htmlFor="task-note">Notes (optional)</label>
        <textarea
          id="task-note"
          className="fuwa-input"
          placeholder="Any extra details?"
          value={note}
          onChange={e => setNote(e.target.value)}
        />
      </div>

      {/* Category */}
      <div>
        <label className="fuwa-label">Category</label>
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          {categories.map(cat => {
            const active = categoryId === cat.id;
            return (
              <motion.button
                key={cat.id}
                type="button"
                onClick={() => setCategoryId(cat.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.94 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '0.45rem 0.875rem',
                  borderRadius: 'var(--r-pill)',
                  background: active ? `${cat.color}30` : 'var(--cream-dark)',
                  color: active ? cat.textColor : 'var(--cocoa)',
                  border: `1.5px solid ${active ? cat.color : 'transparent'}`,
                  fontWeight: 700, fontSize: '0.8125rem',
                  fontFamily: 'var(--font-body)',
                  transition: 'all 0.18s',
                }}
              >
                <span style={{ color: active ? cat.textColor : 'var(--dusty)', display: 'flex' }}>
                  <CategoryIcon id={cat.id} width={16} height={16} strokeWidth={2.5}/>
                </span>
                {cat.name}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Due date */}
      <div>
        <label className="fuwa-label" htmlFor="task-due">Due date (optional)</label>
        <input
          id="task-due"
          className="fuwa-input"
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '0.5rem' }}>
        <motion.button
          type="submit"
          className="fuwa-btn"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          <Check size={18} strokeWidth={3} />
          {existing ? 'Save changes' : 'Add task'}
        </motion.button>
        <motion.button
          type="button"
          className="fuwa-btn-ghost"
          onClick={() => navigate(-1)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.97 }}
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
          Cancel
        </motion.button>
      </div>

    </form>
  );
}
