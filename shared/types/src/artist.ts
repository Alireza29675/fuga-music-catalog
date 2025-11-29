export interface Artist {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * API Requests
 */
export interface CreateArtistInput {
  name: string;
}

/**
 * API Responses
 */
export type GetArtistsResponse = Artist[];

export type CreateArtistResponse = Artist;
