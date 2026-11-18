import { createContext, useContext } from 'react';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export type SyncState = 'off' | 'idle' | 'syncing' | 'synced' | 'offline' | 'error';

export interface AuthContextValue {
  user: AuthUser | null;
  booting: boolean;
  sync: SyncState;
  lastSync: number | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  deleteAccount: (password: string) => Promise<void>;
  resetProgress: () => Promise<void>;
  syncNow: () => Promise<void>;
}

export const AuthCtx = createContext<AuthContextValue | null>(null);

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

