import { Platform, Share } from 'react-native';

/** Share via the native sheet; fall back to the clipboard. Resolves to "shared" | "copied" | "cancelled" | "failed". */
export async function shareText({
  title,
  text,
  url,
}: {
  title?: string;
  text: string;
  url?: string;
}): Promise<'shared' | 'copied' | 'cancelled' | 'failed'> {
  const full = url ? `${text}\n${url}` : text;

  if (Platform.OS !== 'web') {
    try {
      const result = await Share.share({
        title,
        message: full,
        url,
      });
      if (result.action === Share.dismissedAction) return 'cancelled';
      return 'shared';
    } catch {
      return 'failed';
    }
  }

  try {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      await navigator.share({ title, text, url });
      return 'shared';
    }
  } catch (e: unknown) {
    if ((e as { name?: string })?.name === 'AbortError') return 'cancelled';
  }

  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(full);
      return 'copied';
    }
  } catch {
    /* ignore */
  }
  return 'failed';
}

