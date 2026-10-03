export interface User {
  id: string;
  name: string;
  email: string;
}

export interface PdfFile {
  id: string;
  fileName: string;
  pageCount: number;
  fileSize: number;
  createdAt: string;
}

export interface GeneratedPdf {
  generatedId: string;
  fileName: string;
  pageCount: number;
  pages: number[];
}
