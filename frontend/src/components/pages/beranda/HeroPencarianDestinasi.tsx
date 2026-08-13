"use client";

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Button from '@/components/ui/Button';

interface HeroPencarianDestinasiProps {
  onSearch: (query: string) => void;
}

export default function HeroPencarianDestinasi({ onSearch }: HeroPencarianDestinasiProps) {
  const [query, setQuery] = useState('');

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      if (query.trim()) {
        onSearch(query);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [query, onSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query);
  };

  return (
    <div className="relative pt-24 pb-14 px-6 text-center overflow-hidden">
      {/* Decorative Jejak Rute SVG in background */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none -z-10 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 20" preserveAspectRatio="none" className="w-[150%] h-40 -rotate-6">
          <path d="M 0,10 Q 25,20 50,10 T 100,10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 6" className="animate-dash-flow" />
        </svg>
      </div>

      {/* Floating Blobs for Light Theme */}
      <div className="absolute top-0 right-0 w-56 h-56 bg-accent-gold/15 rounded-full blur-3xl animate-blob-float pointer-events-none -z-10" />
      <div className="absolute top-20 left-0 w-40 h-40 bg-accent-primary/15 rounded-full blur-3xl animate-blob-float pointer-events-none -z-10 [animation-delay:2s]" />

      <h1 className="font-display text-[2.75rem] xs:text-5xl sm:text-6xl text-ink leading-[1.1] mb-5 tracking-tight font-bold drop-shadow-sm">
        Jelajah <br />
        <span className="text-accent-primary italic font-serif font-medium">Tanah Blambangan</span>
      </h1>
      <p className="text-sm sm:text-base text-ink-muted mb-8 max-w-[320px] sm:max-w-md mx-auto leading-relaxed">
        Tentukan destinasi utamamu, kami merangkai perjalanan terbaik ke sana.
      </p>

      <form 
        onSubmit={handleSubmit} 
        className="relative max-w-sm sm:max-w-md mx-auto flex items-center bg-white border border-surface-alt/80 rounded-2xl p-1.5 z-10 shadow-lg shadow-ink/5 focus-within:border-accent-primary/50 focus-within:ring-2 focus-within:ring-accent-primary/10 transition-all duration-300"
      >
        <div className="relative flex-1 flex items-center">
          <Search className="absolute left-3.5 text-ink-muted/70" size={18} />
          <input 
            type="text" 
            placeholder="Cari Kawah Ijen, Pulau Merah..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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
    </div>
  );
}
