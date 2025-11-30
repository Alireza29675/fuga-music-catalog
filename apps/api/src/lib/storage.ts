import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import { StorageProvider } from './types';

export class SupabaseStorageProvider implements StorageProvider {
  private client: SupabaseClient;
  private bucketName: string;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('SUPABASE_URL and SUPABASE_SERVICE_KEY must be configured');
    }

    this.client = createClient(supabaseUrl, supabaseServiceKey);
    this.bucketName = process.env.SUPABASE_BUCKET_NAME || 'cover-art';
  }

  async upload(
    buffer: Buffer,
    filename: string,
    contentType: string
  ): Promise<{ url: string; path: string }> {
    const fileExtension = filename.split('.').pop() || 'jpg';
    const uniqueFilename = `${randomUUID()}.${fileExtension}`;
    const path = `covers/${uniqueFilename}`;

    console.log('Uploading to Supabase:', { bucket: this.bucketName, path, contentType, size: buffer.length });

    const { data, error } = await this.client.storage
      .from(this.bucketName)
      .upload(path, buffer, {
        contentType,
        upsert: false,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }

    console.log('Upload successful:', data);

    const { data: { publicUrl } } = this.client.storage
      .from(this.bucketName)
      .getPublicUrl(path);

    return { url: publicUrl, path };
  }

  async delete(path: string): Promise<void> {
    const { error } = await this.client.storage
      .from(this.bucketName)
      .remove([path]);

    if (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }
}

export const storage: StorageProvider = new SupabaseStorageProvider();
