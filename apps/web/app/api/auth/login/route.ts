import { NextRequest, NextResponse } from 'next/server';
import { HTTP_STATUS } from '@fuga-catalog/constants';
import type {
  LoginInput,
  LoginApiResponse,
  ApiError
} from '@fuga-catalog/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as LoginInput;

    const response = await fetch(`${API_URL}/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json() as ApiError;
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json() as LoginApiResponse;

    // Return user data to frontend without the token. (token is in httpOnly cookie)
    const nextResponse = NextResponse.json<LoginApiResponse>(
      data,
      { status: HTTP_STATUS.OK }
    );

    nextResponse.cookies.set('auth-token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return nextResponse;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: message },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
