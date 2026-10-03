import mongoose, { Schema, Document } from "mongoose";

export interface OtpDocument extends Document {
  userId: mongoose.Types.ObjectId;
  email: string;
  code: string;
  purpose: "EMAIL_VERIFICATION" | "PASSWORD_RESET";
  expiresAt: Date;
}

const schema = new Schema<OtpDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    email: { type: String, required: true },
    code: { type: String, required: true },
    purpose: {
      type: String,
      enum: ["EMAIL_VERIFICATION", "PASSWORD_RESET"],
      required: true,
    },
    expiresAt: { type: Date, required: true, index: true },
  },
  { timestamps: true },
);

schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OtpModel = mongoose.model<OtpDocument>("Otp", schema);
