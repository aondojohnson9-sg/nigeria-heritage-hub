import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { api, ApiError, getToken, setToken } from '../lib/api';
import { stable, type ProgressState } from '../lib/merge';
import { AuthCtx, type AuthUser, type SyncState } from './auth';
import { useProgress } from './progress';

// Device-only fields are never sent to the server.
const syncShape = (p: ProgressState) => {
  const { settings: _s, notifsSeen: _n, ...rest } = p;
  return rest;
};
const keyOf = (p: Partial<ProgressState>) => {
  const { settings: _s, notifsSeen: _n, ...rest } = p;
  return stable(rest);
};

interface AuthResponse {
  token: string;
  user: AuthUser;
  progress: Partial<ProgressState>;
}

/** Accounts + background sync. The app is local-first: it works fully without a server or account. */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { raw, mergeIn, reset } = useProgress();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [booting, setBooting] = useState(() => !!getToken());
  const [sync, setSync] = useState<SyncState>('off');
  const [lastSync, setLastSync] = useState<number | null>(null);
  const pushed = useRef('');
  const rawRef = useRef(raw);
  useEffect(() => {
    rawRef.current = raw;
  });

  const signOut = useCallback(() => {
    setToken(null);
    setUser(null);
    setSync('off');
    pushed.current = '';
  }, []);

  const onError = useCallback(
    (e: unknown) => {
      if (e instanceof ApiError && e.status === 401) {
        signOut();
      } else {
        setSync(e instanceof ApiError && e.network ? 'offline' : 'error');
      }
    },
    [signOut]
  );

  const pull = useCallback(async () => {
    try {
      setSync('syncing');
      const { progress } = await api<{ progress: Partial<ProgressState> }>('/api/progress');
      pushed.current = keyOf(progress);
      mergeIn(progress);
      setSync('synced');
      setLastSync(Date.now());
    } catch (e) {
      onError(e);
    }
  }, [mergeIn, onError]);

  // Restore a saved session
  useEffect(() => {
    if (!getToken()) return;
    let alive = true;
    (async () => {
      try {
        const { user: u } = await api<{ user: AuthUser }>('/api/me');
        if (!alive) return;
        setUser(u);
        await pull();
      } catch (e) {
        if (alive) onError(e);
      } finally {
        if (alive) setBooting(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [pull, onError]);

  // Push local changes (debounced)
  useEffect(() => {
    if (!user) return;
    const snap = syncShape(raw);
    const key = stable(snap);
    if (key === pushed.current) return;
    const t = setTimeout(async () => {
      try {
        setSync('syncing');
        const { progress } = await api<{ progress: Partial<ProgressState> }>('/api/progress', {
          method: 'PUT',
          body: { progress: snap },
        });
        pushed.current = keyOf(progress);
        mergeIn(progress);
        setSync('synced');
        setLastSync(Date.now());
      } catch (e) {
        onError(e);
      }
    }, 1800);
    return () => clearTimeout(t);
  }, [raw, user, mergeIn, onError]);

  // Refresh when the app comes back to the foreground
  useEffect(() => {
    if (!user) return;
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') pull();
    });
    return () => sub.remove();
  }, [user, pull]);

  const accept = useCallback(
    ({ token, user: u, progress }: AuthResponse) => {
      setToken(token);
      setUser(u);
      pushed.current = keyOf(progress);
      mergeIn(progress);
      setSync('synced');
      setLastSync(Date.now());
    },
    [mergeIn]
  );

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await api<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: { email, password },
        token: null,
      });
      accept(res);
    },
    [accept]
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const res = await api<AuthResponse>('/api/auth/register', {
        method: 'POST',
        body: { name, email, password },
        token: null,
      });
      accept(res);
    },
    [accept]
  );

  const deleteAccount = useCallback(
    async (password: string) => {
      await api('/api/me', { method: 'DELETE', body: { password } });
      signOut();
    },
    [signOut]
  );

  const resetProgress = useCallback(async () => {
    if (user) await api('/api/progress', { method: 'DELETE' });
    reset();
    pushed.current = '';
  }, [user, reset]);

  return (
    <AuthCtx.Provider
      value={{
        user,
        booting,
        sync,
        lastSync,
        login,
        register,
        logout: signOut,
        deleteAccount,
        resetProgress,
        syncNow: pull,
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
}

