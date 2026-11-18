import { storage } from './storage';

// Small fetch wrapper for the HeritageHub API. Set EXPO_PUBLIC_API_URL if the API lives on another origin.
export const API_BASE = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/$/, '');
const KEY = 'heritagehub.token';

export const getToken = (): string | null => storage.getItem(KEY);
export const setToken = (t: string | null): void => {
  if (t) storage.setItem(KEY, t);
  else storage.removeItem(KEY);
};

export class ApiError extends Error {
  status: number;
  code: string;
  network: boolean;

  constructor(
    message: string,
    { status = 0, code = 'network', network = false }: { status?: number; code?: string; network?: boolean } = {}
  ) {
    super(message);
    this.status = status;
    this.code = code;
    this.network = network;
  }
}

export interface ApiOptions {
  method?: string;
  body?: unknown;
  token?: string | null;
  signal?: AbortSignal;
}

export async function api<T = unknown>(
  path: string,
  { method = 'GET', body, token = getToken(), signal }: ApiOptions = {}
): Promise<T> {
  if (!API_BASE && typeof window === 'undefined') {
    throw new ApiError("Can't reach the server. Your progress is still saved on this device.", {
      network: true,
    });
  }
  let res: Response;
  try {
    res = await fetch(API_BASE + path, {
      method,
      signal,
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("Can't reach the server. Your progress is still saved on this device.", {
      network: true,
    });
  }
  const json = (await res.json().catch(() => null)) as Record<string, unknown> | null;
  if (json === null) {
    throw new ApiError("The HeritageHub server isn't connected.", {
      status: res.status,
      network: true,
    });
  }
  if (!res.ok) {
    throw new ApiError((json.message as string) || `Request failed (${res.status})`, {
      status: res.status,
      code: (json.error as string) || 'http',
    });
  }
  return json as T;
}

