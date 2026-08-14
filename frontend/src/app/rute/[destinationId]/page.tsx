"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getDestinationById } from '@/services/destinationService';
import { useRouteRecommendation } from '@/hooks/useRouteRecommendation';
import { useRouteContext } from '@/context/RouteContext';
import PageTransition from '@/components/layout/PageTransition';
import RouteTrailVisual from '@/components/pages/peta-rute/RouteTrailVisual';
import DestinasiSearahCarousel from '@/components/pages/peta-rute/DestinasiSearahCarousel';
import RadiusExpandNotice from '@/components/pages/peta-rute/RadiusExpandNotice';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import LazyImage from '@/components/common/LazyImage';
import { MapPinOff, ArrowLeft, Compass, Info } from 'lucide-react';
import { MAP_CONSTANTS } from '@/utils/constants';
import type { Destination } from '@/types';

function getCorridorTitle(corridorId?: string) {
  if (!corridorId) return 'Jalur Utama Banyuwangi';
  if (corridorId.includes('ijen') || corridorId.includes('utara')) return 'Koridor Wisata Ijen & Licin';
  if (corridorId.includes('selatan') || corridorId.includes('merah')) return 'Koridor Pesisir Selatan & Pulau Merah';
  if (corridorId.includes('pusat') || corridorId.includes('purwo')) return 'Koridor Budaya Kota & Taman Nasional';
  return corridorId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

export default function PetaRutePage() {
  const params = useParams();
  const destinationId = params?.destinationId as string;
  const router = useRouter();
  const { dispatch } = useRouteContext();
  const [mainDest, setMainDest] = useState<Destination | null>(null);
  const [loadingDest, setLoadingDest] = useState(true);

  const targetId = destinationId === 'aktif' ? 'dest-ijen' : destinationId; 

  useEffect(() => {
    setLoadingDest(true);
    getDestinationById(targetId).then(dest => {
      setMainDest(dest || null);
      if (dest) {
        const corridorId = dest.corridorIds?.[0] || 'jalur-ijen-utara';
        dispatch({ 
          type: 'SET_ACTIVE_ROUTE', 
          payload: { corridorId, destination: dest } 
        });
      }
      setLoadingDest(false);
    });
  }, [targetId, dispatch]);

  const activeCorridorId = mainDest?.corridorIds?.[0] || 'jalur-ijen-utara';
  const { data: routeRecs, loading: loadingRecs } = useRouteRecommendation(activeCorridorId);

  if (loadingDest) {
    return (
      <div className="p-6 pt-safe">
        <Skeleton className="w-full h-32 mb-6" />
        <Skeleton className="w-3/4 h-8 mb-4" />
        <div className="flex gap-4">
          <Skeleton className="w-[280px] h-[300px]" />
        </div>
      </div>
    );
  }

  if (!mainDest) {
    return (
      <div className="p-6 pt-20">
        <EmptyState 
          icon={MapPinOff} 
          title="Belum Ada Rute Aktif" 
          description="Silakan pilih destinasi utama dari Beranda terlebih dahulu."
          action={
            <button onClick={() => router.push('/')} className="mt-4 px-4 py-2 bg-accent-primary text-white rounded-lg">
              Kembali ke Beranda
            </button>
          }
        />
      </div>
    );
  }

  const isRadiusExpanded = (routeRecs?.length || 0) < 3;

  return (
    <PageTransition className="pb-24 bg-base min-h-screen">
      {/* Top Header */}
      <div className="bg-surface border-b border-surface-alt pt-safe pb-4">
        <div className="px-5 mb-3 flex items-center gap-3">
          <button 
            onClick={() => router.push(`/destinasi/${mainDest.id}`)}
            className="p-2 rounded-full hover:bg-surface-alt text-ink transition-colors -ml-1"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-display text-lg font-bold text-ink leading-tight">Koridor Rute Wisata</h1>
            <p className="text-xs text-accent-primary font-medium">{getCorridorTitle(mainDest.corridorIds?.[0])}</p>
          </div>
        </div>
        
        {/* Main Destination Hero Summary in Route */}
        <div className="px-5 mb-2">
          <div 
            onClick={() => router.push(`/destinasi/${mainDest.id}`)}
            className="bg-accent-primary/8 border border-accent-primary/20 rounded-2xl p-3.5 flex items-center gap-3.5 cursor-pointer hover:border-accent-primary/40 transition-all"
          >
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-surface-alt shrink-0 border border-surface-alt">
              <LazyImage src={mainDest.images[0]} alt={mainDest.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold bg-accent-primary text-white px-2 py-0.5 rounded-full">Destinasi Utama</span>
                <span className="text-xs text-accent-gold font-bold">★ {mainDest.rating}</span>
              </div>
              <h2 className="font-bold text-base text-ink truncate mt-0.5">{mainDest.name}</h2>
              <p className="text-xs text-ink-muted line-clamp-1">{mainDest.shortDescription}</p>
            </div>
            <Info size={16} className="text-accent-primary shrink-0 mr-1" />
          </div>
        </div>

        <RouteTrailVisual mainDestination={mainDest} />
      </div>

      <RadiusExpandNotice 
        isExpanded={isRadiusExpanded && !loadingRecs} 
        originalRadius={MAP_CONSTANTS.DEFAULT_RADIUS_KM} 
        newRadius={MAP_CONSTANTS.EXPANDED_RADIUS_KM} 
      />

      {loadingRecs ? (
        <div className="p-6">
          <Skeleton className="w-48 h-6 mb-4" />
          <div className="flex gap-4">
            <Skeleton className="w-[280px] h-[220px]" />
            <Skeleton className="w-[280px] h-[220px]" />
          </div>
        </div>
      ) : (
        <DestinasiSearahCarousel destinations={routeRecs.filter(d => d.id !== mainDest.id)} />
      )}
    </PageTransition>
  );
}
