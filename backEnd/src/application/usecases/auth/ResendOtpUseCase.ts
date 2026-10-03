import { IUserRepository } from '../../../domain/interfaces/repositories/IUserRepository.js';
import { IOtpRepository } from '../../../domain/interfaces/repositories/IOtpRepository.js';
import { IEmailService } from '../../interfaces/services/IEmailService.js';
import { ResendOtpInputDTO } from '../../dtos/auth/ResendOtpDTO.js';
import { IResendOtpUseCase } from '../../interfaces/auth/IResendOtpUseCase.js';

export class ResendOtpUseCase implements IResendOtpUseCase {
  constructor(
    private readonly users: IUserRepository,
    private readonly otps: IOtpRepository,
    private readonly email: IEmailService
  ) {}

  async execute(data: ResendOtpInputDTO): Promise<void> {
    const user = await this.users.findByEmail(data.email.toLowerCase());

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

    await this.otps.deleteForUser(user.id, purpose);

    await this.otps.create({
      userId: user.id,
      email: user.email,
      code,
      purpose,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    });

    await this.email.sendOtp(
      user.email,
      code,
      purpose === 'PASSWORD_RESET'
        ? 'password reset'
        : 'email verification'
    );
  }
}