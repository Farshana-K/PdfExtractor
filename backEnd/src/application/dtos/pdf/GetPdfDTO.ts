import { Pdf } from "../../../domain/entities/Pdf.js";

export interface GetPdfInputDTO {
  userId: string;
  pdfId: string;
}

export interface GetPdfOutputDTO {
  pdf: Pdf;
  stream: NodeJS.ReadableStream;
  contentType: string;
  fileName: string;
}