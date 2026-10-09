
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

import { HttpStatusCode } from '../../shared/HttpStatusCode.js';
import { RESPONSE_MESSAGES } from '../../shared/ResponseMessages.js';
import { AppError } from '../../shared/AppError.js';
import { errorResponse } from '../../shared/ApiResponse.js';

export function errorMiddleware(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (res.headersSent) {
    return;
  }

  if (error instanceof ZodError) {
    res.status(HttpStatusCode.BAD_REQUEST).json(
      errorResponse(
        RESPONSE_MESSAGES.VALIDATION_FAILED,
        error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message
        }))
      )
    );
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json(
      errorResponse(error.message)
    );
    return;
  }

  res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(
    errorResponse(RESPONSE_MESSAGES.INTERNAL_ERROR)
  );
}
