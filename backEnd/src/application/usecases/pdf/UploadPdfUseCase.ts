
import { RESPONSE_MESSAGES } from '../../../shared/ResponseMessages.js';
import { HttpStatusCode } from '../../../shared/HttpStatusCode.js';
import { AppError } from '../../../shared/AppError.js';

import { PDFDocument } from 'pdf-lib';

import { Pdf } from '../../../domain/entities/Pdf.js';
import { IPdfRepository } from '../../../domain/interfaces/repositories/IPdfRepository.js';
import { IPdfStorageService } from '../../interfaces/services/IPdfStorageService.js';
import { UploadPdfInputDTO } from '../../dtos/pdf/UploadPdfDTO.js';
import { IUploadPdfUseCase } from '../../interfaces/pdf/IUploadPdfUseCase.js';

export class UploadPdfUseCase implements IUploadPdfUseCase {
  constructor(
    private readonly _pdfRepo: IPdfRepository,
    private readonly _storageService: IPdfStorageService
  ) {}

  async execute(data: UploadPdfInputDTO): Promise<Pdf> {
    const { userId, file } = data;

    if (file.mimetype !== 'application/pdf') {
      throw new AppError(
        RESPONSE_MESSAGES.PDF_ONLY,
        HttpStatusCode.BAD_REQUEST
      );
    }

    const document = await PDFDocument.load(file.buffer);

    const gridFsId = await this._storageService.save(
      file.originalname,
      file.buffer,
      file.mimetype
    );

    return this._pdfRepo.create({
      userId,
      fileName: file.originalname,
      pageCount: document.getPageCount(),
      fileSize: file.buffer.length,
      gridFsId
    });
  }
}
