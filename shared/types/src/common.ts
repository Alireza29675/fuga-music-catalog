import type { HTTP_STATUS, ERROR_CODES } from '@fuga-catalog/constants';

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export type HttpStatusCode = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];

export interface ApiError {
  error: string;
  code?: ErrorCode;
  details?: unknown;
}

export interface SuccessResponse {
  success: true;
}
