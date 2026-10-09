import { ResendOtpInputDTO } from "../../dtos/auth/ResendOtpDTO.js";



export interface IResendOtpUseCase {
  execute(data: ResendOtpInputDTO): Promise<void>;
}
