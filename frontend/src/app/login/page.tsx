"use client";

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import PageTransition from '@/components/layout/PageTransition';
import Button from '@/components/ui/Button';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/profil';

  const { signIn, signInWithGoogle } = useAuth();

  const [email, setEmail] = useState('wahyu123@gmail.com');
  const [password, setPassword] = useState('123456');
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

  const handleGoogleSignIn = () => {
    setError("Fitur Google Sign-In sedang dalam tahap persiapan OAuth Cloud. Silakan masuk langsung menggunakan Email/Username Anda.");
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
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <img 
              src="/images/logo_osing_explore.png" 
              alt="Osing Explore Logo" 
              className="h-24 w-auto object-contain drop-shadow-sm"
            />
          </div>
          <h2 className="text-xl font-display font-bold text-ink">Selamat Datang Kembali</h2>
          <p className="text-xs text-ink-muted mt-1 max-w-xs mx-auto leading-relaxed">
            Masuk untuk menyinkronkan rute cloud, bookmark wisata, dan profil persona wisatamu.
          </p>
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
            <label className="block text-xs font-bold text-ink mb-1.5">Alamat Email / Nama Pengguna</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 text-ink-muted" size={18} />
              <input 
                type="text" 
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface border border-surface-alt rounded-2xl py-3 pl-11 pr-4 text-sm text-ink placeholder:text-ink-muted/40 focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/10 transition-all shadow-soft"
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
                placeholder="Masukkan kata sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface border border-surface-alt rounded-2xl py-3 pl-11 pr-11 text-sm text-ink placeholder:text-ink-muted/40 focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/10 transition-all shadow-soft"
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
            className="w-full py-3.5 rounded-2xl font-bold text-sm shadow-colored-teal active:scale-[0.98] transition-all mt-3"
            disabled={loading}
          >
            {loading ? 'Memproses...' : 'Masuk ke Akun'}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-surface-alt" />
          <span className="text-[10px] text-ink-muted uppercase tracking-wider font-semibold">Atau</span>
          <div className="flex-1 h-px bg-surface-alt" />
        </div>

        {/* Google Sign-In Button at the Bottom */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full py-3 px-4 rounded-2xl border border-surface-alt bg-surface/80 hover:bg-surface-alt text-ink text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 shadow-soft hover:shadow transition-all cursor-pointer"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Lanjutkan dengan Google</span>
          <span className="text-[10px] font-semibold text-ink-muted bg-surface-alt px-2 py-0.5 rounded-full">Segera Hadir</span>
        </button>

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
