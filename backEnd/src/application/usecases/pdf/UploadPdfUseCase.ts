
import { PDFDocument } from 'pdf-lib';

import { Pdf } from '../../../domain/entities/Pdf.js';
import { IPdfRepository } from '../../../domain/interfaces/repositories/IPdfRepository.js';
import { IPdfStorageService } from '../../interfaces/services/IPdfStorageService.js';
import { UploadPdfInputDTO } from '../../dtos/pdf/UploadPdfDTO.js';
import { IUploadPdfUseCase } from '../../interfaces/pdf/IUploadPdfUseCase.js';

export class UploadPdfUseCase implements IUploadPdfUseCase {
  constructor(
    private readonly pdfs: IPdfRepository,
    private readonly storage: IPdfStorageService
  ) {}

  async execute(data: UploadPdfInputDTO): Promise<Pdf> {
    const { userId, file } = data;

    if (file.mimetype !== 'application/pdf') {
      throw new Error('Only PDF files are allowed');
    }

    const document = await PDFDocument.load(file.buffer);

    const gridFsId = await this.storage.save(
      file.originalname,
      file.buffer,
      file.mimetype
    );

    return this.pdfs.create({
      userId,
      fileName: file.originalname,
      pageCount: document.getPageCount(),
      fileSize: file.buffer.length,
      gridFsId
    });
  }
}

