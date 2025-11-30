export interface StorageProvider {
  upload(buffer: Buffer, filename: string, contentType: string): Promise<{ url: string; path: string }>;
  delete(path: string): Promise<void>;
}
