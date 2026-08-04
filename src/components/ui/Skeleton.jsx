import React from 'react';

export default function Skeleton({ className = '', variant = 'rectangular' }) {
  const roundedClass = variant === 'circular' ? 'rounded-full' : 'rounded-lg';
  return (
    <div className={`animate-pulse bg-surface-alt ${roundedClass} ${className}`} />
  );
}
