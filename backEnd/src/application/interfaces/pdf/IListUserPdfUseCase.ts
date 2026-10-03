
import { Pdf } from '../../../domain/entities/Pdf.js';
import { ListUserPdfsInputDTO } from '../../dtos/pdf/ListPdfDTO.js';

export interface IListUserPdfsUseCase {
  execute(data: ListUserPdfsInputDTO): Promise<Pdf[]>;
}

