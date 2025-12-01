'use client';

import type { Product, CreateProductInput } from '@fuga-catalog/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ContributorsField } from './fields/ContributorsField';
import { CoverArtField } from './fields/CoverArtField';
import { mapFormToCreateProductInput } from './productForm.mappers';
import { productFormSchema, type ProductFormData } from './productForm.schema';
import * as S from './productForm.styles';
import { Button } from '@/components/ui/button';
import { Form, FormField, ErrorBox, FormActions, ErrorText } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUploadCoverArt, useArtists, useCreateArtist, useContributionTypes } from '@/hooks/use-products';

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: CreateProductInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ProductForm({ product, onSubmit, onCancel, isLoading }: ProductFormProps) {
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(product?.coverArt?.resourceUri || null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const uploadCoverArt = useUploadCoverArt();
  const { data: artists = [] } = useArtists('');

  const createArtist = useCreateArtist();
  const { data: contributionTypes = [] } = useContributionTypes();

  const initialContributors = useMemo(
    () =>
      product?.productArtists?.map((pa) => ({
        artistId: pa.artist.id,
        contributionTypeId: pa.contributionType?.id,
      })) || [],
    [product]
  );

  const initialArtists = useMemo(() => product?.productArtists?.map((pa) => pa.artist) || [], [product]);

  const formMethods = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name || '',
      coverArtId: product?.coverArt?.id,
      contributors: initialContributors,
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = formMethods;

  useEffect(() => {
    if (product?.coverArt?.resourceUri) {
      setCoverPreview(product.coverArt.resourceUri);
    }
  }, [product]);

  const handleCoverChange = async (file: File | null) => {
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));

      try {
        const uploadResult = await uploadCoverArt.mutateAsync(file);
        formMethods.setValue('coverArtId', uploadResult.coverArtId);
      } catch (error) {
        console.error('Failed to upload cover art:', error);
        setSubmitError(error instanceof Error ? error.message : 'Failed to upload cover art');
        setCoverFile(null);
        setCoverPreview(product?.coverArt?.resourceUri || null);
      }
      return;
    }
    setCoverFile(null);
    setCoverPreview(product?.coverArt?.resourceUri || null);
    formMethods.setValue('coverArtId', undefined!);
  };

  const handleCreateArtist = async (name: string) => {
    try {
      const newArtist = await createArtist.mutateAsync(name);
      return newArtist;
    } catch (error) {
      console.error('Failed to create artist:', error);
      throw error;
    }
  };

  const handleFormSubmit = async (data: ProductFormData) => {
    try {
      setSubmitError(null);

      if (!data.coverArtId) {
        throw new Error('Cover art is required');
      }

      onSubmit(mapFormToCreateProductInput(data, data.coverArtId));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit form';
      setSubmitError(errorMessage);
      console.error('Form submission error:', error);
    }
  };

  return (
    <FormProvider {...formMethods}>
      <Form onSubmit={handleSubmit(handleFormSubmit)}>
        <FormField>
          <Label htmlFor="name">Product Name *</Label>
          <Input id="name" {...register('name')} placeholder="Album or Single Name" disabled={isLoading} />
          {errors.name && <ErrorText>{errors.name.message}</ErrorText>}
        </FormField>

        <CoverArtField
          preview={coverPreview}
          fileName={coverFile?.name}
          isLoading={isLoading || false}
          isUploading={uploadCoverArt.isPending}
          error={errors.coverArtId?.message}
          onChange={handleCoverChange}
        />

        <ContributorsField
          artists={artists}
          contributionTypes={contributionTypes}
          initialArtists={initialArtists}
          isLoading={isLoading || false}
          isCreatingArtist={createArtist.isPending}
          onCreateArtist={handleCreateArtist}
        />

        {submitError && <ErrorBox>{submitError}</ErrorBox>}

        <FormActions>
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || uploadCoverArt.isPending}>
            {isLoading || uploadCoverArt.isPending ? (
              <S.IconWithText>
                <S.SpinningIcon size={16} />
                {uploadCoverArt.isPending ? 'Uploading...' : 'Saving...'}
              </S.IconWithText>
            ) : product ? (
              'Update Product'
            ) : (
              'Create Product'
            )}
          </Button>
        </FormActions>
      </Form>
    </FormProvider>
  );
}
