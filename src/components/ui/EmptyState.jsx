import React from 'react';

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-surface rounded-2xl border border-surface-alt border-dashed">
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-surface-alt flex items-center justify-center text-ink-muted mb-4">
          <Icon size={32} strokeWidth={1.5} />
        </div>
      )}
      <h3 className="text-lg font-display text-ink mb-2">{title}</h3>
      <p className="text-sm text-ink-muted mb-6 max-w-xs">{description}</p>
      {action && action}
    </div>
  );
}
