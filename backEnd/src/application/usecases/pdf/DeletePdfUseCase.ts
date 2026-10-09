
import { RESPONSE_MESSAGES } from '../../../shared/ResponseMessages.js';
import { HttpStatusCode } from '../../../shared/HttpStatusCode.js';
import { AppError } from '../../../shared/AppError.js';

import { IPdfRepository } from '../../../domain/interfaces/repositories/IPdfRepository.js';
import { IPdfStorageService } from '../../interfaces/services/IPdfStorageService.js';
import { DeletePdfInputDTO } from '../../dtos/pdf/DeletePdfDTO.js';
import { IDeletePdfUseCase } from '../../interfaces/pdf/IDeletePdfUseCase.js';

export class DeletePdfUseCase implements IDeletePdfUseCase {
  constructor(
    private readonly _pdfRepo: IPdfRepository,
    private readonly _storageService: IPdfStorageService
  ) {}

  async execute(data: DeletePdfInputDTO): Promise<void> {
    const pdf = await this._pdfRepo.findById(data.pdfId);

    if (!pdf || pdf.userId !== data.userId) {
      throw new AppError(
        RESPONSE_MESSAGES.PDF_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }

    await this._storageService.delete(pdf.gridFsId);
    await this._pdfRepo.delete(data.pdfId, data.userId);
  }
}
