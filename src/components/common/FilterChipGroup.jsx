import React from 'react';
import Chip from '../ui/Chip';

export default function FilterChipGroup({ options, selected, onChange, className = '' }) {
  return (
    <div className={`flex gap-2 overflow-x-auto hide-scrollbar ${className}`}>
      {options.map(opt => (
        <Chip 
          key={opt.value} 
          label={opt.label} 
          active={selected === opt.value} 
          onClick={() => onChange(opt.value)} 
          className="flex-shrink-0"
        />
      ))}
    </div>
  );
}
