import React from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageTransition({
  children,
  className = '',
}: PageTransitionProps) {
  return (
    <div className={`transition-opacity duration-300 ${className}`}>
      {children}
    </div>
  );
}
