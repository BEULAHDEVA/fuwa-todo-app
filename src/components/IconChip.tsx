import type { ReactNode } from 'react';

interface IconChipProps {
  icon: ReactNode;
  variant?: 'gold' | 'white';
}

export default function IconChip({ icon, variant = 'gold' }: IconChipProps) {
  return (
    <div className={`icon-chip-${variant}`}>
      {icon}
    </div>
  );
}
