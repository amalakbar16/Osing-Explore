"use client";

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import PageTransition from '@/components/layout/PageTransition';
import Button from '@/components/ui/Button';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/profil';

  const { signIn, signInDemo } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email dan kata sandi wajib diisi.');
      return;
    }

    setLoading(true);
    setError(null);

    const res = await signIn(email, password);
    setLoading(false);

    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push(redirectPath);
      }, 600);
    } else {
      setError(res.error || 'Gagal masuk. Periksa email dan kata sandi Anda.');
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    await signInDemo();
    setSuccess(true);
    setTimeout(() => {
      router.push(redirectPath);
    }, 500);
  };

  return (
    <PageTransition className="min-h-screen bg-base pb-24">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-surface/90 backdrop-blur-md border-b border-surface-alt px-4 pt-safe pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button 
            onClick={() => router.back()} 
            className="p-1.5 rounded-full hover:bg-surface-alt text-ink transition-colors -ml-1"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-display text-base font-bold text-ink">Masuk Akun</h1>
        </div>
      </div>

      <div className="px-6 py-6 max-w-md mx-auto">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <img 
              src="/images/logo_osing_explore.png" 
              alt="Osing Explore Logo" 
              className="h-24 w-auto object-contain drop-shadow-sm"
            />
          </div>
          <h2 className="text-xl font-display font-bold text-ink">Selamat Datang Kembali</h2>
          <p className="text-xs text-ink-muted mt-1 max-w-xs mx-auto leading-relaxed">
            Masuk untuk menyinkronkan rute cloud, bookmark wisata, dan personalisasi profilmu.
          </p>
        </div>

        {/* Demo Fast Login Box for Gemastik Pitching */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-accent-primary/10 via-accent-primary/5 to-accent-gold/10 border border-accent-primary/30 shadow-soft">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-5 h-5 rounded-full bg-accent-gold/20 text-accent-gold flex items-center justify-center">
              <Sparkles size={12} className="animate-scale-pulse" />
            </div>
            <span className="text-xs font-bold text-accent-primary">Mode Presentasi Demo</span>
          </div>
          <p className="text-[11px] text-ink-muted leading-relaxed mb-3">
            Gunakan akun demo instan tanpa perlu mengetik email & password saat sesi pitching.
          </p>
          <Button 
            variant="secondary" 
            className="w-full py-2.5 text-xs font-bold text-accent-primary border-accent-primary/40 hover:bg-accent-primary/10 rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
            onClick={handleDemoLogin}
            disabled={loading}
          >
            <Sparkles size={14} /> ⚡ Masuk Cepat (Akun Demo Wisatawan)
          </Button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-surface-alt" />
          <span className="text-[11px] text-ink-muted uppercase tracking-wider font-semibold">Atau Masuk Manual</span>
          <div className="flex-1 h-px bg-surface-alt" />
        </div>

        {/* Error / Success Alert */}
        {error && (
          <div className="mb-4 p-3 bg-accent-rose/10 border border-accent-rose/20 rounded-xl text-xs text-accent-rose flex items-start gap-2 animate-fade-in">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-700 flex items-center gap-2 animate-fade-in">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>Berhasil masuk! Mengalihkan...</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-ink mb-1.5">Alamat Email</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 text-ink-muted" size={18} />
              <input 
                type="email" 
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface border border-surface-alt rounded-2xl py-3 pl-11 pr-4 text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/10 transition-all shadow-soft"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-ink mb-1.5">Kata Sandi</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 text-ink-muted" size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface border border-surface-alt rounded-2xl py-3 pl-11 pr-11 text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/10 transition-all shadow-soft"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-ink-muted hover:text-ink transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            className="w-full py-3.5 rounded-2xl font-bold text-sm shadow-colored-teal active:scale-[0.98] transition-all mt-2"
            disabled={loading}
          >
            {loading ? 'Memproses...' : 'Masuk ke Akun'}
          </Button>
        </form>

        {/* Register Footer Link */}
        <div className="text-center mt-6">
          <p className="text-xs text-ink-muted">
            Belum memiliki akun Osing Explore?{' '}
            <Link 
              href={`/register?redirect=${encodeURIComponent(redirectPath)}`}
              className="font-bold text-accent-primary hover:underline ml-1"
            >
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </div>
    </PageTransition>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-base flex items-center justify-center text-sm text-ink-muted">Memuat...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
