import mongoose, { Schema, Document } from 'mongoose';

export interface PdfDocument extends Document {
  userId: mongoose.Types.ObjectId;
  fileName: string;
  pageCount: number;
  fileSize: number;
  gridFsId: mongoose.Types.ObjectId;
}

const schema = new Schema<PdfDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  fileName: { type: String, required: true },
  pageCount: { type: Number, required: true },
  fileSize: { type: Number, required: true },
  gridFsId: { type: Schema.Types.ObjectId, required: true, unique: true }
}, { timestamps: true });

export const PdfModel = mongoose.model<PdfDocument>('Pdf', schema);
