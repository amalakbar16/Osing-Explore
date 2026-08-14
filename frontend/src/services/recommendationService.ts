import type { WizardRequest, WizardRecommendationResponse, Destination, Culinary, Lodging } from '@/types';
import destinationsData from '@/data/destinations.json';
import culinaryData from '@/data/culinary.json';
import lodgingData from '@/data/lodging.json';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function getSmartRecommendation(req: WizardRequest): Promise<WizardRecommendationResponse> {
  try {
    const res = await fetch(`${API_BASE}/api/recommendations/wizard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
      signal: AbortSignal.timeout(3000), // 3s timeout before fallback
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend recommendation service unreachable, using local smart engine fallback:', err);
  }

  // Local calculation fallback
  return calculateLocalRecommendation(req);
}

function calculateLocalRecommendation(req: WizardRequest): WizardRecommendationResponse {
  const allDests = destinationsData as unknown as Destination[];
  const allCul = culinaryData as unknown as Culinary[];
  const allLod = lodgingData as unknown as Lodging[];

  const scored = allDests.map(d => {
    let score = 0;
    if (d.category === req.vibe) score += 50;
    else if (req.vibe === 'santai' && ['budaya', 'pantai', 'alam'].includes(d.category)) score += 35;
    else if (req.vibe === 'alam' && d.category.includes('alam')) score += 40;

    score += (d.rating || 4.0) * 5;

    if (req.budget === 'hemat') {
      if (['gratis', 'murah'].includes(d.priceRange)) score += 25;
      else if (d.priceRange === 'sedang') score += 10;
    } else {
      score += 20;
    }

    if (d.isMainDestination) score += 15;
    return { score, d };
  });

  scored.sort((a, b) => b.score - a.score);
  const anchor = scored[0].d;
  const corridorId = anchor.corridorIds[0] || 'jalur-ijen-utara';

  const sideTrips = scored
    .filter(s => s.d.id !== anchor.id && s.d.corridorIds.includes(corridorId))
    .map(s => s.d);

  let itinerary = [anchor];
  let totalEstimatedTime = '6 - 8 Jam';

  if (req.duration === '1_hari') {
    itinerary = [anchor, ...sideTrips.slice(0, 1)];
    totalEstimatedTime = '6 - 8 Jam (1 Hari)';
  } else if (req.duration === '2_hari') {
    itinerary = [anchor, ...sideTrips.slice(0, 2)];
    totalEstimatedTime = '2 Hari 1 Malam';
  } else {
    itinerary = [anchor, ...sideTrips.slice(0, 3)];
    totalEstimatedTime = '3 Hari 2 Malam';
  }

  const corridorCul = allCul.filter(c => c.corridorIds.includes(corridorId));
  const matchedCul = req.budget === 'hemat'
    ? corridorCul.find(c => c.priceRange === 'murah') || corridorCul[0]
    : corridorCul.sort((a, b) => b.rating - a.rating)[0];

  const corridorLod = allLod.filter(l => l.corridorIds.includes(corridorId));
  const matchedLod = req.budget === 'hemat'
    ? corridorLod.find(l => l.roomType === 'Homestay') || corridorLod[0]
    : corridorLod.sort((a, b) => b.rating - a.rating)[0];

  const personaMap: Record<string, { title: string; desc: string; tip: string }> = {
    alam: {
      title: 'Penjelajah Alam Vulkanik & Rimba',
      desc: 'Cocok untuk jiwa petualang yang ingin merasakan keajaiban alam Ijen dan keindahan hutan tropis Banyuwangi.',
      tip: 'Siapkan jaket hangat, senter kepala, dan sepatu trekking untuk jalur pendakian.',
    },
    pantai: {
      title: 'Pemburu Sunset & Pesisir Eksotis',
      desc: 'Dirancang bagi penikmat deburan ombak, pasir eksotis, dan panorama senja magis pesisir Blambangan.',
      tip: 'Waktu terbaik tiba di destinasi pantai adalah pukul 15.30 WIB untuk momen matahari terbenam.',
    },
    budaya: {
      title: 'Pencinta Seni & Kearifan Lokal Osing',
      desc: 'Rute otentik menyusuri warisan tari Gandrung, kampung adat suku Osing, dan tradisi kopi khas.',
      tip: 'Sempatkan mencoba seduhan Kopi Kopok di Kemiren yang disangrai dengan tungku tanah liat tradisional.',
    },
    santai: {
      title: 'Pelancong Santai & Rekreasi Edukasi',
      desc: 'Kombinasi destinasi asri, pemandangan menenangkan, dan kuliner khas tanpa jalur ekstrem.',
      tip: 'Rute ini ramah keluarga dan sangat pas dinikmati santai sepanjang akhir pekan.',
    },
  };

  const persona = personaMap[req.vibe] || personaMap.santai;

  return {
    personaTitle: persona.title,
    personaDesc: persona.desc,
    matchPercentage: req.vibe === 'alam' || req.vibe === 'pantai' ? 98 : 95,
    anchorDestination: anchor,
    corridorId,
    itinerary,
    recommendedCulinary: matchedCul || null,
    recommendedLodging: matchedLod || null,
    totalEstimatedTime,
    travelTip: persona.tip,
  };
}
