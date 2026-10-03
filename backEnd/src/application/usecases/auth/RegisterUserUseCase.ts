import { IUserRepository } from '../../../domain/interfaces/repositories/IUserRepository.js';
import { IOtpRepository } from '../../../domain/interfaces/repositories/IOtpRepository.js';
import { IEmailService } from '../../interfaces/services/IEmailService.js';
import { IPasswordHasher } from '../../interfaces/services/IPasswordHasher.js';
import { RegisterDTO, RegisterUserOutputDTO } from '../../dtos/auth/RegisterDTO.js';
import { IRegisterUserUseCase } from '../../interfaces/auth/IRegisterUseCase.js';

export class RegisterUserUseCase implements IRegisterUserUseCase {
  constructor(
    private readonly users: IUserRepository,
    private readonly otps: IOtpRepository,
    private readonly email: IEmailService,
    private readonly passwordHasher: IPasswordHasher
  ) {}

  async execute(data: RegisterDTO): Promise<RegisterUserOutputDTO> {
    const existing = await this.users.findByEmail(data.email);

    if (existing) {
      throw new Error('Email already registered');
    }

    const password = await this.passwordHasher.hash(data.password);

    const user = await this.users.create({
      name: data.name,
      email: data.email.toLowerCase(),
      password,
      isVerified: false
    });

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await this.otps.deleteForUser(user.id, 'EMAIL_VERIFICATION');

    await this.otps.create({
      userId: user.id,
      email: user.email,
      code,
      purpose: 'EMAIL_VERIFICATION',
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    });

    await this.email.sendOtp(
      user.email,
      code,
      'email verification'
    );

    return {
      id: user.id,
      name: user.name,
      email: user.email
    };
  }
}