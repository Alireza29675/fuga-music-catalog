import { NextRequest, NextResponse } from 'next/server';
import { apiRequestTyped } from '@/lib/api/server';
import { HTTP_STATUS } from '@fuga-catalog/constants';
import { type GetArtistsResponse, type CreateArtistResponse, type CreateArtistInput } from '@fuga-catalog/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');

    const url = query ? `/v1/artists?query=${encodeURIComponent(query)}` : '/v1/artists';
    const data = await apiRequestTyped<GetArtistsResponse>(url);

    return NextResponse.json(data, { status: HTTP_STATUS.OK });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateArtistInput;

    const data = await apiRequestTyped<CreateArtistResponse>('/v1/artists', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    return NextResponse.json(data, { status: HTTP_STATUS.CREATED });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
  }
}
