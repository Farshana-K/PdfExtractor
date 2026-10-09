
import { Request, Response, NextFunction } from 'express';

import { ITokenService } from '../../application/interfaces/services/ITokenService.js';
import { AppError } from '../../shared/AppError.js';
import { RESPONSE_MESSAGES } from '../../shared/ResponseMessages.js';
import { HttpStatusCode } from '../../shared/HttpStatusCode.js';

export function authMiddleware(tokens: ITokenService) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const token = req.cookies?.accessToken;

      if (!token) {
        throw new AppError(
          RESPONSE_MESSAGES.AUTH_REQUIRED,
          HttpStatusCode.UNAUTHORIZED
        );
      }

      req.user = tokens.verifyAccessToken(token);

      next();
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
        return;
      }

      next(
        new AppError(
          RESPONSE_MESSAGES.INVALID_SESSION,
          HttpStatusCode.UNAUTHORIZED
        )
      );
    }
  };
}
