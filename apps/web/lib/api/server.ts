/**
 * Server-side API (Next.js Server → API Server)
 */
import type { ApiError } from '@fuga-catalog/types';
import { cookies } from 'next/headers';
import { env } from '@/lib/env';

const API_URL = env.NEXT_PUBLIC_API_URL;

export async function apiRequest(path: string, options: RequestInit = {}): Promise<Response> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (options.body && typeof options.body === 'string') {
    headers['Content-Type'] = 'application/json';
  }

  return fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });
}

/**
 * Type-safe API request that automatically parses JSON response
 */
export async function apiRequestTyped<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await apiRequest(path, options);

  if (!response.ok) {
    const error = (await response.json().catch(() => ({ error: 'Request failed' }))) as ApiError;
    throw new Error(error.error || 'Request failed');
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function handleApiError(response: Response): Promise<{ error: string; status: number } | null> {
  if (!response.ok) {
    const error = (await response.json().catch(() => ({ error: 'Request failed' }))) as ApiError;
    return {
      error: error.error || 'Request failed',
      status: response.status,
    };
  }
  return null;
}
