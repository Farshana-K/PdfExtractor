export interface IPdfStorageService {
  save(fileName: string, buffer: Buffer, contentType: string): Promise<string>;
  get(fileId: string): Promise<{ stream: NodeJS.ReadableStream; contentType: string; fileName: string }>;
  delete(fileId: string): Promise<void>;
}
