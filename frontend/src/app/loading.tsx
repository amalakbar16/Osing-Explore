import React from 'react';
import Skeleton from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="p-6 pt-20 animate-fade-in flex flex-col gap-4 w-full min-h-[70vh]">
      <Skeleton className="w-2/3 h-8 mb-4" />
      <Skeleton className="w-full h-32" />
      <Skeleton className="w-full h-32" />
    </div>
  );
}
