import React, { useState } from 'react';

export default function LazyImage({ src, alt, className = '' }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-surface-alt ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-surface-alt" />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
}
