
import { Request, Response } from 'express';

import { RESPONSE_MESSAGES } from '../../shared/ResponseMessages.js';
import { HttpStatusCode } from '../../shared/HttpStatusCode.js';
import { AppError } from '../../shared/AppError.js';
import { successResponse } from '../../shared/ApiResponse.js';

import { IUploadPdfUseCase } from '../../application/interfaces/pdf/IUploadPdfUseCase.js';
import { IListUserPdfsUseCase } from '../../application/interfaces/pdf/IListUserPdfUseCase.js';
import { IGetPdfUseCase } from '../../application/interfaces/pdf/IGetPdfUseCase.js';
import { IDeletePdfUseCase } from '../../application/interfaces/pdf/IDeletePdfUseCase.js';
import { IExtractPdfUseCase } from '../../application/interfaces/pdf/IExtractPdfUseCase.js';
import { IPdfStorageService } from '../../application/interfaces/services/IPdfStorageService.js';

import { ExtractPdfSchema } from '../schemas/pdf/pdfSchema.js';

export class PdfController {
  constructor(
    private readonly _uploadPdfUseCase: IUploadPdfUseCase,
    private readonly _listPdfsUseCase: IListUserPdfsUseCase,
    private readonly _getPdfUseCase: IGetPdfUseCase,
    private readonly _deletePdfUseCase: IDeletePdfUseCase,
    private readonly _extractPdfUseCase: IExtractPdfUseCase,
    private readonly _storageService: IPdfStorageService
  ) {}

  uploadPdf = async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError(
        RESPONSE_MESSAGES.AUTH_REQUIRED,
        HttpStatusCode.UNAUTHORIZED
      );
    }

    if (!req.file) {
      throw new AppError(
        RESPONSE_MESSAGES.PDF_REQUIRED,
        HttpStatusCode.BAD_REQUEST
      );
    }

    const pdf = await this._uploadPdfUseCase.execute({
      userId: req.user.userId,
      file: {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        buffer: req.file.buffer
      }
    });

    res.status(HttpStatusCode.CREATED).json(
      successResponse(RESPONSE_MESSAGES.SUCCESS, { pdf })
    );
  };

  listPdfs = async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError(
        RESPONSE_MESSAGES.AUTH_REQUIRED,
        HttpStatusCode.UNAUTHORIZED
      );
    }

    const pdfs = await this._listPdfsUseCase.execute({
      userId: req.user.userId
    });

    res.json(
      successResponse(RESPONSE_MESSAGES.SUCCESS, { pdfs })
    );
  };

  viewPdf = async (
    req: Request<{ id: string }>,
    res: Response
  ) => {
    if (!req.user) {
      throw new AppError(
        RESPONSE_MESSAGES.AUTH_REQUIRED,
        HttpStatusCode.UNAUTHORIZED
      );
    }

    const result = await this._getPdfUseCase.execute({
      userId: req.user.userId,
      pdfId: req.params.id
    });

    res.setHeader('Content-Type', result.contentType);
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${result.fileName}"`
    );

    result.stream.pipe(res);
  };

  deletePdf = async (
    req: Request<{ id: string }>,
    res: Response
  ) => {
    if (!req.user) {
      throw new AppError(
        RESPONSE_MESSAGES.AUTH_REQUIRED,
        HttpStatusCode.UNAUTHORIZED
      );
    }

    await this._deletePdfUseCase.execute({
      userId: req.user.userId,
      pdfId: req.params.id
    });

    res.json(
      successResponse(RESPONSE_MESSAGES.PDF_DELETED)
    );
  };

  extractPdf = async (
    req: Request<{ id: string }>,
    res: Response
  ) => {
    if (!req.user) {
      throw new AppError(
        RESPONSE_MESSAGES.AUTH_REQUIRED,
        HttpStatusCode.UNAUTHORIZED
      );
    }

    const data = ExtractPdfSchema.parse(req.body);

    const result = await this._extractPdfUseCase.execute({
      userId: req.user.userId,
      pdfId: req.params.id,
      pages: data.pages
    });

    res.status(HttpStatusCode.CREATED).json(
      successResponse(RESPONSE_MESSAGES.SUCCESS, result)
    );
  };

  downloadGenerated = async (
    req: Request<{ id: string }>,
    res: Response
  ) => {
    const result = await this._storageService.get(req.params.id);

    res.setHeader('Content-Type', result.contentType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${result.fileName}"`
    );

    result.stream.pipe(res);
  };

  discardGenerated = async (
    req: Request<{ id: string }>,
    res: Response
  ) => {
    await this._storageService.delete(req.params.id);

    res.json(
      successResponse(RESPONSE_MESSAGES.GENERATED_PDF_DISCARDED)
    );
  };

  saveGenerated = async (
    req: Request<{ id: string }>,
    res: Response
  ) => {
    if (!req.user) {
      throw new AppError(
        RESPONSE_MESSAGES.AUTH_REQUIRED,
        HttpStatusCode.UNAUTHORIZED
      );
    }

    const generated = await this._storageService.get(req.params.id);
    const chunks: Buffer[] = [];

    for await (
      const chunk of generated.stream as AsyncIterable<Buffer>
    ) {
      chunks.push(Buffer.from(chunk));
    }

    const pdf = await this._uploadPdfUseCase.execute({
      userId: req.user.userId,
      file: {
        originalname: generated.fileName,
        mimetype: 'application/pdf',
        buffer: Buffer.concat(chunks)
      }
    });

    await this._storageService.delete(req.params.id);

    res.status(HttpStatusCode.CREATED).json(
      successResponse(
        RESPONSE_MESSAGES.PDF_SAVED,
        { pdf }
      )
    );
  };
}
