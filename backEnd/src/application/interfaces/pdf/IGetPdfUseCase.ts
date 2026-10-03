import { GetPdfInputDTO, GetPdfOutputDTO } from "../../dtos/pdf/GetPdfDTO.js";

export interface IGetPdfUseCase {
  execute(data: GetPdfInputDTO): Promise<GetPdfOutputDTO>;
}
