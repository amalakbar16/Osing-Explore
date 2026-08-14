"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { Sparkles, ArrowRight, X, UserPlus, LogIn } from 'lucide-react';

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
  description = "Fitur ini membutuhkan akun wisatawan agar rencana liburan dan preferensi AI tersimpan aman di akunmu.",
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

      {/* Modal Dialog */}
      <div className="relative w-full max-w-sm bg-surface rounded-3xl p-6 border border-surface-alt shadow-2xl z-10 animate-scale-pulse overflow-hidden">
        {/* Glow Accent Decoration */}
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-accent-primary/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-32 h-32 bg-accent-gold/15 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-alt hover:bg-surface-alt/80 text-ink-muted hover:text-ink flex items-center justify-center transition-colors"
        >
          <X size={16} />
        </button>

        {/* Header Icon */}
        <div className="text-center pt-2 pb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-accent-primary to-teal-800 text-white flex items-center justify-center mx-auto mb-4 shadow-colored-teal">
            <Sparkles size={26} className="animate-pulse" />
          </div>
          <h3 className="font-display text-xl font-bold text-ink leading-tight">
            {title}
          </h3>
          <p className="text-xs text-ink-muted mt-2 leading-relaxed px-2">
            {description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <Button
            variant="primary"
            className="w-full py-3.5 rounded-2xl font-bold text-sm shadow-colored-teal flex items-center justify-center gap-2"
            onClick={handleGoToLogin}
          >
            <LogIn size={16} />
            <span>Masuk ke Akun</span>
          </Button>

          <Button
            variant="secondary"
            className="w-full py-3 rounded-2xl font-semibold text-xs flex items-center justify-center gap-2"
            onClick={handleGoToRegister}
          >
            <UserPlus size={16} />
            <span>Daftar Akun Baru</span>
          </Button>

          <button
            onClick={onClose}
            className="w-full py-2 text-xs font-semibold text-ink-muted hover:text-ink transition-colors text-center block pt-1"
          >
            Nanti Saja
          </button>
        </div>
      </div>
    </div>
  );
}
