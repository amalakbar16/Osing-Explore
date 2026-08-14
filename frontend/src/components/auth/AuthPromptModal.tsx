"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { Sparkles, X, UserPlus, LogIn } from 'lucide-react';

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  redirectPath?: string;
}

export default function AuthPromptModal({
  isOpen,
  onClose,
  title = "Masuk untuk Melanjutkan",
  description = "Fitur ini membutuhkan akun wisatawan agar rencana liburan dan preferensi AI tersimpan rapi di akunmu.",
  redirectPath = "/profil",
}: AuthPromptModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleGoToLogin = () => {
    onClose();
    router.push(`/login?redirect=${encodeURIComponent(redirectPath)}`);
  };

  const handleGoToRegister = () => {
    onClose();
    router.push(`/register?redirect=${encodeURIComponent(redirectPath)}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      {/* Backdrop click dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Dialog - Compact & Sleek */}
      <div className="relative w-full max-w-[310px] xs:max-w-[330px] bg-surface rounded-2xl p-4 sm:p-5 border border-surface-alt shadow-2xl z-10 animate-scale-pulse overflow-hidden">
        {/* Glow Accent Decoration */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-accent-primary/15 rounded-full blur-xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 bg-accent-gold/15 rounded-full blur-xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-surface-alt hover:bg-surface-alt/80 text-ink-muted hover:text-ink flex items-center justify-center transition-colors cursor-pointer"
        >
          <X size={14} />
        </button>

        {/* Header Icon & Text */}
        <div className="text-center pt-1 pb-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-accent-primary to-teal-800 text-white flex items-center justify-center mx-auto mb-3 shadow-colored-teal">
            <Sparkles size={20} className="animate-pulse" />
          </div>
          <h3 className="font-display text-base font-bold text-ink leading-tight">
            {title}
          </h3>
          <p className="text-xs text-ink-muted mt-1 leading-snug px-1">
            {description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <Button
            variant="primary"
            className="w-full py-2.5 rounded-xl font-bold text-xs shadow-colored-teal flex items-center justify-center gap-2"
            onClick={handleGoToLogin}
          >
            <LogIn size={15} />
            <span>Masuk ke Akun</span>
          </Button>

          <Button
            variant="secondary"
            className="w-full py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2"
            onClick={handleGoToRegister}
          >
            <UserPlus size={15} />
            <span>Daftar Akun Baru</span>
          </Button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-1 text-xs font-medium text-ink-muted hover:text-ink transition-colors text-center block cursor-pointer"
          >
            Nanti Saja
          </button>
        </div>
      </div>
    </div>
  );
}
