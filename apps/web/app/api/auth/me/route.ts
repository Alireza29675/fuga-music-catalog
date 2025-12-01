import { HTTP_STATUS } from '@fuga-catalog/constants';
import type { MeApiResponse, ApiError } from '@fuga-catalog/types';
import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env';

const API_URL = env.NEXT_PUBLIC_API_URL;

export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth-token')?.value;

    if (!authToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: HTTP_STATUS.UNAUTHORIZED });
    }

    const response = await fetch(`${API_URL}/v1/auth/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      const error = (await response.json()) as ApiError;
      return NextResponse.json(error, { status: response.status });
    }

    const data = (await response.json()) as MeApiResponse;
    return NextResponse.json<MeApiResponse>(data, { status: HTTP_STATUS.OK });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
  }
}
