import { env } from './env';
import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/error-handler';
import { authRouter } from './routes/auth';
import { contributionTypesRouter } from './routes/contribution-types';
import { artistsRouter } from './routes/artists';
import { coverArtRouter } from './routes/cover-art';
import { productsRouter } from './routes/products';

const app = express();
const port = env.PORT;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/v1/auth', authRouter);
app.use('/v1/contribution-types', contributionTypesRouter);
app.use('/v1/artists', artistsRouter);
app.use('/v1/cover-art', coverArtRouter);
app.use('/v1/products', productsRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
