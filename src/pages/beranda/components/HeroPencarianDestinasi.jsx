import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Button from '../../../components/ui/Button';

export default function HeroPencarianDestinasi({ onSearch }) {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) onSearch(query);
  };

  return (
    <div className="relative pt-16 pb-12 px-6 text-center overflow-hidden">
      {/* Decorative Jejak Rute SVG in background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 20" preserveAspectRatio="none" className="w-[150%] h-40 -rotate-6">
          <path d="M 0,10 Q 25,20 50,10 T 100,10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 6" className="animate-dash-flow" />
        </svg>
      </div>

      {/* Floating Blobs for Light Theme */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-accent-gold/20 rounded-full blur-3xl animate-blob-float pointer-events-none -z-10" />
      <div className="absolute top-20 left-0 w-32 h-32 bg-accent-primary/20 rounded-full blur-3xl animate-blob-float pointer-events-none -z-10 [animation-delay:2s]" />

      <h1 className="font-display text-display-md text-ink leading-tight mb-4 drop-shadow-sm">
        Jelajah <br />
        <span className="text-accent-primary italic">Tanah Blambangan</span>
      </h1>
      <p className="text-sm text-ink-muted mb-8 max-w-[280px] mx-auto">
        Tentukan destinasi utamamu, kami merangkai perjalanan terbaik ke sana.
      </p>

      <form onSubmit={handleSubmit} className="relative max-w-sm mx-auto flex gap-2 z-10 shadow-soft rounded-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" size={18} />
          <input 
            type="text" 
            placeholder="Cari Kawah Ijen, Pulau Merah..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white border border-surface-alt rounded-l-xl py-3 pl-10 pr-4 text-sm text-ink focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
          />
        </div>
        <Button type="submit" variant="primary" className="py-3 px-5 rounded-l-none rounded-r-xl shadow-none">
          Cari
        </Button>
      </form>
    </div>
  );
}
