"use client";

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import PageTransition from '@/components/layout/PageTransition';
import Button from '@/components/ui/Button';
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, Compass } from 'lucide-react';
import Link from 'next/link';

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/profil';

  const { signUp } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [personaTitle, setPersonaTitle] = useState('Penjelajah Alam Vulkanik');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setError('Mohon lengkapi semua kolom.');
      return;
    }
    if (password.length < 6) {
      setError('Kata sandi minimal harus 6 karakter.');
      return;
    }

    setLoading(true);
    setError(null);

    const res = await signUp(email, password, fullName, personaTitle);
    setLoading(false);

    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push(redirectPath);
      }, 1000);
    } else {
      setError(res.error || 'Gagal mendaftar. Silakan periksa kembali email Anda.');
    }
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
          <h1 className="font-display text-base font-bold text-ink">Daftar Akun Baru</h1>
        </div>
      </div>

      <div className="px-6 py-6 max-w-md mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-display font-bold text-ink">Bergabung dengan Osing Explore</h2>
          <p className="text-xs text-ink-muted mt-1 max-w-xs mx-auto leading-relaxed">
            Buat akun untuk menyimpan rute perjalanan, riwayat rekomendasi AI, dan menikmati fitur offline sync.
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
            <span>Pendaftaran berhasil! Mengalihkan ke profil...</span>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-ink mb-1.5">Nama Lengkap</label>
            <div className="relative flex items-center">
              <User className="absolute left-3.5 text-ink-muted" size={18} />
              <input 
                type="text" 
                placeholder="Contoh: Dimas Pratama"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-surface border border-surface-alt rounded-2xl py-3 pl-11 pr-4 text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/10 transition-all shadow-soft"
                required
              />
            </div>
          </div>

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

          <div>
            <label className="block text-xs font-bold text-ink mb-1.5">Gaya / Persona Wisatawan Awal</label>
            <div className="relative flex items-center">
              <Compass className="absolute left-3.5 text-ink-muted" size={18} />
              <select
                value={personaTitle}
                onChange={(e) => setPersonaTitle(e.target.value)}
                className="w-full bg-surface border border-surface-alt rounded-2xl py-3 pl-11 pr-4 text-sm text-ink focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/10 transition-all shadow-soft"
              >
                <option value="Penjelajah Alam Vulkanik">🌋 Penjelajah Alam Vulkanik</option>
                <option value="Pencari Pesona Bahari & Sunset">🏖️ Pencari Pesona Bahari & Sunset</option>
                <option value="Pencinta Seni & Budaya Osing">🎭 Pencinta Seni & Budaya Osing</option>
                <option value="Pelancong Santai & Rekreasi Edukasi">☕ Pelancong Santai & Rekreasi Edukasi</option>
              </select>
            </div>
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            className="w-full py-3.5 rounded-2xl font-bold text-sm shadow-colored-teal active:scale-[0.98] transition-all mt-3"
            disabled={loading}
          >
            {loading ? 'Mendaftarkan Akun...' : 'Daftar Sekarang'}
          </Button>
        </form>

        {/* Login Footer Link */}
        <div className="text-center mt-6">
          <p className="text-xs text-ink-muted">
            Sudah memiliki akun?{' '}
            <Link 
              href={`/login?redirect=${encodeURIComponent(redirectPath)}`}
              className="font-bold text-accent-primary hover:underline ml-1"
            >
              Masuk ke Akun
            </Link>
          </p>
        </div>
      </div>
    </PageTransition>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-base flex items-center justify-center text-sm text-ink-muted">Memuat...</div>}>
      <RegisterFormContent />
    </Suspense>
  );
}
