"use client";

import React, { useState, useEffect } from 'react';
import BottomNavigation from './BottomNavigation';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { WifiOff, Download } from 'lucide-react';
import Button from '../ui/Button';
import FloatingRouteBadge from '../ui/FloatingRouteBadge';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const isOnline = useOnlineStatus();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Munculkan prompt jika user belum menginstall (misal setelah beberapa detik)
      setTimeout(() => setShowInstallPrompt(true), 10000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  return (
    <div className="min-h-screen bg-base text-ink flex flex-col pt-safe">
      {!isOnline && (
        <div className="bg-accent-rose text-white text-xs py-1 px-4 text-center flex items-center justify-center gap-2">
          <WifiOff size={14} /> Anda sedang offline. Menggunakan data tersimpan.
        </div>
      )}
      
      <main className="flex-1 pb-20">
        {children}
      </main>

      {/* Custom Install Prompt */}
      {showInstallPrompt && deferredPrompt && (
        <div className="fixed bottom-20 left-4 right-4 z-40 bg-surface border border-accent-primary/30 p-4 rounded-xl shadow-lg flex items-center justify-between animate-fade-in">
          <div>
            <h4 className="font-display text-sm text-ink mb-1">Install Osing Explore</h4>
            <p className="text-[10px] text-ink-muted">Akses lebih cepat & mode offline.</p>
          </div>
          <div className="flex gap-2">
            <button className="text-xs text-ink-muted px-2" onClick={() => setShowInstallPrompt(false)}>Nanti</button>
            <Button variant="primary" className="px-3 py-1.5 text-xs flex gap-1" onClick={handleInstallClick}>
              <Download size={14} /> Install
            </Button>
          </div>
        </div>
      )}

      <FloatingRouteBadge />
      <BottomNavigation />
    </div>
  );
}
