import type { ApiError, CoverArtUploadResponse } from '@fuga-catalog/types';

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' })) as ApiError;
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
    const error = await res.json().catch(() => ({ error: 'Upload failed' })) as ApiError;
    throw new Error(error.error || 'Upload failed');
  }

  return res.json() as Promise<CoverArtUploadResponse>;
}
