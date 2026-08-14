"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRouteContext } from '@/context/RouteContext';
import { useAuth } from '@/context/AuthContext';
import { getSmartRecommendation } from '@/services/recommendationService';
import type { WizardRequest, WizardRecommendationResponse } from '@/types';
import PageTransition from '@/components/layout/PageTransition';
import Button from '@/components/ui/Button';
import LazyImage from '@/components/common/LazyImage';
import { 
  ArrowLeft, Sparkles, Mountain, Waves, Palette, Coffee,
  Wallet, Users, Gem, Sun, Calendar, Tent, Compass, 
  Check, CheckCircle2, Clock, MapPin, Utensils, Bed, 
  Lightbulb, RotateCcw, ArrowRight, Lock
} from 'lucide-react';
import AuthPromptModal from '@/components/auth/AuthPromptModal';

export default function RekomendasiPage() {
  const router = useRouter();
  const { dispatch } = useRouteContext();
  const { user } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3 | 'loading' | 'result'>(1);
  const [vibe, setVibe] = useState<WizardRequest['vibe']>('alam');
  const [budget, setBudget] = useState<WizardRequest['budget']>('hemat');
  const [duration, setDuration] = useState<WizardRequest['duration']>('1_hari');
  const [result, setResult] = useState<WizardRecommendationResponse | null>(null);
  const [applied, setApplied] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Resume pending questionnaire if user just logged in
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('osing_pending_wizard');
      if (saved && user) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.vibe) setVibe(parsed.vibe);
          if (parsed.budget) setBudget(parsed.budget);
          if (parsed.duration) setDuration(parsed.duration);
          localStorage.removeItem('osing_pending_wizard');
          // Automatically run recommendation calculation
          setStep('loading');
          getSmartRecommendation(parsed).then(data => {
            setResult(data);
            setStep('result');
          });
        } catch {}
      }
    }
  }, [user]);

  const handleStartAnalysis = async () => {
    if (!user) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('osing_pending_wizard', JSON.stringify({ vibe, budget, duration }));
      }
      setIsAuthModalOpen(true);
      return;
    }

    setStep('loading');
    setApplied(false);
    
    const [data] = await Promise.all([
      getSmartRecommendation({ vibe, budget, duration }),
      new Promise(resolve => setTimeout(resolve, 1400)) // smooth visual animation delay
    ]);

    setResult(data);
    setStep('result');
  };

  const handleApplyRoute = () => {
    if (!result) return;
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    
    dispatch({ type: 'SET_SAVED_ROUTE', payload: result.itinerary });
    dispatch({
      type: 'SET_ACTIVE_ROUTE',
      payload: {
        corridorId: result.corridorId,
        destination: result.anchorDestination
      }
    });

    setApplied(true);
    setTimeout(() => {
      router.push('/rute-saya');
    }, 800);
  };

  const handleReset = () => {
    setStep(1);
    setResult(null);
    setApplied(false);
  };

  return (
    <PageTransition className="min-h-screen bg-base pb-28">
      {/* Top Sticky Header with integrated progress bar */}
      <div className="sticky top-0 z-30 bg-surface/90 backdrop-blur-md border-b border-surface-alt">
        <div className="px-4 pt-safe pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button 
              onClick={() => {
                if (step === 'result' || step === 1) router.push('/');
                else if (typeof step === 'number') setStep((step - 1) as 1 | 2);
              }} 
              className="p-1.5 rounded-full hover:bg-surface-alt text-ink transition-colors -ml-1"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="font-display text-base font-bold text-ink">Asisten Rute Pintar</h1>
          </div>

          {typeof step === 'number' && (
            <div className="flex items-center gap-1 bg-accent-primary/10 text-accent-primary px-2.5 py-0.5 rounded-full text-xs font-bold font-mono">
              <span>{step}/3</span>
            </div>
          )}
        </div>

        {/* Progress Line */}
        {typeof step === 'number' && (
          <div className="w-full h-1 bg-surface-alt overflow-hidden">
            <div 
              className="h-full bg-accent-primary transition-all duration-300 ease-out"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Main Container */}
      <div className="px-6 py-6 max-w-lg mx-auto">
        
        {/* STEP 1: VIBE */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-primary uppercase tracking-wider mb-1">
                <Sparkles size={14} /> Langkah 1
              </div>
              <h2 className="text-2xl font-display font-bold text-ink leading-tight">
                Apa suasana liburan yang kamu cari?
              </h2>
              <p className="text-sm text-ink-muted mt-1.5 leading-relaxed">
                Pilih karakter dan daya tarik utama yang paling menggambarkan liburan impianmu di Banyuwangi.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {[
                { 
                  id: 'alam', 
                  label: 'Alam & Vulkanik', 
                  desc: 'Kawah Ijen, hutan rimbun, air terjun eksotis', 
                  icon: Mountain, 
                  color: 'text-emerald-700 bg-emerald-50 border-emerald-200' 
                },
                { 
                  id: 'pantai', 
                  label: 'Pantai & Pesisir', 
                  desc: 'Pulau Merah, Teluk Hijau, pesona bahari', 
                  icon: Waves, 
                  color: 'text-cyan-700 bg-cyan-50 border-cyan-200' 
                },
                { 
                  id: 'budaya', 
                  label: 'Budaya Osing', 
                  desc: 'Desa Kemiren, sanggar Gandrung, tradisi leluhur', 
                  icon: Palette, 
                  color: 'text-amber-700 bg-amber-50 border-amber-200' 
                },
                { 
                  id: 'santai', 
                  label: 'Santai & Edukasi', 
                  desc: 'Kebun kopi, agrowisata, rekreasi keluarga', 
                  icon: Coffee, 
                  color: 'text-teal-700 bg-teal-50 border-teal-200' 
                },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = vibe === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setVibe(item.id as WizardRequest['vibe'])}
                    className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between h-36 ${
                      isSelected 
                        ? 'border-accent-primary bg-accent-primary/8 ring-2 ring-accent-primary/30 shadow-md scale-[1.01]' 
                        : 'border-surface-alt hover:border-accent-primary/40 bg-surface shadow-soft'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                        <Icon size={20} />
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-accent-primary text-white flex items-center justify-center shadow-xs">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-base text-ink mb-0.5">{item.label}</div>
                      <div className="text-xs text-ink-muted leading-snug">{item.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-4">
              <Button 
                variant="primary" 
                className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm shadow-colored-teal active:scale-[0.98] transition-all"
                onClick={() => setStep(2)}
              >
                Lanjut ke Gaya & Budget <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: BUDGET */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-primary uppercase tracking-wider mb-1">
                <Sparkles size={14} /> Langkah 2
              </div>
              <h2 className="text-2xl font-display font-bold text-ink leading-tight">
                Bagaimana preferensi budget & kenyamananmu?
              </h2>
              <p className="text-sm text-ink-muted mt-1.5 leading-relaxed">
                Kami akan menyesuaikan tiket destinasi, warung kuliner, dan penginapan yang tepat.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {[
                { 
                  id: 'hemat', 
                  label: 'Backpacker Hemat', 
                  desc: 'Prioritas tiket gratis/murah, warung legendaris, & homestay ramah kantong', 
                  icon: Wallet,
                  badge: 'Hemat Budget'
                },
                { 
                  id: 'sedang', 
                  label: 'Keluarga & Santai', 
                  desc: 'Kenyamanan seimbang dengan spot ikonik & tempat makan populer', 
                  icon: Users,
                  badge: 'Paling Populer'
                },
                { 
                  id: 'fleksibel', 
                  label: 'Eksplorasi Lengkap', 
                  desc: 'Akses penuh ke spot premium, resor eksotis, & pengalaman kuliner terbaik', 
                  icon: Gem,
                  badge: 'Pengalaman Maksimal'
                },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = budget === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setBudget(item.id as WizardRequest['budget'])}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center gap-4 ${
                      isSelected 
                        ? 'border-accent-primary bg-accent-primary/8 ring-2 ring-accent-primary/30 shadow-md scale-[1.01]' 
                        : 'border-surface-alt hover:border-accent-primary/40 bg-surface shadow-soft'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-accent-primary text-white shadow-colored-teal' : 'bg-accent-primary/10 text-accent-primary'
                    }`}>
                      <Icon size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-ink">{item.label}</span>
                        {isSelected && (
                          <span className="text-[10px] font-bold bg-accent-primary/20 text-accent-primary px-2 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-ink-muted mt-1 leading-relaxed">{item.desc}</div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-accent-primary bg-accent-primary text-white' : 'border-surface-alt'
                    }`}>
                      {isSelected && <Check size={14} strokeWidth={3} />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                variant="secondary" 
                className="py-3.5 px-6 rounded-2xl font-semibold"
                onClick={() => setStep(1)}
              >
                Kembali
              </Button>
              <Button 
                variant="primary" 
                className="flex-1 py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm shadow-colored-teal active:scale-[0.98] transition-all"
                onClick={() => setStep(3)}
              >
                Lanjut ke Waktu <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: DURATION */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-primary uppercase tracking-wider mb-1">
                <Sparkles size={14} /> Langkah 3
              </div>
              <h2 className="text-2xl font-display font-bold text-ink leading-tight">
                Berapa lama durasi liburanmu?
              </h2>
              <p className="text-sm text-ink-muted mt-1.5 leading-relaxed">
                Kami akan menghitung rute dan estimasi jam agar perjalanan efisien dan tidak terburu-buru.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {[
                { 
                  id: '1_hari', 
                  label: '1 Hari (Rute Kilat)', 
                  desc: '2 spot terdekat & 1 warung khas pilihan tanpa perlu menginap', 
                  icon: Sun,
                  est: '6 - 8 Jam'
                },
                { 
                  id: '2_hari', 
                  label: '2 Hari 1 Malam (Weekend)', 
                  desc: '3 spot ikonik terurut searah + 1 penginapan strategis & kuliner', 
                  icon: Calendar,
                  est: '2 Hari'
                },
                { 
                  id: '3_hari', 
                  label: '3+ Hari (Jelajah Lengkap)', 
                  desc: 'Eksplorasi mendalam seluruh koridor wisata utama Blambangan', 
                  icon: Tent,
                  est: '3+ Hari'
                },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = duration === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setDuration(item.id as WizardRequest['duration'])}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center gap-4 ${
                      isSelected 
                        ? 'border-accent-primary bg-accent-primary/8 ring-2 ring-accent-primary/30 shadow-md scale-[1.01]' 
                        : 'border-surface-alt hover:border-accent-primary/40 bg-surface shadow-soft'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-accent-gold text-white shadow-md' : 'bg-accent-gold/15 text-accent-gold'
                    }`}>
                      <Icon size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-base text-ink">{item.label}</span>
                        <span className="text-[10px] font-bold text-accent-primary bg-accent-primary/10 px-2 py-0.5 rounded-full">
                          {item.est}
                        </span>
                      </div>
                      <div className="text-xs text-ink-muted mt-1 leading-relaxed">{item.desc}</div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-accent-primary bg-accent-primary text-white' : 'border-surface-alt'
                    }`}>
                      {isSelected && <Check size={14} strokeWidth={3} />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                variant="secondary" 
                className="py-3.5 px-6 rounded-2xl font-semibold"
                onClick={() => setStep(2)}
              >
                Kembali
              </Button>
              <Button 
                variant="primary" 
                className="flex-1 py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm shadow-colored-teal active:scale-[0.98] transition-all"
                onClick={handleStartAnalysis}
              >
                <Sparkles size={18} className="animate-spin" /> Buat Rekomendasi Pintar
              </Button>
            </div>
          </div>
        )}

        {/* LOADING STATE */}
        {step === 'loading' && (
          <div className="py-20 text-center space-y-6 animate-fade-in">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 rounded-full bg-accent-primary/20 animate-ping" />
              <div className="relative w-24 h-24 rounded-full bg-accent-primary text-white flex items-center justify-center shadow-colored-teal">
                <Compass size={44} className="animate-spin" />
              </div>
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-ink">Menghitung Rute Terbaik...</h3>
              <p className="text-xs text-ink-muted mt-1 max-w-xs mx-auto">
                Memetakan koridor jalan, mengurutkan destinasi terdekat, serta memilih kuliner dan penginapan searah.
              </p>
            </div>
          </div>
        )}

        {/* RESULT STATE */}
        {step === 'result' && result && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Header Result Card */}
            <div className="bg-gradient-to-br from-accent-primary to-slate-900 text-white rounded-3xl p-6 shadow-colored-teal relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 bg-accent-gold/20 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-accent-gold flex items-center gap-1.5">
                  <Sparkles size={13} />
                  <span>{result.matchPercentage}% Cocok Sempurna</span>
                </div>
              </div>

              <h2 className="font-display text-2xl font-bold text-white mb-2 leading-tight">
                {result.personaTitle}
              </h2>
              <p className="text-xs text-white/80 leading-relaxed">
                {result.personaDesc}
              </p>
            </div>

            {/* Quick summary stats */}
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-surface rounded-2xl p-3 border border-surface-alt shadow-soft">
                <span className="text-[10px] text-ink-muted block mb-0.5">Total Destinasi</span>
                <span className="font-display font-bold text-base text-ink">{result.itinerary.length} Spot Terpilih</span>
              </div>
              <div className="bg-surface rounded-2xl p-3 border border-surface-alt shadow-soft">
                <span className="text-[10px] text-ink-muted block mb-0.5">Estimasi Waktu</span>
                <span className="font-display font-bold text-base text-accent-primary">{result.totalEstimatedTime}</span>
              </div>
            </div>

            {/* Travel tip banner */}
            {result.travelTip && (
              <div className="bg-accent-gold/10 border border-accent-gold/20 rounded-2xl p-3.5 flex items-start gap-2.5">
                <Lightbulb size={16} className="text-accent-gold shrink-0 mt-0.5" />
                <p className="text-xs text-ink leading-relaxed">
                  <strong className="text-accent-gold font-semibold">Tips Jelajah: </strong>
                  {result.travelTip}
                </p>
              </div>
            )}

            {/* Itinerary List (Ordered & Optimized) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                  <Compass size={14} className="text-accent-primary" /> Rangkaian Rute Searah Terpilih
                </h3>
              </div>

              <div className="space-y-3">
                {result.itinerary.map((dest, idx) => (
                  <div 
                    key={dest.id} 
                    className="bg-surface rounded-2xl p-3.5 border border-surface-alt shadow-soft flex items-center gap-3.5 relative overflow-hidden"
                  >
                    <div className="w-6 h-6 rounded-full bg-accent-primary text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-xs">
                      {idx + 1}
                    </div>

                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-surface-alt shrink-0 border border-surface-alt">
                      <LazyImage src={dest.images[0]} alt={dest.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-ink truncate">{dest.name}</h4>
                        {dest.isMainDestination && (
                          <span className="text-[9px] font-bold bg-accent-gold/20 text-amber-700 px-1.5 py-0.5 rounded">
                            Utama
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-ink-muted line-clamp-1 mt-0.5">{dest.shortDescription}</p>
                      <div className="flex items-center gap-3 text-[11px] text-ink-muted mt-1 font-mono">
                        <span className="flex items-center gap-1"><Clock size={11} /> {dest.duration || '2-3 Jam'}</span>
                        <span className="text-accent-primary font-semibold">★ {dest.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Culinary & Lodging */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {result.recommendedCulinary && (
                <div className="bg-surface rounded-2xl p-4 border border-surface-alt shadow-soft">
                  <div className="flex items-center gap-2 text-xs font-bold text-ink mb-2">
                    <Utensils size={14} className="text-accent-gold" />
                    <span>Kuliner Khas Terdekat</span>
                  </div>
                  <h4 className="font-bold text-sm text-ink">{result.recommendedCulinary.name}</h4>
                  <p className="text-xs text-ink-muted line-clamp-1 mt-0.5">{result.recommendedCulinary.specialty}</p>
                </div>
              )}

              {result.recommendedLodging && (
                <div className="bg-surface rounded-2xl p-4 border border-surface-alt shadow-soft">
                  <div className="flex items-center gap-2 text-xs font-bold text-ink mb-2">
                    <Bed size={14} className="text-accent-primary" />
                    <span>Rekomendasi Penginapan</span>
                  </div>
                  <h4 className="font-bold text-sm text-ink">{result.recommendedLodging.name}</h4>
                  <p className="text-xs text-ink-muted line-clamp-1 mt-0.5">{result.recommendedLodging.roomType} • {result.recommendedLodging.priceRange}</p>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="space-y-2.5 pt-4">
              <Button 
                variant="primary" 
                className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm shadow-colored-teal active:scale-[0.98] transition-all"
                onClick={handleApplyRoute}
              >
                {applied ? (
                  <>
                    <CheckCircle2 size={18} className="text-white" />
                    <span>Rute Diterapkan! Membuka Rute Saya...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>✨ Terapkan ke Rute Saya</span>
                  </>
                )}
              </Button>

              <div className="flex gap-2">
                <Button 
                  variant="secondary" 
                  className="flex-1 py-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-1.5"
                  onClick={() => router.push(`/rute/${result.anchorDestination.id}`)}
                >
                  <MapPin size={14} /> Buka Peta Rute
                </Button>
                <Button 
                  variant="ghost" 
                  className="py-3 px-4 rounded-2xl text-xs font-semibold text-ink-muted hover:text-ink flex items-center justify-center gap-1.5"
                  onClick={handleReset}
                >
                  <RotateCcw size={14} /> Atur Ulang
                </Button>
              </div>
            </div>

          </div>
        )}
      </div>

      <AuthPromptModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        title="Simpan & Buat Rekomendasi AI"
        description="Masuk atau daftar akun agar rangkaian rute cerdas ini dapat tersimpan aman dan terhubung dengan profil wisatamu."
        redirectPath="/rekomendasi"
      />
    </PageTransition>
  );
}
