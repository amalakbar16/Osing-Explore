"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRouteContext } from '@/context/RouteContext';
import { getSmartRecommendation } from '@/services/recommendationService';
import type { WizardRequest, WizardRecommendationResponse } from '@/types';
import PageTransition from '@/components/layout/PageTransition';
import Button from '@/components/ui/Button';
import LazyImage from '@/components/common/LazyImage';
import { 
  ArrowLeft, Sparkles, Mountain, Waves, Palette, Coffee,
  Wallet, Users, Gem, Sun, Calendar, Tent, Compass, 
  Check, CheckCircle2, Clock, MapPin, Utensils, Bed, 
  Lightbulb, RotateCcw, ArrowRight
} from 'lucide-react';

export default function RekomendasiPage() {
  const router = useRouter();
  const { dispatch } = useRouteContext();

  const [step, setStep] = useState<1 | 2 | 3 | 'loading' | 'result'>(1);
  const [vibe, setVibe] = useState<WizardRequest['vibe']>('alam');
  const [budget, setBudget] = useState<WizardRequest['budget']>('hemat');
  const [duration, setDuration] = useState<WizardRequest['duration']>('1_hari');
  const [result, setResult] = useState<WizardRecommendationResponse | null>(null);
  const [applied, setApplied] = useState(false);

  const handleStartAnalysis = async () => {
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
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-surface/90 backdrop-blur-md border-b border-surface-alt px-4 pt-safe pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              if (step === 'result' || step === 1) router.push('/');
              else if (typeof step === 'number') setStep((step - 1) as 1 | 2);
            }} 
            className="p-2 rounded-full hover:bg-surface-alt text-ink transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-display text-lg font-bold text-ink">Asisten Rute Pintar</h1>
            <p className="text-[11px] text-ink-muted">Sistem Rekomendasi Wisata Banyuwangi</p>
          </div>
        </div>

        {typeof step === 'number' && (
          <div className="flex items-center gap-1.5 bg-accent-primary/10 text-accent-primary px-3 py-1 rounded-full text-xs font-bold font-mono">
            <span>Langkah</span>
            <span>{step}/3</span>
          </div>
        )}
      </div>

      {/* Progress Line */}
      {typeof step === 'number' && (
        <div className="w-full h-1 bg-surface-alt">
          <div 
            className="h-full bg-accent-primary transition-all duration-300 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      )}

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
                  label: 'Budaya & Seni Osing', 
                  desc: 'Desa Adat Kemiren, Gandrung Terakota', 
                  icon: Palette, 
                  color: 'text-amber-700 bg-amber-50 border-amber-200' 
                },
                { 
                  id: 'santai', 
                  label: 'Santai & Edukasi', 
                  desc: 'Bangsring Underwater, kebun kopi, santai', 
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
                    className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between h-36 relative ${
                      isSelected 
                        ? 'border-accent-primary bg-accent-primary/8 ring-2 ring-accent-primary/30 shadow-md scale-[1.01]' 
                        : 'border-surface-alt hover:border-accent-primary/40 bg-surface shadow-soft'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-3.5 right-3.5 w-5 h-5 rounded-full bg-accent-primary text-white flex items-center justify-center shadow-sm">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                      <Icon size={22} />
                    </div>
                    <div>
                      <div className="font-bold text-base text-ink">{item.label}</div>
                      <div className="text-xs text-ink-muted mt-1 line-clamp-2">{item.desc}</div>
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
                Lanjut ke Preferensi Budget <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: BUDGET & STYLE */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-primary uppercase tracking-wider mb-1">
                <Sparkles size={14} /> Langkah 2
              </div>
              <h2 className="text-2xl font-display font-bold text-ink leading-tight">
                Tentukan gaya & budget perjalanan
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
                  est: '3 Hari'
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
                        <span className="text-[11px] font-mono font-semibold text-accent-primary bg-surface px-2 py-0.5 rounded-full border border-surface-alt">
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
                className="flex-1 py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm bg-gradient-to-r from-accent-primary to-teal-700 shadow-colored-teal active:scale-[0.98] transition-all"
                onClick={handleStartAnalysis}
              >
                <Sparkles size={18} /> Buat Rekomendasi Pintar
              </Button>
            </div>
          </div>
        )}

        {/* LOADING ANIMATION */}
        {step === 'loading' && (
          <div className="py-20 text-center flex flex-col items-center justify-center animate-fade-in space-y-6">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 rounded-full border-4 border-accent-primary/20 border-t-accent-primary animate-spin" />
              <div className="absolute inset-3 rounded-full bg-accent-primary/10 flex items-center justify-center text-accent-primary animate-pulse">
                <Compass size={36} />
              </div>
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-ink">Menghitung Rute Terbaik...</h3>
              <p className="text-xs text-ink-muted max-w-xs mt-1.5 leading-relaxed mx-auto">
                Mesin Python menganalisis jarak geospasial & waktu tempuh koridor jalan di Banyuwangi.
              </p>
            </div>
          </div>
        )}

        {/* RESULT PRESENTATION */}
        {step === 'result' && result && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Persona Badge Card */}
            <div className="bg-gradient-to-br from-accent-primary/15 via-accent-primary/5 to-accent-gold/15 border border-accent-primary/30 rounded-3xl p-6 shadow-soft">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider bg-accent-primary text-white px-3 py-1 rounded-full shadow-sm">
                  {result.matchPercentage}% Cocok Sempurna
                </span>
                <span className="text-xs text-ink-muted font-medium flex items-center gap-1.5">
                  <Clock size={14} className="text-accent-gold" /> {result.totalEstimatedTime}
                </span>
              </div>
              <h3 className="font-display text-2xl font-bold text-ink">
                {result.personaTitle}
              </h3>
              <p className="text-xs text-ink-muted mt-2 leading-relaxed">
                {result.personaDesc}
              </p>
            </div>

            {/* Itinerary Timeline */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-ink-muted uppercase tracking-wider">
                  Rangkaian Destinasi Terurut (Searah)
                </h4>
                <span className="text-[11px] text-accent-primary font-semibold">
                  Koridor: {result.corridorId}
                </span>
              </div>
              
              <div className="space-y-3">
                {result.itinerary.map((dest, idx) => (
                  <div 
                    key={dest.id} 
                    className="bg-surface rounded-2xl p-4 border border-surface-alt flex items-center gap-4 relative shadow-soft"
                  >
                    <div className="w-7 h-7 rounded-full bg-accent-primary text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-sm">
                      {idx + 1}
                    </div>
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-surface-alt">
                      <LazyImage src={dest.images[0]} alt={dest.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-ink truncate">{dest.name}</span>
                        {idx === 0 && (
                          <span className="text-[9px] bg-accent-gold/20 text-accent-gold font-bold px-2 py-0.5 rounded-md">
                            Tujuan Utama
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-ink-muted flex items-center gap-1 mt-1 capitalize">
                        <MapPin size={12} className="text-accent-primary" /> {dest.category} • {dest.duration || '2-3 Jam'}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Culinary recommendation */}
                {result.recommendedCulinary && (
                  <div className="bg-amber-500/8 border border-amber-500/20 rounded-2xl p-4 flex items-center gap-4 shadow-soft">
                    <div className="w-7 h-7 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      <Utensils size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-ink truncate">{result.recommendedCulinary.name}</span>
                        <span className="text-[9px] bg-amber-500/20 text-amber-800 font-bold px-2 py-0.5 rounded-md">
                          Kuliner Searah
                        </span>
                      </div>
                      <span className="text-xs text-ink-muted truncate block mt-0.5">
                        Khas: {result.recommendedCulinary.specialty} • {result.recommendedCulinary.priceRange}
                      </span>
                    </div>
                  </div>
                )}

                {/* Lodging recommendation */}
                {result.recommendedLodging && (
                  <div className="bg-teal-500/8 border border-teal-500/20 rounded-2xl p-4 flex items-center gap-4 shadow-soft">
                    <div className="w-7 h-7 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      <Bed size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-ink truncate">{result.recommendedLodging.name}</span>
                        <span className="text-[9px] bg-teal-500/20 text-teal-800 font-bold px-2 py-0.5 rounded-md">
                          {result.recommendedLodging.roomType}
                        </span>
                      </div>
                      <span className="text-xs text-ink-muted truncate block mt-0.5">
                        Rp {result.recommendedLodging.pricePerNight?.toLocaleString('id-ID')} / malam
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Travel Tip */}
            <div className="p-4 bg-surface-alt/50 rounded-2xl border border-surface-alt text-xs text-ink flex items-start gap-3">
              <Lightbulb size={18} className="text-accent-gold shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-ink">Tips Perjalanan:</strong> {result.travelTip}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <Button 
                variant="primary" 
                className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-base shadow-colored-teal active:scale-[0.98] transition-all ${
                  applied ? 'bg-emerald-600' : 'bg-accent-primary'
                }`}
                onClick={handleApplyRoute}
              >
                {applied ? (
                  <>
                    <CheckCircle2 size={20} /> Rute Berhasil Diterapkan ke Rute Saya!
                  </>
                ) : (
                  <>
                    <Sparkles size={20} /> ✨ Terapkan ke Rute Saya ({result.itinerary.length} Destinasi)
                  </>
                )}
              </Button>

              <div className="flex gap-3">
                <Button 
                  variant="secondary" 
                  className="flex-1 py-3 text-xs rounded-2xl flex items-center justify-center gap-2 font-semibold"
                  onClick={() => router.push(`/rute/${result.anchorDestination.id}`)}
                >
                  <Compass size={16} /> Buka Peta Rute
                </Button>
                <Button 
                  variant="ghost" 
                  className="py-3 px-4 text-xs text-ink-muted hover:text-ink flex items-center justify-center gap-1.5 rounded-2xl"
                  onClick={handleReset}
                >
                  <RotateCcw size={15} /> Kuesioner Baru
                </Button>
              </div>
            </div>

          </div>
        )}

      </div>
    </PageTransition>
  );
}
