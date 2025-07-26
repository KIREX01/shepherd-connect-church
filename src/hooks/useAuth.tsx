import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, firstName?: string, lastName?: string, role?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  userRole: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch user role when session changes
        if (session?.user) {
          setTimeout(async () => {
            try {
              const { data: roleData } = await supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', session.user.id)
                .single();
              
              setUserRole(roleData?.role || 'member');
            } catch (error) {
              console.error('Error fetching user role:', error);
              setUserRole('member');
            }
          }, 0);
        } else {
          setUserRole(null);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      // Don't expose internal error details to prevent information leakage
      if (error) {
        const sanitizedError = {
          message: error.message.includes('Invalid login credentials') 
            ? 'Invalid email or password' 
            : 'Authentication failed'
        };
        return { error: sanitizedError };
      }
      
      return { error: null };
    } catch (error) {
      return { error: { message: 'Authentication failed' } };
    }
  };

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string, role?: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      // Security fix: Force all new users to be 'member' regardless of what's passed
      // Only admins can assign elevated roles through the user management interface
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: firstName,
            last_name: lastName,
            role: 'member' // Always assign member role on signup
          }
        }
      });
      
      if (error) {
        // Don't expose internal error details
        const sanitizedError = {
          message: error.message.includes('already registered')
            ? 'An account with this email already exists'
            : 'Account creation failed'
        };
        return { error: sanitizedError };
      }
      
      return { error: null };
    } catch (error) {
      return { error: { message: 'Account creation failed' } };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    userRole,
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