
import { BaseRepository } from './BaseRepository.js';
import { IPdfRepository } from '../../domain/interfaces/repositories/IPdfRepository.js';
import { Pdf } from '../../domain/entities/Pdf.js';
import { PdfModel } from '../database/models/PdfModel.js';

type CreatePdf = Omit<Pdf, 'id' | 'createdAt' | 'updatedAt'>;

export class PdfRepository
  extends BaseRepository<Pdf, CreatePdf>
  implements IPdfRepository
{
  constructor() {
    super(PdfModel);
  }

  async findByUserId(userId: string): Promise<Pdf[]> {
    const documents = await this._model
      .find({ userId })
      .sort({ createdAt: -1 })
      .exec();

    return documents.map((document) => this.map(document));
  }

  async delete(
    id: string,
    userId?: string
  ): Promise<boolean> {
    if (!userId) {
      return false;
    }

    return this.deleteDocument({ _id: id, userId });
  }

  protected map(document: any): Pdf {
    return {
      id: document._id.toString(),
      userId: document.userId.toString(),
      fileName: document.fileName,
      pageCount: document.pageCount,
      fileSize: document.fileSize,
      gridFsId: document.gridFsId.toString(),
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }
}
