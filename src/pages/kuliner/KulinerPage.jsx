import React, { useState } from 'react';
import { useRouteContext } from '../../context/RouteContext';
import { useCulinaryByRoute } from '../../hooks/useCulinaryByRoute';
import PageTransition from '../../components/layout/PageTransition';
import FilterChipGroup from '../../components/common/FilterChipGroup';
import SupportCard from '../../components/destinasi/SupportCard';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import { Coffee, MapPinOff } from 'lucide-react';

const FILTER_OPTIONS = [
  { label: 'Semua', value: 'all' },
  { label: 'Lokal Pedas', value: 'Lokal Pedas' },
  { label: 'Seafood', value: 'Seafood' },
  { label: 'Kopi & Cafe', value: 'Cafe' },
];

export default function KulinerPage() {
  const { state } = useRouteContext();
  const { data, loading } = useCulinaryByRoute(state.activeCorridorId);
  const [filter, setFilter] = useState('all');

  const filteredData = filter === 'all' ? data : data.filter(item => item.cuisineType === filter);

  return (
    <PageTransition>
      <div className="pt-6 pb-2 px-6">
        <h1 className="font-display text-2xl text-ink mb-2">Kuliner Sekitar</h1>
        <p className="text-sm text-ink-muted mb-4">
          {state.activeCorridorId 
            ? `Rekomendasi searah perjalanan ke ${state.mainDestination?.name || 'tujuan Anda'}.`
            : "Eksplorasi kuliner khas Banyuwangi."}
        </p>

        {!state.activeCorridorId && (
          <div className="mb-4 p-3 bg-surface-alt/50 border border-surface-alt rounded-lg text-xs text-ink-muted">
            <strong className="text-ink">Tip:</strong> Pilih destinasi utama di Beranda agar kami bisa merekomendasikan kuliner yang searah.
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
            <Skeleton className="w-full h-32" />
          </>
        ) : filteredData.length === 0 ? (
          <EmptyState 
            icon={MapPinOff}
            title="Tidak Ada Kuliner"
            description={state.activeCorridorId 
              ? "Kami tidak menemukan tempat makan dalam radius rute ini. Coba ubah filter kategori." 
              : "Belum ada data kuliner untuk kategori ini."}
          />
        ) : (
          filteredData.map((item, idx) => (
            <div key={item.id} className="animate-fade-in" style={{ animationDelay: `${idx * 50}ms`, animationFillMode: 'both' }}>
              <SupportCard item={item} subtitleLabel="cuisineType" />
            </div>
          ))
        )}
      </div>
    </PageTransition>
  );
}
