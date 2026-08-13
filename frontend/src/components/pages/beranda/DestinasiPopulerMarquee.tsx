"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DestinationCard from '@/components/destinasi/DestinationCard';
import { getAllDestinations } from '@/services/destinationService';
import ScrollReveal from '@/components/common/ScrollReveal';
import type { Destination } from '@/types';

interface DestinasiPopulerMarqueeProps {
  activeKategori: string;
}

export default function DestinasiPopulerMarquee({ activeKategori }: DestinasiPopulerMarqueeProps) {
  const router = useRouter();
  const [destinations, setDestinations] = useState<Destination[]>([]);

  useEffect(() => {
    getAllDestinations().then(data => {
      const filtered = activeKategori === 'semua' 
        ? data 
        : data.filter(d => d.category === activeKategori);
      
      const sorted = filtered.sort((a, b) => b.rating - a.rating).slice(0, 6);
      setDestinations(sorted);
    });
  }, [activeKategori]);

  if (destinations.length === 0) return (
    <div className="px-6 py-12 text-center text-ink-muted text-sm">
      Belum ada destinasi di kategori ini.
    </div>
  );

  return (
    <ScrollReveal className="py-6">
      <div className="px-6 mb-4 flex justify-between items-end">
        <h2 className="font-display text-xl text-ink">Destinasi Populer</h2>
        <button 
          onClick={() => router.push('/semua-destinasi')}
          className="text-xs text-accent-primary hover:underline bg-transparent border-none p-0 cursor-pointer"
        >
          Lihat Semua
        </button>
      </div>
      
      <div className="flex gap-4 overflow-x-auto px-6 hide-scrollbar pb-4 scroll-smooth snap-x">
        {destinations.map(dest => (
          <div key={dest.id} className="min-w-[240px] w-[240px] snap-center">
            <DestinationCard destination={dest} />
          </div>
        ))}
      </div>
    </ScrollReveal>
  );
}
