"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getDestinationById } from '@/services/destinationService';
import PageTransition from '@/components/layout/PageTransition';
import KisahDestinasiPanel from '@/components/pages/detail-destinasi/KisahDestinasiPanel';
import LazyImage from '@/components/common/LazyImage';
import Skeleton from '@/components/ui/Skeleton';
import RatingBadge from '@/components/ui/RatingBadge';
import Button from '@/components/ui/Button';
import { ArrowLeft, Clock, MapPin, Navigation, BookmarkPlus, CheckCircle2, Ticket, Tent } from 'lucide-react';
import { useRouteContext } from '@/context/RouteContext';
import type { Destination } from '@/types';

export default function DetailDestinasiPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [dest, setDest] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const { state, dispatch } = useRouteContext();

  const isSaved = state.savedRoute.some(d => d.id === id);

  useEffect(() => {
    if (id) {
      getDestinationById(id).then(data => {
        setDest(data || null);
        setLoading(false);
      });
    }
  }, [id]);

  const handleOpenMaps = () => {
    if (dest) {
      const query = encodeURIComponent(`${dest.name}, Banyuwangi`);
      const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
      window.open(url, '_blank');
    }
  };

  const handleToggleRoute = () => {
    if (!dest) return;
    if (isSaved) {
      dispatch({ type: 'REMOVE_FROM_ROUTE', payload: dest.id });
    } else {
      dispatch({ type: 'ADD_TO_ROUTE', payload: dest });
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full bg-base">
        <Skeleton className="w-full h-72 md:h-96 rounded-none" />
        <div className="p-6 -mt-12 relative z-10 bg-base rounded-t-3xl h-full">
          <Skeleton className="w-2/3 h-8 mb-4" />
          <Skeleton className="w-1/3 h-6 mb-8" />
          <Skeleton className="w-full h-40" />
        </div>
      </div>
    );
  }

  if (!dest) {
    return (
      <div className="p-8 text-center mt-20">
        <h2 className="text-lg text-ink">Destinasi tidak ditemukan</h2>
        <Button variant="secondary" className="mt-4" onClick={() => router.back()}>Kembali</Button>
      </div>
    );
  }

  return (
    <PageTransition>
      {/* Hero Image */}
      <div className="relative w-full h-72 md:h-96">
        <button 
          onClick={() => router.back()} 
          className="absolute top-4 left-4 z-20 w-10 h-10 rounded-full bg-white/50 backdrop-blur flex items-center justify-center text-ink border border-white/50 shadow-soft"
        >
          <ArrowLeft size={20} />
        </button>
        <LazyImage 
          src={dest.images[0]} 
          alt={dest.name} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-base via-base/20 to-transparent" />
      </div>

      {/* Content Area */}
      <div className="relative z-10 -mt-12 px-6 pb-24">
        <div className="flex justify-between items-end mb-2">
          <span className="text-xs font-mono text-accent-primary uppercase tracking-widest bg-accent-primary/10 px-2 py-1 rounded">
            {dest.category}
          </span>
          <RatingBadge rating={dest.rating} className="shadow-none border-none bg-surface/80" />
        </div>
        
        <h1 className="font-display text-display-md text-ink leading-tight mb-2">
          {dest.name}
        </h1>
        
        <p className="text-ink-muted mb-6">
          {dest.shortDescription}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <Button variant="primary" className="flex-1 flex gap-2" onClick={handleOpenMaps}>
            <Navigation size={18} /> Maps
          </Button>
          <Button 
            variant="secondary" 
            className={`flex-1 flex gap-2 ${isSaved ? 'text-accent-primary border-accent-primary bg-accent-primary/5' : ''}`}
            onClick={handleToggleRoute}
          >
            {isSaved ? <CheckCircle2 size={18} /> : <BookmarkPlus size={18} />}
            {isSaved ? "Di Rute" : "Tambah"}
          </Button>
        </div>

        {/* Tags */}
        {dest.tags && (
          <div className="flex flex-wrap gap-2 mb-6">
            {dest.tags.map(tag => (
              <span key={tag} className="text-xs text-ink bg-white px-3 py-1.5 rounded-full border border-surface-alt shadow-soft">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Info Grid Card */}
        <div className="bg-surface rounded-2xl p-5 border border-surface-alt grid grid-cols-2 gap-y-5 gap-x-4 shadow-soft mb-6">
          <div className="flex flex-col gap-1">
            <span className="flex items-center text-xs text-ink-muted"><Clock size={14} className="mr-1 text-accent-gold" /> Jam Buka</span>
            <span className="text-sm font-medium text-ink">{dest.openingHours}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="flex items-center text-xs text-ink-muted"><Ticket size={14} className="mr-1 text-accent-gold" /> Tiket</span>
            <span className="text-sm font-medium text-ink capitalize">
              {dest.ticketPrice !== undefined && dest.ticketPrice > 0 ? `Rp ${dest.ticketPrice.toLocaleString('id-ID')}` : 'Gratis'}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="flex items-center text-xs text-ink-muted"><Tent size={14} className="mr-1 text-accent-gold" /> Durasi</span>
            <span className="text-sm font-medium text-ink capitalize">{dest.duration || 'Bebas'}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="flex items-center text-xs text-ink-muted"><MapPin size={14} className="mr-1 text-accent-gold" /> Jarak</span>
            <span className="text-sm font-medium text-ink capitalize">{dest.distanceFromRouteKm > 0 ? `${dest.distanceFromRouteKm} km` : 'Pusat'}</span>
          </div>
        </div>

        {dest.kisahDestinasi && <KisahDestinasiPanel kisah={dest.kisahDestinasi} />}
      </div>
    </PageTransition>
  );
}
