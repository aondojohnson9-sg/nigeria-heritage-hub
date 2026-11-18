import { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';

export interface ToastInput {
  emoji?: string;
  text: string;
}

export type ToastFn = (t: string | ToastInput) => void;

export const ToastCtx = createContext<ToastFn>(() => {});
export const useToast = (): ToastFn => useContext(ToastCtx);

/** Counts from 0 up to `target` with an ease-out curve. */
export function useCountUp(target: number, ms = 900): number {
  const [v, setV] = useState(0);

  useEffect(() => {
    let rafId: number | null = null;
    const t0 = Date.now();
    const step = () => {
      const k = Math.min(1, (Date.now() - t0) / ms);
      setV(Math.round(target * (1 - Math.pow(1 - k, 3))));
      if (k < 1) {
        rafId = requestAnimationFrame(step);
      }
    };
    rafId = requestAnimationFrame(step);
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [target, ms]);

  return v;
}

/** True while the browser has a network connection (always true on native when unknown). */
export function useOnline(): boolean {
  const [on, setOn] = useState(() => {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean') {
      return navigator.onLine;
    }
    return true;
  });

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    const up = () => setOn(true);
    const down = () => setOn(false);
    window.addEventListener('online', up);
    window.addEventListener('offline', down);
    return () => {
      window.removeEventListener('online', up);
      window.removeEventListener('offline', down);
    };
  }, []);

  return on;
}

