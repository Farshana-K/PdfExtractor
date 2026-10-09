
import { IUserRepository } from '../../../domain/interfaces/repositories/IUserRepository.js';
import { IOtpRepository } from '../../../domain/interfaces/repositories/IOtpRepository.js';
import { IEmailService } from '../../interfaces/services/IEmailService.js';
import { ForgotPasswordDTO } from '../../dtos/auth/ForgotPasswordDTO.js';
import { IForgotPasswordUseCase } from '../../interfaces/auth/IForgotPasswordUseCase.js';

import { AppError } from '../../../shared/AppError.js';
import { HttpStatusCode } from '../../../shared/HttpStatusCode.js';
import { RESPONSE_MESSAGES } from '../../../shared/ResponseMessages.js';

export class ForgotPasswordUseCase implements IForgotPasswordUseCase {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _otpRepo: IOtpRepository,
    private readonly _emailService: IEmailService
  ) {}

  async execute(data: ForgotPasswordDTO): Promise<void> {
    try {
      const user = await this._userRepo.findByEmail(data.email.toLowerCase());

      if (!user || !user.isVerified) return;

      const code = Math.floor(100000 + Math.random() * 900000).toString();

      await this._otpRepo.deleteForUser(user.id, 'PASSWORD_RESET');

      await this._otpRepo.create({
        userId: user.id,
        email: user.email,
        code,
        purpose: 'PASSWORD_RESET',
        expiresAt: new Date(Date.now() + 10 * 60 * 1000)
      });

      await this._emailService.sendOtp(user.email, code, 'password reset');
    } catch {
      throw new AppError(
        RESPONSE_MESSAGES.INTERNAL_ERROR,
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }
}
