import React from 'react';

export default function PageTransition({ children, className = '' }) {
  // Transisi dasar menggunakan CSS transition (akan disempurnakan nanti)
  return (
    <div className={`transition-opacity duration-300 ${className}`}>
      {children}
    </div>
  );
}
