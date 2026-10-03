
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
    private readonly users: IUserRepository,
    private readonly otps: IOtpRepository,
    private readonly tokens: ITokenService
  ) {}

  async execute(data: VerifyOtpDTO): Promise<VerifyOtpOutputDTO> {
    const user = await this.users.findByEmail(data.email.toLowerCase());

    if (!user) {
      throw new Error('Invalid verification request');
    }

    const otp = await this.otps.findLatest(user.id, data.purpose);

    if (
      !otp ||
      otp.code !== data.otp ||
      otp.expiresAt.getTime() < Date.now()
    ) {
      throw new Error('Invalid or expired OTP');
    }

    await this.otps.deleteForUser(user.id, data.purpose);

    if (data.purpose === 'EMAIL_VERIFICATION') {
      const updated = await this.users.update(user.id, {
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
      resetToken: this.tokens.createPasswordResetToken(user.id)
    };
  }
}

