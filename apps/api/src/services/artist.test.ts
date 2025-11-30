import { ArtistService } from './artist';
import { prisma } from '../lib/prisma';
import { AppError } from '../lib/errors';
import { ERROR_CODES } from '@fuga-catalog/constants';

// Mock Prisma
jest.mock('../lib/prisma', () => ({
  prisma: {
    artist: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe('ArtistService', () => {
  let service: ArtistService;

  beforeEach(() => {
    service = new ArtistService();
    jest.clearAllMocks();
  });

  describe('search', () => {
    it('should search artists with query', async () => {
      const mockArtists = [
        { id: 1, name: 'John Doe', createdByUserId: 1 },
        { id: 2, name: 'Jane Doe', createdByUserId: 1 },
      ];

      (prisma.artist.findMany as jest.Mock).mockResolvedValue(mockArtists);

      const result = await service.search('Doe');

      expect(prisma.artist.findMany).toHaveBeenCalledWith({
        where: { name: { contains: 'Doe', mode: 'insensitive' } },
        orderBy: { name: 'asc' },
        take: 50,
      });
      expect(result).toEqual(mockArtists);
    });

    it('should return all artists when no query provided', async () => {
      const mockArtists = [
        { id: 1, name: 'Artist 1', createdByUserId: 1 },
        { id: 2, name: 'Artist 2', createdByUserId: 1 },
      ];

      (prisma.artist.findMany as jest.Mock).mockResolvedValue(mockArtists);

      const result = await service.search();

      expect(prisma.artist.findMany).toHaveBeenCalledWith({
        where: undefined,
        orderBy: { name: 'asc' },
        take: 50,
      });
      expect(result).toEqual(mockArtists);
    });

    it('should limit results to 50 artists', async () => {
      await service.search('test');

      expect(prisma.artist.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 50 }));
    });
  });

  describe('create', () => {
    it('should create an artist with valid name', async () => {
      const mockArtist = { id: 1, name: 'New Artist', createdByUserId: 1 };
      (prisma.artist.create as jest.Mock).mockResolvedValue(mockArtist);

      const result = await service.create('New Artist', 1);

      expect(prisma.artist.create).toHaveBeenCalledWith({
        data: {
          name: 'New Artist',
          createdByUserId: 1,
        },
      });
      expect(result).toEqual(mockArtist);
    });

    it('should trim whitespace from artist name', async () => {
      const mockArtist = { id: 1, name: 'Trimmed Name', createdByUserId: 1 };
      (prisma.artist.create as jest.Mock).mockResolvedValue(mockArtist);

      await service.create('  Trimmed Name  ', 1);

      expect(prisma.artist.create).toHaveBeenCalledWith({
        data: {
          name: 'Trimmed Name',
          createdByUserId: 1,
        },
      });
    });

    it('should throw error for empty name', async () => {
      await expect(service.create('', 1)).rejects.toThrow(AppError);
      await expect(service.create('', 1)).rejects.toMatchObject({
        message: 'Artist name is required',
        statusCode: 400,
        code: ERROR_CODES.VALIDATION_ERROR,
      });
    });

    it('should throw error for whitespace-only name', async () => {
      await expect(service.create('   ', 1)).rejects.toThrow(AppError);
    });
  });
});
