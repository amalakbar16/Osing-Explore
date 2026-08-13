import type { RouteCorridor } from '../types';
import routeCorridorsData from '../data/routeCorridors.json';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function getCorridors(): Promise<RouteCorridor[]> {
  try {
    const res = await fetch(`${API_BASE}/corridors`);
    if (!res.ok) throw new Error('API failed');
    return await res.json();
  } catch (e) {
    console.warn('API error, falling back to local data:', e);
    await delay(200);
    return routeCorridorsData as RouteCorridor[];
  }
}

export async function getCorridorById(id: string): Promise<RouteCorridor | undefined> {
  try {
    const res = await fetch(`${API_BASE}/corridors/${id}`);
    if (!res.ok) throw new Error('API failed');
    return await res.json();
  } catch (e) {
    console.warn('API error, falling back to local data:', e);
    await delay(200);
    return (routeCorridorsData as RouteCorridor[]).find(c => c.id === id);
  }
}
