"use client";

import React from 'react';
import { LogOut, X } from 'lucide-react';
import Button from '@/components/ui/Button';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export default function LogoutConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}: LogoutConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      {/* Backdrop click dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-[310px] xs:max-w-[330px] bg-surface rounded-2xl p-4 sm:p-5 border border-surface-alt shadow-2xl z-10 animate-scale-pulse overflow-hidden">
        {/* Glow Accent Decoration */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-accent-rose/15 rounded-full blur-xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-surface-alt hover:bg-surface-alt/80 text-ink-muted hover:text-ink flex items-center justify-center transition-colors cursor-pointer"
        >
          <X size={14} />
        </button>

        {/* Header Icon & Text */}
        <div className="text-center pt-1 pb-3">
          <div className="w-11 h-11 rounded-xl bg-accent-rose/10 text-accent-rose flex items-center justify-center mx-auto mb-3 border border-accent-rose/20">
            <LogOut size={20} />
          </div>
          <h3 className="font-display text-base font-bold text-ink leading-tight">
            Keluar dari Akun?
          </h3>
          <p className="text-xs text-ink-muted mt-1 leading-snug px-1">
            Kamu perlu masuk kembali untuk mengakses rute cloud dan preferensi persona wisatamu.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="w-full py-2.5 rounded-xl font-bold text-xs bg-accent-rose text-white hover:bg-rose-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
          >
            <LogOut size={15} />
            <span>{loading ? 'Memproses...' : 'Ya, Keluar Akun'}</span>
          </button>

          <Button
            variant="secondary"
            className="w-full py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center cursor-pointer"
            onClick={onClose}
          >
            Batal
          </Button>
        </div>
      </div>
    </div>
  );
}
