import type { LoginApiResponse, MeApiResponse } from '@fuga-catalog/types';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../env';
import { AppError } from '../lib/errors';
import { prisma } from '../lib/prisma';

const JWT_SECRET = env.JWT_SECRET;
const JWT_EXPIRES_IN = '24h';

const PERMISSIONS_INCLUDE = {
  userRoles: {
    include: {
      role: {
        include: {
          rolePermissions: {
            include: { permission: true },
          },
        },
      },
    },
  },
};

export class AuthService {
  async login(email: string, password: string): Promise<LoginApiResponse> {
    const user = await prisma.user.findUnique({
      where: { email },
      include: PERMISSIONS_INCLUDE,
    });

    if (!user || !user.isActive) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    const roles = user.userRoles.map((ur) => ur.role.name);
    const permissions = [
      ...new Set(user.userRoles.flatMap((ur) => ur.role.rolePermissions.map((rp) => rp.permission.key))),
    ];

    const token = jwt.sign({ userId: user.id, roles, permissions }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        roles,
        permissions: permissions as LoginApiResponse['user']['permissions'],
      },
    };
  }

  async getMe(userId: number): Promise<MeApiResponse> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: PERMISSIONS_INCLUDE,
    });

    if (!user || !user.isActive) {
      throw new AppError('User not found or inactive', 401, 'UNAUTHORIZED');
    }

    const roles = user.userRoles.map((ur) => ur.role.name);
    const permissions = [
      ...new Set(user.userRoles.flatMap((ur) => ur.role.rolePermissions.map((rp) => rp.permission.key))),
    ];

    return {
      id: user.id,
      email: user.email,
      roles,
      permissions: permissions as MeApiResponse['permissions'],
    };
  }
}
