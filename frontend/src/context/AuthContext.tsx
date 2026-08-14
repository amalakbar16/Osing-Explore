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
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, fullName: string, personaTitle?: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  saveRouteToCloud: (title: string, destinations: Destination[], corridorId?: string) => Promise<{ success: boolean; error?: string }>;
  fetchCloudRoutes: () => Promise<CloudSavedRoute[]>;
  deleteCloudRoute: (routeId: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth session
  useEffect(() => {
    // Clear old demo flags if any
    if (typeof window !== 'undefined') {
      localStorage.removeItem('osing_demo_user_active');
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const saveRouteToCloud = async (title: string, destinations: Destination[], corridorId?: string) => {
    if (!user) return { success: false, error: 'Silakan masuk terlebih dahulu.' };

    try {
      const { error } = await supabase.from('user_saved_routes').insert({
        user_id: user.id,
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
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('user_saved_routes')
        .select('*')
        .eq('user_id', user.id)
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
    if (!user) return { success: false, error: 'Silakan masuk terlebih dahulu.' };

    try {
      const { error } = await supabase
        .from('user_saved_routes')
        .delete()
        .eq('id', routeId)
        .eq('user_id', user.id);

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
        signIn,
        signUp,
        signInWithGoogle,
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
