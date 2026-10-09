import { ResetPasswordDTO } from '../../dtos/auth/ResetPasswordDTO.js';

export interface IResetPasswordUseCase {
  execute(data: ResetPasswordDTO): Promise<void>;
}
