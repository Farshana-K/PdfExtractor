
import { RESPONSE_MESSAGES } from '../../../shared/ResponseMessages.js';
import { HttpStatusCode } from '../../../shared/HttpStatusCode.js';
import { AppError } from '../../../shared/AppError.js';

import { IPdfRepository } from '../../../domain/interfaces/repositories/IPdfRepository.js';
import { IPdfStorageService } from '../../interfaces/services/IPdfStorageService.js';
import {
  GetPdfInputDTO,
  GetPdfOutputDTO
} from '../../dtos/pdf/GetPdfDTO.js';
import { IGetPdfUseCase } from '../../interfaces/pdf/IGetPdfUseCase.js';

export class GetPdfUseCase implements IGetPdfUseCase {
  constructor(
    private readonly _pdfRepo: IPdfRepository,
    private readonly _storageService: IPdfStorageService
  ) {}

  async execute(data: GetPdfInputDTO): Promise<GetPdfOutputDTO> {
    const pdf = await this._pdfRepo.findById(data.pdfId);

    if (!pdf || pdf.userId !== data.userId) {
      throw new AppError(
        RESPONSE_MESSAGES.PDF_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }

    const file = await this._storageService.get(pdf.gridFsId);

    return {
      pdf,
      ...file
    };
  }
}
