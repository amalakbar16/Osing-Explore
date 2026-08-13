"use client";

import React, { useState, useEffect } from 'react';
import { getAllCulinary } from '@/services/culinaryService';
import LazyImage from '@/components/common/LazyImage';
import RatingBadge from '@/components/ui/RatingBadge';
import type { Culinary } from '@/types';

export default function KulinerUnggulan() {
  const [kulinerList, setKulinerList] = useState<Culinary[]>([]);

  useEffect(() => {
    getAllCulinary().then(data => {
      setKulinerList(data.slice(0, 3));
    });
  }, []);

  if (kulinerList.length === 0) return null;

  return (
    <div className="px-6 py-8">
      <h2 className="font-display text-xl text-ink mb-4">Kuliner Unggulan</h2>
      <div className="grid grid-cols-2 gap-4">
        {/* Item pertama besar (span 2) */}
        {kulinerList[0] && (
          <div className="col-span-2 relative h-40 rounded-2xl overflow-hidden shadow-soft group">
            <LazyImage src={kulinerList[0].images[0]} alt={kulinerList[0].name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4 w-full">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-xs text-white/80 font-mono mb-1 block">{kulinerList[0].cuisineType}</span>
                  <h3 className="text-white font-semibold">{kulinerList[0].name}</h3>
                </div>
                <RatingBadge rating={kulinerList[0].rating} className="bg-white/20 text-white border-none" />
              </div>
            </div>
          </div>
        )}
        
        {/* Item 2 dan 3 */}
        {kulinerList.slice(1).map(item => (
          <div key={item.id} className="relative h-32 rounded-2xl overflow-hidden shadow-soft group">
            <LazyImage src={item.images[0]} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 p-3 w-full">
              <h3 className="text-white text-sm font-semibold line-clamp-2">{item.name}</h3>
              <div className="flex items-center gap-1 mt-1 text-accent-gold">
                <span className="text-[10px] font-mono text-white/90">⭐ {item.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
