import { IUserRepository } from '../../../domain/interfaces/repositories/IUserRepository.js';
import { ITokenService } from '../../interfaces/services/ITokenService.js';
import {
  RefreshSessionInputDTO,
  RefreshSessionOutputDTO
} from '../../dtos/auth/RefreshSessionDTO.js';
import { IRefreshSessionUseCase } from '../../interfaces/auth/IRefreshSessionUseCase.js';

export class RefreshSessionUseCase implements IRefreshSessionUseCase {
  constructor(
    private readonly users: IUserRepository,
    private readonly tokens: ITokenService
  ) {}

  async execute(data: RefreshSessionInputDTO): Promise<RefreshSessionOutputDTO> {
    const { userId } = this.tokens.verifyRefreshToken(data.refreshToken);

    const user = await this.users.findById(userId);

    if (!user || !user.isVerified) {
      throw new Error('Session is no longer valid');
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      accessToken: this.tokens.createAccessToken(user.id),
      refreshToken: this.tokens.createRefreshToken(user.id)
    };
  }
}