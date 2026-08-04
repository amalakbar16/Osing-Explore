import React, { useState } from 'react';
import PageTransition from '../../components/layout/PageTransition';
import HeroPencarianDestinasi from './components/HeroPencarianDestinasi';
import KategoriFilter from './components/KategoriFilter';
import DestinasiPopulerMarquee from './components/DestinasiPopulerMarquee';
import KisahBlambangan from './components/KisahBlambangan';
import KulinerUnggulan from './components/KulinerUnggulan';
import StatsSection from './components/StatsSection';
import { useNavigate } from 'react-router';
import ScrollReveal from '../../components/common/ScrollReveal';

export default function BerandaPage() {
  const navigate = useNavigate();
  const [activeKategori, setActiveKategori] = useState('semua');

  const handleSearch = (query) => {
    const q = query.toLowerCase();
    if (q.includes('ijen')) navigate('/rute/dest-ijen');
    else if (q.includes('merah') || q.includes('pulau')) navigate('/rute/dest-p-merah');
    else if (q.includes('plengkung') || q.includes('g-land')) navigate('/rute/dest-plengkung');
    else if (q.includes('boom')) navigate('/rute/dest-boom');
    else navigate('/rute/dest-ijen'); // fallback dummy
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
