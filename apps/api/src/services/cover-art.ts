import { randomUUID } from 'crypto';
import type { CoverArtUploadResponse, AllowedImageFormat } from '@fuga-catalog/types';
import { ALLOWED_IMAGE_FORMATS, MAX_COVER_ART_SIZE_BYTES, ERROR_CODES } from '@fuga-catalog/constants';
import { prisma } from '../lib/prisma';
import { storage } from '../lib/storage';
import { AppError } from '../lib/errors';

export class CoverArtService {
  async upload(buffer: Buffer, mimeType: string, userId: number): Promise<CoverArtUploadResponse> {
    this.validateFile(buffer, mimeType);

    const ext = mimeType.split('/')[1];
    const filename = `${randomUUID()}.${ext}`;

    const { url, path } = await storage.upload(buffer, filename, mimeType);

    const coverArt = await prisma.coverArt.create({
      data: {
        resourceUri: url,
        providerKey: path,
        mimeType: mimeType as AllowedImageFormat,
        createdByUserId: userId,
      },
    });

    return {
      coverArtId: coverArt.id,
      publicUrl: coverArt.resourceUri,
    };
  }

  private validateFile(buffer: Buffer, mimeType: string): void {
    const allowedFormats = Object.values(ALLOWED_IMAGE_FORMATS);

    if (!allowedFormats.includes(mimeType as AllowedImageFormat)) {
      throw new AppError(
        `Invalid file type. Allowed: ${allowedFormats.join(', ')}`,
        400,
        ERROR_CODES.INVALID_FILE_TYPE
      );
    }

    if (buffer.length > MAX_COVER_ART_SIZE_BYTES) {
      const sizeInMB = MAX_COVER_ART_SIZE_BYTES / 1024 / 1024;
      throw new AppError(`File too large. Maximum: ${sizeInMB}MB`, 400, ERROR_CODES.FILE_TOO_LARGE);
    }
  }

  /**
   * We don't directly delete cover art when a product is deleted,
   * but we mark it for deletion and delete it after 30 days if it's still orphaned.
   * @param coverArtId - The ID of the cover art to delete if orphaned
   */
  async deleteIfOrphan(coverArtId: number): Promise<void> {
    const count = await prisma.product.count({
      where: {
        coverArtId,
        isDeleted: false,
      },
    });

    if (count === 0) {
      const coverArt = await prisma.coverArt.findUnique({
        where: { id: coverArtId },
      });

      if (coverArt && !coverArt.markedForDeletionAt) {
        const deletionDate = new Date();
        deletionDate.setDate(deletionDate.getDate() + 30);

        await prisma.coverArt.update({
          where: { id: coverArtId },
          data: { markedForDeletionAt: deletionDate },
        });
      }
    }
  }

  async clearDeletionMark(coverArtId: number): Promise<void> {
    await prisma.coverArt.update({
      where: { id: coverArtId },
      data: { markedForDeletionAt: null },
    });
  }

  async cleanupExpired(): Promise<number> {
    const now = new Date();

    const expiredCoverArt = await prisma.coverArt.findMany({
      where: {
        markedForDeletionAt: {
          lte: now,
        },
      },
    });

    let deletedCount = 0;
    for (const coverArt of expiredCoverArt) {
      // Double-check it's still orphaned before deleting
      const count = await prisma.product.count({
        where: {
          coverArtId: coverArt.id,
          isDeleted: false,
        },
      });

      if (count === 0) {
        try {
          await storage.delete(coverArt.providerKey);
          await prisma.coverArt.delete({ where: { id: coverArt.id } });
          deletedCount++;
        } catch (error) {
          console.error(`[CoverArtService] Failed to delete cover art ${coverArt.id}:`, error);
        }
      } else {
        console.warn(`[CoverArtService] Found a cover art ${coverArt.id} that is no longer orphaned, but had deletion mark! Clearing deletion mark...`);
        await this.clearDeletionMark(coverArt.id);
      }
    }
    return deletedCount;
  }
}
