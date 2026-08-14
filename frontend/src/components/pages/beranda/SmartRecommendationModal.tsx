"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRouteContext } from '@/context/RouteContext';
import { getSmartRecommendation } from '@/services/recommendationService';
import type { WizardRequest, WizardRecommendationResponse } from '@/types';
import { 
  Sparkles, X, Compass, ArrowRight, CheckCircle2, 
  MapPin, Utensils, Bed, Clock, Lightbulb, RotateCcw, 
  Mountain, Waves, Palette, Coffee,
  Wallet, Users, Gem, Calendar, Sun, Tent, Check
} from 'lucide-react';
import Button from '@/components/ui/Button';
import LazyImage from '@/components/common/LazyImage';

interface SmartRecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SmartRecommendationModal({ isOpen, onClose }: SmartRecommendationModalProps) {
  const router = useRouter();
  const { dispatch } = useRouteContext();

  const [step, setStep] = useState<1 | 2 | 3 | 'loading' | 'result'>(1);
  const [vibe, setVibe] = useState<WizardRequest['vibe']>('alam');
  const [budget, setBudget] = useState<WizardRequest['budget']>('hemat');
  const [duration, setDuration] = useState<WizardRequest['duration']>('1_hari');
  const [result, setResult] = useState<WizardRecommendationResponse | null>(null);
  const [applied, setApplied] = useState(false);

  if (!isOpen) return null;

  const handleStartAnalysis = async () => {
    setStep('loading');
    setApplied(false);
    
    // Simulate smart calculation with minimal latency for smooth visual feedback
    const [data] = await Promise.all([
      getSmartRecommendation({ vibe, budget, duration }),
      new Promise(resolve => setTimeout(resolve, 1000))
    ]);

    setResult(data);
    setStep('result');
  };

  const handleApplyRoute = () => {
    if (!result) return;
    
    // Set all destinations in itinerary to savedRoute
    dispatch({ type: 'SET_SAVED_ROUTE', payload: result.itinerary });
    
    // Set active route corridor
    dispatch({
      type: 'SET_ACTIVE_ROUTE',
      payload: {
        corridorId: result.corridorId,
        destination: result.anchorDestination
      }
    });

    setApplied(true);
    setTimeout(() => {
      onClose();
      router.push('/rute-saya');
    }, 600);
  };

