
import { Router } from 'express';

import {
  pdfController,
  tokens
} from '../../factory/AppFactory.js';

import { uploadPdf } from '../middlewares/UploadMiddleware.js';
import { authMiddleware } from '../middlewares/AuthMiddleware.js';

const pdfRouter = Router();

pdfRouter.use(authMiddleware(tokens));

pdfRouter.post(
  '/',
  uploadPdf,
  pdfController.uploadPdf
);

pdfRouter.get(
  '/',
  pdfController.listPdfs
);

pdfRouter.get(
  '/:id',
  pdfController.viewPdf
);

pdfRouter.delete(
  '/:id',
  pdfController.deletePdf
);

pdfRouter.post(
  '/:id/extract',
  pdfController.extractPdf
);

export { pdfRouter as pdfRoutes };


const generatedRouter = Router();

generatedRouter.use(authMiddleware(tokens));

generatedRouter.get(
  '/:id/download',
  pdfController.downloadGenerated
);

generatedRouter.post(
  '/:id/save',
  pdfController.saveGenerated
);

generatedRouter.delete(
  '/:id',
  pdfController.discardGenerated
);

export { generatedRouter as generatedRoutes };

