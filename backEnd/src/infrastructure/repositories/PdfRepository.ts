import { IPdfRepository } from '../../domain/interfaces/repositories/IPdfRepository.js';
import { Pdf } from '../../domain/entities/Pdf.js';
import { PdfModel } from '../database/models/PdfModel.js';

export class PdfRepository implements IPdfRepository {
  async create(data: Omit<Pdf, 'id' | 'createdAt' | 'updatedAt'>): Promise<Pdf> {
    const doc = await PdfModel.create(data);
    return this.map(doc);
  }
  async findById(id: string): Promise<Pdf | null> {
    const doc = await PdfModel.findById(id).exec();
    return doc ? this.map(doc) : null;
  }
  async findByUserId(userId: string): Promise<Pdf[]> {
    const docs = await PdfModel.find({ userId }).sort({ createdAt: -1 }).exec();
    return docs.map((doc) => this.map(doc));
  }
  async delete(id: string, userId: string): Promise<boolean> {
    const result = await PdfModel.deleteOne({ _id: id, userId }).exec();
    return result.deletedCount === 1;
  }
  private map(doc: any): Pdf {
    return {
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      fileName: doc.fileName,
      pageCount: doc.pageCount,
      fileSize: doc.fileSize,
      gridFsId: doc.gridFsId.toString(),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }
}
