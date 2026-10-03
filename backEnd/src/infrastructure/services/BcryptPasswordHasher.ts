import bcrypt from 'bcryptjs';
import { IPasswordHasher } from '../../application/interfaces/services/IPasswordHasher.js';

export class BcryptPasswordHasher implements IPasswordHasher {
  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, 12);
  }

  async compare(value: string, hashedValue: string): Promise<boolean> {
    return bcrypt.compare(value, hashedValue);
  }
}
