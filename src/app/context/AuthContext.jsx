'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({
  user: null,
  loading: true,
  isFallback: false,
  signIn: async (email, password) => {},
  signUp: async (email, password) => {},
  signOut: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const isFallback = !supabase;

  useEffect(() => {
    if (!supabase) {
      // If Supabase is not configured yet (local dev fallback), disable auth loading immediately
      setLoading(false);
      return;
    }

    // Retrieve the active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen to real-time auth changes (sign in, sign out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email, password) => {
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data.user;
    } else {
      // Local dev / demo fallback mode
      const mockUser = { email, id: 'mock-user-123' };
      setUser(mockUser);
      return mockUser;
    }
  };

  const signUp = async (email, password) => {
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      return data.user;
    } else {
      // Local dev / demo fallback mode
      const mockUser = { email, id: 'mock-user-123' };
      setUser(mockUser);
      return mockUser;
    }
  };

  const signOut = async () => {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Error signing out:', err);
      }
    } else {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isFallback, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
