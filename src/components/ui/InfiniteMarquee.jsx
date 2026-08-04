import React from 'react';

export default function InfiniteMarquee({ children, speed = 'slow', direction = 'left', className = '' }) {
  const speedClass = {
    slow: 'animate-[marquee-scroll_30s_linear_infinite]',
    normal: 'animate-[marquee-scroll_20s_linear_infinite]',
    fast: 'animate-[marquee-scroll_10s_linear_infinite]',
  }[speed];

  const directionClass = direction === 'right' ? '[animation-direction:reverse]' : '';

  return (
    <div className={`relative overflow-hidden flex w-full group ${className}`}>
      {/* Container ini butuh w-max agar bisa melebar sejauh isinya */}
      <div className={`flex w-max group-hover:[animation-play-state:paused] ${speedClass} ${directionClass}`}>
        {/* Render children dua kali untuk efek infinite loop */}
        <div className="flex gap-4 px-2">
          {children}
        </div>
        <div className="flex gap-4 px-2" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
