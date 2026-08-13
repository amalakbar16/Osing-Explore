import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'circular' | 'rectangular';
}

export default function Skeleton({
  className = '',
  variant = 'rectangular',
}: SkeletonProps) {
  const roundedClass = variant === 'circular' ? 'rounded-full' : 'rounded-lg';
  return (
    <div className={`animate-pulse bg-surface-alt ${roundedClass} ${className}`} />
  );
}
