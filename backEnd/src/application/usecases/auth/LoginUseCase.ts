import { IUserRepository } from '../../../domain/interfaces/repositories/IUserRepository.js';
import { ITokenService } from '../../interfaces/services/ITokenService.js';
import { IPasswordHasher } from '../../interfaces/services/IPasswordHasher.js';
import { LoginDTO, LoginOutputDTO } from '../../dtos/auth/LoginDTO.js';
import { ILoginUseCase } from '../../interfaces/auth/ILoginUseCase.js';

export class LoginUseCase implements ILoginUseCase {
  constructor(
    private readonly users: IUserRepository,
    private readonly tokens: ITokenService,
    private readonly passwordHasher: IPasswordHasher
  ) {}

  async execute(data: LoginDTO): Promise<LoginOutputDTO> {
    const user = await this.users.findByEmail(data.email.toLowerCase());

    if (!user || !(await this.passwordHasher.compare(data.password, user.password))) {
      throw new Error('Invalid email or password');
    }

    if (!user.isVerified) {
      throw new Error('Please verify your email first');
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