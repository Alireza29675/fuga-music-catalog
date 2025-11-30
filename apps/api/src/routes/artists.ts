import { PERMISSIONS } from '@fuga-catalog/constants';
import { Router, type Router as ExpressRouter } from 'express';
import { createArtistSchema } from '../lib/validation';
import { authenticate, requirePermission } from '../middleware/auth';
import { ArtistService } from '../services/artist';

export const artistsRouter: ExpressRouter = Router();
const artistService = new ArtistService();

artistsRouter.use(authenticate);

artistsRouter.get('/', requirePermission(PERMISSIONS.PRODUCT_VIEW), async (req, res, next) => {
  try {
    const query = req.query.query as string | undefined;
    const artists = await artistService.search(query);
    res.json(artists);
  } catch (error) {
    next(error);
  }
});

artistsRouter.post('/', requirePermission(PERMISSIONS.PRODUCT_CREATE), async (req, res, next) => {
  try {
    const { name } = createArtistSchema.parse(req.body);
    const artist = await artistService.create(name, req.user!.userId);
    res.status(201).json(artist);
  } catch (error) {
    next(error);
  }
});
