import { ProductService } from './product';
import { prisma } from '../lib/prisma';
import { AppError } from '../lib/errors';
import type { CreateProductInput } from '@fuga-catalog/types';
import { CoverArtService } from './cover-art';

// Mock dependencies
jest.mock('../lib/prisma', () => ({
  prisma: {
    product: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    productArtist: {
      deleteMany: jest.fn(),
      createMany: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

jest.mock('./cover-art');

describe('ProductService', () => {
  let service: ProductService;
  let mockCoverArtService: jest.Mocked<CoverArtService>;

  beforeEach(() => {
    mockCoverArtService = {
      clearDeletionMark: jest.fn().mockResolvedValue(undefined),
      deleteIfOrphan: jest.fn().mockResolvedValue(undefined),
    } as any;

    (CoverArtService as jest.Mock).mockImplementation(() => mockCoverArtService);

    service = new ProductService();
    jest.clearAllMocks();
  });

  describe('list', () => {
    it('should return all non-deleted products', async () => {
      const mockProducts = [
        {
          id: 1,
          name: 'Product 1',
          isDeleted: false,
          coverArt: { id: 1 },
          productArtists: [],
        },
      ];

      (prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);

      const result = await service.list();

      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: { isDeleted: false },
        include: {
          coverArt: true,
          productArtists: {
            include: {
              artist: true,
              contributionType: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockProducts);
    });
  });

  describe('getById', () => {
    it('should return product by id', async () => {
      const mockProduct = {
        id: 1,
        name: 'Test Product',
        isDeleted: false,
        coverArt: { id: 1 },
        productArtists: [],
      };

      (prisma.product.findFirst as jest.Mock).mockResolvedValue(mockProduct);

      const result = await service.getById(1);

      expect(prisma.product.findFirst).toHaveBeenCalledWith({
        where: { id: 1, isDeleted: false },
        include: {
          coverArt: true,
          productArtists: {
            include: {
              artist: true,
              contributionType: true,
            },
          },
        },
      });
      expect(result).toEqual(mockProduct);
    });

    it('should throw error if product not found', async () => {
      (prisma.product.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(service.getById(999)).rejects.toThrow(AppError);
      await expect(service.getById(999)).rejects.toMatchObject({
        message: 'Product not found',
        statusCode: 404,
        code: 'NOT_FOUND',
      });
    });
  });

  describe('create', () => {
    const validInput: CreateProductInput = {
      name: 'New Product',
      coverArtId: 1,
      contributors: [{ artistId: 1, contributionTypeId: 1 }],
    };

    it('should create a product with valid input', async () => {
      const mockProduct = {
        id: 1,
        ...validInput,
        coverArt: { id: 1 },
        productArtists: [],
      };

      (prisma.product.create as jest.Mock).mockResolvedValue(mockProduct);

      const result = await service.create(validInput, 1);

      expect(prisma.product.create).toHaveBeenCalledWith({
        data: {
          name: 'New Product',
          coverArtId: 1,
          createdByUserId: 1,
          productArtists: {
            create: [{ artistId: 1, contributionTypeId: 1 }],
          },
        },
        include: {
          coverArt: true,
          productArtists: {
            include: {
              artist: true,
              contributionType: true,
            },
          },
        },
      });
      expect(result).toEqual(mockProduct);
    });

    it('should throw error for empty name', async () => {
      const invalidInput = { ...validInput, name: '' };

      await expect(service.create(invalidInput, 1)).rejects.toThrow(AppError);
      await expect(service.create(invalidInput, 1)).rejects.toMatchObject({
        message: 'Product name is required',
        statusCode: 400,
      });
    });

    it('should throw error for missing cover art', async () => {
      const invalidInput = { ...validInput, coverArtId: 0 };

      await expect(service.create(invalidInput as any, 1)).rejects.toThrow(AppError);
    });

    it('should throw error for no contributors', async () => {
      const invalidInput = { ...validInput, contributors: [] };

      await expect(service.create(invalidInput, 1)).rejects.toThrow(AppError);
      await expect(service.create(invalidInput, 1)).rejects.toMatchObject({
        message: 'At least one artist is required',
        statusCode: 400,
      });
    });

    it('should trim product name', async () => {
      const inputWithSpaces = { ...validInput, name: '  Product Name  ' };
      (prisma.product.create as jest.Mock).mockResolvedValue({});

      await service.create(inputWithSpaces, 1);

      expect(prisma.product.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            name: 'Product Name',
          }),
        })
      );
    });
  });

  describe('delete', () => {
    it('should mark product as deleted', async () => {
      const mockProduct = {
        id: 1,
        name: 'Test',
        isDeleted: false,
        coverArt: { id: 1 },
      };

      (prisma.product.findFirst as jest.Mock).mockResolvedValue(mockProduct);
      (prisma.product.update as jest.Mock).mockResolvedValue({});

      await service.delete(1, 1);

      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          isDeleted: true,
          coverArtId: null,
        },
      });
    });
  });
});
