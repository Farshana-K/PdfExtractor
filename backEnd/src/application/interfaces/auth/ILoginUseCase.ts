import { LoginDTO, LoginOutputDTO } from '../../dtos/auth/LoginDTO.js';



export interface ILoginUseCase {
  execute(data: LoginDTO): Promise<LoginOutputDTO>;
}