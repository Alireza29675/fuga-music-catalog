import { HTTP_STATUS } from '@fuga-catalog/constants';
import type { GetContributionTypesResponse } from '@fuga-catalog/types';
import { NextResponse } from 'next/server';
import { apiRequestTyped } from '@/lib/api/server';

export async function GET() {
  try {
    const data = await apiRequestTyped<GetContributionTypesResponse>('/v1/contribution-types');
    return NextResponse.json(data, { status: HTTP_STATUS.OK });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
  }
}
