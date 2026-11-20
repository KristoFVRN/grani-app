export function getApiBase(): string {
  if (typeof window === 'undefined') return 'https://snepp.ru/grani-api';
  const { protocol, hostname, port, pathname } = window.location;
  // When hosted on GitHub Pages or custom domain, route API requests to production server
  if (hostname.includes('github.io') || hostname.includes('pages.dev') || hostname.includes('vercel.app') || hostname.includes('netlify.app')) {
    return 'https://snepp.ru/grani-api';
  }
  if (pathname.startsWith('/grani')) {
    return `${protocol}//${hostname}${port ? `:${port}` : ''}/grani-api`;
  }
  if (port === '8090') {
    return `${protocol}//${hostname}:8090`;
  }
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://192.168.31.102:8090';
  }
  return 'https://snepp.ru/grani-api';
}

export function resolveUploadUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  const clean = url.startsWith('/') ? url : `/${url}`;
  return `${getApiBase()}${clean}`;
}

export async function fetchSyncedState(): Promise<{ state: Record<string, unknown>; updatedAt: string | null } | null> {
  try {
    const res = await fetch(`${getApiBase()}/api/v2/state`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function pushStateKey(key: string, value: unknown): Promise<boolean> {
  try {
    const res = await fetch(`${getApiBase()}/api/v2/state/${encodeURIComponent(key)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value })
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function uploadSchoolPhoto(file: File): Promise<string | null> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${getApiBase()}/api/v2/upload`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.success && data.url) {
      return resolveUploadUrl(data.url);
    }
    return null;
  } catch {
    return null;
  }
}
