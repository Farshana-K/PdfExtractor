
import { RESPONSE_MESSAGES } from '../../../shared/ResponseMessages.js';
import { HttpStatusCode } from '../../../shared/HttpStatusCode.js';
import { AppError } from '../../../shared/AppError.js';

import { IUserRepository } from '../../../domain/interfaces/repositories/IUserRepository.js';
import { ITokenService } from '../../interfaces/services/ITokenService.js';
import { IPasswordHasher } from '../../interfaces/services/IPasswordHasher.js';
import { LoginDTO, LoginOutputDTO } from '../../dtos/auth/LoginDTO.js';
import { ILoginUseCase } from '../../interfaces/auth/ILoginUseCase.js';

export class LoginUseCase implements ILoginUseCase {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _tokenService: ITokenService,
    private readonly _passwordHasher: IPasswordHasher
  ) {}

  async execute(data: LoginDTO): Promise<LoginOutputDTO> {
    const user = await this._userRepo.findByEmail(data.email.toLowerCase());

    if (!user || !(await this._passwordHasher.compare(data.password, user.password))) {
      throw new AppError(
        RESPONSE_MESSAGES.INVALID_CREDENTIALS,
        HttpStatusCode.UNAUTHORIZED
      );
    }

    if (!user.isVerified) {
      throw new AppError(
        RESPONSE_MESSAGES.VERIFY_EMAIL,
        HttpStatusCode.FORBIDDEN
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
