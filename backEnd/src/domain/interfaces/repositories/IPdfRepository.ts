import { Pdf } from '../../entities/Pdf.js';
import { IBaseRepository } from './IBaseRepository.js';

export interface IPdfRepository extends Omit<
    IBaseRepository<
      Pdf,
      Omit<Pdf, 'id' | 'createdAt' | 'updatedAt'>
    >,
    'delete'
  > {
  findByUserId(userId: string): Promise<Pdf[]>;

  delete(id: string, userId: string): Promise<boolean>;
}