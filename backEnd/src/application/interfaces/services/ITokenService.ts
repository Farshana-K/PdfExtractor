export interface ITokenService {
  createAccessToken(userId: string): string;
  createRefreshToken(userId: string): string;
  createPasswordResetToken(userId: string): string;
  verifyAccessToken(token: string): { userId: string };
  verifyRefreshToken(token: string): { userId: string };
  verifyPasswordResetToken(token: string): { userId: string };
}
