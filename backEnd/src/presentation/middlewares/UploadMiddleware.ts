
import multer from 'multer';

import { AppError } from '../../shared/AppError.js';
import { HttpStatusCode } from '../../shared/HttpStatusCode.js';
import { RESPONSE_MESSAGES } from '../../shared/ResponseMessages.js';

export const uploadPdf = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
      return;
    }

    cb(
      new AppError(
        RESPONSE_MESSAGES.PDF_ONLY,
        HttpStatusCode.BAD_REQUEST
      )
    );
  }
}).single('file');
