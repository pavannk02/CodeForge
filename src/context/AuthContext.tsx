import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { UserProfile, UserRole } from '@/types';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, fullName: string, studentId?: string, role?: UserRole) => Promise<{ error?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo profiles for local dev without Supabase
const DEMO_PROFILES: Record<string, UserProfile> = {
  'student@campus.edu': {
    id: 'demo-student-1',
    full_name: 'Aryan Kumar',
    email: 'student@campus.edu',
    student_id: 'CS2024001',
    role: 'student',
    created_at: new Date().toISOString(),
    account_status: 'active',
  },
  'student2@campus.edu': {
    id: 'demo-student-2',
    full_name: 'Neha Sharma',
    email: 'student2@campus.edu',
    student_id: 'CS2024002',
    role: 'student',
    created_at: new Date().toISOString(),
    account_status: 'active',
  },
  'admin@campus.edu': {
    id: 'demo-admin-1',
    full_name: 'Security Admin',
    email: 'admin@campus.edu',
    role: 'admin',
    created_at: new Date().toISOString(),
    account_status: 'active',
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const isConfigured = isSupabaseConfigured();

  // Fetch user profile from Supabase
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (!error && data) {
        setProfile(data as UserProfile);
      }
    } catch (e) {
      console.warn('Profile fetch warning:', e);
    }
  };

  useEffect(() => {
    if (!isConfigured) {
      // Check localStorage for demo session
      const demoEmail = localStorage.getItem('demo_user_email');
      if (demoEmail && DEMO_PROFILES[demoEmail]) {
        setProfile(DEMO_PROFILES[demoEmail]);
        setUser({ id: DEMO_PROFILES[demoEmail].id, email: demoEmail } as User);
      }
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) fetchProfile(s.user.id);
      setLoading(false);
    }).catch(() => setLoading(false));

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, s) => {
        setSession(s);
        setUser(s?.user ?? null);
        if (s?.user) fetchProfile(s.user.id);
        else setProfile(null);
      }
    );

    return () => subscription.unsubscribe();
  }, [isConfigured]);

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    studentId?: string,
    role: UserRole = 'student'
  ) => {
    if (!isConfigured) {
      // Demo mode
      const newProfile: UserProfile = {
        id: `demo-${Date.now()}`,
        full_name: fullName,
        email,
        student_id: studentId,
        role,
        created_at: new Date().toISOString(),
        account_status: 'active',
      };
      DEMO_PROFILES[email] = newProfile;
      setProfile(newProfile);
      setUser({ id: newProfile.id, email } as User);
      localStorage.setItem('demo_user_email', email);
      return {};
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          student_id: studentId,
          role,
        },
      },
    });
    if (error) return { error: error.message };

    // Create profile row in Supabase
    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: fullName,
        email,
        student_id: studentId,
        role,
        account_status: 'active',
      });
      if (profileError) {
        console.warn('Profile insert note:', profileError.message);
      }

      setProfile({
        id: data.user.id,
        full_name: fullName,
        email,
        student_id: studentId,
        role,
        created_at: new Date().toISOString(),
        account_status: 'active',
      });
    }
    return {};
  };

  const signIn = async (email: string, password: string) => {
    if (!isConfigured) {
      const demoProfile = DEMO_PROFILES[email];
      if (demoProfile && password.length >= 6) {
        setProfile(demoProfile);
        setUser({ id: demoProfile.id, email } as User);
        localStorage.setItem('demo_user_email', email);
        return {};
      }
      return { error: 'Invalid credentials. Demo accounts: student@campus.edu, student2@campus.edu, admin@campus.edu (any 6+ char password)' };
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    if (data.user) {
      await fetchProfile(data.user.id);
    }
    return {};
  };

  const signOut = async () => {
    if (!isConfigured) {
      localStorage.removeItem('demo_user_email');
      setUser(null);
      setProfile(null);
      return;
    }
    await supabase.auth.signOut();
    setProfile(null);
    setUser(null);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return { error: 'Not authenticated' };
    if (!isConfigured) {
      setProfile({ ...profile, ...updates });
      return {};
    }
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', profile.id);
    if (error) return { error: error.message };
    setProfile({ ...profile, ...updates });
    return {};
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        isAdmin: profile?.role === 'admin',
        signUp,
        signIn,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
