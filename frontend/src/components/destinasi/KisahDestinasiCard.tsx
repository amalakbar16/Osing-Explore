import React from 'react';
import GlassCard from '../ui/GlassCard';

interface KisahDestinasi {
  era: string;
  title: string;
  body: string;
  tags?: string[];
}

interface KisahDestinasiCardProps {
  kisah?: KisahDestinasi;
  className?: string;
}

export default function KisahDestinasiCard({
  kisah,
  className = '',
}: KisahDestinasiCardProps) {
  if (!kisah) return null;

  return (
    <GlassCard className={`p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-mono px-2 py-0.5 rounded border border-accent-gold/50 text-accent-gold uppercase tracking-wider">
          {kisah.era}
        </span>
      </div>
      <h4 className="font-display italic text-xl text-ink mb-2">
        {kisah.title}
      </h4>
      <p className="text-sm text-ink-muted leading-relaxed mb-4">
        {kisah.body}
      </p>
      {kisah.tags && kisah.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {kisah.tags.map(tag => (
            <span key={tag} className="text-[10px] text-ink bg-surface-alt px-2 py-1 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </GlassCard>
  );
}
