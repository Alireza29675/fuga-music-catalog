import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiFetch } from '@/lib/api';
import type { LoginInput, LoginApiResponse, SuccessResponse } from '@fuga-catalog/types';

interface AuthUser {
  id: number;
  email: string;
  roles: string[];
  permissions: string[];
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  login: (credentials: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isLoading: false,
      user: null,

      login: async (credentials: LoginInput) => {
        set({ isLoading: true });
        try {
          const response = await apiFetch<LoginApiResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
          });
          set({
            isAuthenticated: true,
            isLoading: false,
            user: response.user,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await apiFetch<SuccessResponse>('/auth/logout', {
            method: 'POST',
          });
          set({ isAuthenticated: false, user: null });
        } catch (error) {
          console.error('Logout failed:', error);
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);
