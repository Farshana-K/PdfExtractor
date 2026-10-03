import { Request, Response, NextFunction } from 'express';

export function errorMiddleware(error: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error(error.message);
  res.status(400).json({ message: error.message || 'Something went wrong' });
}
