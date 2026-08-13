"use client";

import React, { useState, useRef } from 'react';
import { useRouteContext } from '../../context/RouteContext';
import { Map } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function FloatingRouteBadge() {
  const { state } = useRouteContext();
  const router = useRouter();
  const count = state.savedRoute.length;

  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const dragInfo = useRef<{ startX: number; startY: number; posX: number; posY: number; moved: boolean }>({
    startX: 0,
    startY: 0,
    posX: 0,
    posY: 0,
    moved: false
  });

  React.useEffect(() => {
    const btn = buttonRef.current;
    if (!btn) return;

    const preventDefaultScroll = (e: TouchEvent) => {
      if (isDragging && e.cancelable) {
        e.preventDefault();
      }
    };

    btn.addEventListener('touchmove', preventDefaultScroll, { passive: false });
    return () => {
      btn.removeEventListener('touchmove', preventDefaultScroll);
    };
  }, [isDragging]);

  if (count === 0) return null;

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    
    let currentX = 0;
    let currentY = 0;
    
    if (position) {
      currentX = position.x;
      currentY = position.y;
    } else if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      currentX = rect.left;
      currentY = rect.top;
    }
    
    dragInfo.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: currentX,
      posY: currentY,
      moved: false
    };
    
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragInfo.current.startX;
    const deltaY = e.clientY - dragInfo.current.startY;
    
    if (Math.abs(deltaX) > 6 || Math.abs(deltaY) > 6) {
      dragInfo.current.moved = true;
    }
    
    const newX = dragInfo.current.posX + deltaX;
    const newY = dragInfo.current.posY + deltaY;
    
    // Constraint bounds: Keep it inside viewport
    const maxX = typeof window !== 'undefined' ? window.innerWidth - 140 : 500;
    const maxY = typeof window !== 'undefined' ? window.innerHeight - 80 : 800;
    
    const boundedX = Math.max(10, Math.min(newX, maxX));
    const boundedY = Math.max(10, Math.min(newY, maxY));
    
    setPosition({ x: boundedX, y: boundedY });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
    
    if (!dragInfo.current.moved) {
      router.push('/rute-saya');
    }
  };

  const style: React.CSSProperties = position 
    ? { 
        position: 'fixed', 
        left: `${position.x}px`, 
        top: `${position.y}px`, 
        bottom: 'auto', 
        right: 'auto',
        touchAction: 'none'
      }
    : {
        touchAction: 'none'
      };

  return (
    <button 
      ref={buttonRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={style}
      className={`fixed bottom-20 right-4 z-50 bg-accent-primary text-white rounded-full pl-3 pr-4 py-3 flex items-center gap-2 shadow-colored-teal select-none ${
        isDragging ? 'scale-105 opacity-90 cursor-grabbing' : 'hover:scale-105 transition-transform cursor-grab active:scale-95'
      }`}
    >
      <div className="relative">
        <Map size={20} />
        <span className="absolute -top-2 -right-2 bg-accent-gold text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-scale-pulse">
          {count}
        </span>
      </div>
      <span className="text-sm font-semibold">Rute Saya</span>
    </button>
  );
}
