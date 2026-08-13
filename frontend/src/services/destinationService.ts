import type { Destination } from '../types';
import destinationsData from '../data/destinations.json';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function getMainDestinations(): Promise<Destination[]> {
  try {
    const res = await fetch(`${API_BASE}/destinations/main`);
    if (!res.ok) throw new Error('API failed');
    return await res.json();
  } catch (e) {
    console.warn('API error, falling back to local data:', e);
    await delay(200);
    return (destinationsData as Destination[]).filter(d => d.isMainDestination);
  }
}

export async function getAllDestinations(): Promise<Destination[]> {
  try {
    const res = await fetch(`${API_BASE}/destinations`);
    if (!res.ok) throw new Error('API failed');
    return await res.json();
  } catch (e) {
    console.warn('API error, falling back to local data:', e);
    await delay(200);
    return destinationsData as Destination[];
  }
}

export async function getDestinationsByCorridor(corridorId: string): Promise<Destination[]> {
  try {
    const res = await fetch(`${API_BASE}/destinations/corridor/${corridorId}`);
    if (!res.ok) throw new Error('API failed');
    return await res.json();
  } catch (e) {
    console.warn('API error, falling back to local data:', e);
    await delay(200);
    return (destinationsData as Destination[]).filter(d => d.corridorIds.includes(corridorId));
  }
}

export async function getDestinationById(id: string): Promise<Destination | undefined> {
  try {
    const res = await fetch(`${API_BASE}/destinations/${id}`);
    if (!res.ok) throw new Error('API failed');
    return await res.json();
  } catch (e) {
    console.warn('API error, falling back to local data:', e);
    await delay(100);
    return (destinationsData as Destination[]).find(d => d.id === id);
  }
}

export async function searchDestinations(query: string): Promise<Destination[]> {
  try {
    const res = await fetch(`${API_BASE}/destinations/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('API failed');
    return await res.json();
  } catch (e) {
    console.warn('API error, falling back to local data:', e);
    await delay(100);
    return (destinationsData as Destination[]).filter(d =>
      d.name.toLowerCase().includes(query.toLowerCase())
    );
  }
}
