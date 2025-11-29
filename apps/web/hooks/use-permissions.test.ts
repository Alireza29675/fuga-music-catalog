import { renderHook } from '@testing-library/react';
import { usePermissions } from './use-permissions';
import { useAuth } from './use-auth';
import { PERMISSIONS } from '@fuga-catalog/constants';

// Mock the useAuth hook
jest.mock('./use-auth');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('usePermissions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('hasPermission', () => {
    it('should return true when user has the permission', () => {
      mockUseAuth.mockReturnValue({
        user: {
          id: 1,
          email: 'test@example.com',
          roles: ['admin'],
          permissions: [PERMISSIONS.PRODUCT_CREATE, PERMISSIONS.PRODUCT_VIEW],
        },
        isAuthenticated: true,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
      });

      const { result } = renderHook(() => usePermissions());

      expect(result.current.hasPermission(PERMISSIONS.PRODUCT_CREATE)).toBe(true);
    });

    it('should return false when user does not have the permission', () => {
      mockUseAuth.mockReturnValue({
        user: {
          id: 1,
          email: 'test@example.com',
          roles: ['viewer'],
          permissions: [PERMISSIONS.PRODUCT_VIEW],
        },
        isAuthenticated: true,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
      });

      const { result } = renderHook(() => usePermissions());

      expect(result.current.hasPermission(PERMISSIONS.PRODUCT_CREATE)).toBe(false);
    });

    it('should return false when user is not logged in', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
      });

      const { result } = renderHook(() => usePermissions());

      expect(result.current.hasPermission(PERMISSIONS.PRODUCT_CREATE)).toBe(false);
    });
  });

  describe('hasAnyPermission', () => {
    it('should return true when user has at least one of the permissions', () => {
      mockUseAuth.mockReturnValue({
        user: {
          id: 1,
          email: 'test@example.com',
          roles: ['editor'],
          permissions: [PERMISSIONS.PRODUCT_VIEW, PERMISSIONS.PRODUCT_EDIT],
        },
        isAuthenticated: true,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
      });

      const { result } = renderHook(() => usePermissions());

      expect(
        result.current.hasAnyPermission([PERMISSIONS.PRODUCT_CREATE, PERMISSIONS.PRODUCT_EDIT])
      ).toBe(true);
    });

    it('should return false when user has none of the permissions', () => {
      mockUseAuth.mockReturnValue({
        user: {
          id: 1,
          email: 'test@example.com',
          roles: ['viewer'],
          permissions: [PERMISSIONS.PRODUCT_VIEW],
        },
        isAuthenticated: true,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
      });

      const { result } = renderHook(() => usePermissions());

      expect(
        result.current.hasAnyPermission([PERMISSIONS.PRODUCT_CREATE, PERMISSIONS.PRODUCT_EDIT])
      ).toBe(false);
    });

    it('should return false when user is not logged in', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
      });

      const { result } = renderHook(() => usePermissions());

      expect(
        result.current.hasAnyPermission([PERMISSIONS.PRODUCT_CREATE, PERMISSIONS.PRODUCT_VIEW])
      ).toBe(false);
    });
  });

  describe('hasAllPermissions', () => {
    it('should return true when user has all of the permissions', () => {
      mockUseAuth.mockReturnValue({
        user: {
          id: 1,
          email: 'test@example.com',
          roles: ['admin'],
          permissions: [
            PERMISSIONS.PRODUCT_CREATE,
            PERMISSIONS.PRODUCT_VIEW,
            PERMISSIONS.PRODUCT_EDIT,
          ],
        },
        isAuthenticated: true,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
      });

      const { result } = renderHook(() => usePermissions());

      expect(
        result.current.hasAllPermissions([PERMISSIONS.PRODUCT_CREATE, PERMISSIONS.PRODUCT_VIEW])
      ).toBe(true);
    });

    it('should return false when user is missing at least one permission', () => {
      mockUseAuth.mockReturnValue({
        user: {
          id: 1,
          email: 'test@example.com',
          roles: ['editor'],
          permissions: [PERMISSIONS.PRODUCT_VIEW, PERMISSIONS.PRODUCT_EDIT],
        },
        isAuthenticated: true,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
      });

      const { result } = renderHook(() => usePermissions());

      expect(
        result.current.hasAllPermissions([PERMISSIONS.PRODUCT_CREATE, PERMISSIONS.PRODUCT_VIEW])
      ).toBe(false);
    });

    it('should return false when user is not logged in', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
      });

      const { result } = renderHook(() => usePermissions());

      expect(
        result.current.hasAllPermissions([PERMISSIONS.PRODUCT_CREATE, PERMISSIONS.PRODUCT_VIEW])
      ).toBe(false);
    });
  });

  describe('hasRole', () => {
    it('should return true when user has the role', () => {
      mockUseAuth.mockReturnValue({
        user: {
          id: 1,
          email: 'test@example.com',
          roles: ['admin', 'editor'],
          permissions: [],
        },
        isAuthenticated: true,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
      });

      const { result } = renderHook(() => usePermissions());

      expect(result.current.hasRole('admin')).toBe(true);
    });

    it('should return false when user does not have the role', () => {
      mockUseAuth.mockReturnValue({
        user: {
          id: 1,
          email: 'test@example.com',
          roles: ['viewer'],
          permissions: [],
        },
        isAuthenticated: true,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
      });

      const { result } = renderHook(() => usePermissions());

      expect(result.current.hasRole('admin')).toBe(false);
    });

    it('should return false when user is not logged in', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
      });

      const { result } = renderHook(() => usePermissions());

      expect(result.current.hasRole('admin')).toBe(false);
    });
  });

  describe('permissions and roles', () => {
    it('should return user permissions', () => {
      mockUseAuth.mockReturnValue({
        user: {
          id: 1,
          email: 'test@example.com',
          roles: ['admin'],
          permissions: [PERMISSIONS.PRODUCT_CREATE, PERMISSIONS.PRODUCT_VIEW],
        },
        isAuthenticated: true,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
      });

      const { result } = renderHook(() => usePermissions());

      expect(result.current.permissions).toEqual([PERMISSIONS.PRODUCT_CREATE, PERMISSIONS.PRODUCT_VIEW]);
    });

    it('should return empty array when user is not logged in', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
      });

      const { result } = renderHook(() => usePermissions());

      expect(result.current.permissions).toEqual([]);
      expect(result.current.roles).toEqual([]);
    });
  });
});
