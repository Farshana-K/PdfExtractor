import { IPdfRepository } from '../../../domain/interfaces/repositories/IPdfRepository.js';
import { ListUserPdfsInputDTO } from '../../dtos/pdf/ListPdfDTO.js';
import { Pdf } from '../../../domain/entities/Pdf.js';
import { IListUserPdfsUseCase } from '../../interfaces/pdf/IListUserPdfUseCase.js';

export class ListUserPdfsUseCase implements IListUserPdfsUseCase {
  constructor(private readonly _pdfRepo: IPdfRepository) {}

  async execute(data: ListUserPdfsInputDTO): Promise<Pdf[]> {
    return this._pdfRepo.findByUserId(data.userId);
  }
}