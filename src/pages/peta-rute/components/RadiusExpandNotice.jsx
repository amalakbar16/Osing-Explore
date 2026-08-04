import React from 'react';
import { Info } from 'lucide-react';

export default function RadiusExpandNotice({ isExpanded, originalRadius, newRadius }) {
  if (!isExpanded) return null;

  return (
    <div className="mx-6 mt-4 p-3 bg-accent-primary/10 border border-accent-primary/20 rounded-lg flex gap-3 items-start">
      <Info size={18} className="text-accent-primary shrink-0 mt-0.5" />
      <div>
        <p className="text-xs text-ink-muted leading-relaxed">
          <strong className="text-ink font-medium">Radius Pencarian Diperluas</strong><br/>
          Karena sedikitnya pilihan dalam radius {originalRadius}km, kami memperluas jangkauan hingga {newRadius}km di sepanjang koridor rute ini agar Anda mendapatkan rekomendasi terbaik.
        </p>
      </div>
    </div>
  );
}
