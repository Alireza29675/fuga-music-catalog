import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuth } from './use-auth';
import { apiFetch } from '@/lib/api/client';

jest.mock('@/lib/api/client');

const mockApiFetch = apiFetch as jest.MockedFunction<typeof apiFetch>;

describe('useAuth', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    useAuth.setState({
      isAuthenticated: false,
      isLoading: false,
      user: null,
    });
  });

  it('should have initial state', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.user).toBe(null);
  });

  it('should login successfully', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      roles: ['user'],
      permissions: ['products:read'],
    };

    mockApiFetch.mockResolvedValueOnce({ user: mockUser });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    expect(mockApiFetch).toHaveBeenCalledWith('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
      }),
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.user).toEqual(mockUser);
  });

  it('should set loading state during login', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      roles: ['user'],
      permissions: ['products:read'],
    };

    let resolveLogin: (value: any) => void;
    const loginPromise = new Promise((resolve) => {
      resolveLogin = resolve;
    });
    mockApiFetch.mockReturnValueOnce(loginPromise as any);

    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.login({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      resolveLogin!({ user: mockUser });
      await loginPromise;
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('should handle login failure', async () => {
    mockApiFetch.mockRejectedValueOnce(new Error('Invalid credentials'));

    const { result } = renderHook(() => useAuth());

    await expect(async () => {
      await act(async () => {
        await result.current.login({
          email: 'test@example.com',
          password: 'wrongpassword',
        });
      });
    }).rejects.toThrow('Invalid credentials');

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
  });

  it('should logout successfully', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      roles: ['user'],
      permissions: ['products:read'],
    };

    useAuth.setState({
      isAuthenticated: true,
      user: mockUser,
      isLoading: false,
    });

    mockApiFetch.mockResolvedValueOnce({ success: true });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.logout();
    });

    expect(mockApiFetch).toHaveBeenCalledWith('/auth/logout', {
      method: 'POST',
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
  });

  it('should log error if logout API call fails but not clear state', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      roles: ['user'],
      permissions: ['products:read'],
    };

    mockApiFetch.mockRejectedValueOnce(new Error('Network error'));
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    const { result } = renderHook(() => useAuth());

    act(() => {
      useAuth.setState({
        isAuthenticated: true,
        user: mockUser,
        isLoading: false,
      });
    });

    await act(async () => {
      await result.current.logout();
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith('Logout failed:', expect.any(Error));

    // State should NOT be cleared when logout fails
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);

    consoleErrorSpy.mockRestore();
  });

  it('should persist auth state to localStorage', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      roles: ['user'],
      permissions: ['products:read'],
    };

    mockApiFetch.mockResolvedValueOnce({ user: mockUser });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    const stored = localStorage.getItem('auth-storage');
    expect(stored).toBeTruthy();
    const parsedStored = JSON.parse(stored!);
    expect(parsedStored.state.isAuthenticated).toBe(true);
    expect(parsedStored.state.user).toEqual(mockUser);
  });
});
