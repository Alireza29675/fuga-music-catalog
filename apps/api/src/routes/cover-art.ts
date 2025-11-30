import { Router, type Router as ExpressRouter } from 'express';
import multer from 'multer';
import { ALLOWED_IMAGE_FORMATS, MAX_COVER_ART_SIZE_BYTES, ERROR_CODES, PERMISSIONS } from '@fuga-catalog/constants';
import { CoverArtService } from '../services/cover-art';
import { authenticate, requirePermission } from '../middleware/auth';
import { AppError } from '../lib/errors';

export const coverArtRouter: ExpressRouter = Router();
const coverArtService = new CoverArtService();

const allowedFormats = Object.values(ALLOWED_IMAGE_FORMATS);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_COVER_ART_SIZE_BYTES },
  fileFilter: (_req, file, cb) => {
    if (allowedFormats.includes(file.mimetype as any)) {
      cb(null, true);
    } else {
      cb(new AppError(`Invalid file type. Allowed: ${allowedFormats.join(', ')}`, 400, ERROR_CODES.INVALID_FILE_TYPE));
    }
  },
});

coverArtRouter.use(authenticate);

coverArtRouter.post(
  '/',
  requirePermission(PERMISSIONS.PRODUCT_CREATE),
  upload.single('file'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        throw new AppError('No file uploaded', 400, 'MISSING_FILE');
      }
      const result = await coverArtService.upload(req.file.buffer, req.file.mimetype, req.user!.userId);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
);
