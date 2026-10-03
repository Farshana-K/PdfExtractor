import { Request, Response, NextFunction } from 'express';
import { ITokenService } from '../../application/interfaces/services/ITokenService.js';

export function authMiddleware(tokens: ITokenService) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.accessToken;
      if (!token) return res.status(401).json({ message: 'Authentication required' });
      req.user = tokens.verifyAccessToken(token);
      next();
    } catch {
      return res.status(401).json({ message: 'Invalid or expired access token' });
    }
  };
}
