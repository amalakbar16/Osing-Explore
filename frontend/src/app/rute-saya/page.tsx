"use client";

import React, { useState } from 'react';
import { useRouteContext } from '@/context/RouteContext';
import { useAuth } from '@/context/AuthContext';
import PageTransition from '@/components/layout/PageTransition';
import EmptyState from '@/components/ui/EmptyState';
import { MapPin, Map, Trash2, Navigation, Cloud, CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import LazyImage from '@/components/common/LazyImage';
import AuthPromptModal from '@/components/auth/AuthPromptModal';
import { useRouter } from 'next/navigation';

export default function RuteSayaPage() {
  const { state, dispatch } = useRouteContext();
  const { user, saveRouteToCloud } = useAuth();
  const router = useRouter();

  const [savingCloud, setSavingCloud] = useState(false);
  const [savedCloudSuccess, setSavedCloudSuccess] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleSaveToCloud = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setSavingCloud(true);
    const title = `Rute ${state.savedRoute[0]?.name || 'Wisata'} & Sekitarnya`;
    const res = await saveRouteToCloud(title, state.savedRoute, state.activeCorridorId || undefined);
    setSavingCloud(false);
    if (res.success) {
      setSavedCloudSuccess(true);
      setTimeout(() => setSavedCloudSuccess(false), 3000);
    }
  };

  const handleBukaSemuaDiMaps = () => {
    if (state.savedRoute.length === 0) return;
    
    const getCoords = (dest: any) => {
      if (dest.coordinates && dest.coordinates.lat !== undefined) {
        return { lat: dest.coordinates.lat, lng: dest.coordinates.lng };
      }
      return { lat: dest.lat, lng: dest.lng };
    };

    const startCoords = getCoords(state.savedRoute[0]);
    let url = `https://www.google.com/maps/dir/?api=1&origin=${startCoords.lat},${startCoords.lng}`;
    
    if (state.savedRoute.length > 1) {
      const intermediateWaypoints = state.savedRoute.slice(1, state.savedRoute.length - 1);
      if (intermediateWaypoints.length > 0) {
        const wpParams = intermediateWaypoints.map(w => {
          const c = getCoords(w);
          return `${c.lat},${c.lng}`;
        }).join('|');
        url += `&waypoints=${encodeURIComponent(wpParams)}`;
      }
      
      const endCoords = getCoords(state.savedRoute[state.savedRoute.length - 1]);
      url += `&destination=${endCoords.lat},${endCoords.lng}`;
    } else {
      url += `&destination=${startCoords.lat},${startCoords.lng}`;
    }

    window.open(url, '_blank');
  };

  return (
    <PageTransition className="p-6 pt-safe pb-24 min-h-screen">
      <h1 className="font-display text-2xl text-ink mb-2">Rute Perjalanan Saya</h1>
      <p className="text-sm text-ink-muted mb-8">
        {state.savedRoute.length} destinasi dipilih untuk perjalanan Anda.
      </p>

      {state.savedRoute.length === 0 ? (
        <EmptyState 
          icon={Map}
          title="Belum ada destinasi"
          description="Eksplorasi destinasi menarik dan tambahkan ke rute perjalanan Anda."
          action={<Button variant="primary" onClick={() => router.push('/')}>Eksplor Sekarang</Button>}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {state.savedRoute.map((dest, index) => (
            <div key={dest.id} className="bg-surface rounded-2xl p-4 border border-surface-alt shadow-soft flex gap-4 items-center animate-fade-in relative">
              <div className="absolute top-4 left-2 -ml-2 bg-accent-gold text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {index + 1}
              </div>
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 ml-2">
                <LazyImage src={dest.images[0]} alt={dest.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-ink font-semibold truncate mb-1">{dest.name}</h3>
                <div className="text-xs text-ink-muted mb-2 flex flex-col gap-1">
                  <span className="flex items-center"><MapPin size={12} className="mr-1" /> {dest.category}</span>
                  <span>Est. {dest.duration || 'Bebas'}</span>
                </div>
              </div>
              <button 
                onClick={() => dispatch({ type: 'REMOVE_FROM_ROUTE', payload: dest.id })}
                className="w-10 h-10 rounded-full bg-accent-rose/10 text-accent-rose flex items-center justify-center hover:bg-accent-rose hover:text-white transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          <div className="mt-8 flex flex-col gap-3">
            <Button 
              variant="secondary" 
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl border font-bold text-sm transition-all shadow-soft ${
                savedCloudSuccess 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700' 
                  : 'border-accent-primary/40 text-accent-primary hover:bg-accent-primary/10'
              }`} 
              onClick={handleSaveToCloud}
              disabled={savingCloud}
            >
              {savedCloudSuccess ? (
                <>
                  <CheckCircle2 size={18} className="text-emerald-600" /> Rute Tersimpan di Cloud!
                </>
              ) : (
                <>
                  <Cloud size={18} /> {user ? 'Simpan Rute ke Akun Cloud' : 'Masuk untuk Simpan ke Cloud'}
                </>
              )}
            </Button>

            <Button variant="primary" className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold shadow-colored-teal" onClick={handleBukaSemuaDiMaps}>
              <Navigation size={18} /> Buka Rute di Maps
            </Button>

            <Button variant="ghost" className="w-full text-accent-rose py-2.5 text-xs rounded-xl" onClick={() => dispatch({ type: 'CLEAR_SAVED_ROUTE' })}>
              Kosongkan Rute
            </Button>
          </div>
        </div>
      )}

      <AuthPromptModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        title="Simpan Rute ke Cloud"
        description="Masuk atau daftar akun agar rute liburanmu tersimpan permanen di cloud dan bisa diakses dari perangkat mana pun."
        redirectPath="/rute-saya"
      />
    </PageTransition>
  );
}
