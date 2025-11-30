import type { CreateProductInput } from '@fuga-catalog/types';
import type { ProductFormData } from './productForm.schema';

export function mapFormToCreateProductInput(data: ProductFormData, coverArtId: number): CreateProductInput {
  return {
    name: data.name,
    coverArtId,
    contributors: data.contributors.map((c) => ({
      artistId: c.artistId,
      contributionTypeId:
        c.contributionTypeId && !isNaN(c.contributionTypeId) && c.contributionTypeId > 0
          ? c.contributionTypeId
          : undefined,
    })),
  };
}
