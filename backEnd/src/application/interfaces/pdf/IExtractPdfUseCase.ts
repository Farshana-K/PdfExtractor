
import {
  ExtractPdfInputDTO,
  ExtractPdfOutputDTO
} from '../../dtos/pdf/ExtractPdfDTO.js';

export interface IExtractPdfUseCase {
  execute(data: ExtractPdfInputDTO): Promise<ExtractPdfOutputDTO>;
}

