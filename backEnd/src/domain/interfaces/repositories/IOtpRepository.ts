import { Otp } from '../../entities/Otp.js';
import { IBaseRepository } from './IBaseRepository.js';

export interface IOtpRepository extends Pick<
    IBaseRepository<
      Otp,
      Omit<Otp, 'id' | 'createdAt'>
    >,
    'create'
  > {
  findLatest(
    userId: string,
    purpose: Otp['purpose']
  ): Promise<Otp | null>;

  deleteForUser(
    userId: string,
    purpose: Otp['purpose']
  ): Promise<void>;
}