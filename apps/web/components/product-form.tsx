'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Upload, Loader2 } from 'lucide-react';
import styled, { keyframes } from 'styled-components';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArtistCombobox } from '@/components/artist-combobox';
import { useUploadCoverArt, useArtists, useCreateArtist, useContributionTypes } from '@/hooks/use-products';
import type { Product, CreateProductInput } from '@fuga-catalog/types';

const productFormSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  coverArtId: z.number().optional(),
  contributors: z
    .array(
      z.object({
        artistId: z.number(),
        contributionTypeId: z.coerce.number().optional(),
      })
    )
    .min(1, 'At least one artist is required'),
});

type ProductFormData = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: CreateProductInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ErrorText = styled.p`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.error};
`;

const CoverArtSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const CoverPreview = styled.div`
  position: relative;
  width: 6rem;
  height: 6rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UploadArea = styled.div`
  flex: 1;
`;

const UploadLabel = styled.label`
  cursor: pointer;
  display: block;
`;

const UploadBox = styled.div`
  border: 2px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.md};
  transition: border-color ${({ theme }) => theme.transitions.fast};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const UploadText = styled.span`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const HiddenInput = styled.input`
  display: none;
`;

const ArtistSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ArtistList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ArtistRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
`;

const FlexInput = styled(Input)`
  flex: 1;
`;

const Select = styled.select`
  height: 2.25rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.inputBorder};
  background-color: ${({ theme }) => theme.colors.background};
  padding: 0 ${({ theme }) => theme.spacing.md};
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSize.sm};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:focus-visible {
    outline: none;
    border-color: ${({ theme }) => theme.colors.inputFocus};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.inputFocus};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const ErrorBox = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.errorBg};
  color: ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const FormActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: flex-end;
`;

const SpinningIcon = styled(Loader2)`
  animation: ${spin} 1s linear infinite;
  margin-right: ${({ theme }) => theme.spacing.sm};
`;

const IconWithText = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export function ProductForm({ product, onSubmit, onCancel, isLoading }: ProductFormProps) {
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(product?.coverArt?.resourceUri || null);
  const [selectedArtists, setSelectedArtists] = useState<Array<{ id: number; name: string }>>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const uploadCoverArt = useUploadCoverArt();
  const { data: artists = [] } = useArtists('');
  const createArtist = useCreateArtist();
  const { data: contributionTypes = [] } = useContributionTypes();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name || '',
      coverArtId: product?.coverArt?.id,
      contributors:
        product?.productArtists?.map((pa) => ({
          artistId: pa.artist.id,
          contributionTypeId: pa.contributionType?.id,
        })) || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contributors',
  });

  useEffect(() => {
    if (product) {
      setSelectedArtists(product.productArtists.map((pa) => pa.artist));
    }
  }, [product]);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleAddArtist = (artist: { id: number; name: string }) => {
    if (!selectedArtists.find((a) => a.id === artist.id)) {
      setSelectedArtists([...selectedArtists, artist]);
      append({ artistId: artist.id });
    }
  };

  const handleCreateArtist = async (name: string) => {
    try {
      const newArtist = await createArtist.mutateAsync(name);
      handleAddArtist(newArtist);
    } catch (error) {
      console.error('Failed to create artist:', error);
    }
  };

  const handleRemoveArtist = (index: number) => {
    setSelectedArtists(selectedArtists.filter((_, i) => i !== index));
    remove(index);
  };

  const handleFormSubmit = async (data: ProductFormData) => {
    try {
      setSubmitError(null);
      let coverArtId = data.coverArtId;

      if (coverFile) {
        const uploadResult = await uploadCoverArt.mutateAsync(coverFile);
        coverArtId = uploadResult.coverArtId;
      }

      if (!coverArtId) {
        throw new Error('Cover art is required');
      }

      onSubmit({
        name: data.name,
        coverArtId,
        contributors: data.contributors.map((c) => ({
          artistId: c.artistId,
          contributionTypeId:
            c.contributionTypeId && !isNaN(c.contributionTypeId) && c.contributionTypeId > 0
              ? c.contributionTypeId
              : undefined,
        })),
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit form';
      setSubmitError(errorMessage);
      console.error('Form submission error:', error);
    }
  };

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)}>
      <FormField>
        <Label htmlFor="name">Product Name *</Label>
        <Input id="name" {...register('name')} placeholder="Album or Single Name" disabled={isLoading} />
        {errors.name && <ErrorText>{errors.name.message}</ErrorText>}
      </FormField>

      <FormField>
        <Label htmlFor="cover">Cover Art *</Label>
        <CoverArtSection>
          {coverPreview && (
            <CoverPreview>
              <img src={coverPreview} alt="Cover preview" />
            </CoverPreview>
          )}
          <UploadArea>
            <UploadLabel htmlFor="cover">
              <UploadBox>
                <Upload size={24} color="currentColor" />
                <UploadText>{coverFile ? coverFile.name : 'Click to upload (JPEG, PNG, WebP)'}</UploadText>
              </UploadBox>
              <HiddenInput
                id="cover"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleCoverChange}
                disabled={isLoading}
              />
            </UploadLabel>
          </UploadArea>
        </CoverArtSection>
      </FormField>

      <FormField>
        <Label>Artists *</Label>
        <ArtistSection>
          <ArtistCombobox
            artists={artists}
            selectedArtists={selectedArtists}
            onSelectArtist={handleAddArtist}
            onCreateArtist={handleCreateArtist}
            isCreating={createArtist.isPending}
            disabled={isLoading}
          />

          {fields.length > 0 && (
            <ArtistList>
              {fields.map((field, index) => (
                <ArtistRow key={field.id}>
                  <FlexInput value={selectedArtists[index]?.name || ''} disabled />
                  <Select {...register(`contributors.${index}.contributionTypeId` as const)} disabled={isLoading}>
                    <option value="">Role (optional)</option>
                    {contributionTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </Select>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveArtist(index)}
                    disabled={isLoading}
                  >
                    <X size={16} />
                  </Button>
                </ArtistRow>
              ))}
            </ArtistList>
          )}
        </ArtistSection>
        {errors.contributors && <ErrorText>{errors.contributors.message}</ErrorText>}
      </FormField>

      {submitError && <ErrorBox>{submitError}</ErrorBox>}

      <FormActions>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || uploadCoverArt.isPending}>
          {isLoading || uploadCoverArt.isPending ? (
            <IconWithText>
              <SpinningIcon size={16} />
              {uploadCoverArt.isPending ? 'Uploading...' : 'Saving...'}
            </IconWithText>
          ) : product ? (
            'Update Product'
          ) : (
            'Create Product'
          )}
        </Button>
      </FormActions>
    </Form>
  );
}
