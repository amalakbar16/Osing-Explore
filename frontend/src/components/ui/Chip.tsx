import React from 'react';

interface ChipProps {
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function Chip({
  icon: Icon,
  label,
  active = false,
  onClick,
  className = '',
}: ChipProps) {
  return (
    <button
      onClick={onClick}
      suppressHydrationWarning
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-all ${
        active
          ? 'bg-accent-primary border-accent-primary text-white shadow-colored-teal font-medium'
          : 'bg-surface border-surface-alt text-ink-muted hover:text-ink hover:border-accent-primary/30'
      } ${className}`}
    >
      {Icon && <Icon size={14} />}
      <span>{label}</span>
    </button>
  );
}
