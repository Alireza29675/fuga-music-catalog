import type { PERMISSIONS } from '@fuga-catalog/constants';

export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export interface PermissionEntity {
  id: number;
  key: string;
  description: string | null;
}
