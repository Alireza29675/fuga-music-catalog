import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import { StorageProvider } from './types';
import { env } from '../env';

export class SupabaseStorageProvider implements StorageProvider {
  private client: SupabaseClient;
  private bucketName: string;

  constructor() {
    this.client = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);
    this.bucketName = env.SUPABASE_BUCKET_NAME;
  }

  async upload(buffer: Buffer, filename: string, contentType: string): Promise<{ url: string; path: string }> {
    const fileExtension = filename.split('.').pop() || 'jpg';
    const uniqueFilename = `${randomUUID()}.${fileExtension}`;
    const path = `covers/${uniqueFilename}`;

    console.log('Uploading to Supabase:', {
      bucket: this.bucketName,
      path,
      contentType,
      size: buffer.length,
    });

    const { data, error } = await this.client.storage.from(this.bucketName).upload(path, buffer, {
      contentType,
      upsert: false,
    });

    if (error) {
      console.error('Supabase upload error:', error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }

    console.log('Upload successful:', data);

    const {
      data: { publicUrl },
    } = this.client.storage.from(this.bucketName).getPublicUrl(path);

    return { url: publicUrl, path };
  }

  async delete(path: string): Promise<void> {
    const { error } = await this.client.storage.from(this.bucketName).remove([path]);

    if (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }
}

export const storage: StorageProvider = new SupabaseStorageProvider();
