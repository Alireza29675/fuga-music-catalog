import type { ERROR_CODES } from '@fuga-catalog/constants';

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];

export interface ApiError {
  error: string;
  code?: ErrorCode;
  details?: unknown;
}

export interface SuccessResponse {
  success: true;
}
