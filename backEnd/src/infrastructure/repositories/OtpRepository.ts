
import { BaseRepository } from './BaseRepository.js';
import { IOtpRepository } from '../../domain/interfaces/repositories/IOtpRepository.js';
import { Otp } from '../../domain/entities/Otp.js';
import { OtpModel } from '../database/models/OtpModel.js';

type CreateOtp = Omit<Otp, 'id' | 'createdAt'>;

export class OtpRepository
  extends BaseRepository<Otp, CreateOtp>
  implements IOtpRepository
{
  constructor() {
    super(OtpModel);
  }

  async findLatest(
    userId: string,
    purpose: Otp['purpose']
  ): Promise<Otp | null> {
    const document = await this._model
      .findOne({ userId, purpose })
      .sort({ createdAt: -1 })
      .exec();

    return document ? this.map(document) : null;
  }

  async deleteForUser(
    userId: string,
    purpose: Otp['purpose']
  ): Promise<void> {
    await this._model.deleteMany({ userId, purpose }).exec();
  }

  protected map(document: any): Otp {
    return {
      id: document._id.toString(),
      userId: document.userId.toString(),
      email: document.email,
      code: document.code,
      purpose: document.purpose,
      expiresAt: document.expiresAt,
      createdAt: document.createdAt,
    };
  }
}
