"use client";

import React, { useEffect, useRef, useState } from 'react';
import ScrollReveal from '@/components/common/ScrollReveal';

export default function StatsSection() {
  const [count, setCount] = useState(0);
  const target = 15; // Jumlah destinasi dummy
  const domRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        // Animasi count up
        let start = 0;
        const duration = 1500;
        const increment = target / (duration / 16);
        
        interval = setInterval(() => {
          start += increment;
          if (start >= target) {
            setCount(target);
            clearInterval(interval);
          } else {
            setCount(Math.floor(start));
          }
        }, 16);
        observer.disconnect();
      }
    });

    if (domRef.current) observer.observe(domRef.current);
    
    return () => {
      if (interval) clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="relative py-16 px-6 overflow-hidden my-8">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-accent-primary/5 -skew-y-3 z-0 transform origin-top-left" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent-primary/10 rounded-full blur-3xl" />
      
      <ScrollReveal className="relative z-10 text-center flex flex-col items-center justify-center">
        <h2 className="text-sm font-mono text-accent-primary uppercase tracking-widest mb-2">Eksplorasi Tanpa Batas</h2>
        <div className="font-display text-5xl font-bold text-ink flex items-baseline justify-center mb-4">
          <span ref={domRef}>{count}</span>
          <span className="text-accent-gold ml-1">+</span>
        </div>
        <p className="text-ink-muted text-sm max-w-[250px]">
          Destinasi menakjubkan menanti untuk ditemukan di ujung timur Pulau Jawa.
        </p>
      </ScrollReveal>
    </div>
  );
}
