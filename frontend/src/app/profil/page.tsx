"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useRouteContext } from '@/context/RouteContext';
import type { CloudSavedRoute } from '@/context/AuthContext';
import PageTransition from '@/components/layout/PageTransition';
import Button from '@/components/ui/Button';
import LazyImage from '@/components/common/LazyImage';
import { 
  User, Cloud, Sparkles, LogOut, ArrowRight, 
  MapPin, Trash2, ShieldCheck, 
  FolderHeart, ExternalLink, RefreshCw
} from 'lucide-react';
import Link from 'next/link';

export default function ProfilPage() {
  const router = useRouter();
  const { user, profile, isDemoUser, signOut, signInDemo, fetchCloudRoutes, deleteCloudRoute } = useAuth();
  const { dispatch } = useRouteContext();

  const [cloudRoutes, setCloudRoutes] = useState<CloudSavedRoute[]>([]);
  const [loadingRoutes, setLoadingRoutes] = useState(false);

  const isAuthenticated = !!user || isDemoUser;

  useEffect(() => {
    if (isAuthenticated) {
      setLoadingRoutes(true);
      fetchCloudRoutes().then(data => {
        setCloudRoutes(data);
        setLoadingRoutes(false);
      });
    }
  }, [isAuthenticated, fetchCloudRoutes]);

  const handleOpenCloudRoute = (route: CloudSavedRoute) => {
    dispatch({ type: 'SET_SAVED_ROUTE', payload: route.destinations });
    if (route.destinations.length > 0) {
      dispatch({
        type: 'SET_ACTIVE_ROUTE',
        payload: {
          corridorId: route.corridorId,
          destination: route.destinations[0],
        },
      });
    }
    router.push('/rute-saya');
  };

  const handleDeleteRoute = async (routeId: string) => {
    await deleteCloudRoute(routeId);
    setCloudRoutes(prev => prev.filter(r => r.id !== routeId));
  };

  return (
    <PageTransition className="min-h-screen bg-base pb-28">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-surface/90 backdrop-blur-md border-b border-surface-alt px-4 pt-safe pb-3 flex items-center justify-between">
        <h1 className="font-display text-base font-bold text-ink">Profil Wisatawan</h1>
        {isAuthenticated && (
          <button 
            onClick={() => signOut()}
            className="text-xs text-accent-rose hover:text-rose-700 flex items-center gap-1 font-semibold transition-colors"
          >
            <LogOut size={14} /> Keluar
          </button>
        )}
      </div>

      <div className="px-6 py-6 max-w-md mx-auto">
        
        {/* UNAUTHENTICATED GUEST STATE */}
        {!isAuthenticated ? (
          <div className="space-y-6 animate-fade-in">
            {/* Guest Banner */}
            <div className="bg-surface rounded-3xl p-6 border border-surface-alt text-center shadow-soft">
              <div className="w-16 h-16 rounded-full bg-accent-primary/10 text-accent-primary mx-auto flex items-center justify-center mb-4">
                <User size={32} />
              </div>
              <h2 className="text-xl font-display font-bold text-ink">Masuk ke Osing Explore</h2>
              <p className="text-xs text-ink-muted mt-1.5 leading-relaxed max-w-xs mx-auto">
                Nikmati fitur sinkronisasi rute cloud, bookmark tempat wisata, dan personalisasi asisten AI.
              </p>

              <div className="grid grid-cols-1 gap-2.5 mt-6">
                <Button 
                  variant="primary" 
                  className="w-full py-3 rounded-2xl font-bold text-sm shadow-colored-teal"
                  onClick={() => router.push('/login')}
                >
                  Masuk ke Akun <ArrowRight size={16} />
                </Button>
                <Button 
                  variant="secondary" 
                  className="w-full py-3 rounded-2xl font-semibold text-xs"
                  onClick={() => router.push('/register')}
                >
                  Daftar Akun Baru
                </Button>
              </div>
            </div>

            {/* Quick Demo Access for Gemastik Pitching */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-accent-primary/10 via-accent-primary/5 to-accent-gold/10 border border-accent-primary/30 shadow-soft">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={14} className="text-accent-gold animate-scale-pulse" />
                <span className="text-xs font-bold text-accent-primary">Mode Presentasi Demo</span>
              </div>
              <p className="text-[11px] text-ink-muted leading-relaxed mb-3">
                Coba pengalaman profil wisatawan aktif dengan 1-klik tanpa mengetik.
              </p>
              <Button 
                variant="secondary" 
                className="w-full py-2.5 text-xs font-bold text-accent-primary border-accent-primary/30 rounded-xl flex items-center justify-center gap-1.5 hover:bg-accent-primary/10"
                onClick={() => signInDemo()}
              >
                <Sparkles size={14} /> ⚡ Masuk Cepat (Akun Demo)
              </Button>
            </div>

            {/* Benefits list */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-ink-muted uppercase tracking-wider">Keuntungan Akun</h3>
              {[
                { title: 'Sinkronisasi Rute Cloud', desc: 'Rute perjalanan tersimpan permanen dan dapat dibuka di HP lain.', icon: Cloud },
                { title: 'Personalisasi AI Wisata', desc: 'Asisten mengingat gaya liburan dan preferensi kuesionermu.', icon: Sparkles },
                { title: 'Aman & Terenkripsi', desc: 'Didukung oleh Supabase Auth & PostgreSQL Row Level Security.', icon: ShieldCheck },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="bg-surface rounded-2xl p-3.5 border border-surface-alt flex items-start gap-3 shadow-soft">
                    <div className="w-8 h-8 rounded-xl bg-accent-primary/10 text-accent-primary flex items-center justify-center shrink-0 mt-0.5">
                      <Icon size={16} />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-ink">{item.title}</h4>
                      <p className="text-[11px] text-ink-muted mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* AUTHENTICATED STATE */
          <div className="space-y-6 animate-fade-in">
            
            {/* User Profile Card */}
            <div className="bg-surface rounded-3xl p-5 border border-surface-alt shadow-soft relative overflow-hidden">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-accent-primary/10 text-accent-primary flex items-center justify-center shrink-0 border border-surface-alt">
                  {profile?.avatarUrl ? (
                    <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User size={30} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="font-display font-bold text-base text-ink truncate">
                      {profile?.fullName || 'Wisatawan Osing'}
                    </h2>
                    {isDemoUser && (
                      <span className="text-[9px] font-bold bg-accent-gold/20 text-accent-gold px-1.5 py-0.5 rounded">
                        Demo
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-ink-muted truncate mt-0.5">{profile?.email || 'wisatawan@osing.id'}</p>
                  <div className="mt-2 inline-flex items-center gap-1 bg-accent-primary/10 text-accent-primary px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                    <Sparkles size={11} /> {profile?.personaTitle || 'Penjelajah Blambangan'}
                  </div>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-surface-alt text-center">
                <div className="p-2 rounded-xl bg-surface-alt/40">
                  <span className="text-xs text-ink-muted block">Rute di Cloud</span>
                  <span className="font-display font-bold text-base text-ink">{cloudRoutes.length} Rute</span>
                </div>
                <div className="p-2 rounded-xl bg-surface-alt/40">
                  <span className="text-xs text-ink-muted block">Status Akun</span>
                  <span className="font-display font-bold text-base text-emerald-600">Aktif</span>
                </div>
              </div>
            </div>

            {/* Cloud Saved Routes Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <Cloud size={16} className="text-accent-primary" />
                  <h3 className="text-xs font-bold text-ink uppercase tracking-wider">Koleksi Rute di Cloud</h3>
                </div>
                <span className="text-[11px] font-semibold text-accent-primary">
                  {cloudRoutes.length} Tersimpan
                </span>
              </div>

              {loadingRoutes ? (
                <div className="py-8 text-center text-xs text-ink-muted flex items-center justify-center gap-2">
                  <RefreshCw size={14} className="animate-spin" /> Memuat rute cloud...
                </div>
              ) : cloudRoutes.length === 0 ? (
                <div className="bg-surface rounded-2xl p-6 border border-surface-alt text-center shadow-soft">
                  <FolderHeart size={28} className="text-ink-muted mx-auto mb-2 opacity-50" />
                  <h4 className="font-bold text-xs text-ink">Belum Ada Rute Tersimpan</h4>
                  <p className="text-[11px] text-ink-muted mt-1 mb-4 leading-relaxed">
                    Kunjungi halaman Rute Saya dan klik &quot;Simpan ke Akun Cloud&quot; untuk menyinkronkan rute liburanmu.
                  </p>
                  <Button 
                    variant="secondary" 
                    className="py-2 px-4 text-xs font-semibold rounded-xl"
                    onClick={() => router.push('/rute-saya')}
                  >
                    Buka Rute Saya
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {cloudRoutes.map((route) => (
                    <div 
                      key={route.id} 
                      className="bg-surface rounded-2xl p-4 border border-surface-alt shadow-soft relative flex flex-col gap-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-sm text-ink">{route.title}</h4>
                          <span className="text-[10px] text-ink-muted flex items-center gap-1 mt-0.5">
                            <MapPin size={10} className="text-accent-primary" /> {route.destinations.length} Destinasi • {new Date(route.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <button 
                          onClick={() => handleDeleteRoute(route.id)}
                          className="w-7 h-7 rounded-full bg-surface-alt text-ink-muted hover:text-accent-rose hover:bg-accent-rose/10 flex items-center justify-center transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      {/* Thumbnails of destinations */}
                      <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
                        {route.destinations.map((d) => (
                          <div key={d.id} className="w-12 h-12 rounded-lg overflow-hidden bg-surface-alt shrink-0 border border-surface-alt">
                            <LazyImage src={d.images[0]} alt={d.name} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>

                      {/* Action to activate route */}
                      <Button 
                        variant="secondary" 
                        className="w-full py-2 text-xs font-bold text-accent-primary border-accent-primary/30 hover:bg-accent-primary/10 rounded-xl flex items-center justify-center gap-1.5 shadow-none"
                        onClick={() => handleOpenCloudRoute(route)}
                      >
                        <ExternalLink size={13} /> Aktifkan & Buka di Rute Saya
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="pt-2">
              <Link 
                href="/rekomendasi"
                className="w-full bg-surface rounded-2xl p-3.5 border border-surface-alt flex items-center justify-between text-ink hover:border-accent-primary transition-all shadow-soft group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-accent-gold/15 text-accent-gold flex items-center justify-center">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-ink block">Kuesioner Rekomendasi AI</span>
                    <span className="text-[10px] text-ink-muted">Ubah profil & gaya liburan impianmu</span>
                  </div>
                </div>
                <ArrowRight size={16} className="text-ink-muted group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>
        )}

      </div>
    </PageTransition>
  );
}
