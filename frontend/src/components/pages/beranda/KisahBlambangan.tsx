import React from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { Quote } from 'lucide-react';

export default function KisahBlambangan() {
  return (
    <div className="px-6 py-8">
      <h2 className="font-display text-xl text-ink mb-4">Kisah Blambangan</h2>
      <GlassCard className="p-6">
        <Quote className="text-accent-gold/50 mb-3 animate-bobbing" size={32} />
        <p className="text-sm text-ink-muted italic leading-relaxed mb-4">
          "Sejengkal tanah pun takkan kuserahkan, bila itu merenggut harga diri dan warisan leluhur. Bumi Blambangan adalah nafas, Banyuwangi adalah denyut nadinya."
        </p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent-gold/20 flex items-center justify-center text-accent-gold font-display font-bold">
            M
          </div>
          <div>
            <h4 className="text-sm font-semibold text-ink">Minak Jinggo</h4>
            <span className="text-xs text-ink-muted">Legenda Nusantara</span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
