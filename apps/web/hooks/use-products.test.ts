import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProducts, useCreateProduct, useDeleteProduct } from './use-products';
import { apiFetch } from '@/lib/api';
import React, { ReactNode } from 'react';

// Mock the API
jest.mock('../lib/api');

const mockApiFetch = apiFetch as jest.MockedFunction<typeof apiFetch>;

// Create a wrapper for React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('useProducts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch products successfully', async () => {
    const mockProducts = {
      products: [
        { id: 1, name: 'Product 1' },
        { id: 2, name: 'Product 2' },
      ],
    };

    mockApiFetch.mockResolvedValue(mockProducts);

    const { result } = renderHook(() => useProducts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockProducts);
    expect(mockApiFetch).toHaveBeenCalledWith('/products');
  });

  it('should handle fetch error', async () => {
    const error = new Error('Failed to fetch');
    mockApiFetch.mockRejectedValue(error);

    const { result } = renderHook(() => useProducts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(error);
  });
});

describe('useCreateProduct', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create product successfully', async () => {
    const mockProduct = {
      product: { id: 1, name: 'New Product' },
    };

    mockApiFetch.mockResolvedValue(mockProduct);

    const { result } = renderHook(() => useCreateProduct(), {
      wrapper: createWrapper(),
    });

    const productInput = {
      name: 'New Product',
      coverArtId: 1,
      contributors: [{ artistId: 1 }],
    };

    result.current.mutate(productInput);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockProduct);
    expect(mockApiFetch).toHaveBeenCalledWith('/products', {
      method: 'POST',
      body: JSON.stringify(productInput),
    });
  });

  it('should handle create error', async () => {
    const error = new Error('Failed to create');
    mockApiFetch.mockRejectedValue(error);

    const { result } = renderHook(() => useCreateProduct(), {
      wrapper: createWrapper(),
    });

    const productInput = {
      name: 'New Product',
      coverArtId: 1,
      contributors: [{ artistId: 1 }],
    };

    result.current.mutate(productInput);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(error);
  });
});

describe('useDeleteProduct', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should delete product successfully', async () => {
    const mockResponse = { success: true };
    mockApiFetch.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useDeleteProduct(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(1);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockResponse);
    expect(mockApiFetch).toHaveBeenCalledWith('/products/1', {
      method: 'DELETE',
    });
  });

  it('should handle delete error', async () => {
    const error = new Error('Failed to delete');
    mockApiFetch.mockRejectedValue(error);

    const { result } = renderHook(() => useDeleteProduct(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(1);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(error);
  });
});
