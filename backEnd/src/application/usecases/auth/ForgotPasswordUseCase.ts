import { IUserRepository } from '../../../domain/interfaces/repositories/IUserRepository.js';
import { IOtpRepository } from '../../../domain/interfaces/repositories/IOtpRepository.js';
import { IEmailService } from '../../interfaces/services/IEmailService.js';
import { ForgotPasswordDTO } from '../../dtos/auth/ForgotPasswordDTO.js';
import { IForgotPasswordUseCase } from '../../interfaces/auth/IForgotPasswordUseCase.js';

export class ForgotPasswordUseCase implements IForgotPasswordUseCase {
  constructor(
    private readonly users: IUserRepository,
    private readonly otps: IOtpRepository,
    private readonly email: IEmailService
  ) {}

  async execute(data: ForgotPasswordDTO): Promise<void> {
    const user = await this.users.findByEmail(data.email.toLowerCase());

    if (!user || !user.isVerified) return;

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await this.otps.deleteForUser(user.id, 'PASSWORD_RESET');

    await this.otps.create({
      userId: user.id,
      email: user.email,
      code,
      purpose: 'PASSWORD_RESET',
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    });

    await this.email.sendOtp(user.email, code, 'password reset');
  }
}