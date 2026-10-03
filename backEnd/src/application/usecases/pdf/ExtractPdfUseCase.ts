
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
    private readonly pdfs: IPdfRepository,
    private readonly storage: IPdfStorageService
  ) {}

  async execute(
    data: ExtractPdfInputDTO
  ): Promise<ExtractPdfOutputDTO> {
    const source = await this.pdfs.findById(data.pdfId);

    if (!source || source.userId !== data.userId) {
      throw new Error('PDF not found');
    }

    const file = await this.storage.get(source.gridFsId);

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
      throw new Error('One or more selected pages are invalid');
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

    const generatedId = await this.storage.save(
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

