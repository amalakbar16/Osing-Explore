"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';
import type { Destination } from '@/types';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  personaTitle?: string;
  travelStyle?: string;
}

export interface CloudSavedRoute {
  id: string;
  title: string;
  corridorId: string;
  destinations: Destination[];
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isDemoUser: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, fullName: string, personaTitle?: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signInDemo: () => Promise<void>;
  signOut: () => Promise<void>;
  saveRouteToCloud: (title: string, destinations: Destination[], corridorId?: string) => Promise<{ success: boolean; error?: string }>;
  fetchCloudRoutes: () => Promise<CloudSavedRoute[]>;
  deleteCloudRoute: (routeId: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEMO_USER_PROFILE: UserProfile = {
  id: 'demo-wisatawan-id',
  email: 'wisatawan.gemastik@osing.id',
  fullName: 'Dimas Wicaksono',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  personaTitle: 'Penjelajah Alam Vulkanik (Level 2)',
  travelStyle: 'alam',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoUser, setIsDemoUser] = useState(false);

  // Initialize auth session
  useEffect(() => {
    // Check if demo user session was saved locally
    const savedDemo = typeof window !== 'undefined' ? localStorage.getItem('osing_demo_user_active') : null;
    if (savedDemo === 'true') {
      setIsDemoUser(true);
      setProfile(DEMO_USER_PROFILE);
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user);
      } else if (!isDemoUser) {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [isDemoUser]);

  const fetchProfile = async (currentUser: User) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (data && !error) {
        setProfile({
          id: currentUser.id,
          email: currentUser.email || '',
          fullName: data.full_name || 'Wisatawan Osing',
          avatarUrl: data.avatar_url,
          personaTitle: data.persona_title || 'Penjelajah Blambangan',
          travelStyle: data.travel_style || 'santai',
        });
      } else {
        // Fallback profile if table is not yet populated
        setProfile({
          id: currentUser.id,
          email: currentUser.email || '',
          fullName: currentUser.user_metadata?.full_name || 'Wisatawan Osing',
          avatarUrl: currentUser.user_metadata?.avatar_url,
          personaTitle: currentUser.user_metadata?.persona_title || 'Penjelajah Blambangan',
        });
      }
    } catch {
      setProfile({
        id: currentUser.id,
        email: currentUser.email || '',
        fullName: currentUser.user_metadata?.full_name || 'Wisatawan Osing',
        avatarUrl: currentUser.user_metadata?.avatar_url,
        personaTitle: currentUser.user_metadata?.persona_title || 'Penjelajah Blambangan',
      });
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const cleanEmail = email.trim().includes('@') ? email.trim() : `${email.trim()}@gmail.com`;
      const { error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal masuk. Silakan coba lagi.';
      return { success: false, error: msg };
    }
  };

  const signUp = async (email: string, password: string, fullName: string, personaTitle?: string) => {
    try {
      const cleanEmail = email.trim().includes('@') ? email.trim() : `${email.trim()}@gmail.com`;
      const { error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: fullName,
            persona_title: personaTitle || 'Penjelajah Blambangan',
          },
        },
      });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal mendaftar. Silakan coba lagi.';
      return { success: false, error: msg };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/profil` : undefined,
        },
      });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal masuk dengan Google.';
      return { success: false, error: msg };
    }
  };

  const signInDemo = async () => {
    setIsDemoUser(true);
    setProfile(DEMO_USER_PROFILE);
    if (typeof window !== 'undefined') {
      localStorage.setItem('osing_demo_user_active', 'true');
    }
  };

  const signOut = async () => {
    if (isDemoUser) {
      setIsDemoUser(false);
      setProfile(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('osing_demo_user_active');
      }
    } else {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
    }
  };

  const saveRouteToCloud = async (title: string, destinations: Destination[], corridorId?: string) => {
    if (!profile) return { success: false, error: 'Silakan masuk terlebih dahulu.' };

    if (isDemoUser) {
      // Save to demo local storage cloud mock
      const existing = JSON.parse(localStorage.getItem('osing_demo_cloud_routes') || '[]');
      const newRoute: CloudSavedRoute = {
        id: `demo-route-${Date.now()}`,
        title: title || `Rute ${destinations[0]?.name || 'Wisata'}`,
        corridorId: corridorId || destinations[0]?.corridorIds[0] || 'jalur-ijen-utara',
        destinations,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('osing_demo_cloud_routes', JSON.stringify([newRoute, ...existing]));
      return { success: true };
    }

    try {
      const { error } = await supabase.from('user_saved_routes').insert({
        user_id: profile.id,
        title: title || `Rute ${destinations[0]?.name || 'Wisata'}`,
        corridor_id: corridorId || destinations[0]?.corridorIds[0] || 'jalur-ijen-utara',
        destinations,
      });

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal menyimpan rute ke cloud.';
      return { success: false, error: msg };
    }
  };

  const fetchCloudRoutes = async (): Promise<CloudSavedRoute[]> => {
    if (!profile) return [];

    if (isDemoUser) {
      const saved = localStorage.getItem('osing_demo_cloud_routes');
      if (saved) {
        return JSON.parse(saved);
      }
      // Default demo cloud routes
      const defaultDemoRoutes: CloudSavedRoute[] = [
        {
          id: 'demo-route-1',
          title: 'Petualangan Vulkanik Ijen & Jagir',
          corridorId: 'jalur-ijen-utara',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          destinations: [
            {
              id: 'dest-ijen',
              name: 'Kawah Ijen',
              category: 'alam',
              corridorIds: ['jalur-ijen-utara'],
              coordinates: { lat: -8.0583, lng: 114.2418 },
              rating: 4.8,
              distanceFromRouteKm: 0,
              isMainDestination: true,
              images: ['https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=600&auto=format&fit=crop&q=80'],
              shortDescription: 'Danau kawah asam terbesar di dunia dengan fenomena api biru mistis.',
              openingHours: '01:00 - 12:00',
              priceRange: 'murah',
              ticketPrice: 15000,
              duration: '4-6 Jam',
            },
            {
              id: 'dest-jagir',
              name: 'Air Terjun Jagir',
              category: 'alam',
              corridorIds: ['jalur-ijen-utara'],
              coordinates: { lat: -8.1978, lng: 114.3056 },
              rating: 4.5,
              distanceFromRouteKm: 1.2,
              isMainDestination: false,
              images: ['https://images.unsplash.com/photo-1546548970-71785318a17b?w=600&auto=format&fit=crop&q=80'],
              shortDescription: 'Air terjun kembar bersumber dari mata air alami pegunungan Ijen.',
              openingHours: '07:00 - 17:00',
              priceRange: 'murah',
              ticketPrice: 5000,
              duration: '1-2 Jam',
            }
          ]
        }
      ];
      localStorage.setItem('osing_demo_cloud_routes', JSON.stringify(defaultDemoRoutes));
      return defaultDemoRoutes;
    }

    try {
      const { data, error } = await supabase
        .from('user_saved_routes')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

      if (data && !error) {
        return data.map((r: { id: string; title: string; corridor_id: string; destinations: Destination[]; created_at: string }) => ({
          id: r.id,
          title: r.title,
          corridorId: r.corridor_id,
          destinations: r.destinations,
          createdAt: r.created_at,
        }));
      }
      return [];
    } catch {
      return [];
    }
  };

  const deleteCloudRoute = async (routeId: string) => {
    if (!profile) return { success: false, error: 'Silakan masuk terlebih dahulu.' };

    if (isDemoUser) {
      const existing: CloudSavedRoute[] = JSON.parse(localStorage.getItem('osing_demo_cloud_routes') || '[]');
      const filtered = existing.filter(r => r.id !== routeId);
      localStorage.setItem('osing_demo_cloud_routes', JSON.stringify(filtered));
      return { success: true };
    }

    try {
      const { error } = await supabase
        .from('user_saved_routes')
        .delete()
        .eq('id', routeId)
        .eq('user_id', profile.id);

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal menghapus rute.';
      return { success: false, error: msg };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isDemoUser,
        signIn,
        signUp,
        signInWithGoogle,
        signInDemo,
        signOut,
        saveRouteToCloud,
        fetchCloudRoutes,
        deleteCloudRoute,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
