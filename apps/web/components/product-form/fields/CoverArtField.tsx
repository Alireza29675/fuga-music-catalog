import { ALLOWED_IMAGE_FORMATS } from '@fuga-catalog/constants';
import { Upload } from 'lucide-react';
import type { ChangeEvent } from 'react';
import * as S from '../productForm.styles';
import { FormField, ErrorText } from '@/components/ui/form';
import { Label } from '@/components/ui/label';

export interface CoverArtFieldProps {
  preview: string | null;
  fileName?: string;
  isLoading: boolean;
  isUploading?: boolean;
  error?: string;
  onChange: (file: File | null) => void;
}

export function CoverArtField({
  preview,
  fileName,
  isLoading,
  isUploading = false,
  error,
  onChange,
}: CoverArtFieldProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(file);
  };

  return (
    <FormField>
      <Label htmlFor="cover">Cover Art *</Label>
      <S.CoverArtSection>
        {preview && (
          <S.CoverPreview>
            <img src={preview} alt="Cover preview" />
          </S.CoverPreview>
        )}
        <S.UploadArea>
          <S.UploadLabel htmlFor="cover">
            <S.UploadBox>
              <Upload size={24} color="currentColor" />
              <S.UploadText>
                {isUploading ? 'Uploading...' : fileName || 'Click to upload (JPEG, PNG, WebP)'}
              </S.UploadText>
            </S.UploadBox>
            <S.HiddenInput
              id="cover"
              type="file"
              accept={Object.values(ALLOWED_IMAGE_FORMATS).join(',')}
              onChange={handleChange}
              disabled={isLoading || isUploading}
            />
          </S.UploadLabel>
        </S.UploadArea>
      </S.CoverArtSection>
      {error && <ErrorText>{error}</ErrorText>}
    </FormField>
  );
}
