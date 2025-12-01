import { HttpStatusCode } from '@fuga-catalog/types';
import { AppError } from './errors';

describe('Error Classes', () => {
  describe('AppError', () => {
    it('should create an error with default values', () => {
      const error = new AppError('Test error');

      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(500);
      expect(error.code).toBe('INTERNAL_ERROR');
      expect(error.name).toBe('AppError');
      expect(error instanceof Error).toBe(true);
    });

    it('should create an error with custom status code', () => {
      const error = new AppError('Custom error', 418 as HttpStatusCode);

      expect(error.message).toBe('Custom error');
      expect(error.statusCode).toBe(418);
      expect(error.code).toBe('INTERNAL_ERROR');
    });

    it('should create an error with custom code', () => {
      const error = new AppError('Validation failed', 400, 'VALIDATION_ERROR');

      expect(error.message).toBe('Validation failed');
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('VALIDATION_ERROR');
    });

    it('should preserve stack trace', () => {
      const error = new AppError('Test error');

      expect(error.stack).toBeDefined();
    });
  });
});
