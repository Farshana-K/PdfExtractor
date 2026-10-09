
import { API_ROUTES } from '../constants/apiRoutes';
import { apiService as api } from './apiService';
import type { PdfFile, GeneratedPdf } from '../types';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface PdfListResponse {
  pdfs: PdfFile[];
}

export const pdfService = {
  async getPdfs(): Promise<PdfFile[]> {
    const { data } = await api.get<ApiResponse<PdfListResponse>>(
      API_ROUTES.PDFS
    );

    return data.data.pdfs;
  },

  async uploadPdf(form: FormData): Promise<void> {
    await api.post(API_ROUTES.PDFS, form);
  },

  async deletePdf(id: string): Promise<void> {
    await api.delete(API_ROUTES.pdfById(id));
  },

  async getPdf(id: string): Promise<ArrayBuffer> {
    const { data } = await api.get<ArrayBuffer>(
      API_ROUTES.pdfById(id),
      { responseType: 'arraybuffer' }
    );

    return data;
  },

  async extractPdf(
    id: string,
    pages: number[]
  ): Promise<GeneratedPdf> {
    const { data } = await api.post<ApiResponse<GeneratedPdf>>(
      API_ROUTES.extractPdf(id),
      { pages }
    );

    return data.data;
  },

  async saveGeneratedPdf(generatedId: string): Promise<void> {
    await api.post(API_ROUTES.saveGenerated(generatedId));
  },

  async discardGeneratedPdf(generatedId: string): Promise<void> {
    await api.delete(API_ROUTES.generatedById(generatedId));
  },

  async downloadGeneratedPdf(generatedId: string): Promise<Blob> {
    const { data } = await api.get<Blob>(
      API_ROUTES.downloadGenerated(generatedId),
      { responseType: 'blob' }
    );

    return data;
  }
};
