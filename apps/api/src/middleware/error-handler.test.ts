import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { errorHandler } from './error-handler';
import { AppError } from '../lib/errors';

describe('Error Handler Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  it('should handle AppError correctly', () => {
    const error = new AppError('Test error', 404, 'NOT_FOUND');

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Test error',
      code: 'NOT_FOUND',
    });
  });

  it('should handle ZodError correctly', () => {
    const zodError = new ZodError([
      {
        code: 'invalid_type',
        expected: 'string',
        received: 'number',
        path: ['name'],
        message: 'Expected string, received number',
      },
    ]);

    errorHandler(
      zodError,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Validation failed',
      details: zodError.errors,
    });
  });

  it('should handle unknown errors with 500 status', () => {
    const error = new Error('Unknown error');
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Internal server error',
    });
    expect(consoleSpy).toHaveBeenCalledWith('Unhandled error:', error);

    consoleSpy.mockRestore();
  });

  it('should handle AppError with default values', () => {
    const error = new AppError('Default error');

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Default error',
      code: 'INTERNAL_ERROR',
    });
  });
});
