"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageTransition from '@/components/layout/PageTransition';
import DestinationCard from '@/components/destinasi/DestinationCard';
import { getAllDestinations } from '@/services/destinationService';
import { ArrowLeft } from 'lucide-react';
import Skeleton from '@/components/ui/Skeleton';
import type { Destination } from '@/types';

export default function SemuaDestinasiPage() {
  const router = useRouter();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllDestinations().then(data => {
      setDestinations(data);
      setLoading(false);
    });
  }, []);

  return (
    <PageTransition>
      <div className="bg-surface min-h-screen">
        <div className="sticky top-0 z-30 bg-surface/90 backdrop-blur-md border-b border-surface-alt px-4 pt-safe pb-3 flex items-center gap-2.5">
          <button 
            onClick={() => router.back()} 
            className="p-1.5 rounded-full hover:bg-surface-alt text-ink transition-colors -ml-1"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-display text-base font-bold text-ink">Semua Destinasi</h1>
        </div>

        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <Skeleton key={i} className="w-full h-64 rounded-xl" />
            ))
          ) : (
            destinations.map(dest => (
              <div key={dest.id} className="w-full animate-fade-in">
                <DestinationCard destination={dest} />
              </div>
            ))
          )}
        </div>
      </div>
    </PageTransition>
  );
}
