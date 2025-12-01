import { Router, type Router as ExpressRouter } from 'express';
import { loginSchema } from '../lib/validation';
import { authenticate } from '../middleware/auth';
import { AuthService } from '../services/auth';

export const authRouter: ExpressRouter = Router();
const authService = new AuthService();

authRouter.post('/login', async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const result = await authService.login(email, password);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

authRouter.get('/me', authenticate, async (req, res, next) => {
  try {
    const result = await authService.getMe(req.user!.userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});
