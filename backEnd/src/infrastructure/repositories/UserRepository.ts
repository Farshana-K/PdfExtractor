import { IUserRepository } from '../../domain/interfaces/repositories/IUserRepository.js';
import { User } from '../../domain/entities/User.js';
import { UserModel } from '../database/models/UserModel.js';

export class UserRepository implements IUserRepository {
  async create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const doc = await UserModel.create(data);
    return this.map(doc);
  }
  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email }).exec();
    return doc ? this.map(doc) : null;
  }
  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findById(id).exec();
    return doc ? this.map(doc) : null;
  }
  async update(id: string, data: Partial<User>): Promise<User | null> {
    const doc = await UserModel.findByIdAndUpdate(id, data, { new: true }).exec();
    return doc ? this.map(doc) : null;
  }
  private map(doc: any): User {
    return {
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      password: doc.password,
      isVerified: doc.isVerified,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }
}
