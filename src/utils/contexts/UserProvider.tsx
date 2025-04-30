"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { type Session } from '@supabase/supabase-js'
import { supabase } from "@/lib/supabase/supabase-browserclient"

// Define an interface for the user profile data from the users table
interface UserProfile {
  id: string;
  created_at: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  github_id?: string;
  linkedin_id?: string;
  token_balance?: string;
  activity?: string;
  phone_number?: string;
  location?: string;
  email?: string;
}

interface AuthContextType {
  session: Session | null;
  user: UserProfile | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

import { ReactNode } from "react";

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch user profile data from users table
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        return null;
      }
      console.log("User data:", data);
      return data;
    } catch (error) {
      console.error("Exception when fetching user profile:", error);
      return null;
    }
  };

  // Function to refresh the user profile data
  const refreshUser = async () => {
    if (session?.user?.id) {
      const profileData = await fetchUserProfile(session.user.id);
      if (profileData) {
        setUser(profileData);
      }
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);

      // Get initial session using your existing supabase browser client
      const { data: { session: initialSession }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error getting session:", error);
        setLoading(false);
        return;
      }

      if (initialSession?.user) {
        setSession(initialSession);
        
        // Fetch user profile
        const profileData = await fetchUserProfile(initialSession.user.id);
        setUser(profileData || null);
      }
      
      setLoading(false);

      // Set up auth state change listener using your existing supabase browser client
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event, currentSession) => {
          setSession(currentSession);
          router.refresh(); // Refresh the current route when auth state changes

          // Fetch profile if user is logged in
          if (currentSession?.user) {
            const profileData = await fetchUserProfile(currentSession.user.id);
            setUser(profileData || null);
          } else {
            setUser(null);
          }
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    };

    initializeAuth();
  }, [router]);

  return (
    <AuthContext.Provider value={{ session, user, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a UserProvider");
  }
  return context;
};
