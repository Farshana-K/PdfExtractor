
export interface ExtractPdfInputDTO {
  userId: string;
  pdfId: string;
  pages: number[];
}

export interface ExtractPdfOutputDTO {
  generatedId: string;
  fileName: string;
  pageCount: number;
  pages: number[];
}

