import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Category, Todo } from '../types';

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'work',     name: 'Work',     color: '#C4B5D0', textColor: '#3D2A52' },
  { id: 'personal', name: 'Personal', color: '#F4A7B9', textColor: '#7A2740' },
  { id: 'health',   name: 'Health',   color: '#B8D8C0', textColor: '#2A5230' },
  { id: 'creative', name: 'Creative', color: '#F9C784', textColor: '#7A4A10' },
];

interface TodoContextValue {
  todos: Todo[];
  categories: Category[];
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'completedAt'>) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  getTodo: (id: string) => Todo | undefined;
  todosForCategory: (categoryId: string) => Todo[];
  completedThisWeek: () => Todo[];
  currentStreak: () => number;
}

const TodoContext = createContext<TodoContextValue | null>(null);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>(() =>
    loadFromStorage('fuwa-todos', [])
  );
  const [categories] = useState<Category[]>(DEFAULT_CATEGORIES);

  useEffect(() => {
    localStorage.setItem('fuwa-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (todo: Omit<Todo, 'id' | 'createdAt' | 'completedAt'>) => {
    setTodos(prev => [
      { ...todo, id: crypto.randomUUID(), createdAt: new Date().toISOString(), completedAt: '' },
      ...prev,
    ]);
  };

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const toggleTodo = (id: string) => {
    setTodos(prev =>
      prev.map(t =>
        t.id === id
          ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toISOString() : '' }
          : t
      )
    );
  };

  const getTodo = (id: string) => todos.find(t => t.id === id);
  const todosForCategory = (categoryId: string) => todos.filter(t => t.categoryId === categoryId);

  const completedThisWeek = () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - start.getDay());
    return todos.filter(t => t.completed && t.completedAt && new Date(t.completedAt) >= start);
  };

  const currentStreak = () => {
    const completedDates = new Set(
      todos.filter(t => t.completed && t.completedAt).map(t => new Date(t.completedAt).toDateString())
    );
    let streak = 0;
    const date = new Date();
    while (completedDates.has(date.toDateString())) {
      streak++;
      date.setDate(date.getDate() - 1);
    }
    return streak;
  };

  return (
    <TodoContext.Provider value={{ todos, categories, addTodo, updateTodo, deleteTodo, toggleTodo, getTodo, todosForCategory, completedThisWeek, currentStreak }}>
      {children}
    </TodoContext.Provider>
  );
}

export function useTodos(): TodoContextValue {
  const ctx = useContext(TodoContext);
  if (!ctx) throw new Error('useTodos must be used inside TodoProvider');
  return ctx;
}
