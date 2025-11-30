import { HTTP_STATUS } from '@fuga-catalog/constants';
import type { SuccessResponse } from '@fuga-catalog/types';
import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json<SuccessResponse>({ success: true }, { status: HTTP_STATUS.OK });

  response.cookies.delete('auth-token');

  return response;
}
