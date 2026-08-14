"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRouteContext } from '@/context/RouteContext';
import { getSmartRecommendation } from '@/services/recommendationService';
import type { WizardRequest, WizardRecommendationResponse } from '@/types';
import { 
  Sparkles, X, Compass, ArrowRight, CheckCircle2, 
  MapPin, Utensils, Bed, Clock, Lightbulb, RotateCcw, 
  ChevronRight, Mountain, Waves, Palette, Coffee,
  Wallet, Users, Gem, Calendar, Sun, Tent
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
    
    // Simulate smart calculation
    const [data] = await Promise.all([
      getSmartRecommendation({ vibe, budget, duration }),
      new Promise(resolve => setTimeout(resolve, 1200)) // smooth visual animation delay
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
    }, 800);
  };

  const handleReset = () => {
    setStep(1);
    setResult(null);
    setApplied(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-surface border border-surface-alt rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col animate-scale-up">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-alt bg-surface/80 backdrop-blur sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-accent-primary/10 text-accent-primary flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="font-display font-semibold text-ink text-base">Asisten Rekomendasi Rute</h3>
              <p className="text-[11px] text-ink-muted">Mesin Pencocokan Rute Cerdas Osing</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-alt/70 hover:bg-surface-alt text-ink-muted hover:text-ink flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {/* STEP 1: Vibe Selection */}
          {step === 1 && (
            <div className="animate-fade-in">
              <div className="mb-5">
                <span className="text-xs font-semibold text-accent-primary tracking-wider uppercase">Langkah 1 dari 3</span>
                <h4 className="text-xl font-display font-bold text-ink mt-1">Apa suasana liburan yang kamu inginkan?</h4>
                <p className="text-xs text-ink-muted mt-1">Pilih daya tarik utama yang paling menggambarkan liburan impianmu.</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { id: 'alam', label: 'Alam & Vulkanik', desc: 'Kawah Ijen, hutan, air terjun', icon: Mountain, color: 'text-emerald-600 bg-emerald-50' },
                  { id: 'pantai', label: 'Pantai & Pesisir', desc: 'Pulau Merah, Teluk Hijau', icon: Waves, color: 'text-cyan-600 bg-cyan-50' },
                  { id: 'budaya', label: 'Seni & Budaya Osing', desc: 'Kemiren, Gandrung Terakota', icon: Palette, color: 'text-amber-600 bg-amber-50' },
                  { id: 'santai', label: 'Santai & Edukasi', desc: 'Bangsring, Kopi, Rekreasi', icon: Coffee, color: 'text-teal-600 bg-teal-50' },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = vibe === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setVibe(item.id as WizardRequest['vibe'])}
                      className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between h-32 ${
                        isSelected 
                          ? 'border-accent-primary bg-accent-primary/5 ring-2 ring-accent-primary/20 shadow-soft scale-[1.02]' 
                          : 'border-surface-alt hover:border-accent-primary/40 bg-surface'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.color}`}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-ink">{item.label}</div>
                        <div className="text-[10px] text-ink-muted line-clamp-1">{item.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <Button 
                variant="primary" 
                className="w-full py-3 rounded-xl flex items-center justify-center gap-2 font-semibold"
                onClick={() => setStep(2)}
              >
                Lanjut <ArrowRight size={16} />
              </Button>
            </div>
          )}

          {/* STEP 2: Budget & Style */}
          {step === 2 && (
            <div className="animate-fade-in">
              <div className="mb-5">
                <span className="text-xs font-semibold text-accent-primary tracking-wider uppercase">Langkah 2 dari 3</span>
                <h4 className="text-xl font-display font-bold text-ink mt-1">Bagaimana gaya & preferensi budget?</h4>
                <p className="text-xs text-ink-muted mt-1">Kami akan menyesuaikan tiket wisata, kuliner, dan penginapan.</p>
              </div>

              <div className="flex flex-col gap-3 mb-6">
                {[
                  { id: 'hemat', label: 'Backpacker Hemat', desc: 'Prioritas tiket gratis/murah, homestay terjangkau & warung khas', icon: Wallet },
                  { id: 'sedang', label: 'Keluarga & Santai', desc: 'Kenyamanan seimbang dengan destinasi populer & kuliner legendaris', icon: Users },
                  { id: 'fleksibel', label: 'Eksplorasi Lengkap', desc: 'Akses penuh ke spot ikonik, resort, & pengalaman premium', icon: Gem },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = budget === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setBudget(item.id as WizardRequest['budget'])}
                      className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-4 ${
                        isSelected 
                          ? 'border-accent-primary bg-accent-primary/5 ring-2 ring-accent-primary/20 shadow-soft' 
                          : 'border-surface-alt hover:border-accent-primary/40 bg-surface'
                      }`}
                    >
                      <div className="w-11 h-11 rounded-xl bg-accent-primary/10 text-accent-primary flex items-center justify-center shrink-0">
                        <Icon size={22} />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm text-ink">{item.label}</div>
                        <div className="text-xs text-ink-muted mt-0.5">{item.desc}</div>
                      </div>
                      <ChevronRight size={18} className={isSelected ? 'text-accent-primary' : 'text-ink-muted/40'} />
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" className="py-3 px-4 rounded-xl" onClick={() => setStep(1)}>
                  Kembali
                </Button>
                <Button 
                  variant="primary" 
                  className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold"
                  onClick={() => setStep(3)}
                >
                  Lanjut <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Duration Selection */}
          {step === 3 && (
            <div className="animate-fade-in">
              <div className="mb-5">
                <span className="text-xs font-semibold text-accent-primary tracking-wider uppercase">Langkah 3 dari 3</span>
                <h4 className="text-xl font-display font-bold text-ink mt-1">Berapa lama waktu perjalananmu?</h4>
                <p className="text-xs text-ink-muted mt-1">Kami akan mengoptimasi rute agar tidak lelah dan terburu-buru.</p>
              </div>

              <div className="flex flex-col gap-3 mb-6">
                {[
                  { id: '1_hari', label: '1 Hari (Rute Kilat)', desc: '2 spot terdekat searah + 1 kuliner khas pilihan', icon: Sun },
                  { id: '2_hari', label: '2 Hari (Akhir Pekan)', desc: '3 spot ikonik + penginapan strategis & kuliner', icon: Calendar },
                  { id: '3_hari', label: '3+ Hari (Jelajah Penuh)', desc: 'Rute lengkap seluruh koridor wisata utama', icon: Tent },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = duration === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setDuration(item.id as WizardRequest['duration'])}
                      className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-4 ${
                        isSelected 
                          ? 'border-accent-primary bg-accent-primary/5 ring-2 ring-accent-primary/20 shadow-soft' 
                          : 'border-surface-alt hover:border-accent-primary/40 bg-surface'
                      }`}
                    >
                      <div className="w-11 h-11 rounded-xl bg-accent-gold/15 text-accent-gold flex items-center justify-center shrink-0">
                        <Icon size={22} />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm text-ink">{item.label}</div>
                        <div className="text-xs text-ink-muted mt-0.5">{item.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" className="py-3 px-4 rounded-xl" onClick={() => setStep(2)}>
                  Kembali
                </Button>
                <Button 
                  variant="primary" 
                  className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold bg-gradient-to-r from-accent-primary to-teal-700 shadow-colored-teal"
                  onClick={handleStartAnalysis}
                >
                  <Sparkles size={16} /> Buat Rekomendasi Pintar
                </Button>
              </div>
            </div>
          )}

          {/* LOADING STATE */}
          {step === 'loading' && (
            <div className="py-12 text-center flex flex-col items-center justify-center animate-fade-in">
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-accent-primary/20 border-t-accent-primary animate-spin" />
                <div className="absolute inset-2 rounded-full bg-accent-primary/10 flex items-center justify-center text-accent-primary animate-pulse">
                  <Compass size={28} />
                </div>
              </div>
              <h4 className="font-display text-lg font-bold text-ink mb-1">Menganalisis Rute Terbaik...</h4>
              <p className="text-xs text-ink-muted max-w-xs">
                Mencocokkan preferensi dengan koridor jalan & waktu tempuh di Banyuwangi.
              </p>
            </div>
          )}

          {/* RESULT STATE */}
          {step === 'result' && result && (
            <div className="animate-fade-in">
              
              {/* Persona Header Card */}
              <div className="bg-gradient-to-br from-accent-primary/15 via-accent-primary/5 to-accent-gold/10 border border-accent-primary/30 rounded-2xl p-5 mb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-accent-primary text-white px-2.5 py-1 rounded-full">
                    {result.matchPercentage}% Cocok
                  </span>
                  <span className="text-xs text-ink-muted flex items-center gap-1">
                    <Clock size={12} /> {result.totalEstimatedTime}
                  </span>
                </div>
                <h4 className="font-display text-lg font-bold text-ink mb-1">
                  {result.personaTitle}
                </h4>
                <p className="text-xs text-ink-muted leading-relaxed">
                  {result.personaDesc}
                </p>
              </div>

              {/* Itinerary Timeline */}
              <div className="mb-5">
                <h5 className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-3">
                  Urutan Rute Teroptimasi (Searah)
                </h5>
                <div className="flex flex-col gap-3">
                  {result.itinerary.map((dest, idx) => (
                    <div 
                      key={dest.id} 
                      className="bg-surface rounded-xl p-3 border border-surface-alt shadow-soft flex items-center gap-3 relative"
                    >
                      <div className="w-6 h-6 rounded-full bg-accent-primary text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </div>
                      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-surface-alt">
                        <LazyImage src={dest.images[0]} alt={dest.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-ink truncate">{dest.name}</span>
                          {idx === 0 && (
                            <span className="text-[9px] bg-accent-gold/20 text-accent-gold font-bold px-1.5 py-0.5 rounded">
                              Utama
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-ink-muted flex items-center gap-1 capitalize">
                          <MapPin size={11} /> {dest.category} • {dest.duration || '2-3 Jam'}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Culinary recommendation */}
                  {result.recommendedCulinary && (
                    <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
                        <Utensils size={12} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-sm text-ink truncate">{result.recommendedCulinary.name}</span>
                          <span className="text-[9px] bg-amber-500/20 text-amber-700 font-bold px-1.5 py-0.5 rounded">
                            Kuliner Searah
                          </span>
                        </div>
                        <span className="text-xs text-ink-muted truncate block">{result.recommendedCulinary.specialty}</span>
                      </div>
                    </div>
                  )}

                  {/* Lodging recommendation */}
                  {result.recommendedLodging && (
                    <div className="bg-teal-500/5 border border-teal-500/20 rounded-xl p-3 flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                        <Bed size={12} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-sm text-ink truncate">{result.recommendedLodging.name}</span>
                          <span className="text-[9px] bg-teal-500/20 text-teal-700 font-bold px-1.5 py-0.5 rounded">
                            {result.recommendedLodging.roomType}
                          </span>
                        </div>
                        <span className="text-xs text-ink-muted truncate block">Rp {result.recommendedLodging.pricePerNight?.toLocaleString('id-ID')}/malam</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Travel Tip */}
              <div className="p-3.5 bg-surface-alt/60 rounded-xl border border-surface-alt text-xs text-ink flex items-start gap-2.5 mb-6">
                <Lightbulb size={16} className="text-accent-gold shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold text-ink">Tips Perjalanan:</strong> {result.travelTip}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5">
                <Button 
                  variant="primary" 
                  className={`w-full py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold text-sm shadow-colored-teal transition-all ${
                    applied ? 'bg-emerald-600' : 'bg-accent-primary'
                  }`}
                  onClick={handleApplyRoute}
                >
                  {applied ? (
                    <>
                      <CheckCircle2 size={18} /> Rute Berhasil Diterapkan!
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} /> ✨ Terapkan ke Rute Saya ({result.itinerary.length} Wisata)
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
                    <Compass size={14} /> Peta Jalur Koridor
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="py-2.5 px-3 text-xs text-ink-muted hover:text-ink flex items-center justify-center gap-1"
                    onClick={handleReset}
                  >
                    <RotateCcw size={14} /> Kuesioner Baru
                  </Button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
