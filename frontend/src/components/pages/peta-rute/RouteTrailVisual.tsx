import React from 'react';
import type { Destination } from '@/types';

interface RouteTrailVisualProps {
  mainDestination?: Destination | null;
  isActive?: boolean;
  className?: string;
}

export default function RouteTrailVisual({
  mainDestination,
  isActive = true,
  className = '',
}: RouteTrailVisualProps) {
  return (
    <div className={`relative w-full h-32 overflow-hidden text-accent-gold ${className}`}>
      {/* Garis rute putus-putus */}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 100 20" 
        preserveAspectRatio="none"
        className={`w-full h-full opacity-60 ${isActive ? 'animate-dash-flow-slow' : ''}`}
      >
        <path 
          d="M 0,10 Q 25,20 50,10 T 100,10" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeDasharray="4 6"
        />
      </svg>
      
      {/* Node Awal (Lokasi Saat Ini / Kota) */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-surface-alt border-2 border-accent-gold z-10 shadow-lg shadow-surface-alt/50" />
      <span className="absolute left-6 top-[calc(50%+16px)] text-[10px] font-mono text-ink-muted">Titik Awal</span>

      {/* Node Tujuan (Main Destination) */}
      <div className={`absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-accent-primary border-2 border-surface z-10 ${isActive ? 'animate-bobbing' : ''}`} />
      <span className="absolute right-6 top-[calc(50%+16px)] text-[10px] font-mono font-medium text-accent-primary whitespace-nowrap -translate-x-1/2">
        {mainDestination?.name || 'Tujuan'}
      </span>
    </div>
  );
}
