import { RefreshSessionInputDTO, RefreshSessionOutputDTO } from "../../dtos/auth/RefreshSessionDTO.js";


export interface IRefreshSessionUseCase {
  execute(data: RefreshSessionInputDTO): Promise<RefreshSessionOutputDTO>;
}