  const handleReset = () => {
    setStep(1);
    setResult(null);
    setApplied(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center items-center bg-ink/75 backdrop-blur-sm animate-fade-in sm:p-4">
      {/* Click outside backdrop */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      {/* Modal Container: Bottom Sheet on Mobile, Centered Box on Desktop */}
      <div className="w-full sm:max-w-lg bg-surface rounded-t-[2.25rem] sm:rounded-3xl shadow-2xl flex flex-col max-h-[88vh] sm:max-h-[85vh] border-t sm:border border-surface-alt overflow-hidden transition-all duration-300">
        
        {/* Mobile Pull Indicator */}
        <div className="pt-3 pb-1 flex justify-center sm:hidden">
          <div className="w-12 h-1.5 bg-surface-alt/90 rounded-full" />
        </div>

        {/* Modal Sticky Header */}
        <div className="px-6 pt-3 pb-4 border-b border-surface-alt bg-surface/95 backdrop-blur flex flex-col gap-2 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-accent-primary/10 text-accent-primary flex items-center justify-center">
                <Sparkles size={18} className="animate-scale-pulse" />
              </div>
              <div>
                <h3 className="font-display font-bold text-ink text-base">Asisten Rute Pintar</h3>
                <p className="text-[11px] text-ink-muted">Rekomendasi Searah & Terdekat</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-surface-alt/70 hover:bg-surface-alt text-ink-muted hover:text-ink flex items-center justify-center transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Progress Indicator for Wizard Steps */}
          {typeof step === 'number' && (
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-1.5 bg-surface-alt rounded-full overflow-hidden flex gap-1">
                <div className={`h-full rounded-full transition-all duration-300 ${step >= 1 ? 'bg-accent-primary flex-1' : 'bg-surface-alt flex-1'}`} />
                <div className={`h-full rounded-full transition-all duration-300 ${step >= 2 ? 'bg-accent-primary flex-1' : 'bg-surface-alt flex-1'}`} />
                <div className={`h-full rounded-full transition-all duration-300 ${step >= 3 ? 'bg-accent-primary flex-1' : 'bg-surface-alt flex-1'}`} />
              </div>
              <span className="text-[11px] font-mono font-semibold text-accent-primary shrink-0">
                {step}/3
              </span>
            </div>
          )}
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 hide-scrollbar">
          
          {/* STEP 1: VIBE */}
          {step === 1 && (
            <div className="animate-fade-in space-y-4">
              <div>
                <span className="text-xs font-bold text-accent-primary uppercase tracking-wider">Langkah 1</span>
                <h4 className="text-lg font-display font-bold text-ink mt-0.5">Pilih Suasana Liburanmu</h4>
                <p className="text-xs text-ink-muted mt-0.5">Daya tarik utama apa yang ingin kamu jelajahi di Banyuwangi?</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                {[
                  { id: 'alam', label: 'Alam & Vulkanik', desc: 'Kawah Ijen, hutan, air terjun', icon: Mountain, iconBg: 'bg-emerald-100 text-emerald-700' },
                  { id: 'pantai', label: 'Pantai & Pesisir', desc: 'Pulau Merah, Teluk Hijau', icon: Waves, iconBg: 'bg-cyan-100 text-cyan-700' },
                  { id: 'budaya', label: 'Budaya & Seni Osing', desc: 'Desa Kemiren, Gandrung', icon: Palette, iconBg: 'bg-amber-100 text-amber-700' },
                  { id: 'santai', label: 'Santai & Edukasi', desc: 'Bangsring, Kopi, Kebun', icon: Coffee, iconBg: 'bg-teal-100 text-teal-700' },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = vibe === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setVibe(item.id as WizardRequest['vibe'])}
                      className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between h-28 relative ${
                        isSelected 
                          ? 'border-accent-primary bg-accent-primary/8 ring-2 ring-accent-primary/20 shadow-soft' 
                          : 'border-surface-alt hover:border-surface-alt/90 bg-surface'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-accent-primary text-white flex items-center justify-center">
                          <Check size={10} strokeWidth={3} />
                        </div>
                      )}
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${item.iconBg}`}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-ink">{item.label}</div>
                        <div className="text-[10px] text-ink-muted truncate mt-0.5">{item.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: BUDGET & STYLE */}
          {step === 2 && (
            <div className="animate-fade-in space-y-4">
              <div>
                <span className="text-xs font-bold text-accent-primary uppercase tracking-wider">Langkah 2</span>
                <h4 className="text-lg font-display font-bold text-ink mt-0.5">Preferensi Budget & Gaya</h4>
                <p className="text-xs text-ink-muted mt-0.5">Kami sesuaikan tiket destinasi, rekomendasi kuliner, dan penginapan.</p>
              </div>

              <div className="space-y-2.5 pt-1">
                {[
                  { id: 'hemat', label: 'Backpacker Hemat', desc: 'Spot murah/gratis, warung legendaris, & homestay ramah kantong', icon: Wallet },
                  { id: 'sedang', label: 'Keluarga & Santai', desc: 'Kenyamanan optimal dengan spot ikonik & tempat makan populer', icon: Users },
                  { id: 'fleksibel', label: 'Eksplorasi Lengkap', desc: 'Akses penuh ke spot premium, resor eksotis, & kuliner terbaik', icon: Gem },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = budget === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setBudget(item.id as WizardRequest['budget'])}
                      className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3.5 ${
                        isSelected 
                          ? 'border-accent-primary bg-accent-primary/8 ring-2 ring-accent-primary/20 shadow-soft' 
                          : 'border-surface-alt hover:border-surface-alt/90 bg-surface'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-accent-primary text-white' : 'bg-accent-primary/10 text-accent-primary'
                      }`}>
                        <Icon size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm text-ink">{item.label}</div>
                        <div className="text-xs text-ink-muted truncate mt-0.5">{item.desc}</div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-accent-primary bg-accent-primary text-white' : 'border-surface-alt'
                      }`}>
                        {isSelected && <Check size={12} strokeWidth={3} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: DURATION */}
          {step === 3 && (
            <div className="animate-fade-in space-y-4">
              <div>
                <span className="text-xs font-bold text-accent-primary uppercase tracking-wider">Langkah 3</span>
                <h4 className="text-lg font-display font-bold text-ink mt-0.5">Durasi Waktu Perjalanan</h4>
                <p className="text-xs text-ink-muted mt-0.5">Berapa lama waktu yang kamu miliki di Banyuwangi?</p>
              </div>

              <div className="space-y-2.5 pt-1">
                {[
                  { id: '1_hari', label: '1 Hari (Rute Kilat)', desc: '2 spot terdekat & 1 kuliner khas pilihan tanpa menginap', icon: Sun },
                  { id: '2_hari', label: '2 Hari (Akhir Pekan)', desc: '3 spot terurut searah + 1 penginapan & kuliner strategis', icon: Calendar },
                  { id: '3_hari', label: '3+ Hari (Jelajah Penuh)', desc: 'Eksplorasi mendalam seluruh koridor utama Blambangan', icon: Tent },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = duration === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setDuration(item.id as WizardRequest['duration'])}
                      className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3.5 ${
                        isSelected 
                          ? 'border-accent-primary bg-accent-primary/8 ring-2 ring-accent-primary/20 shadow-soft' 
                          : 'border-surface-alt hover:border-surface-alt/90 bg-surface'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-accent-gold text-white' : 'bg-accent-gold/15 text-accent-gold'
                      }`}>
                        <Icon size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm text-ink">{item.label}</div>
                        <div className="text-xs text-ink-muted truncate mt-0.5">{item.desc}</div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-accent-primary bg-accent-primary text-white' : 'border-surface-alt'
                      }`}>
                        {isSelected && <Check size={12} strokeWidth={3} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* LOADING STATE */}
          {step === 'loading' && (
            <div className="py-12 text-center flex flex-col items-center justify-center animate-fade-in">
              <div className="relative w-16 h-16 mb-5">
                <div className="absolute inset-0 rounded-full border-4 border-accent-primary/20 border-t-accent-primary animate-spin" />
                <div className="absolute inset-2 rounded-full bg-accent-primary/10 flex items-center justify-center text-accent-primary animate-pulse">
                  <Compass size={24} />
                </div>
              </div>
              <h4 className="font-display text-base font-bold text-ink mb-1">Menghitung Rute Searah...</h4>
              <p className="text-xs text-ink-muted max-w-xs">
                Mencocokkan koridor jalan & waktu tempuh terdekat di Banyuwangi.
              </p>
            </div>
          )}

          {/* RESULT STATE */}
          {step === 'result' && result && (
            <div className="animate-fade-in space-y-4">
              {/* Persona Header Box */}
              <div className="bg-gradient-to-br from-accent-primary/10 via-accent-primary/5 to-accent-gold/10 border border-accent-primary/30 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-accent-primary text-white px-2 py-0.5 rounded-full">
                    {result.matchPercentage}% Sesuai
                  </span>
                  <span className="text-[11px] text-ink-muted font-medium flex items-center gap-1">
                    <Clock size={12} /> {result.totalEstimatedTime}
                  </span>
                </div>
                <h4 className="font-display text-base font-bold text-ink">
                  {result.personaTitle}
                </h4>
                <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                  {result.personaDesc}
                </p>
              </div>

              {/* Itinerary Timeline */}
              <div>
                <h5 className="text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-2.5">
                  Rangkaian Rute Rekomendasi
                </h5>
                
                <div className="space-y-2">
                  {result.itinerary.map((dest, idx) => (
                    <div 
                      key={dest.id} 
                      className="bg-surface rounded-xl p-2.5 border border-surface-alt flex items-center gap-3 relative shadow-soft"
                    >
                      <div className="w-5 h-5 rounded-full bg-accent-primary text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </div>
                      <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-surface-alt">
                        <LazyImage src={dest.images[0]} alt={dest.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-xs text-ink truncate">{dest.name}</span>
                          {idx === 0 && (
                            <span className="text-[8px] bg-accent-gold/20 text-accent-gold font-bold px-1.5 py-0.5 rounded">
                              Utama
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-ink-muted flex items-center gap-1 capitalize">
                          <MapPin size={10} /> {dest.category} • Est. {dest.duration || '2 Jam'}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Culinary recommendation */}
                  {result.recommendedCulinary && (
                    <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-2.5 flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        <Utensils size={10} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-xs text-ink truncate">{result.recommendedCulinary.name}</span>
                          <span className="text-[8px] bg-amber-500/20 text-amber-800 font-bold px-1.5 py-0.5 rounded">
                            Kuliner Searah
                          </span>
                        </div>
                        <span className="text-[10px] text-ink-muted truncate block">{result.recommendedCulinary.specialty}</span>
                      </div>
                    </div>
                  )}

                  {/* Lodging recommendation */}
                  {result.recommendedLodging && (
                    <div className="bg-teal-500/8 border border-teal-500/20 rounded-xl p-2.5 flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-teal-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        <Bed size={10} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-xs text-ink truncate">{result.recommendedLodging.name}</span>
                          <span className="text-[8px] bg-teal-500/20 text-teal-800 font-bold px-1.5 py-0.5 rounded">
                            {result.recommendedLodging.roomType}
                          </span>
                        </div>
                        <span className="text-[10px] text-ink-muted truncate block">Rp {result.recommendedLodging.pricePerNight?.toLocaleString('id-ID')}/malam</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Travel Tip */}
              <div className="p-3 bg-surface-alt/50 rounded-xl border border-surface-alt text-[11px] text-ink flex items-start gap-2">
                <Lightbulb size={14} className="text-accent-gold shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold text-ink">Tips:</strong> {result.travelTip}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* STICKY FOOTER NAVIGATION - ALWAYS VISIBLE AT BOTTOM */}
        <div className="p-4 border-t border-surface-alt bg-surface/95 backdrop-blur shrink-0 pb-safe">
          {step === 1 && (
            <Button 
              variant="primary" 
              className="w-full py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-sm shadow-colored-teal"
              onClick={() => setStep(2)}
            >
              Lanjut ke Budget <ArrowRight size={16} />
            </Button>
          )}

          {step === 2 && (
            <div className="flex gap-2.5">
              <Button variant="secondary" className="py-3 px-4 rounded-xl text-xs" onClick={() => setStep(1)}>
                Kembali
              </Button>
              <Button 
                variant="primary" 
                className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-sm shadow-colored-teal"
                onClick={() => setStep(3)}
              >
                Lanjut ke Waktu <ArrowRight size={16} />
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="flex gap-2.5">
              <Button variant="secondary" className="py-3 px-4 rounded-xl text-xs" onClick={() => setStep(2)}>
                Kembali
              </Button>
              <Button 
                variant="primary" 
                className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-sm bg-gradient-to-r from-accent-primary to-teal-700 shadow-colored-teal"
                onClick={handleStartAnalysis}
              >
                <Sparkles size={16} /> Buat Rekomendasi
              </Button>
            </div>
          )}

          {step === 'result' && result && (
            <div className="space-y-2">
              <Button 
                variant="primary" 
                className={`w-full py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold text-sm shadow-colored-teal transition-all ${
                  applied ? 'bg-emerald-600' : 'bg-accent-primary'
                }`}
                onClick={handleApplyRoute}
              >
                {applied ? (
                  <>
                    <CheckCircle2 size={18} /> Rute Berhasil Disimpan!
                  </>
                ) : (
                  <>
                    <Sparkles size={18} /> ✨ Terapkan ke Rute Saya
                  </>
                )}
              </Button>

              <div className="flex gap-2">
                <Button 
                  variant="secondary" 
                  className="flex-1 py-2.5 text-xs rounded-xl flex items-center justify-center gap-1.5"
                  onClick={() => {
                    onClose();
                    router.push(`/rute/${result.anchorDestination.id}`);
                  }}
                >
                  <Compass size={14} /> Peta Rute
                </Button>
                <Button 
                  variant="ghost" 
                  className="py-2.5 px-3 text-xs text-ink-muted hover:text-ink flex items-center justify-center gap-1"
                  onClick={handleReset}
                >
                  <RotateCcw size={14} /> Ulangi
                </Button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
