'use client';

import type { PermissionKey } from '@fuga-catalog/types';
import { ReactNode } from 'react';
import { usePermissions } from '@/hooks/use-permissions';

interface PermissionGuardProps {
  permission: PermissionKey;
  children: ReactNode;
  fallback?: ReactNode;
}

export function PermissionGuard({ permission, children, fallback = null }: PermissionGuardProps) {
  const { hasPermission } = usePermissions();

  if (!hasPermission(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface AnyPermissionGuardProps {
  permissions: PermissionKey[];
  children: ReactNode;
  fallback?: ReactNode;
}

export function AnyPermissionGuard({ permissions, children, fallback = null }: AnyPermissionGuardProps) {
  const { hasAnyPermission } = usePermissions();

  if (!hasAnyPermission(permissions)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface AllPermissionsGuardProps {
  permissions: PermissionKey[];
  children: ReactNode;
  fallback?: ReactNode;
}

export function AllPermissionsGuard({ permissions, children, fallback = null }: AllPermissionsGuardProps) {
  const { hasAllPermissions } = usePermissions();

  if (!hasAllPermissions(permissions)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
