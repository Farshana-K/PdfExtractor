
import { BaseRepository } from './BaseRepository.js';
import { IUserRepository } from '../../domain/interfaces/repositories/IUserRepository.js';
import { User } from '../../domain/entities/User.js';
import { UserModel } from '../database/models/UserModel.js';

type CreateUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

export class UserRepository
  extends BaseRepository<User, CreateUser>
  implements IUserRepository
{
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<User | null> {
    const document = await this._model.findOne({ email }).exec();

    return document ? this.map(document) : null;
  }

  protected map(document: any): User {
    return {
      id: document._id.toString(),
      name: document.name,
      email: document.email,
      password: document.password,
      isVerified: document.isVerified,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }
}
