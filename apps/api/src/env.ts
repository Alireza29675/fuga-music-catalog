import { config } from 'dotenv';
import { resolve } from 'path';
import { z } from 'zod';

config({ path: resolve(__dirname, '../../../.env') });

const envSchema = z.object({
  // Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).optional().default('development'),

  // Database
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),

  // JWT
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),

  // Supabase Storage
  SUPABASE_URL: z.string().url('SUPABASE_URL must be a valid URL'),
  SUPABASE_SERVICE_KEY: z.string().min(1, 'SUPABASE_SERVICE_KEY is required'),
  SUPABASE_BUCKET_NAME: z.string().default('cover-art'),

  // Server
  PORT: z.string().default('4000').transform(Number),

  // CORS
  CORS_ORIGIN: z.string().url('CORS_ORIGIN must be a valid URL'),
});

const parseResult = envSchema.safeParse(process.env);

if (!parseResult.success) {
  console.error('❌ Invalid environment variables:');
  console.error(JSON.stringify(parseResult.error.format(), null, 2));
  process.exit(1);
}

export const env = parseResult.data;

export type Env = z.infer<typeof envSchema>;
