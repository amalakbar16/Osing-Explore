import React from 'react';
import { Mountain, Flame, Coffee, Palette } from 'lucide-react';
import Chip from '../../../components/ui/Chip';

export default function KategoriFilter({ activeKategori, onSelect }) {
  const categories = [
    { id: 'semua', label: 'Semua', icon: null },
    { id: 'alam', label: 'Alam', icon: Mountain },
    { id: 'pantai', label: 'Pantai', icon: Flame },
    { id: 'budaya', label: 'Budaya', icon: Palette },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto hide-scrollbar px-6 py-2">
      {categories.map((cat) => (
        <Chip
          key={cat.id}
          label={cat.label}
          icon={cat.icon}
          active={activeKategori === cat.id}
          onClick={() => onSelect(cat.id)}
          className="whitespace-nowrap"
        />
      ))}
    </div>
  );
}
