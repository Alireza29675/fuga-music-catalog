import { ErrorCode, HttpStatusCode } from '@fuga-catalog/types';

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: HttpStatusCode = 500,
    public code: ErrorCode = 'INTERNAL_ERROR'
  ) {
    super(message);
    this.name = 'AppError';
  }
}
