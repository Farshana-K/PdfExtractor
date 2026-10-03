import { VerifyOtpDTO, VerifyOtpOutputDTO } from '../../dtos/auth/VerifyOtpDTO.js';





export interface IVerifyOtpUseCase {
  execute(data: VerifyOtpDTO): Promise<VerifyOtpOutputDTO>;
}