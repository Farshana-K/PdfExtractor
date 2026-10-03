import { RegisterDTO, RegisterUserOutputDTO } from '../../dtos/auth/RegisterDTO.js';



export interface IRegisterUserUseCase {
  execute(data: RegisterDTO): Promise<RegisterUserOutputDTO>;
}