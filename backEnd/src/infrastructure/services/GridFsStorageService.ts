import { RESPONSE_MESSAGES } from '../../shared/ResponseMessages.js';
import mongoose from 'mongoose';
import { GridFSBucket, ObjectId } from 'mongodb';
import { Readable } from 'node:stream';
import { IPdfStorageService } from '../../application/interfaces/services/IPdfStorageService.js';

export class GridFsStorageService implements IPdfStorageService {
  private bucket(): GridFSBucket {
    const db = mongoose.connection.db;
    if (!db) throw new Error(RESPONSE_MESSAGES.DATABASE_NOT_CONNECTED);
    return new GridFSBucket(db, { bucketName: 'pdfFiles' });
  }

  async save(fileName: string, buffer: Buffer, contentType: string): Promise<string> {
    const id = new ObjectId();
    const upload = this.bucket().openUploadStreamWithId(id, fileName, {
      metadata: { contentType }
    });
    await new Promise<void>((resolve, reject) => {
      Readable.from(buffer).pipe(upload).on('finish', () => resolve()).on('error', reject);
    });
    return id.toString();
  }

  async get(fileId: string) {
    const id = new ObjectId(fileId);
    const files = await this.bucket().find({ _id: id }).toArray();
    if (!files.length) throw new Error(RESPONSE_MESSAGES.STORED_PDF_NOT_FOUND);
    return {
      stream: this.bucket().openDownloadStream(id),
      contentType: files[0].metadata?.contentType || 'application/pdf',
      fileName: files[0].filename
    };
  }

  async delete(fileId: string) {
    await this.bucket().delete(new ObjectId(fileId));
  }
}
