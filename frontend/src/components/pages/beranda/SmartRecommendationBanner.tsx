"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function SmartRecommendationBanner() {
  const router = useRouter();

  return (
    <div className="px-6 mb-8">
      <div 
        onClick={() => router.push('/rekomendasi')}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-accent-primary via-teal-800 to-slate-900 text-white p-6 shadow-colored-teal cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all group"
      >
        {/* Subtle Decorative elements */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-36 h-36 bg-accent-gold/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-44 h-44 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="max-w-xs sm:max-w-md">
            <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-accent-gold mb-3 border border-white/10">
              <Sparkles size={13} className="animate-pulse" />
              <span>Asisten Rekomendasi Pintar</span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold leading-tight mb-1.5 text-white">
              Bingung Mau ke Mana di Banyuwangi?
            </h3>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              Tentukan gaya liburanmu, asisten cerdas kami akan merangkai rute terdekat dan paling searah secara otomatis.
            </p>
          </div>

          <button 
            className="mt-2 sm:mt-0 px-5 py-3 rounded-2xl bg-white text-accent-primary font-bold text-sm flex items-center gap-2 shadow-lg shadow-black/20 group-hover:bg-accent-gold group-hover:text-white transition-all shrink-0"
          >
            <span>Mulai Sekarang</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
