import { ForgotPasswordDTO } from '../../dtos/auth/ForgotPasswordDTO.js';

export interface IForgotPasswordUseCase {
  execute(data: ForgotPasswordDTO): Promise<void>;
}
