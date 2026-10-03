import { Otp } from '../../entities/Otp.js';

export interface IOtpRepository {
  create(data: Omit<Otp, 'id' | 'createdAt'>): Promise<Otp>;
  findLatest(userId: string, purpose: Otp['purpose']): Promise<Otp | null>;
  deleteForUser(userId: string, purpose: Otp['purpose']): Promise<void>;
}
