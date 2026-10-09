
import { RESPONSE_MESSAGES } from '../../../shared/ResponseMessages.js';
import { HttpStatusCode } from '../../../shared/HttpStatusCode.js';
import { AppError } from '../../../shared/AppError.js';

import { IUserRepository } from '../../../domain/interfaces/repositories/IUserRepository.js';
import { IOtpRepository } from '../../../domain/interfaces/repositories/IOtpRepository.js';
import { IEmailService } from '../../interfaces/services/IEmailService.js';
import { IPasswordHasher } from '../../interfaces/services/IPasswordHasher.js';
import { RegisterDTO, RegisterUserOutputDTO } from '../../dtos/auth/RegisterDTO.js';
import { IRegisterUserUseCase } from '../../interfaces/auth/IRegisterUseCase.js';

export class RegisterUserUseCase implements IRegisterUserUseCase {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _otpRepo: IOtpRepository,
    private readonly _emailService: IEmailService,
    private readonly _passwordHasher: IPasswordHasher
  ) {}

  async execute(data: RegisterDTO): Promise<RegisterUserOutputDTO> {
    const existing = await this._userRepo.findByEmail(data.email);

    if (existing) {
      throw new AppError(
        RESPONSE_MESSAGES.EMAIL_REGISTERED,
        HttpStatusCode.CONFLICT
      );
    }

    const password = await this._passwordHasher.hash(data.password);

    const user = await this._userRepo.create({
      name: data.name,
      email: data.email.toLowerCase(),
      password,
      isVerified: false
    });

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await this._otpRepo.deleteForUser(user.id, 'EMAIL_VERIFICATION');

    await this._otpRepo.create({
      userId: user.id,
      email: user.email,
      code,
      purpose: 'EMAIL_VERIFICATION',
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    });

    await this._emailService.sendOtp(
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
