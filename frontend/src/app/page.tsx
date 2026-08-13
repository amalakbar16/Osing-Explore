"use client";

import React, { useState } from 'react';
import PageTransition from '@/components/layout/PageTransition';
import HeroPencarianDestinasi from '@/components/pages/beranda/HeroPencarianDestinasi';
import KategoriFilter from '@/components/pages/beranda/KategoriFilter';
import DestinasiPopulerMarquee from '@/components/pages/beranda/DestinasiPopulerMarquee';
import KisahBlambangan from '@/components/pages/beranda/KisahBlambangan';
import KulinerUnggulan from '@/components/pages/beranda/KulinerUnggulan';
import StatsSection from '@/components/pages/beranda/StatsSection';
import { useRouter } from 'next/navigation';
import ScrollReveal from '@/components/common/ScrollReveal';
import { searchDestinations } from '@/services/destinationService';

export default function BerandaPage() {
  const router = useRouter();
  const [activeKategori, setActiveKategori] = useState('semua');

  const handleSearch = async (query: string) => {
    const q = query.trim();
    if (!q) return;
    try {
      const results = await searchDestinations(q);
      if (results.length > 0) {
        router.push(`/rute/${results[0].id}`);
      } else {
        const lower = q.toLowerCase();
        if (lower.includes('ijen')) router.push('/rute/dest-ijen');
        else if (lower.includes('merah') || lower.includes('pulau')) router.push('/rute/dest-p-merah');
        else if (lower.includes('plengkung') || lower.includes('g-land')) router.push('/rute/dest-plengkung');
        else if (lower.includes('boom')) router.push('/rute/dest-boom');
        else router.push('/rute/dest-ijen');
      }
    } catch (e) {
      console.error(e);
      router.push('/rute/dest-ijen');
    }
  };

  return (
    <PageTransition className="pb-12 bg-base">
      <HeroPencarianDestinasi onSearch={handleSearch} />
      
      <ScrollReveal delay={100}>
        <KategoriFilter activeKategori={activeKategori} onSelect={setActiveKategori} />
      </ScrollReveal>
      
      <DestinasiPopulerMarquee activeKategori={activeKategori} />
      
      <ScrollReveal delay={200}>
        <KisahBlambangan />
      </ScrollReveal>
      
      <ScrollReveal delay={300}>
        <KulinerUnggulan />
      </ScrollReveal>

      <StatsSection />
    </PageTransition>
  );
}
