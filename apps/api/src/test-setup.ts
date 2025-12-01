// Test setup file

// Mock environment vars
process.env.JWT_SECRET = 'test-secret';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_SERVICE_KEY = 'test-service-key';
process.env.SUPABASE_BUCKET_NAME = 'test-bucket';
process.env.CORS_ORIGIN = 'http://localhost:3000';
