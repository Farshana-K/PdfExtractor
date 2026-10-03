
import { Request, Response } from 'express';

import { IUploadPdfUseCase } from '../../application/interfaces/pdf/IUploadPdfUseCase.js';
import { IListUserPdfsUseCase } from '../../application/interfaces/pdf/IListUserPdfUseCase.js';
import { IGetPdfUseCase } from '../../application/interfaces/pdf/IGetPdfUseCase.js';
import { IDeletePdfUseCase } from '../../application/interfaces/pdf/IDeletePdfUseCase.js';
import { IExtractPdfUseCase } from '../../application/interfaces/pdf/IExtractPdfUseCase.js';
import { IPdfStorageService } from '../../application/interfaces/services/IPdfStorageService.js';

import { ExtractPdfSchema } from '../schemas/pdf/pdfSchema.js';

export class PdfController {
  constructor(
    private readonly upload: IUploadPdfUseCase,
    private readonly list: IListUserPdfsUseCase,
    private readonly get: IGetPdfUseCase,
    private readonly remove: IDeletePdfUseCase,
    private readonly extract: IExtractPdfUseCase,
    private readonly storage: IPdfStorageService
  ) {}

  uploadPdf = async (req: Request, res: Response) => {
    if (!req.user) {
      throw new Error('Authentication required');
    }

    if (!req.file) {
      throw new Error('PDF file is required');
    }

    const pdf = await this.upload.execute({
      userId: req.user.userId,
      file: {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        buffer: req.file.buffer
      }
    });

    res.status(201).json({ pdf });
  };

  listPdfs = async (req: Request, res: Response) => {
    if (!req.user) {
      throw new Error('Authentication required');
    }

    const pdfs = await this.list.execute({
      userId: req.user.userId
    });

    res.json({ pdfs });
  };

  viewPdf = async (
    req: Request<{ id: string }>,
    res: Response
  ) => {
    if (!req.user) {
      throw new Error('Authentication required');
    }

    const result = await this.get.execute({
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
      throw new Error('Authentication required');
    }

    await this.remove.execute({
      userId: req.user.userId,
      pdfId: req.params.id
    });

    res.json({
      message: 'PDF deleted successfully'
    });
  };

  extractPdf = async (
    req: Request<{ id: string }>,
    res: Response
  ) => {
    if (!req.user) {
      throw new Error('Authentication required');
    }

    const data = ExtractPdfSchema.parse(req.body);

    const result = await this.extract.execute({
      userId: req.user.userId,
      pdfId: req.params.id,
      pages: data.pages
    });

    res.status(201).json(result);
  };

  downloadGenerated = async (
    req: Request<{ id: string }>,
    res: Response
  ) => {
    const result = await this.storage.get(req.params.id);

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
    await this.storage.delete(req.params.id);

    res.json({
      message: 'Generated PDF discarded'
    });
  };

  saveGenerated = async (
    req: Request<{ id: string }>,
    res: Response
  ) => {
    if (!req.user) {
      throw new Error('Authentication required');
    }

    const generated = await this.storage.get(req.params.id);

    const chunks: Buffer[] = [];

    for await (
      const chunk of generated.stream as AsyncIterable<Buffer>
    ) {
      chunks.push(Buffer.from(chunk));
    }

    const pdf = await this.upload.execute({
      userId: req.user.userId,
      file: {
        originalname: generated.fileName,
        mimetype: 'application/pdf',
        buffer: Buffer.concat(chunks)
      }
    });

    await this.storage.delete(req.params.id);

    res.status(201).json({
      pdf,
      message: 'PDF saved to your library'
    });
  };
}

