
import { RESPONSE_MESSAGES } from '../../../shared/ResponseMessages.js';
import { HttpStatusCode } from '../../../shared/HttpStatusCode.js';
import { AppError } from '../../../shared/AppError.js';

import { PDFDocument } from 'pdf-lib';

import { IPdfRepository } from '../../../domain/interfaces/repositories/IPdfRepository.js';
import { IPdfStorageService } from '../../interfaces/services/IPdfStorageService.js';
import {
  ExtractPdfInputDTO,
  ExtractPdfOutputDTO
} from '../../dtos/pdf/ExtractPdfDTO.js';
import { IExtractPdfUseCase } from '../../interfaces/pdf/IExtractPdfUseCase.js';

export class ExtractPdfUseCase implements IExtractPdfUseCase {
  constructor(
    private readonly _pdfRepo: IPdfRepository,
    private readonly _storageService: IPdfStorageService
  ) {}

  async execute(
    data: ExtractPdfInputDTO
  ): Promise<ExtractPdfOutputDTO> {
    const source = await this._pdfRepo.findById(data.pdfId);

    if (!source || source.userId !== data.userId) {
      throw new AppError(
        RESPONSE_MESSAGES.PDF_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }

    const file = await this._storageService.get(source.gridFsId);

    const chunks: Buffer[] = [];

    for await (
      const chunk of file.stream as AsyncIterable<Buffer>
    ) {
      chunks.push(Buffer.from(chunk));
    }

    const original = await PDFDocument.load(Buffer.concat(chunks));

    const uniquePages = [...new Set(data.pages)];

    if (
      uniquePages.some(
        (page) => page < 1 || page > original.getPageCount()
      )
    ) {
      throw new AppError(
        RESPONSE_MESSAGES.INVALID_PAGES,
        HttpStatusCode.BAD_REQUEST
      );
    }

    const generated = await PDFDocument.create();

    const copied = await generated.copyPages(
      original,
      uniquePages.map((page) => page - 1)
    );

    copied.forEach((page) => generated.addPage(page));

    const bytes = await generated.save();

    const fileName = `${source.fileName.replace(
      /\.pdf$/i,
      ''
    )}-extracted-${Date.now()}.pdf`;

    const generatedId = await this._storageService.save(
      fileName,
      Buffer.from(bytes),
      'application/pdf'
    );

    return {
      generatedId,
      fileName,
      pageCount: copied.length,
      pages: uniquePages
    };
  }
}
