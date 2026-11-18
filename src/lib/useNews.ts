import { useCallback, useEffect, useState } from 'react';
import { api } from './api';
import { storage } from './storage';

export interface NewsItem {
  id: string;
  title: string;
  summary?: string;
  source: string;
  link: string;
  publishedAt: string;
}

interface NewsCache {
  items: NewsItem[];
  updatedAt: string | null;
}

interface NewsState extends NewsCache {
  status: 'loading' | 'live' | 'cached' | 'unavailable';
}

const KEY = 'heritagehub.news.v1';

const read = (): NewsCache | null => {
  try {
    const raw = storage.getItem(KEY);
    return raw ? (JSON.parse(raw) as NewsCache) : null;
  } catch {
    return null;
  }
};

const fetchNews = () => api<{ items: NewsItem[]; updatedAt: string }>('/api/news', { token: null });

/** Live headlines from the HeritageHub server, cached on-device so they still show offline. */
export function useNews() {
  const [state, setState] = useState<NewsState>(() => {
    const c = read();
    return {
      items: c?.items || [],
      updatedAt: c?.updatedAt || null,
      status: c ? 'cached' : 'loading',
    };
  });

  const apply = useCallback((j: { items: NewsItem[]; updatedAt: string }) => {
    try {
      storage.setItem(KEY, JSON.stringify({ items: j.items, updatedAt: j.updatedAt }));
    } catch {
      /* ignore */
    }
    setState({ items: j.items, updatedAt: j.updatedAt, status: 'live' });
  }, []);

  const fail = useCallback(
    () =>
      setState((s) => ({
        ...s,
        status: s.items.length ? 'cached' : 'unavailable',
      })),
    []
  );

  useEffect(() => {
    let alive = true;
    fetchNews().then(
      (j) => {
        if (alive) apply(j);
      },
      () => {
        if (alive) fail();
      }
    );
    return () => {
      alive = false;
    };
  }, [apply, fail]);

  const refresh = useCallback(() => fetchNews().then(apply, fail), [apply, fail]);
  return { ...state, refresh };
}

