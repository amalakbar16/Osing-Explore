"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Map as MapIcon, Coffee, Bed } from 'lucide-react';

export default function BottomNavigation() {
  const pathname = usePathname();

  const navItems = [
    { path: '/', label: 'Beranda', icon: Home },
    { path: '/rute-saya', label: 'Rute Saya', icon: MapIcon },
    { path: '/kuliner', label: 'Kuliner', icon: Coffee },
    { path: '/penginapan', label: 'Penginapan', icon: Bed },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-md border-t border-surface-alt pb-safe">
      <div className="flex justify-around items-center h-16 px-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`relative flex flex-col items-center justify-center w-16 h-full transition-colors duration-250 ease-in-out ${
                isActive ? 'text-accent-primary' : 'text-ink-muted hover:text-ink'
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2 : 1.5} className="mb-1" />
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-accent-primary rounded-b-md" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
