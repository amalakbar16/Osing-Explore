"use client";

import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Volume2, VolumeX, Pause, Play } from 'lucide-react';

interface Kisah {
  title: string;
  body: string;
  era: string;
  tags?: string[];
}

interface KisahDestinasiPanelProps {
  kisah?: Kisah;
}

export default function KisahDestinasiPanel({ kisah }: KisahDestinasiPanelProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [kisah]);

  if (!kisah) return null;

  const toggleSpeech = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      alert('Browser Anda tidak mendukung fitur Audio Guide (Text-to-Speech).');
      return;
    }

    const synth = window.speechSynthesis;

    if (isPlaying) {
      if (isPaused) {
        synth.resume();
        setIsPaused(false);
      } else {
        synth.pause();
        setIsPaused(true);
      }
    } else {
      synth.cancel();

      const textToRead = `${kisah.title}. ${kisah.body}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      
      // Handle chrome async voice loading
      const setIndonesianVoice = () => {
        const voices = synth.getVoices();
        const idVoice = voices.find(v => v.lang.toLowerCase().startsWith('id'));
        if (idVoice) {
          utterance.voice = idVoice;
        }
      };

      setIndonesianVoice();
      if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = setIndonesianVoice;
      }
      
      utterance.lang = 'id-ID';
      utterance.rate = 1.0;

      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };

      utterance.onerror = (e) => {
        console.error('Speech synthesis error:', e);
        setIsPlaying(false);
        setIsPaused(false);
      };

      utteranceRef.current = utterance;
      setIsPlaying(true);
      setIsPaused(false);
      synth.speak(utterance);
    }
  };

  const stopSpeech = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  return (
    <div className="relative mt-8 rounded-2xl p-1 bg-gradient-to-br from-accent-gold/40 via-surface to-accent-rose/20 overflow-hidden shadow-lg shadow-accent-primary/5">
      <div className="relative z-10 bg-surface/90 backdrop-blur-md p-6 rounded-[14px]">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-accent-gold/20 flex items-center justify-center text-accent-gold animate-pulse">
              <BookOpen size={16} />
            </div>
            <span className="text-xs font-mono text-accent-gold uppercase tracking-widest">
              Kisah Destinasi
            </span>
          </div>

          {/* Audio Guide Pill Controls */}
          <div className="flex items-center gap-2">
            {isPlaying && (
              <button
                onClick={stopSpeech}
                className="flex items-center justify-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-600 hover:bg-rose-500/25 transition-all border border-rose-500/20 active:scale-95"
                title="Hentikan Audio"
              >
                <VolumeX size={12} />
                <span>Stop</span>
              </button>
            )}
            <button
              onClick={toggleSpeech}
              className={`flex items-center justify-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border active:scale-95 ${
                isPlaying
                  ? 'bg-accent-primary/10 text-accent-primary border-accent-primary/20 hover:bg-accent-primary/25'
                  : 'bg-accent-gold/15 text-accent-gold border-accent-gold/30 hover:bg-accent-gold/25'
              }`}
            >
              {isPlaying ? (
                isPaused ? (
                  <>
                    <Play size={12} fill="currentColor" />
                    <span>Lanjutkan</span>
                  </>
                ) : (
                  <>
                    <Pause size={12} fill="currentColor" />
                    <span>Jeda</span>
                  </>
                )
              ) : (
                <>
                  <Volume2 size={12} className="animate-bounce" />
                  <span>Dengarkan Kisah</span>
                </>
              )}
            </button>
          </div>
        </div>
        
        <h3 className="font-display italic text-display-sm text-ink leading-tight mb-4">
          {kisah.title}
        </h3>
        
        <div className="text-ink-muted text-sm leading-relaxed space-y-4 font-body relative">
          {isPlaying && !isPaused && (
            <div className="absolute right-0 -top-8 flex items-end gap-0.5 h-4 opacity-75">
              <span className="w-0.5 bg-accent-primary rounded-full animate-bounce h-2" style={{ animationDelay: '0.1s' }} />
              <span className="w-0.5 bg-accent-primary rounded-full animate-bounce h-3.5" style={{ animationDelay: '0.3s' }} />
              <span className="w-0.5 bg-accent-primary rounded-full animate-bounce h-2.5" style={{ animationDelay: '0.2s' }} />
              <span className="w-0.5 bg-accent-primary rounded-full animate-bounce h-4" style={{ animationDelay: '0.5s' }} />
              <span className="w-0.5 bg-accent-primary rounded-full animate-bounce h-1.5" style={{ animationDelay: '0.4s' }} />
            </div>
          )}
          <p>{kisah.body}</p>
        </div>
        
        <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-surface-alt/50">
          <span className="text-[10px] text-ink-muted bg-base px-2 py-1 rounded border border-surface-alt">
            {kisah.era}
          </span>
          {kisah.tags?.map(tag => (
            <span key={tag} className="text-[10px] text-accent-primary bg-accent-primary/10 px-2 py-1 rounded">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
