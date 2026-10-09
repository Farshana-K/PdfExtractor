
import { RESPONSE_MESSAGES } from '../../../shared/ResponseMessages.js';
import { HttpStatusCode } from '../../../shared/HttpStatusCode.js';
import { AppError } from '../../../shared/AppError.js';

import { IUserRepository } from '../../../domain/interfaces/repositories/IUserRepository.js';
import { ITokenService } from '../../interfaces/services/ITokenService.js';
import {
  RefreshSessionInputDTO,
  RefreshSessionOutputDTO
} from '../../dtos/auth/RefreshSessionDTO.js';
import { IRefreshSessionUseCase } from '../../interfaces/auth/IRefreshSessionUseCase.js';

export class RefreshSessionUseCase implements IRefreshSessionUseCase {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _tokenService: ITokenService
  ) {}

  async execute(data: RefreshSessionInputDTO): Promise<RefreshSessionOutputDTO> {
    const { userId } = this._tokenService.verifyRefreshToken(data.refreshToken);

    const user = await this._userRepo.findById(userId);

    if (!user || !user.isVerified) {
      throw new AppError(
        RESPONSE_MESSAGES.INVALID_SESSION,
        HttpStatusCode.UNAUTHORIZED
      );
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      accessToken: this._tokenService.createAccessToken(user.id),
      refreshToken: this._tokenService.createRefreshToken(user.id)
    };
  }
}
