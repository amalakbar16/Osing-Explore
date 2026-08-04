import React from 'react';
import { BookOpen } from 'lucide-react';

export default function KisahDestinasiPanel({ kisah }) {
  if (!kisah) return null;

  return (
    <div className="relative mt-8 rounded-2xl p-1 bg-gradient-to-br from-accent-gold/40 via-surface to-accent-rose/20 overflow-hidden shadow-lg shadow-accent-primary/5">
      <div className="relative z-10 bg-surface/90 backdrop-blur-md p-6 rounded-[14px]">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-accent-gold/20 flex items-center justify-center text-accent-gold">
            <BookOpen size={16} />
          </div>
          <span className="text-xs font-mono text-accent-gold uppercase tracking-widest">
            Kisah Destinasi
          </span>
        </div>
        
        <h3 className="font-display italic text-display-sm text-ink leading-tight mb-4">
          {kisah.title}
        </h3>
        
        <div className="text-ink-muted text-sm leading-relaxed space-y-4 font-body">
          <p>{kisah.body}</p>
        </div>
        
        <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-surface-alt/50">
          <span className="text-[10px] text-ink-muted bg-base px-2 py-1 rounded border border-surface-alt">
            {kisah.era}
          </span>
          {kisah.tags?.map(tag => (
            <span key={tag} className="text-[10px] text-accent-primary bg-accent-primary/10 px-2 py-1 rounded">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
