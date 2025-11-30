import type { PermissionKey } from '@fuga-catalog/types';
import { useAuth } from './use-auth';

export function usePermissions() {
  const { user } = useAuth();

  const hasPermission = (permission: PermissionKey): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission);
  };

  const hasAnyPermission = (permissions: PermissionKey[]): boolean => {
    if (!user) return false;
    return permissions.some((permission) => user.permissions.includes(permission));
  };

  const hasAllPermissions = (permissions: PermissionKey[]): boolean => {
    if (!user) return false;
    return permissions.every((permission) => user.permissions.includes(permission));
  };

  const hasRole = (role: string): boolean => {
    if (!user) return false;
    return user.roles.includes(role);
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    permissions: user?.permissions || [],
    roles: user?.roles || [],
  };
}
