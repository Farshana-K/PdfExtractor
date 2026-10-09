import { User } from '../../entities/User.js';
import { IBaseRepository } from './IBaseRepository.js';

export interface IUserRepository extends IBaseRepository<
    User,
    Omit<User, 'id' | 'createdAt' | 'updatedAt'>
  > {
  findByEmail(email: string): Promise<User | null>;
}