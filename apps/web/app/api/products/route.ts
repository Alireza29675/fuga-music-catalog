import { NextRequest, NextResponse } from 'next/server';
import { apiRequestTyped } from '@/lib/api/server';
import { HTTP_STATUS } from '@fuga-catalog/constants';
import type {
  GetProductsResponse,
  CreateProductResponse,
  CreateProductInput
} from '@fuga-catalog/types';

export async function GET() {
  try {
    const data = await apiRequestTyped<GetProductsResponse>('/v1/products');
    return NextResponse.json(data, { status: HTTP_STATUS.OK });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: message },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as CreateProductInput;

    const data = await apiRequestTyped<CreateProductResponse>('/v1/products', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    return NextResponse.json(data, { status: HTTP_STATUS.CREATED });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: message },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
