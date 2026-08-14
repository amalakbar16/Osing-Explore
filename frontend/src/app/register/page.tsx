"use client";

import React, { useState, Suspense, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import PageTransition from '@/components/layout/PageTransition';
import Button from '@/components/ui/Button';
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ChevronDown, Check, Sparkles } from 'lucide-react';
import Link from 'next/link';

const PERSONA_OPTIONS = [
  { id: 'Penjelajah Alam Vulkanik', label: 'Penjelajah Alam & Vulkanik' },
  { id: 'Pencari Pesona Bahari & Sunset', label: 'Pencari Pesona Bahari & Pantai' },
  { id: 'Pencinta Seni & Budaya Osing', label: 'Pencinta Seni & Budaya Osing' },
  { id: 'Pelancong Santai & Rekreasi Edukasi', label: 'Pelancong Santai & Rekreasi Edukasi' },
];

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/profil';

  const { signUp, signInWithGoogle, signInDemo } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [personaTitle, setPersonaTitle] = useState('Penjelajah Alam Vulkanik');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const handleGoogleSignUp = async () => {
    setLoading(true);
    const res = await signInWithGoogle();
    if (!res.success) {
      setError(res.error || 'Gagal masuk dengan Google.');
      setLoading(false);
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
        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-ink mb-1.5">Nama Lengkap</label>
            <div className="relative flex items-center">
              <User className="absolute left-3.5 text-ink-muted" size={18} />
              <input 
                type="text" 
                name="reg_user_fullname_field"
                autoComplete="off"
                placeholder="Contoh: Dimas Pratama"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-surface border border-surface-alt rounded-2xl py-3 pl-11 pr-4 text-sm text-ink placeholder:text-ink-muted/40 focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/10 transition-all shadow-soft"
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
                name="reg_user_email_field"
                autoComplete="off"
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
                name="reg_user_pwd_field"
                autoComplete="new-password"
                placeholder="Minimal 6 karakter"
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

          {/* Clean Custom Dropdown for Persona (No icons, perfectly contained) */}
          <div ref={dropdownRef} className="relative">
            <label className="block text-xs font-bold text-ink mb-1.5">Gaya Wisatawan Utama</label>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-surface border border-surface-alt rounded-2xl py-3 px-4 text-sm text-ink text-left flex items-center justify-between shadow-soft focus:outline-none focus:border-accent-primary transition-all"
            >
              <span className="truncate">
                {PERSONA_OPTIONS.find(p => p.id === personaTitle)?.label || 'Pilih Gaya Wisatawan'}
              </span>
              <ChevronDown size={18} className={`text-ink-muted transition-transform shrink-0 ml-2 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-surface border border-surface-alt rounded-2xl shadow-xl z-30 py-1 overflow-hidden animate-fade-in">
                {PERSONA_OPTIONS.map((item) => {
                  const isSelected = personaTitle === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setPersonaTitle(item.id);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm transition-colors flex items-center justify-between ${
                        isSelected 
                          ? 'bg-accent-primary/10 text-accent-primary font-bold' 
                          : 'text-ink hover:bg-surface-alt'
                      }`}
                    >
                      <span>{item.label}</span>
                      {isSelected && <Check size={14} className="text-accent-primary shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            className="w-full py-3.5 rounded-2xl font-bold text-sm shadow-colored-teal active:scale-[0.98] transition-all mt-4"
            disabled={loading}
          >
            {loading ? 'Mendaftarkan Akun...' : 'Daftar Akun'}
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
          onClick={handleGoogleSignUp}
          disabled={loading}
          className="w-full py-3 px-4 rounded-2xl border border-surface-alt bg-surface hover:bg-surface-alt text-ink text-xs sm:text-sm font-bold flex items-center justify-center gap-3 shadow-soft hover:shadow transition-all"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Daftar dengan Google</span>
        </button>

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
