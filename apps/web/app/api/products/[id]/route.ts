import { NextRequest, NextResponse } from 'next/server';
import { apiRequestTyped } from '@/lib/api/server';
import { HTTP_STATUS } from '@fuga-catalog/constants';
import type {
  GetProductResponse,
  UpdateProductResponse,
  UpdateProductInput,
  DeleteProductResponse,
} from '@fuga-catalog/types';

type Params = Promise<{ id: string }>;

export async function GET(_request: NextRequest, segmentData: { params: Params }) {
  try {
    const { id } = await segmentData.params;
    const data = await apiRequestTyped<GetProductResponse>(`/v1/products/${id}`);
    return NextResponse.json(data, { status: HTTP_STATUS.OK });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
  }
}

export async function PATCH(request: NextRequest, segmentData: { params: Params }) {
  try {
    const { id } = await segmentData.params;
    const body = (await request.json()) as UpdateProductInput;

    const data = await apiRequestTyped<UpdateProductResponse>(`/v1/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });

    return NextResponse.json(data, { status: HTTP_STATUS.OK });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
  }
}

export async function DELETE(_request: NextRequest, segmentData: { params: Params }) {
  try {
    const { id } = await segmentData.params;
    await apiRequestTyped<DeleteProductResponse>(`/v1/products/${id}`, {
      method: 'DELETE',
    });

    return new NextResponse(null, { status: HTTP_STATUS.NO_CONTENT });
  } catch (error) {
    console.error('[BFF DELETE] Error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
  }
}
