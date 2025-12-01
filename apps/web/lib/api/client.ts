/**
 * Client-side API (Browser → Next.js Routes)
 */
import type { ApiError, CoverArtUploadResponse } from '@fuga-catalog/types';

function handleUnauthorized() {
  // Clear auth state from localStorage
  const authStorage = localStorage.getItem('auth-storage');
  if (authStorage) {
    try {
      const parsed = JSON.parse(authStorage);
      parsed.state.isAuthenticated = false;
      parsed.state.user = null;
      localStorage.setItem('auth-storage', JSON.stringify(parsed));
    } catch {
      localStorage.removeItem('auth-storage');
    }
  }

  // Redirect to login if not already there
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  });

  if (!res.ok) {
    // Handle token expiration
    if (res.status === 401) {
      handleUnauthorized();
    }

    const error = (await res.json().catch(() => ({ error: 'Request failed' }))) as ApiError;
    throw new Error(error.error || 'Request failed');
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

export async function uploadFile(path: string, file: File): Promise<CoverArtUploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`/api${path}`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  if (!res.ok) {
    // Handle token expiration
    if (res.status === 401) {
      handleUnauthorized();
    }

    const error = (await res.json().catch(() => ({ error: 'Upload failed' }))) as ApiError;
    throw new Error(error.error || 'Upload failed');
  }

  return res.json() as Promise<CoverArtUploadResponse>;
}
