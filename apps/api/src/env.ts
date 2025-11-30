import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables before any other modules
config({ path: resolve(__dirname, '../../../.env') });
