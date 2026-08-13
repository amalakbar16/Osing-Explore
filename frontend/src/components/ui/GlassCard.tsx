import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function GlassCard({
  children,
  className = '',
  ...props
}: GlassCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-md border border-white/50 shadow-soft ${className}`}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-accent-gold/5 pointer-events-none" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
