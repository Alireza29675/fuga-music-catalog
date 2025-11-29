import { z } from 'zod';

export const contributorSchema = z.object({
  artistId: z.number(),
  contributionTypeId: z.number().optional(),
});

export const createProductSchema = z.object({
  name: z.string().min(1),
  coverArtId: z.number(),
  contributors: z.array(contributorSchema),
});

export const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  coverArtId: z.number().optional(),
  contributors: z.array(contributorSchema).optional(),
});

export const createArtistSchema = z.object({
  name: z.string().min(1),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
