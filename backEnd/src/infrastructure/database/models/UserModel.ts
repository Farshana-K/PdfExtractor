import mongoose, { Schema, Document } from 'mongoose';

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
}

const schema = new Schema<UserDocument>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  password: { type: String, required: true, select: true },
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

export const UserModel = mongoose.model<UserDocument>('User', schema);
