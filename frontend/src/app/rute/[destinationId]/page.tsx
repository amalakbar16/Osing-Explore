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
import { MapPinOff } from 'lucide-react';
import { MAP_CONSTANTS } from '@/utils/constants';
import type { Destination } from '@/types';

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
        dispatch({ 
          type: 'SET_ACTIVE_ROUTE', 
          payload: { corridorId: dest.corridorIds[0], destination: dest } 
        });
      }
      setLoadingDest(false);
    });
  }, [targetId, dispatch]);

  const { data: routeRecs, loading: loadingRecs } = useRouteRecommendation(mainDest?.corridorIds[0]);

  if (loadingDest) {
    return (
      <div className="p-6">
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

  const isRadiusExpanded = routeRecs.length < 3;

  return (
    <PageTransition>
      <div className="bg-surface border-b border-surface-alt pb-4 pt-6">
        <div className="px-6 mb-2">
          <h1 className="font-display text-2xl text-ink">Perjalanan ke {mainDest.name}</h1>
          <p className="text-sm text-ink-muted">Estimasi: 90 menit • Via {mainDest.corridorIds[0]}</p>
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
