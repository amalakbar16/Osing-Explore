"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Star, ArrowRight, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { searchDestinations } from '@/services/destinationService';
import type { Destination } from '@/types';
import LazyImage from '@/components/common/LazyImage';

interface HeroPencarianDestinasiProps {
  onSearch?: (query: string) => void;
}

export default function HeroPencarianDestinasi({ onSearch }: HeroPencarianDestinasiProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Destination[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Live search as user types without interrupting or auto-navigating
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchDestinations(query.trim());
        setSuggestions(results.slice(0, 5));
        setShowDropdown(true);
      } catch {
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setShowDropdown(false);

    if (onSearch) {
      onSearch(q);
      return;
    }

    if (suggestions.length > 0) {
      router.push(`/destinasi/${suggestions[0].id}`);
    } else {
      router.push(`/semua-destinasi?search=${encodeURIComponent(q)}`);
    }
  };

  const handleSelectDestination = (destId: string) => {
    setShowDropdown(false);
    router.push(`/destinasi/${destId}`);
  };

  return (
    <div className="relative pt-12 pb-10 px-6 text-center overflow-visible">
      {/* Decorative Jejak Rute SVG in background */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none -z-10 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 20" preserveAspectRatio="none" className="w-[150%] h-40 -rotate-6">
          <path d="M 0,10 Q 25,20 50,10 T 100,10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 6" className="animate-dash-flow" />
        </svg>
      </div>

      {/* Floating Blobs for Light Theme */}
      <div className="absolute top-0 right-0 w-56 h-56 bg-accent-gold/15 rounded-full blur-3xl animate-blob-float pointer-events-none -z-10" />
      <div className="absolute top-20 left-0 w-40 h-40 bg-accent-primary/15 rounded-full blur-3xl animate-blob-float pointer-events-none -z-10 [animation-delay:2s]" />

      {/* Brand Logo */}
      <div className="flex justify-center mb-5">
        <img 
          src="/images/logo_osing_explore.png" 
          alt="Osing Explore Logo" 
          className="h-52 xs:h-56 sm:h-64 w-auto object-contain drop-shadow-md"
        />
      </div>
      <p className="text-sm sm:text-base text-ink-muted mb-6 max-w-[320px] sm:max-w-md mx-auto leading-relaxed">
        Tentukan destinasi utamamu, kami merangkai perjalanan terbaik ke sana.
      </p>

      {/* Search Bar with live dropdown container */}
      <div ref={searchContainerRef} className="relative max-w-sm sm:max-w-md mx-auto z-30">
        <form 
          onSubmit={handleSubmit} 
          className="relative flex items-center bg-white border border-surface-alt/80 rounded-2xl p-1.5 shadow-lg shadow-ink/5 focus-within:border-accent-primary/50 focus-within:ring-2 focus-within:ring-accent-primary/10 transition-all duration-300"
        >
          <div className="relative flex-1 flex items-center">
            {isSearching ? (
              <Loader2 className="absolute left-3.5 text-accent-primary animate-spin" size={18} />
            ) : (
              <Search className="absolute left-3.5 text-ink-muted/70" size={18} />
            )}
            <input 
              type="text" 
              placeholder="Cari Kawah Ijen, Pulau Merah..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => {
                if (suggestions.length > 0) setShowDropdown(true);
              }}
              className="w-full bg-transparent py-2.5 pl-11 pr-3 text-sm text-ink placeholder:text-ink-muted/40 focus:outline-none"
              suppressHydrationWarning
            />
          </div>
          <Button 
            type="submit" 
            variant="primary" 
            className="py-2.5 px-6 rounded-xl shadow-none font-semibold text-sm active:scale-95 transition-all duration-200"
          >
            Cari
          </Button>
        </form>

        {/* Live Search Suggestions Dropdown */}
        {showDropdown && suggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-surface rounded-2xl border border-surface-alt shadow-2xl overflow-hidden z-40 animate-fade-in text-left">
            <div className="p-2 border-b border-surface-alt bg-surface-alt/30 text-[11px] font-bold text-ink-muted uppercase tracking-wider flex items-center justify-between">
              <span>Destinasi Ditemukan</span>
              <span>{suggestions.length} hasil</span>
            </div>

            <div className="divide-y divide-surface-alt">
              {suggestions.map((dest) => (
                <button
                  key={dest.id}
                  type="button"
                  onClick={() => handleSelectDestination(dest.id)}
                  className="w-full p-3 flex items-center gap-3 hover:bg-accent-primary/5 active:bg-accent-primary/10 transition-colors group cursor-pointer text-left"
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-surface-alt shrink-0 border border-surface-alt">
                    <LazyImage src={dest.images[0]} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-ink group-hover:text-accent-primary transition-colors truncate">
                      {dest.name}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-ink-muted">
                      <span className="capitalize">{dest.category}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 text-accent-gold font-semibold">
                        <Star size={12} fill="currentColor" /> {dest.rating}
                      </span>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-ink-muted group-hover:text-accent-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="w-full p-2.5 text-center text-xs font-semibold text-accent-primary hover:bg-accent-primary/5 transition-colors border-t border-surface-alt block"
            >
              Lihat semua hasil untuk &quot;{query}&quot; →
            </button>
          </div>
        )}

        {showDropdown && query.trim() && !isSearching && suggestions.length === 0 && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-surface rounded-2xl border border-surface-alt shadow-2xl p-4 z-40 animate-fade-in text-center">
            <p className="text-xs text-ink-muted">
              Tidak ada destinasi yang cocok dengan &quot;{query}&quot;
            </p>
            <button
              onClick={() => router.push(`/semua-destinasi`)}
              className="mt-2 text-xs font-semibold text-accent-primary hover:underline block mx-auto"
            >
              Jelajahi Semua Destinasi
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
