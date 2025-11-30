import type { AuthPayload } from '@fuga-catalog/types';

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export {};
