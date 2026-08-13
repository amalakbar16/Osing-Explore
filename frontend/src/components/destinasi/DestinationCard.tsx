import React from 'react';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import LazyImage from '../common/LazyImage';
import RatingBadge from '../ui/RatingBadge';
import type { Destination } from '../../types';

interface DestinationCardProps {
  destination: Destination;
  variant?: 'compact' | 'detailed';
  className?: string;
}

export default function DestinationCard({
  destination,
  variant = 'compact',
  className = '',
}: DestinationCardProps) {
  const isCompact = variant === 'compact';

  const getShadowClass = (category?: string) => {
    switch (category?.toLowerCase()) {
      case 'alam':
        return 'group-hover:shadow-colored-teal';
      case 'budaya':
        return 'group-hover:shadow-colored-gold';
      case 'pantai':
        return 'group-hover:shadow-colored-blue';
      default:
        return 'group-hover:shadow-soft';
    }
  };

  return (
    <Link href={`/destinasi/${destination.id}`} className={`block group ${className}`}>
      <div className={`relative rounded-2xl overflow-hidden bg-surface border border-surface-alt transition-all duration-300 transform group-hover:-translate-y-1 ${getShadowClass(destination.category)} shadow-sm`}>
        <LazyImage 
          src={destination.images[0]} 
          alt={destination.name} 
          className={isCompact ? "aspect-[4/3] w-full object-cover" : "aspect-video w-full object-cover"} 
        />
        <div className="absolute top-2 right-2">
          <RatingBadge rating={destination.rating} />
        </div>
        <div className="p-4">
          <h3 className="font-display text-lg text-ink mb-1 group-hover:text-accent-primary transition-colors line-clamp-1">
            {destination.name}
          </h3>
          <p className="text-sm text-ink-muted line-clamp-2 mb-3">
            {destination.shortDescription}
          </p>
          {!isCompact && (
            <div className="flex items-center text-xs text-ink-muted">
              <MapPin size={14} className="mr-1" />
              <span className="font-mono">{destination.distanceFromRouteKm > 0 ? `${destination.distanceFromRouteKm} km dari rute` : 'Titik utama'}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
