import type { CoverArt } from './cover-art';
import type { Artist } from './artist';
import type { ContributionType } from './contribution-type';

export interface ProductArtist {
  artist: Artist;
  contributionType: ContributionType | null;
}

export interface Product {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  coverArt: CoverArt;
  productArtists: ProductArtist[];
}

/**
 * API Requests
 */
export interface CreateProductInput {
  name: string;
  coverArtId: number;
  contributors: {
    artistId: number;
    contributionTypeId?: number;
  }[];
}

export type UpdateProductInput = Partial<CreateProductInput>;

/**
 * API Responses
 */

export type GetProductsResponse = Product[];

export type GetProductResponse = Product;

export type CreateProductResponse = Product;

export type UpdateProductResponse = Product;

export type DeleteProductResponse = void;
