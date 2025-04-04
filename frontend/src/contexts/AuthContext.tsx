import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Session, User, AuthError, AuthResponse } from '@supabase/supabase-js';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (email: string, password: string, options?: { data?: object }) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hard-code the Lovable domain for this project
// change later
const SITE_URL = 'http://localhost:8080';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get session from storage
    const initAuth = async () => {
      try {
        // Get session from storage
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user ?? null);
        
        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          console.log("Auth state changed:", _event, session ? "User logged in" : "No session");
          setSession(session);
          setUser(session?.user ?? null);
        });
        
        return () => subscription.unsubscribe();
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log("Signing in with email:", email);
    return supabase.auth.signInWithPassword({ email, password });
  };

  const signUp = async (email: string, password: string, options?: { data?: object }) => {
    console.log("Signing up with email:", email);
    
    // Use the Lovable domain for redirects
    const redirectTo = `${SITE_URL}/verification-success`;
    
    console.log("Using redirect URL:", redirectTo);
    
    return supabase.auth.signUp({ 
      email, 
      password,
      options: {
        ...options,
        emailRedirectTo: redirectTo,
        data: options?.data
      }
    });
  };

  const signOut = async () => {
    console.log("Signing out");
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    console.log("Resetting password for:", email);
    
    // Use the Lovable domain for redirects
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${SITE_URL}/reset-password`,
    });
  };

  const value = {
    session,
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
