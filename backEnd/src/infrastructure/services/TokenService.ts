import jwt from 'jsonwebtoken';
import { ITokenService } from '../../application/interfaces/services/ITokenService.js';

export class TokenService implements ITokenService {
  createAccessToken(userId: string) {
    return jwt.sign({ userId }, this.accessSecret(), { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m' });
  }

  createRefreshToken(userId: string) {
    return jwt.sign({ userId }, this.refreshSecret(), { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' });
  }

  createPasswordResetToken(userId: string) {
    return jwt.sign({ userId, purpose: 'PASSWORD_RESET' }, this.passwordResetSecret(), { expiresIn: '10m' });
  }

  verifyAccessToken(token: string) {
    return jwt.verify(token, this.accessSecret()) as { userId: string };
  }

  verifyRefreshToken(token: string) {
    return jwt.verify(token, this.refreshSecret()) as { userId: string };
  }

  verifyPasswordResetToken(token: string) {
    const payload = jwt.verify(token, this.passwordResetSecret()) as { userId: string; purpose: string };
    if (payload.purpose !== 'PASSWORD_RESET') throw new Error('Invalid password reset token');
    return { userId: payload.userId };
  }

  private accessSecret() {
    if (!process.env.JWT_ACCESS_SECRET) throw new Error('JWT_ACCESS_SECRET missing');
    return process.env.JWT_ACCESS_SECRET;
  }

  private refreshSecret() {
    if (!process.env.JWT_REFRESH_SECRET) throw new Error('JWT_REFRESH_SECRET missing');
    return process.env.JWT_REFRESH_SECRET;
  }

  private passwordResetSecret() {
    if (!process.env.JWT_PASSWORD_RESET_SECRET) throw new Error('JWT_PASSWORD_RESET_SECRET missing');
    return process.env.JWT_PASSWORD_RESET_SECRET;
  }
}
