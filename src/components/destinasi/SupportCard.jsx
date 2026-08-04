import React from 'react';
import LazyImage from '../common/LazyImage';
import RatingBadge from '../ui/RatingBadge';
import { MapPin } from 'lucide-react';

export default function SupportCard({ item, onClick, subtitleLabel }) {
  return (
    <div 
      onClick={onClick}
      className="flex gap-4 p-3 bg-surface border border-surface-alt rounded-2xl cursor-pointer hover:bg-surface-alt/50 transition-colors"
    >
      <LazyImage 
        src={item.images[0]} 
        alt={item.name} 
        className="w-24 h-24 rounded-xl flex-shrink-0" 
      />
      <div className="flex-1 py-1 flex flex-col">
        <h4 className="font-display text-base text-ink mb-1 line-clamp-1">{item.name}</h4>
        <div className="flex items-center gap-2 mb-2 text-xs">
          <RatingBadge rating={item.rating} className="px-1.5 py-0.5" />
          <span className="text-ink-muted capitalize">{item.priceRange}</span>
        </div>
        {subtitleLabel && (
          <div className="text-xs text-accent-primary mb-1">{item[subtitleLabel]}</div>
        )}
        <div className="flex items-center text-[10px] text-ink-muted mt-auto">
          <MapPin size={12} className="mr-1" />
          <span className="font-mono">{item.distanceFromRouteKm !== undefined ? `${item.distanceFromRouteKm} km dari rute` : 'Titik utama'}</span>
        </div>
      </div>
    </div>
  );
}
