import type { SuccessResponse } from "./common";
import type { PermissionKey } from "./permissions";

export interface AuthPayload {
  userId: number;
  roles: string[];
  permissions: string[];
}

/**
 * API Requests
 */

export interface LoginInput {
  email: string;
  password: string;
}

/**
 * API Responses
 */

export interface LoginApiResponse {
  token: string;
  user: {
    id: number;
    email: string;
    roles: string[];
    permissions: PermissionKey[];
  };
}

export type LogoutApiResponse = SuccessResponse;
