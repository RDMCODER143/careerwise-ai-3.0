import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type UserRole = "job_seeker" | "employer" | "admin";

interface Profile {
  id: string;
  user_id: string;
  role: UserRole;
  app_role?: "job_seeker" | "employer" | "admin";
  full_name: string;
  company_name?: string;
  phone?: string;
  city?: string;
  country?: string;
  bio?: string;
  current_title?: string;
  experience?: string;
  current_company?: string;
  expected_salary?: string;
  degree?: string;
  major?: string;
  school?: string;
  graduation_year?: string;
  skills?: string[];
  profile_photo_url?: string;
  is_banned?: boolean;
  banned_at?: string;
  banned_reason?: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  firstName: string;
  lastName: string;
  signUp: (email: string, password: string, fullName: string, role: UserRole, companyName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signInWithLinkedIn: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Derive first and last names from profile
  const firstName = profile?.full_name?.split(' ')[0] || '';
  const lastName = profile?.full_name?.split(' ').slice(1).join(' ') || '';

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer profile fetch to avoid deadlock
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Set up real-time subscription for profile updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'profiles',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Profile updated:', payload);
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            const updatedProfile = payload.new as Profile;
            setProfile({
              ...updatedProfile,
              role: updatedProfile.role as UserRole
            });
          } else if (payload.eventType === 'DELETE') {
            setProfile(null);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      if (data) {
        // Cast the role and app_role to ensure type safety
        const profileData: Profile = {
          ...data,
          role: data.role as UserRole,
          app_role: data.app_role ? data.app_role as UserRole : undefined
        };
        setProfile(profileData);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: UserRole, companyName?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
          role: role,
          company_name: companyName || ""
        }
      }
    });

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    // Redirect to homepage after logout
    window.location.href = '/';
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });

    return { error };
  };

  const signInWithLinkedIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "linkedin_oidc",
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });

    return { error };
  };

  const value = {
    user,
    session,
    profile,
    loading,
    firstName,
    lastName,
    signUp,
    signIn,
    signOut,
    signInWithGoogle,
    signInWithLinkedIn,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
