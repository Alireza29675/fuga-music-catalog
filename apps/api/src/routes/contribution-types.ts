import { PERMISSIONS } from '@fuga-catalog/constants';
import { Router, type Router as ExpressRouter } from 'express';
import { authenticate, requirePermission } from '../middleware/auth';
import { ContributionTypeService } from '../services/contribution-type';

export const contributionTypesRouter: ExpressRouter = Router();
const contributionTypeService = new ContributionTypeService();

contributionTypesRouter.use(authenticate);

contributionTypesRouter.get('/', requirePermission(PERMISSIONS.PRODUCT_VIEW), async (_req, res, next) => {
  try {
    const types = await contributionTypeService.list();
    res.json(types);
  } catch (error) {
    next(error);
  }
});
