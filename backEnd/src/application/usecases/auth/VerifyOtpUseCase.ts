
import { RESPONSE_MESSAGES } from '../../../shared/ResponseMessages.js';
import { HttpStatusCode } from '../../../shared/HttpStatusCode.js';
import { AppError } from '../../../shared/AppError.js';

import { IUserRepository } from '../../../domain/interfaces/repositories/IUserRepository.js';
import { IOtpRepository } from '../../../domain/interfaces/repositories/IOtpRepository.js';
import { ITokenService } from '../../interfaces/services/ITokenService.js';
import {
  VerifyOtpDTO,
  VerifyOtpOutputDTO
} from '../../dtos/auth/VerifyOtpDTO.js';
import { IVerifyOtpUseCase } from '../../interfaces/auth/IVerifyOtpUseCase.js';

export class VerifyOtpUseCase implements IVerifyOtpUseCase {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _otpRepo: IOtpRepository,
    private readonly _tokenService: ITokenService
  ) {}

  async execute(data: VerifyOtpDTO): Promise<VerifyOtpOutputDTO> {
    const user = await this._userRepo.findByEmail(data.email.toLowerCase());

    if (!user) {
      throw new AppError(
        RESPONSE_MESSAGES.INVALID_VERIFICATION,
        HttpStatusCode.BAD_REQUEST
      );
    }

    const otp = await this._otpRepo.findLatest(user.id, data.purpose);

    if (
      !otp ||
      otp.code !== data.otp ||
      otp.expiresAt.getTime() < Date.now()
    ) {
      throw new AppError(
        RESPONSE_MESSAGES.INVALID_OTP,
        HttpStatusCode.BAD_REQUEST
      );
    }

    await this._otpRepo.deleteForUser(user.id, data.purpose);

    if (data.purpose === 'EMAIL_VERIFICATION') {
      const updated = await this._userRepo.update(user.id, {
        isVerified: true
      });

      return {
        purpose: data.purpose,
        user: {
          id: updated!.id,
          name: updated!.name,
          email: updated!.email
        }
      };
    }

    return {
      purpose: data.purpose,
      resetToken: this._tokenService.createPasswordResetToken(user.id)
    };
  }
}
