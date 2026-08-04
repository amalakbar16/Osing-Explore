import React from 'react';
import { useRouteContext } from '../../context/RouteContext';
import PageTransition from '../../components/layout/PageTransition';
import EmptyState from '../../components/ui/EmptyState';
import { MapPin, Map, Trash2, Navigation } from 'lucide-react';
import Button from '../../components/ui/Button';
import LazyImage from '../../components/common/LazyImage';
import { useNavigate } from 'react-router';

export default function RuteSayaPage() {
  const { state, dispatch } = useRouteContext();
  const navigate = useNavigate();

  const handleBukaSemuaDiMaps = () => {
    // Bangun URL rute dengan multi-waypoint
    if (state.savedRoute.length === 0) return;
    
    // Titik awal ambil destinasi pertama
    const start = state.savedRoute[0];
    const waypoints = state.savedRoute.slice(1);
    
    let url = `https://www.google.com/maps/dir/?api=1&origin=${start.coordinates.lat},${start.coordinates.lng}`;
    
    if (waypoints.length > 0) {
      const wpParams = waypoints.map(w => `${w.coordinates.lat},${w.coordinates.lng}`).join('|');
      url += `&waypoints=${wpParams}`;
    }
    
    // Destinasi akhir adalah titik terakhir
    const end = state.savedRoute[state.savedRoute.length - 1];
    url += `&destination=${end.coordinates.lat},${end.coordinates.lng}`;

    window.open(url, '_blank');
  };

  return (
    <PageTransition className="p-6 pt-12 pb-24 min-h-screen">
      <h1 className="font-display text-2xl text-ink mb-2">Rute Perjalanan Saya</h1>
      <p className="text-sm text-ink-muted mb-8">
        {state.savedRoute.length} destinasi dipilih untuk perjalanan Anda.
      </p>

      {state.savedRoute.length === 0 ? (
        <EmptyState 
          icon={Map}
          title="Belum ada destinasi"
          description="Eksplorasi destinasi menarik dan tambahkan ke rute perjalanan Anda."
          action={<Button variant="primary" onClick={() => navigate('/')}>Eksplor Sekarang</Button>}
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
            <Button variant="primary" className="w-full flex items-center justify-center gap-2 py-3" onClick={handleBukaSemuaDiMaps}>
              <Navigation size={18} /> Buka Rute di Maps
            </Button>
            <Button variant="ghost" className="w-full text-accent-rose py-3" onClick={() => dispatch({ type: 'CLEAR_SAVED_ROUTE' })}>
              Kosongkan Rute
            </Button>
          </div>
        </div>
      )}
    </PageTransition>
  );
}
