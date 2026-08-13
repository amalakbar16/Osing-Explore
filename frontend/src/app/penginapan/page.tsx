"use client";

import React, { useState } from 'react';
import { useRouteContext } from '@/context/RouteContext';
import { useLodgingByRoute } from '@/hooks/useLodgingByRoute';
import PageTransition from '@/components/layout/PageTransition';
import FilterChipGroup from '@/components/common/FilterChipGroup';
import SupportCard from '@/components/destinasi/SupportCard';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import { MapPinOff } from 'lucide-react';

const FILTER_OPTIONS = [
  { label: 'Semua', value: 'all' },
  { label: 'Hotel', value: 'Hotel' },
  { label: 'Resort', value: 'Resort' },
  { label: 'Homestay', value: 'Homestay' },
];

export default function PenginapanPage() {
  const { state } = useRouteContext();
  const { data, loading } = useLodgingByRoute(state.activeCorridorId);
  const [filter, setFilter] = useState('all');

  const filteredData = filter === 'all' ? data : data.filter(item => item.roomType === filter);

  return (
    <PageTransition>
      <div className="pt-6 pb-2 px-6">
        <h1 className="font-display text-2xl text-ink mb-2">Tempat Istirahat</h1>
        <p className="text-sm text-ink-muted mb-4">
          {state.activeCorridorId 
            ? `Penginapan strategis di sekitar rute ke ${state.mainDestination?.name || 'tujuan Anda'}.`
            : "Temukan penginapan nyaman di Banyuwangi."}
        </p>

        {!state.activeCorridorId && (
          <div className="mb-4 p-3 bg-surface-alt/50 border border-surface-alt rounded-lg text-xs text-ink-muted">
            <strong className="text-ink">Tip:</strong> Pilih destinasi utama di Beranda untuk melihat penginapan yang searah.
          </div>
        )}

        <FilterChipGroup 
          options={FILTER_OPTIONS} 
          selected={filter} 
          onChange={setFilter}
          className="mt-4 mb-6 pb-2"
        />
      </div>

      <div className="px-6 flex flex-col gap-3">
        {loading ? (
          <>
            <Skeleton className="w-full h-32" />
            <Skeleton className="w-full h-32" />
          </>
        ) : filteredData.length === 0 ? (
          <EmptyState 
            icon={MapPinOff}
            title="Tidak Ada Penginapan"
            description={state.activeCorridorId 
              ? "Kami tidak menemukan penginapan dalam radius rute ini." 
              : "Belum ada data penginapan untuk kategori ini."}
          />
        ) : (
          filteredData.map((item, idx) => (
            <div key={item.id} className="animate-fade-in" style={{ animationDelay: `${idx * 50}ms`, animationFillMode: 'both' }}>
              <SupportCard item={item} subtitleLabel="roomType" />
            </div>
          ))
        )}
      </div>
    </PageTransition>
  );
}
