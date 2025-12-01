import type { CreateProductInput } from '@fuga-catalog/types';
import { z } from 'zod';

export const productFormSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  coverArtId: z.number({
    required_error: 'Cover art is required',
    invalid_type_error: 'Cover art is required',
  }),
  contributors: z
    .array(
      z.object({
        artistId: z.number(),
        contributionTypeId: z.coerce.number().optional(),
      })
    )
    .min(1, 'At least one artist is required'),
}) satisfies z.ZodType<CreateProductInput>;

export type ProductFormData = z.infer<typeof productFormSchema>;
