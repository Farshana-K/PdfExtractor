
import { IUserRepository } from '../../../domain/interfaces/repositories/IUserRepository.js';
import { IOtpRepository } from '../../../domain/interfaces/repositories/IOtpRepository.js';
import { IEmailService } from '../../interfaces/services/IEmailService.js';
import { ResendOtpInputDTO } from '../../dtos/auth/ResendOtpDTO.js';
import { IResendOtpUseCase } from '../../interfaces/auth/IResendOtpUseCase.js';

import { AppError } from '../../../shared/AppError.js';
import { HttpStatusCode } from '../../../shared/HttpStatusCode.js';
import { RESPONSE_MESSAGES } from '../../../shared/ResponseMessages.js';

export class ResendOtpUseCase implements IResendOtpUseCase {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _otpRepo: IOtpRepository,
    private readonly _emailService: IEmailService
  ) {}

  async execute(data: ResendOtpInputDTO): Promise<void> {
    try {
      const user = await this._userRepo.findByEmail(data.email.toLowerCase());

      if (!user) {
        return;
      }

      const purpose = data.purpose ?? 'EMAIL_VERIFICATION';

      if (purpose === 'EMAIL_VERIFICATION' && user.isVerified) {
        return;
      }

      if (purpose === 'PASSWORD_RESET' && !user.isVerified) {
        return;
      }

      const code = Math.floor(100000 + Math.random() * 900000).toString();

      await this._otpRepo.deleteForUser(user.id, purpose);

      await this._otpRepo.create({
        userId: user.id,
        email: user.email,
        code,
        purpose,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000)
      });

      await this._emailService.sendOtp(
        user.email,
        code,
        purpose === 'PASSWORD_RESET'
          ? 'password reset'
          : 'email verification'
      );
    } catch {
      throw new AppError(
        RESPONSE_MESSAGES.INTERNAL_ERROR,
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }
}
