'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';

/**
 * AuthInitializer validates the auth token on app load.
 * This ensures client-side state stays in sync with server-side token validity.
 */
export function AuthInitializer() {
  const pathname = usePathname();
  const { isAuthenticated, validateToken } = useAuth();

  useEffect(() => {
    // Only validate if user is authenticated and not on login page
    if (isAuthenticated && pathname !== '/login') {
      validateToken();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
