import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authenticate, requirePermission } from './auth';
import { AppError } from '../lib/errors';
import type { AuthPayload } from '@fuga-catalog/types';

describe('Auth Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  const JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {};
    mockNext = jest.fn();
  });

  describe('authenticate', () => {
    it('should authenticate valid token', () => {
      const payload: AuthPayload = {
        userId: 1,
        roles: ['admin'],
        permissions: ['product:create'],
      };
      const token = jwt.sign(payload, JWT_SECRET);

      mockRequest.headers = {
        authorization: `Bearer ${token}`,
      };

      authenticate(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockRequest.user).toEqual(expect.objectContaining({
        userId: 1,
        roles: ['admin'],
        permissions: ['product:create'],
      }));
      expect(mockNext).toHaveBeenCalled();
    });

    it('should reject missing authorization header', () => {
      mockRequest.headers = {};

      expect(() =>
        authenticate(
          mockRequest as Request,
          mockResponse as Response,
          mockNext
        )
      ).toThrow(AppError);

      expect(() =>
        authenticate(
          mockRequest as Request,
          mockResponse as Response,
          mockNext
        )
      ).toThrow('Missing or invalid authorization header');
    });

    it('should reject invalid authorization format', () => {
      mockRequest.headers = {
        authorization: 'InvalidFormat token',
      };

      expect(() =>
        authenticate(
          mockRequest as Request,
          mockResponse as Response,
          mockNext
        )
      ).toThrow(AppError);
    });

    it('should reject invalid token', () => {
      mockRequest.headers = {
        authorization: 'Bearer invalid-token',
      };

      expect(() =>
        authenticate(
          mockRequest as Request,
          mockResponse as Response,
          mockNext
        )
      ).toThrow(AppError);

      expect(() =>
        authenticate(
          mockRequest as Request,
          mockResponse as Response,
          mockNext
        )
      ).toThrow('Invalid or expired token');
    });

    it('should reject expired token', () => {
      const payload: AuthPayload = {
        userId: 1,
        roles: ['admin'],
        permissions: ['product:create'],
      };
      // Create an expired token
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '-1s' });

      mockRequest.headers = {
        authorization: `Bearer ${token}`,
      };

      expect(() =>
        authenticate(
          mockRequest as Request,
          mockResponse as Response,
          mockNext
        )
      ).toThrow(AppError);
    });
  });

  describe('requirePermission', () => {
    it('should allow request with required permission', () => {
      mockRequest.user = {
        userId: 1,
        roles: ['editor'],
        permissions: ['product:create', 'product:read'],
      };

      const middleware = requirePermission('product:create' as any);
      middleware(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
    });

    it('should reject unauthenticated request', () => {
      mockRequest.user = undefined;

      const middleware = requirePermission('product:create' as any);

      expect(() =>
        middleware(
          mockRequest as Request,
          mockResponse as Response,
          mockNext
        )
      ).toThrow(AppError);

      expect(() =>
        middleware(
          mockRequest as Request,
          mockResponse as Response,
          mockNext
        )
      ).toThrow('Not authenticated');
    });

    it('should reject request without required permission', () => {
      mockRequest.user = {
        userId: 1,
        roles: ['viewer'],
        permissions: ['product:read'],
      };

      const middleware = requirePermission('product:create' as any);

      expect(() =>
        middleware(
          mockRequest as Request,
          mockResponse as Response,
          mockNext
        )
      ).toThrow(AppError);

      expect(() =>
        middleware(
          mockRequest as Request,
          mockResponse as Response,
          mockNext
        )
      ).toThrow('Insufficient permissions');
    });

    it('should handle multiple permissions correctly', () => {
      mockRequest.user = {
        userId: 1,
        roles: ['admin'],
        permissions: ['product:create', 'product:read', 'product:update'],
      };

      const middleware = requirePermission('product:update' as any);
      middleware(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
    });
  });
});
