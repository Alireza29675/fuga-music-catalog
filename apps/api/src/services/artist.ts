import { ERROR_CODES } from '@fuga-catalog/constants';
import { AppError } from '../lib/errors';
import { prisma } from '../lib/prisma';

export class ArtistService {
  async search(query?: string) {
    return prisma.artist.findMany({
      where: query ? { name: { contains: query, mode: 'insensitive' } } : undefined,
      orderBy: { name: 'asc' },
      take: 50,
    });
  }

  async create(name: string, userId: number) {
    const trimmedName = name.trim();

    if (!trimmedName) {
      throw new AppError('Artist name is required', 400, ERROR_CODES.VALIDATION_ERROR);
    }

    return prisma.artist.create({
      data: {
        name: trimmedName,
        createdByUserId: userId,
      },
    });
  }
}
