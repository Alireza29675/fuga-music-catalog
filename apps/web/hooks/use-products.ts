import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch, uploadFile } from '@/lib/api/client';
import type {
  CreateProductInput,
  UpdateProductInput,
  GetProductsResponse,
  GetProductResponse,
  CreateProductResponse,
  UpdateProductResponse,
  DeleteProductResponse,
  GetArtistsResponse,
  CreateArtistResponse,
  GetContributionTypesResponse,
  CoverArtUploadResponse,
} from '@fuga-catalog/types';

export function useProducts() {
  return useQuery<GetProductsResponse>({
    queryKey: ['products'],
    queryFn: () => apiFetch<GetProductsResponse>('/products'),
  });
}

export function useProduct(id: number) {
  return useQuery<GetProductResponse>({
    queryKey: ['products', id],
    queryFn: () => apiFetch<GetProductResponse>(`/products/${id}`),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation<CreateProductResponse, Error, CreateProductInput>({
    mutationFn: (data: CreateProductInput) =>
      apiFetch<CreateProductResponse>('/products', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation<UpdateProductResponse, Error, { id: number; data: UpdateProductInput }>({
    mutationFn: ({ id, data }: { id: number; data: UpdateProductInput }) =>
      apiFetch<UpdateProductResponse>(`/products/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation<DeleteProductResponse, Error, number>({
    mutationFn: (id: number) =>
      apiFetch<DeleteProductResponse>(`/products/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUploadCoverArt() {
  return useMutation<CoverArtUploadResponse, Error, File>({
    mutationFn: (file: File) => uploadFile('/cover-art', file),
  });
}

export function useArtists(query?: string) {
  return useQuery<GetArtistsResponse>({
    queryKey: ['artists', query],
    queryFn: () => apiFetch<GetArtistsResponse>(query ? `/artists?query=${encodeURIComponent(query)}` : '/artists'),
  });
}

export function useCreateArtist() {
  const queryClient = useQueryClient();

  return useMutation<CreateArtistResponse, Error, string>({
    mutationFn: (name: string) =>
      apiFetch<CreateArtistResponse>('/artists', {
        method: 'POST',
        body: JSON.stringify({ name }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artists'] });
    },
  });
}

export function useContributionTypes() {
  return useQuery<GetContributionTypesResponse>({
    queryKey: ['contribution-types'],
    queryFn: () => apiFetch<GetContributionTypesResponse>('/contribution-types'),
  });
}
