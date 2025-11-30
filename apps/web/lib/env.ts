import { z } from 'zod';

const envSchema = z.object({
  // Next.js public variables
  NEXT_PUBLIC_API_URL: z.string().url('NEXT_PUBLIC_API_URL must be a valid URL'),

  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).optional().default('development'),
});

const parseResult = envSchema.safeParse(process.env);

if (!parseResult.success) {
  console.error('❌ Invalid environment variables:');
  console.error(JSON.stringify(parseResult.error.format(), null, 2));
  throw new Error('Invalid environment variables');
}

export const env = parseResult.data;

export type Env = z.infer<typeof envSchema>;
