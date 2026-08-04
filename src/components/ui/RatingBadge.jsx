import React from 'react';
import { Star } from 'lucide-react';

export default function RatingBadge({ rating, reviews, className = '' }) {
  return (
    <div className={`inline-flex items-center gap-1 bg-white/90 backdrop-blur px-2 py-1 rounded-md border border-surface-alt shadow-soft ${className}`}>
      <Star size={14} className="text-accent-gold fill-accent-gold" />
      <span className="font-mono text-sm font-medium text-ink">{rating.toFixed(1)}</span>
      {reviews && (
        <span className="text-xs text-ink-muted ml-1">({reviews})</span>
      )}
    </div>
  );
}
