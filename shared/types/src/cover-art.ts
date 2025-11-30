import type { ALLOWED_IMAGE_FORMATS } from '@fuga-catalog/constants';

export type AllowedImageFormat = (typeof ALLOWED_IMAGE_FORMATS)[keyof typeof ALLOWED_IMAGE_FORMATS];

export interface CoverArt {
  id: number;
  resourceUri: string;
  mimeType: AllowedImageFormat;
  uploadedAt: string;
}

/**
 * API Responses
 */

export interface CoverArtUploadResponse {
  coverArtId: number;
  publicUrl: string;
}
