import type { SVGProps } from 'react';

/**
 * Fuwa custom icon set — one visual family.
 * All icons: 24×24 viewBox, strokeWidth=2, rounded caps/joins.
 * Nav icons (HomeIcon, ListsIcon, StatsIcon) and category icons
 * (WorkIcon, PersonalIcon, HealthIcon, CreativeIcon) share the same
 * stroke weight and style — no mismatched visual families.
 */

const BASE: SVGProps<SVGSVGElement> = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

/* ── NAV ICONS ────────────────────────────────────────────── */

export function HomeIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...BASE} {...p}>
      {/* rounded house: arc roof + door dot */}
      <path d="M3 11 12 4l9 7"/>
      <path d="M5 9.5V20h5v-5h4v5h5V9.5"/>
      <circle cx="12" cy="14" r="1.4" fill="currentColor" stroke="none"/>
    </svg>
  );
}

export function ListsIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...BASE} {...p}>
      {/* dot-bullet list — 3 rows */}
      <circle cx="4.5" cy="7"  r="1.5" fill="currentColor" stroke="none"/>
      <line x1="9" y1="7"  x2="21" y2="7"/>
      <circle cx="4.5" cy="12" r="1.5" fill="currentColor" stroke="none"/>
      <line x1="9" y1="12" x2="21" y2="12"/>
      <circle cx="4.5" cy="17" r="1.5" fill="currentColor" stroke="none"/>
      <line x1="9" y1="17" x2="17" y2="17"/>
    </svg>
  );
}

export function StatsIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...BASE} {...p}>
      {/* ascending bar chart — filled rounded rects */}
      <rect x="3"  y="15" width="4" height="6"  rx="2" fill="currentColor" stroke="none"/>
      <rect x="10" y="9"  width="4" height="12" rx="2" fill="currentColor" stroke="none"/>
      <rect x="17" y="4"  width="4" height="17" rx="2" fill="currentColor" stroke="none"/>
    </svg>
  );
}

/* ── CATEGORY ICONS ───────────────────────────────────────── */

export function WorkIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...BASE} {...p}>
      {/* briefcase */}
      <rect x="2" y="8" width="20" height="13" rx="3"/>
      <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </svg>
  );
}

export function PersonalIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...BASE} {...p}>
      {/* heart */}
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}

export function HealthIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...BASE} {...p}>
      {/* sprout / leaf */}
      <path d="M12 22V12"/>
      <path d="M12 12C12 7.5 7.5 5 3 5c0 5.5 3.5 8 9 7z"/>
      <path d="M12 12C12 7.5 16.5 5 21 5c0 5.5-3.5 8-9 7z"/>
    </svg>
  );
}

export function CreativeIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...BASE} {...p}>
      {/* 4-point sparkle */}
      <path d="M12 3 13.5 8.5 19 10l-5.5 1.5L12 17 10.5 11.5 5 10l5.5-1.5z"/>
      <line x1="19" y1="3"  x2="21" y2="5"  strokeWidth="1.5"/>
      <line x1="3"  y1="19" x2="5"  y2="21" strokeWidth="1.5"/>
    </svg>
  );
}

/** Map category id → its icon component */
export function CategoryIcon({ id, ...p }: { id: string } & SVGProps<SVGSVGElement>) {
  switch (id) {
    case 'work':     return <WorkIcon     {...p}/>;
    case 'personal': return <PersonalIcon {...p}/>;
    case 'health':   return <HealthIcon   {...p}/>;
    case 'creative': return <CreativeIcon {...p}/>;
    default:         return <PersonalIcon {...p}/>;
  }
}
