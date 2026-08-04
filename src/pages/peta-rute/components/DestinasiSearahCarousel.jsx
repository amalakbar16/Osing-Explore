import React from 'react';
import DestinationCard from '../../../components/destinasi/DestinationCard';
import KisahDestinasiCard from '../../../components/destinasi/KisahDestinasiCard';

export default function DestinasiSearahCarousel({ destinations = [] }) {
  if (destinations.length === 0) return null;

  return (
    <div className="py-6">
      <h3 className="px-6 text-lg font-display mb-4">Searah Perjalanan Anda</h3>
      
      <div className="flex gap-4 overflow-x-auto px-6 pb-6 snap-x snap-mandatory hide-scrollbar">
        {destinations.map((dest, idx) => (
          <div 
            key={dest.id} 
            className="w-[280px] flex-shrink-0 snap-center animate-fade-in"
            style={{ animationDelay: `${idx * 150}ms`, animationFillMode: 'both' }}
          >
            {/* Card Destinasi Reguler */}
            <DestinationCard destination={dest} variant="compact" />
          </div>
        ))}
      </div>
    </div>
  );
}
