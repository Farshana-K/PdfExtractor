
import { RESPONSE_MESSAGES } from '../../../shared/ResponseMessages.js';
import { HttpStatusCode } from '../../../shared/HttpStatusCode.js';
import { AppError } from '../../../shared/AppError.js';

import { IUserRepository } from '../../../domain/interfaces/repositories/IUserRepository.js';
import { IOtpRepository } from '../../../domain/interfaces/repositories/IOtpRepository.js';
import { IPasswordHasher } from '../../interfaces/services/IPasswordHasher.js';
import { ITokenService } from '../../interfaces/services/ITokenService.js';
import { ResetPasswordDTO } from '../../dtos/auth/ResetPasswordDTO.js';
import { IResetPasswordUseCase } from '../../interfaces/auth/IResetPasswordUseCase.js';

export class ResetPasswordUseCase implements IResetPasswordUseCase {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _otpRepo: IOtpRepository,
    private readonly _passwordHasher: IPasswordHasher,
    private readonly _tokenService: ITokenService
  ) {}

  async execute(data: ResetPasswordDTO): Promise<void> {
    const { userId } = this._tokenService.verifyPasswordResetToken(data.resetToken);

    const user = await this._userRepo.findById(userId);

    if (!user) {
      throw new AppError(
        RESPONSE_MESSAGES.INVALID_RESET_REQUEST,
        HttpStatusCode.BAD_REQUEST
      );
    }

    const password = await this._passwordHasher.hash(data.password);

    await this._userRepo.update(user.id, { password });

    await this._otpRepo.deleteForUser(user.id, 'PASSWORD_RESET');
  }
}
