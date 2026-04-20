'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { signIn as apiSignIn, signUp as apiSignUp } from '../lib/api/auth';
import {
  clearToken,
  getStoredUser,
  getToken,
  setStoredEmail,
  setStoredUser,
  setToken,
} from '../lib/token';

export interface AuthUser {
  id: string;
  email: string;
}

interface AuthContextValue {
  isSignedIn: boolean;
  isLoading: boolean;
  isGuest: boolean;
  user: AuthUser | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInAsGuest: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrating, setIsHydrating] = useState(true);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = getStoredUser();
    const token = getToken();
    if (stored && token) {
      setUser(stored);
    }
    setIsHydrating(false);
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      if (isLoading) return;
      setIsLoading(true);
      try {
        const data = await apiSignIn(email, password);
        const nextUser: AuthUser = { id: data.user.id, email: data.user.email };
        setToken(data.token);
        setStoredEmail(nextUser.email);
        setStoredUser(nextUser);
        setUser(nextUser);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading]
  );

  const signUp = useCallback(
    async (email: string, password: string) => {
      if (isLoading) return;
      setIsLoading(true);
      try {
        const data = await apiSignUp(email, password);
        const nextUser: AuthUser = { id: data.user.id, email: data.user.email };
        setToken(data.token);
        setStoredEmail(nextUser.email);
        setStoredUser(nextUser);
        setUser(nextUser);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading]
  );

  const signInAsGuest = useCallback(() => {
    const guestUser: AuthUser = { id: 'guest', email: 'guest@thesis.ai' };
    setUser(guestUser);
    setIsGuest(true);
    // No token stored — API calls will use the demo endpoint on the dashboard
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    setIsGuest(false);
    clearToken();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isSignedIn: Boolean(user),
      isLoading: isLoading || isHydrating,
      isGuest,
      user,
      signIn,
      signUp,
      signInAsGuest,
      signOut,
    }),
    [user, isLoading, isHydrating, isGuest, signIn, signUp, signInAsGuest, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
