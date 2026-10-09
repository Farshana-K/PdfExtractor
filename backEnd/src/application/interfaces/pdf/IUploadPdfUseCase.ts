import { Pdf } from "../../../domain/entities/Pdf.js";
import { UploadPdfInputDTO } from "../../dtos/pdf/UploadPdfDTO.js";


export interface IUploadPdfUseCase {
  execute(data: UploadPdfInputDTO): Promise<Pdf>;
}
