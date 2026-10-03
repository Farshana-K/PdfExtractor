
import { IUserRepository } from '../../../domain/interfaces/repositories/IUserRepository.js';
import { IOtpRepository } from '../../../domain/interfaces/repositories/IOtpRepository.js';
import { IPasswordHasher } from '../../interfaces/services/IPasswordHasher.js';
import { ITokenService } from '../../interfaces/services/ITokenService.js';
import { ResetPasswordDTO } from '../../dtos/auth/ResetPasswordDTO.js';
import { IResetPasswordUseCase } from '../../interfaces/auth/IResetPasswordUseCase.js';

export class ResetPasswordUseCase implements IResetPasswordUseCase {
  constructor(
    private readonly users: IUserRepository,
    private readonly otps: IOtpRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokens: ITokenService
  ) {}

  async execute(data: ResetPasswordDTO): Promise<void> {
    const { userId } = this.tokens.verifyPasswordResetToken(data.resetToken);

    const user = await this.users.findById(userId);

    if (!user) {
      throw new Error('Invalid password reset request');
    }

    const password = await this.passwordHasher.hash(data.password);

    await this.users.update(user.id, { password });

    await this.otps.deleteForUser(user.id, 'PASSWORD_RESET');
  }
}

