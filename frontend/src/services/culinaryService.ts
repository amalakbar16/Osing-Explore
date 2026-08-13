import type { Culinary } from '../types';
import culinaryData from '../data/culinary.json';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function getCulinaryByCorridor(corridorId: string): Promise<Culinary[]> {
  try {
    const res = await fetch(`${API_BASE}/culinary/corridor/${corridorId}`);
    if (!res.ok) throw new Error('API failed');
    return await res.json();
  } catch (e) {
    console.warn('API error, falling back to local data:', e);
    await delay(300);
    return (culinaryData as Culinary[]).filter(c => c.corridorIds.includes(corridorId));
  }
}

export async function getAllCulinary(): Promise<Culinary[]> {
  try {
    const res = await fetch(`${API_BASE}/culinary`);
    if (!res.ok) throw new Error('API failed');
    return await res.json();
  } catch (e) {
    console.warn('API error, falling back to local data:', e);
    await delay(300);
    return culinaryData as Culinary[];
  }
}

export async function getCulinaryById(id: string): Promise<Culinary | undefined> {
  try {
    const res = await fetch(`${API_BASE}/culinary/${id}`);
    if (!res.ok) throw new Error('API failed');
    return await res.json();
  } catch (e) {
    console.warn('API error, falling back to local data:', e);
    await delay(200);
    return (culinaryData as Culinary[]).find(c => c.id === id);
  }
}
