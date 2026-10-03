import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { authRoutes } from './presentation/routes/AuthRoutes.js';
import { pdfRoutes, generatedRoutes } from './presentation/routes/PdfRoutes.js';
import { errorMiddleware } from './presentation/middlewares/ErrorMiddleware.js';

export function createApp() {
  const app = express();
  

  app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  }));
  app.use(express.json());
  app.use(cookieParser());

  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
  app.use('/api/auth', authRoutes);
  app.use('/api/pdfs', pdfRoutes);
  app.use('/api/generated', generatedRoutes);
  app.use(errorMiddleware);

  return app;
}
