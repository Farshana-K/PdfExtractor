import { DeletePdfInputDTO } from "../../dtos/pdf/DeletePdfDTO.js";

export interface IDeletePdfUseCase {
  execute(data: DeletePdfInputDTO): Promise<void>;
}