
import jwt, { SignOptions } from 'jsonwebtoken';

import { ITokenService } from '../../application/interfaces/services/ITokenService.js';
import { AppError } from '../../shared/AppError.js';
import { HttpStatusCode } from '../../shared/HttpStatusCode.js';
import { RESPONSE_MESSAGES } from '../../shared/ResponseMessages.js';

export class TokenService implements ITokenService {
  createAccessToken(userId: string): string {
    const options: SignOptions = {
      expiresIn: (process.env.ACCESS_TOKEN_EXPIRES_IN ||
        '15m') as SignOptions['expiresIn']
    };

    return jwt.sign({ userId }, this.accessSecret(), options);
  }

  createRefreshToken(userId: string): string {
    const options: SignOptions = {
      expiresIn: (process.env.REFRESH_TOKEN_EXPIRES_IN ||
        '7d') as SignOptions['expiresIn']
    };

    return jwt.sign({ userId }, this.refreshSecret(), options);
  }

  createPasswordResetToken(userId: string): string {
    return jwt.sign(
      { userId, purpose: 'PASSWORD_RESET' },
      this.passwordResetSecret(),
      { expiresIn: '10m' }
    );
  }

  verifyAccessToken(token: string): { userId: string } {
    try {
      const payload = jwt.verify(token, this.accessSecret());

      if (typeof payload === 'string' || typeof payload.userId !== 'string') {
        throw new Error('Invalid token payload');
      }

      return { userId: payload.userId };
    } catch {
      throw new AppError(
        RESPONSE_MESSAGES.INVALID_SESSION,
        HttpStatusCode.UNAUTHORIZED
      );
    }
  }

  verifyRefreshToken(token: string): { userId: string } {
    try {
      const payload = jwt.verify(token, this.refreshSecret());

      if (typeof payload === 'string' || typeof payload.userId !== 'string') {
        throw new Error('Invalid token payload');
      }

      return { userId: payload.userId };
    } catch {
      throw new AppError(
        RESPONSE_MESSAGES.INVALID_SESSION,
        HttpStatusCode.UNAUTHORIZED
      );
    }
  }

  verifyPasswordResetToken(token: string): { userId: string } {
    try {
      const payload = jwt.verify(token, this.passwordResetSecret());

      if (
        typeof payload === 'string' ||
        typeof payload.userId !== 'string' ||
        payload.purpose !== 'PASSWORD_RESET'
      ) {
        throw new Error('Invalid password reset token');
      }

      return { userId: payload.userId };
    } catch {
      throw new AppError(
        RESPONSE_MESSAGES.INVALID_RESET_TOKEN,
        HttpStatusCode.UNAUTHORIZED
      );
    }
  }

  private accessSecret(): string {
    const secret = process.env.JWT_ACCESS_SECRET;

    if (!secret) {
      throw new Error('JWT_ACCESS_SECRET missing');
    }

    return secret;
  }

  private refreshSecret(): string {
    const secret = process.env.JWT_REFRESH_SECRET;

    if (!secret) {
      throw new Error('JWT_REFRESH_SECRET missing');
    }

    return secret;
  }

  private passwordResetSecret(): string {
    const secret = process.env.JWT_PASSWORD_RESET_SECRET;

    if (!secret) {
      throw new Error('JWT_PASSWORD_RESET_SECRET missing');
    }

    return secret;
  }
}
