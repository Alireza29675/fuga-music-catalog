import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { HTTP_STATUS } from '@fuga-catalog/constants';
import type { CoverArtUploadResponse, ApiError } from '@fuga-catalog/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    const formData = await request.formData();

    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/v1/cover-art`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = (await response.json()) as ApiError;
      return NextResponse.json(error, { status: response.status });
    }

    const data = (await response.json()) as CoverArtUploadResponse;
    return NextResponse.json(data, { status: HTTP_STATUS.CREATED });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
  }
}
