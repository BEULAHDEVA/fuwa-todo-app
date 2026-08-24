import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import FuwaMascot from './mascot/FuwaMascot';
import { HomeIcon, ListsIcon, StatsIcon } from './icons/FuwaIcons';

const TABS = [
  { to: '/',           Icon: HomeIcon,  label: 'Home'  },
  { to: '/categories', Icon: ListsIcon, label: 'Lists' },
  { to: '/stats',      Icon: StatsIcon, label: 'Stats' },
] as const;

/**
 * NavBar renders TWO fixed elements:
 * 1. Top header — Fuwa wordmark + small idle mascot
 * 2. Bottom pill nav — 3 tabs + floating Add button
 *
 * Framer Motion owns:
 *   - layoutId="fuwa-nav-pill" shared element for the active tab indicator
 *   - whileHover/whileTap on the Add button
 */
export default function NavBar() {
  const location = useLocation();
  const { dark, toggle } = useTheme();

  return (
    <>
      {/* ── Top Header ───────────────────────────────────── */}
      <header className="fuwa-header">
        <div className="fuwa-wordmark">
          {/* Small idle Fuwa-chan — anime.js owns its float loop */}
          <FuwaMascot size={34} mood="idle" />
          fuwa
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{
            fontSize: '0.775rem',
            fontWeight: 700,
            color: 'var(--dusty)',
            fontFamily: 'var(--font-body)',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}>
            your cozy companion ✿
          </div>
          <motion.button
            onClick={toggle}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--cream-dark)', color: 'var(--cocoa)',
              border: '1.5px solid var(--blush-border)',
            }}
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun size={15} strokeWidth={2.5} /> : <Moon size={15} strokeWidth={2.5} />}
          </motion.button>
        </div>
      </header>

      {/* ── Bottom Tab Nav ───────────────────────────────── */}
      <div className="fuwa-nav-shell">
        <nav className="fuwa-nav-inner">

          {/* Home + Lists */}
          {TABS.slice(0, 2).map(({ to, Icon, label }) => {
            const active = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
            return (
              <NavLink
                key={to}
                to={to}
                className={`fuwa-nav-tab ${active ? 'active' : ''}`}
                style={{ textDecoration: 'none', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                {/* Shared active background pill (Framer layoutId) */}
                <AnimatePresence>
                  {active && (
                    <motion.div
                      layoutId="fuwa-nav-pill"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(244,167,185,0.14)',
                        borderRadius: 'var(--r-lg)',
                        zIndex: -1,
                      }}
                      transition={{ type: 'spring', stiffness: 500, damping: 36 }}
                    />
                  )}
                </AnimatePresence>
                <Icon />
                <span className="fuwa-nav-tab-label">{label}</span>
              </NavLink>
            );
          })}

          {/* ── Floating Add Button (CTA) ──────────────────── */}
          <NavLink to="/task/new" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <motion.div
              className="fuwa-nav-add"
              whileHover={{ scale: 1.1, rotate: 8 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 500, damping: 28 }}
            >
              <Plus size={22} strokeWidth={2.5} />
            </motion.div>
            <span className="fuwa-nav-tab-label" style={{ color: 'var(--dusty)' }}>Add</span>
          </NavLink>

          {/* Stats */}
          {TABS.slice(2).map(({ to, Icon, label }) => {
            const active = location.pathname.startsWith(to);
            return (
              <NavLink
                key={to}
                to={to}
                className={`fuwa-nav-tab ${active ? 'active' : ''}`}
                style={{ textDecoration: 'none', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <AnimatePresence>
                  {active && (
                    <motion.div
                      layoutId="fuwa-nav-pill"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(244,167,185,0.14)',
                        borderRadius: 'var(--r-lg)',
                        zIndex: -1,
                      }}
                      transition={{ type: 'spring', stiffness: 500, damping: 36 }}
                    />
                  )}
                </AnimatePresence>
                <Icon />
                <span className="fuwa-nav-tab-label">{label}</span>
              </NavLink>
            );
          })}

        </nav>
      </div>
    </>
  );
}
