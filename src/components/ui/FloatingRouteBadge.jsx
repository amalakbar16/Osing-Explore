import React from 'react';
import { useRouteContext } from '../../context/RouteContext';
import { Map } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function FloatingRouteBadge() {
  const { state } = useRouteContext();
  const navigate = useNavigate();
  const count = state.savedRoute.length;

  if (count === 0) return null;

  return (
    <button 
      onClick={() => navigate('/rute-saya')}
      className="fixed bottom-20 right-4 z-50 bg-accent-primary text-white rounded-full pl-3 pr-4 py-3 flex items-center gap-2 shadow-colored-teal animate-fade-in hover:scale-105 transition-transform"
    >
      <div className="relative">
        <Map size={20} />
        <span className="absolute -top-2 -right-2 bg-accent-gold text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-scale-pulse">
          {count}
        </span>
      </div>
      <span className="text-sm font-semibold">Rute Saya</span>
    </button>
  );
}
