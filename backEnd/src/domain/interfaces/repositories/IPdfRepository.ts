import { Pdf } from '../../entities/Pdf.js';

export interface IPdfRepository {
  create(data: Omit<Pdf, 'id' | 'createdAt' | 'updatedAt'>): Promise<Pdf>;
  findById(id: string): Promise<Pdf | null>;
  findByUserId(userId: string): Promise<Pdf[]>;
  delete(id: string, userId: string): Promise<boolean>;
}
