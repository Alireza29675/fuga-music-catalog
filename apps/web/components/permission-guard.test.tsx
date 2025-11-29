import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { PermissionGuard, AnyPermissionGuard, AllPermissionsGuard } from './permission-guard';
import { usePermissions } from '@/hooks/use-permissions';
import { PERMISSIONS } from '@fuga-catalog/constants';

// Mock the usePermissions hook
jest.mock('../hooks/use-permissions');

const mockUsePermissions = usePermissions as jest.MockedFunction<typeof usePermissions>;

describe('PermissionGuard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children when user has the required permission', () => {
    mockUsePermissions.mockReturnValue({
      hasPermission: jest.fn().mockReturnValue(true),
      hasAnyPermission: jest.fn(),
      hasAllPermissions: jest.fn(),
      hasRole: jest.fn(),
      permissions: [PERMISSIONS.PRODUCT_CREATE],
      roles: [],
    });

    render(
      <PermissionGuard permission={PERMISSIONS.PRODUCT_CREATE}>
        <div>Protected Content</div>
      </PermissionGuard>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should not render children when user lacks the required permission', () => {
    mockUsePermissions.mockReturnValue({
      hasPermission: jest.fn().mockReturnValue(false),
      hasAnyPermission: jest.fn(),
      hasAllPermissions: jest.fn(),
      hasRole: jest.fn(),
      permissions: [],
      roles: [],
    });

    render(
      <PermissionGuard permission={PERMISSIONS.PRODUCT_CREATE}>
        <div>Protected Content</div>
      </PermissionGuard>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should render fallback when user lacks the required permission', () => {
    mockUsePermissions.mockReturnValue({
      hasPermission: jest.fn().mockReturnValue(false),
      hasAnyPermission: jest.fn(),
      hasAllPermissions: jest.fn(),
      hasRole: jest.fn(),
      permissions: [],
      roles: [],
    });

    render(
      <PermissionGuard
        permission={PERMISSIONS.PRODUCT_CREATE}
        fallback={<div>No Permission</div>}
      >
        <div>Protected Content</div>
      </PermissionGuard>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(screen.getByText('No Permission')).toBeInTheDocument();
  });
});

describe('AnyPermissionGuard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children when user has at least one permission', () => {
    mockUsePermissions.mockReturnValue({
      hasPermission: jest.fn(),
      hasAnyPermission: jest.fn().mockReturnValue(true),
      hasAllPermissions: jest.fn(),
      hasRole: jest.fn(),
      permissions: [PERMISSIONS.PRODUCT_CREATE],
      roles: [],
    });

    render(
      <AnyPermissionGuard
        permissions={[PERMISSIONS.PRODUCT_CREATE, PERMISSIONS.PRODUCT_EDIT]}
      >
        <div>Protected Content</div>
      </AnyPermissionGuard>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should not render children when user lacks all permissions', () => {
    mockUsePermissions.mockReturnValue({
      hasPermission: jest.fn(),
      hasAnyPermission: jest.fn().mockReturnValue(false),
      hasAllPermissions: jest.fn(),
      hasRole: jest.fn(),
      permissions: [],
      roles: [],
    });

    render(
      <AnyPermissionGuard
        permissions={[PERMISSIONS.PRODUCT_CREATE, PERMISSIONS.PRODUCT_EDIT]}
      >
        <div>Protected Content</div>
      </AnyPermissionGuard>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should render fallback when user lacks all permissions', () => {
    mockUsePermissions.mockReturnValue({
      hasPermission: jest.fn(),
      hasAnyPermission: jest.fn().mockReturnValue(false),
      hasAllPermissions: jest.fn(),
      hasRole: jest.fn(),
      permissions: [],
      roles: [],
    });

    render(
      <AnyPermissionGuard
        permissions={[PERMISSIONS.PRODUCT_CREATE, PERMISSIONS.PRODUCT_EDIT]}
        fallback={<div>No Permissions</div>}
      >
        <div>Protected Content</div>
      </AnyPermissionGuard>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(screen.getByText('No Permissions')).toBeInTheDocument();
  });
});

describe('AllPermissionsGuard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children when user has all required permissions', () => {
    mockUsePermissions.mockReturnValue({
      hasPermission: jest.fn(),
      hasAnyPermission: jest.fn(),
      hasAllPermissions: jest.fn().mockReturnValue(true),
      hasRole: jest.fn(),
      permissions: [PERMISSIONS.PRODUCT_CREATE, PERMISSIONS.PRODUCT_EDIT],
      roles: [],
    });

    render(
      <AllPermissionsGuard
        permissions={[PERMISSIONS.PRODUCT_CREATE, PERMISSIONS.PRODUCT_EDIT]}
      >
        <div>Protected Content</div>
      </AllPermissionsGuard>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should not render children when user lacks any permission', () => {
    mockUsePermissions.mockReturnValue({
      hasPermission: jest.fn(),
      hasAnyPermission: jest.fn(),
      hasAllPermissions: jest.fn().mockReturnValue(false),
      hasRole: jest.fn(),
      permissions: [PERMISSIONS.PRODUCT_CREATE],
      roles: [],
    });

    render(
      <AllPermissionsGuard
        permissions={[PERMISSIONS.PRODUCT_CREATE, PERMISSIONS.PRODUCT_EDIT]}
      >
        <div>Protected Content</div>
      </AllPermissionsGuard>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should render fallback when user lacks any permission', () => {
    mockUsePermissions.mockReturnValue({
      hasPermission: jest.fn(),
      hasAnyPermission: jest.fn(),
      hasAllPermissions: jest.fn().mockReturnValue(false),
      hasRole: jest.fn(),
      permissions: [PERMISSIONS.PRODUCT_CREATE],
      roles: [],
    });

    render(
      <AllPermissionsGuard
        permissions={[PERMISSIONS.PRODUCT_CREATE, PERMISSIONS.PRODUCT_EDIT]}
        fallback={<div>Missing Permissions</div>}
      >
        <div>Protected Content</div>
      </AllPermissionsGuard>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(screen.getByText('Missing Permissions')).toBeInTheDocument();
  });
});
