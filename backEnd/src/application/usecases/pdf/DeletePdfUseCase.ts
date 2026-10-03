
import { IPdfRepository } from '../../../domain/interfaces/repositories/IPdfRepository.js';
import { IPdfStorageService } from '../../interfaces/services/IPdfStorageService.js';
import { DeletePdfInputDTO } from '../../dtos/pdf/DeletePdfDTO.js';
import { IDeletePdfUseCase } from '../../interfaces/pdf/IDeletePdfUseCase.js';

export class DeletePdfUseCase implements IDeletePdfUseCase {
  constructor(
    private readonly pdfs: IPdfRepository,
    private readonly storage: IPdfStorageService
  ) {}

  async execute(data: DeletePdfInputDTO): Promise<void> {
    const pdf = await this.pdfs.findById(data.pdfId);

    if (!pdf || pdf.userId !== data.userId) {
      throw new Error('PDF not found');
    }

    await this.storage.delete(pdf.gridFsId);
    await this.pdfs.delete(data.pdfId, data.userId);
  }
}

