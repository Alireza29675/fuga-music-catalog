import { PERMISSIONS } from '@fuga-catalog/constants';
import { Router, type Router as ExpressRouter } from 'express';
import { createProductSchema, updateProductSchema } from '../lib/validation';
import { authenticate, requirePermission } from '../middleware/auth';
import { ProductService } from '../services/product';

export const productsRouter: ExpressRouter = Router();
const productService = new ProductService();

productsRouter.use(authenticate);

productsRouter.get('/', requirePermission(PERMISSIONS.PRODUCT_VIEW), async (_req, res, next) => {
  try {
    const products = await productService.list();
    res.json(products);
  } catch (error) {
    next(error);
  }
});

productsRouter.get('/:id', requirePermission(PERMISSIONS.PRODUCT_VIEW), async (req, res, next) => {
  try {
    const product = await productService.getById(Number(req.params.id));
    res.json(product);
  } catch (error) {
    next(error);
  }
});

productsRouter.post('/', requirePermission(PERMISSIONS.PRODUCT_CREATE), async (req, res, next) => {
  try {
    const data = createProductSchema.parse(req.body);
    const product = await productService.create(data, req.user!.userId);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
});

productsRouter.patch('/:id', requirePermission(PERMISSIONS.PRODUCT_EDIT), async (req, res, next) => {
  try {
    const data = updateProductSchema.parse(req.body);
    const product = await productService.update(Number(req.params.id), data, req.user!.userId);
    res.json(product);
  } catch (error) {
    next(error);
  }
});

productsRouter.delete('/:id', requirePermission(PERMISSIONS.PRODUCT_EDIT), async (req, res, next) => {
  try {
    const productId = Number(req.params.id);
    await productService.delete(productId, req.user!.userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
