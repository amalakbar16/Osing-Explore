import type { Lodging } from '../types';
import lodgingData from '../data/lodging.json';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function getLodgingByCorridor(corridorId: string): Promise<Lodging[]> {
  try {
    const res = await fetch(`${API_BASE}/lodging/corridor/${corridorId}`);
    if (!res.ok) throw new Error('API failed');
    return await res.json();
  } catch (e) {
    console.warn('API error, falling back to local data:', e);
    await delay(300);
    return (lodgingData as Lodging[]).filter(l => l.corridorIds.includes(corridorId));
  }
}

export async function getAllLodging(): Promise<Lodging[]> {
  try {
    const res = await fetch(`${API_BASE}/lodging`);
    if (!res.ok) throw new Error('API failed');
    return await res.json();
  } catch (e) {
    console.warn('API error, falling back to local data:', e);
    await delay(300);
    return lodgingData as Lodging[];
  }
}

export async function getLodgingById(id: string): Promise<Lodging | undefined> {
  try {
    const res = await fetch(`${API_BASE}/lodging/${id}`);
    if (!res.ok) throw new Error('API failed');
    return await res.json();
  } catch (e) {
    console.warn('API error, falling back to local data:', e);
    await delay(200);
    return (lodgingData as Lodging[]).find(l => l.id === id);
  }
}
