import { IOtpRepository } from '../../domain/interfaces/repositories/IOtpRepository.js';
import { Otp } from '../../domain/entities/Otp.js';
import { OtpModel } from '../database/models/OtpModel.js';

export class OtpRepository implements IOtpRepository {
  async create(data: Omit<Otp, 'id' | 'createdAt'>): Promise<Otp> {
    const doc = await OtpModel.create(data);
    return this.map(doc);
  }
  async findLatest(userId: string, purpose: Otp['purpose']): Promise<Otp | null> {
    const doc = await OtpModel.findOne({ userId, purpose }).sort({ createdAt: -1 }).exec();
    return doc ? this.map(doc) : null;
  }
  async deleteForUser(userId: string, purpose: Otp['purpose']): Promise<void> {
    await OtpModel.deleteMany({ userId, purpose }).exec();
  }
  private map(doc: any): Otp {
    return {
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      email: doc.email,
      code: doc.code,
      purpose: doc.purpose,
      expiresAt: doc.expiresAt,
      createdAt: doc.createdAt
    };
  }
}
