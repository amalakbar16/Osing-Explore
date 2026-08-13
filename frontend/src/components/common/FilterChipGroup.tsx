import React from 'react';
import Chip from '../ui/Chip';

interface Option {
  label: string;
  value: string;
}

interface FilterChipGroupProps {
  options: Option[];
  selected: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function FilterChipGroup({
  options,
  selected,
  onChange,
  className = '',
}: FilterChipGroupProps) {
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
