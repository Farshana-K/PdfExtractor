
import { IPdfRepository } from '../../../domain/interfaces/repositories/IPdfRepository.js';
import { IPdfStorageService } from '../../interfaces/services/IPdfStorageService.js';
import {
  GetPdfInputDTO,
  GetPdfOutputDTO
} from '../../dtos/pdf/GetPdfDTO.js';
import { IGetPdfUseCase } from '../../interfaces/pdf/IGetPdfUseCase.js';

export class GetPdfUseCase implements IGetPdfUseCase {
  constructor(
    private readonly pdfs: IPdfRepository,
    private readonly storage: IPdfStorageService
  ) {}

  async execute(data: GetPdfInputDTO): Promise<GetPdfOutputDTO> {
    const pdf = await this.pdfs.findById(data.pdfId);

    if (!pdf || pdf.userId !== data.userId) {
      throw new Error('PDF not found');
    }

    const file = await this.storage.get(pdf.gridFsId);

    return {
      pdf,
      ...file
    };
  }
}

