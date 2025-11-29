import type { CreateProductInput, UpdateProductInput } from '@fuga-catalog/types';
import { prisma } from '../lib/prisma';
import { AppError } from '../lib/errors';
import { CoverArtService } from './cover-art';

export class ProductService {
  private coverArtService = new CoverArtService();

  async list() {
    return prisma.product.findMany({
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
  }

  async getById(id: number) {
    const product = await prisma.product.findFirst({
      where: { id, isDeleted: false },
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

    if (!product) {
      throw new AppError('Product not found', 404, 'NOT_FOUND');
    }

    return product;
  }

  async create(input: CreateProductInput, userId: number) {
    this.validateProductInput(input);

    // Clear deletion mark if cover art was marked for deletion
    if (input.coverArtId) {
      await this.coverArtService.clearDeletionMark(input.coverArtId);
    }

    return prisma.product.create({
      data: {
        name: input.name.trim(),
        coverArtId: input.coverArtId,
        createdByUserId: userId,
        productArtists: {
          create: input.contributors.map((c) => ({
            artistId: c.artistId,
            contributionTypeId: c.contributionTypeId || undefined,
          })),
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
  }

  private validateProductInput(input: CreateProductInput): void {
    if (!input.name || !input.name.trim()) {
      throw new AppError('Product name is required', 400, 'VALIDATION_ERROR');
    }

    if (!input.coverArtId) {
      throw new AppError('Cover art is required', 400, 'VALIDATION_ERROR');
    }

    if (!input.contributors || input.contributors.length === 0) {
      throw new AppError('At least one artist is required', 400, 'VALIDATION_ERROR');
    }
  }

  async update(id: number, input: UpdateProductInput, _userId: number) {
    const existing = await this.getById(id);
    const oldCoverArtId = existing.coverArtId;

    // Clear deletion mark if cover art was marked for deletion
    if (input.coverArtId) {
      await this.coverArtService.clearDeletionMark(input.coverArtId);
    }

    const product = await prisma.$transaction(async (tx) => {
      if (input.contributors) {
        await tx.productArtist.deleteMany({ where: { productId: id } });
        await tx.productArtist.createMany({
          data: input.contributors.map((c) => ({
            productId: id,
            artistId: c.artistId,
            contributionTypeId: c.contributionTypeId || undefined,
          })),
        });
      }

      return tx.product.update({
        where: { id },
        data: {
          name: input.name,
          coverArtId: input.coverArtId,
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
    });

    if (input.coverArtId && oldCoverArtId && oldCoverArtId !== input.coverArtId) {
      await this.coverArtService.deleteIfOrphan(oldCoverArtId);
    }

    return product;
  }

  async delete(id: number, _userId: number): Promise<void> {
    const existing = await this.getById(id);
    const coverArtId = existing.coverArt?.id;

    await prisma.product.update({
      where: { id },
      data: {
        isDeleted: true,
        coverArtId: null,
      },
    });

    if (coverArtId) {
      await this.coverArtService.deleteIfOrphan(coverArtId);
    }
  }
}
